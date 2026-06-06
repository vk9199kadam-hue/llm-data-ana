# =============================================================================
# AutoInsight AI — Database Connection & Query Utilities (database.py)
# Phase 1: Foundation — Convex Real-Time Database Client
# =============================================================================
"""
Convex database connection management using the official convex Python client.

Provides:
  - Synchronous-to-asynchronous client wrappers using asyncio.to_thread
  - CRUD utility functions for Convex queries and mutations
  - Pydantic model serialization and deserialization helpers
"""

from __future__ import annotations

import json
import logging
import asyncio
from datetime import datetime
from typing import Any, Dict, List, Optional, TypeVar
from pydantic import BaseModel

from backend.config import settings

logger = logging.getLogger(__name__)

# Type variable for generic database operations
T = TypeVar("T", bound=BaseModel)

# Lazy initialized Convex client
_client: Optional[Any] = None

def get_convex_client():
    """Get or initialize the Convex client."""
    global _client
    if _client is None:
        from convex import ConvexClient
        url = settings.CONVEX_URL
        logger.info(f"Initializing Convex client with URL: {url}")
        _client = ConvexClient(url)
    return _client

async def query_async(name: str, args: Dict[str, Any]) -> Any:
    """Execute a Convex query asynchronously in a thread pool."""
    client = get_convex_client()
    return await asyncio.to_thread(client.query, name, args)

async def mutation_async(name: str, args: Dict[str, Any]) -> Any:
    """Execute a Convex mutation asynchronously in a thread pool."""
    client = get_convex_client()
    return await asyncio.to_thread(client.mutation, name, args)

async def get_pool() -> Any:
    """Get the database client. Provided for backward compatibility."""
    return get_convex_client()

async def close_pool() -> None:
    """Close the database pool. Provided for backward compatibility."""
    # Convex client doesn't require explicit closing of a pool
    pass

async def health_check() -> Dict[str, Any]:
    """Check Convex database connectivity."""
    try:
        # Run a simple query to verify connection
        await query_async("crud:fetchRows", {"table": "users", "limit": 1})
        return {
            "status": "healthy",
            "provider": "convex",
            "url": settings.CONVEX_URL,
        }
    except Exception as e:
        logger.error(f"Convex database health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
        }

# =============================================================================
# Generic CRUD Utilities mapping to Convex crud.ts functions
# =============================================================================

async def insert_one(
    table: str,
    data: Dict[str, Any],
    returning: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """Insert a single row into Convex."""
    try:
        # Clean up any id fields generated on the model, Convex generates its own _id
        cleaned_data = {k: v for k, v in data.items() if k not in ("id", "_id")}
        
        doc_id = await mutation_async("crud:insertRow", {"table": table, "document": cleaned_data})
        inserted = {"_id": doc_id, "id": doc_id, **cleaned_data}
        
        if returning:
            if returning in ("id", "_id"):
                return {returning: doc_id}
            return {returning: data.get(returning)}
            
        return inserted
    except Exception as e:
        logger.error(f"Failed to insert row into {table}: {e}")
        raise

async def insert_many(
    table: str,
    data: List[Dict[str, Any]],
    batch_size: int = 100,
) -> int:
    """Bulk insert multiple rows into Convex."""
    if not data:
        return 0
    try:
        cleaned_docs = []
        for doc in data:
            cleaned_docs.append({k: v for k, v in doc.items() if k not in ("id", "_id")})
            
        ids = await mutation_async("crud:bulkInsert", {"table": table, "documents": cleaned_docs})
        return len(ids)
    except Exception as e:
        logger.error(f"Failed to bulk insert into {table}: {e}")
        raise

async def fetch_one(
    table: str,
    conditions: Optional[Dict[str, Any]] = None,
    order_by: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """Fetch a single row matching conditions from Convex."""
    try:
        # If conditions contains direct id or _id, fetch by ID directly
        if conditions and ("id" in conditions or "_id" in conditions):
            doc_id = conditions.get("id") or conditions.get("_id")
            result = await query_async("crud:fetchRow", {"table": table, "id": str(doc_id)})
            return dict(result) if result else None
            
        result = await query_async("crud:fetchRowByConditions", {"table": table, "conditions": conditions or {}})
        return dict(result) if result else None
    except Exception as e:
        logger.error(f"Failed to fetch row from {table}: {e}")
        return None

async def fetch_many(
    table: str,
    conditions: Optional[Dict[str, Any]] = None,
    order_by: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
) -> List[Dict[str, Any]]:
    """Fetch multiple rows matching conditions from Convex."""
    try:
        results = await query_async(
            "crud:fetchRowsByConditions", 
            {"table": table, "conditions": conditions or {}, "limit": limit}
        )
        if not results:
            return []
        # Slice results to emulate offset if needed
        parsed_results = [dict(r) for r in results]
        if offset > 0:
            parsed_results = parsed_results[offset:]
        return parsed_results
    except Exception as e:
        logger.error(f"Failed to fetch rows from {table}: {e}")
        return []

async def update_one(
    table: str,
    data: Dict[str, Any],
    conditions: Dict[str, Any],
) -> int:
    """Update rows matching conditions in Convex."""
    try:
        row = await fetch_one(table, conditions)
        if not row:
            return 0
        doc_id = row.get("_id")
        if not doc_id:
            return 0
            
        cleaned_patch = {k: v for k, v in data.items() if k not in ("id", "_id")}
        await mutation_async("crud:updateRow", {"table": table, "id": str(doc_id), "patch": cleaned_patch})
        return 1
    except Exception as e:
        logger.error(f"Failed to update row in {table}: {e}")
        return 0

async def delete_one(
    table: str,
    conditions: Dict[str, Any],
) -> int:
    """Delete rows matching conditions in Convex."""
    try:
        row = await fetch_one(table, conditions)
        if not row:
            return 0
        doc_id = row.get("_id")
        if not doc_id:
            return 0
            
        await mutation_async("crud:deleteRow", {"table": table, "id": str(doc_id)})
        return 1
    except Exception as e:
        logger.error(f"Failed to delete row from {table}: {e}")
        return 0

# =============================================================================
# Serialization Helpers
# =============================================================================

def serialize_model(model: BaseModel) -> Dict[str, Any]:
    """Serialize Pydantic model to a dict, transforming dates."""
    data = model.model_dump()
    for key, value in data.items():
        if isinstance(value, datetime):
            data[key] = value.isoformat()
    return data

def deserialize_row(
    row: Dict[str, Any],
    model_class: type[T],
) -> T:
    """Deserialize database row from Convex into a Pydantic model."""
    data = dict(row)
    
    # Parse JSON strings inside columns if stored as raw JSON string
    for key, value in data.items():
        if isinstance(value, str):
            if value.startswith("{") or value.startswith("["):
                try:
                    data[key] = json.loads(value)
                except (json.JSONDecodeError, TypeError):
                    pass
                    
    # Map Convex native `_id` to primary key field expected by Pydantic model
    fields = model_class.model_fields
    for field_name in fields:
        if field_name == "id" or field_name.endswith("_id"):
            if field_name not in data or data[field_name] is None:
                if "_id" in data:
                    data[field_name] = str(data["_id"])
                    
    return model_class(**data)

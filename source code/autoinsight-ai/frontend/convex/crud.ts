import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generic insert mutation
export const insertRow = mutation({
  args: {
    table: v.string(),
    document: v.any(),
  },
  handler: async (ctx, args) => {
    const table = args.table as any;
    const id = await ctx.db.insert(table, args.document);
    return id;
  },
});

// Bulk insert mutation
export const bulkInsert = mutation({
  args: {
    table: v.string(),
    documents: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const table = args.table as any;
    const ids = [];
    for (const doc of args.documents) {
      const id = await ctx.db.insert(table, doc);
      ids.push(id);
    }
    return ids;
  },
});

// Generic update mutation
export const updateRow = mutation({
  args: {
    table: v.string(),
    id: v.string(),
    patch: v.any(),
  },
  handler: async (ctx, args) => {
    const table = args.table as any;
    const normalizedId = ctx.db.normalizeId(table, args.id);
    if (!normalizedId) {
      throw new Error(`Invalid ID: ${args.id} for table: ${args.table}`);
    }
    await ctx.db.patch(normalizedId, args.patch);
    return args.id;
  },
});

// Generic delete mutation
export const deleteRow = mutation({
  args: {
    table: v.string(),
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const table = args.table as any;
    const normalizedId = ctx.db.normalizeId(table, args.id);
    if (!normalizedId) {
      throw new Error(`Invalid ID: ${args.id} for table: ${args.table}`);
    }
    await ctx.db.delete(normalizedId);
    return args.id;
  },
});

// Generic fetch one query
export const fetchRow = query({
  args: {
    table: v.string(),
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const table = args.table as any;
    const normalizedId = ctx.db.normalizeId(table, args.id);
    if (!normalizedId) return null;
    return await ctx.db.get(normalizedId);
  },
});

// Fetch one row matching key-value condition
export const fetchRowByField = query({
  args: {
    table: v.string(),
    field: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const table = args.table as any;
    const results = await ctx.db
      .query(table)
      .filter((q) => q.eq(q.field(args.field), args.value))
      .first();
    return results;
  },
});

// Generic fetch many query
export const fetchRows = query({
  args: {
    table: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const table = args.table as any;
    const q = ctx.db.query(table);
    if (args.limit) {
      return await q.take(args.limit);
    }
    return await q.collect();
  },
});

// Fetch one row matching multiple conditions
export const fetchRowByConditions = query({
  args: {
    table: v.string(),
    conditions: v.any(),
  },
  handler: async (ctx, args) => {
    const table = args.table as any;
    let q = ctx.db.query(table);
    for (const [key, val] of Object.entries(args.conditions || {})) {
      q = q.filter((f) => f.eq(f.field(key), val));
    }
    return await q.first();
  },
});

// Fetch multiple rows matching multiple conditions
export const fetchRowsByConditions = query({
  args: {
    table: v.string(),
    conditions: v.any(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const table = args.table as any;
    let q = ctx.db.query(table);
    for (const [key, val] of Object.entries(args.conditions || {})) {
      q = q.filter((f) => f.eq(f.field(key), val));
    }
    if (args.limit) {
      return await q.take(args.limit);
    }
    return await q.collect();
  },
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users & Authentication
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("analyst"), v.literal("viewer")),
    isActive: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
    lastLoginAt: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // Pipeline Execution Tracking
  pipelines: defineTable({
    userId: v.optional(v.string()),
    status: v.string(), // queued, running, completed, failed, cancelled, paused
    fileName: v.string(),
    fileSize: v.number(),
    fileHash: v.string(),
    llmProvider: v.string(), // groq
    stagesCompleted: v.array(v.string()),
    totalProcessingTimeMs: v.optional(v.number()),
    unifiedDataModel: v.optional(v.string()), // stringified JSON
    error: v.optional(v.string()),
    startedAt: v.optional(v.string()),
    completedAt: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_status", ["status"]),

  // Data Models
  dataModels: defineTable({
    pipelineId: v.string(),
    userId: v.optional(v.string()),
    modelJson: v.string(), // stringified UnifiedDataModel JSON
    confidenceAvg: v.number(),
    columnCount: v.number(),
    rowCount: v.number(),
    version: v.number(),
    createdAt: v.string(),
  }).index("by_pipelineId", ["pipelineId"]),

  // Reports Index
  reports: defineTable({
    dataModelId: v.string(),
    userId: v.optional(v.string()),
    title: v.string(),
    reportBundle: v.string(), // stringified ReportBundle JSON
    exportUrls: v.string(), // stringified format -> key mappings
    status: v.string(), // pending, generating, completed, failed
    overallConfidence: v.number(),
    createdAt: v.string(),
  }).index("by_dataModelId", ["dataModelId"]),

  // NLQ Conversations
  conversations: defineTable({
    userId: v.optional(v.string()),
    datasetId: v.optional(v.string()),
    context: v.optional(v.string()), // stringified JSON
    turnCount: v.number(),
    isActive: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
    messages: v.array(
      v.object({
        sender: v.union(v.literal("user"), v.literal("agent")),
        text: v.string(),
        timestamp: v.string(),
      })
    ),
  }),

  // Prompt Registry
  prompts: defineTable({
    name: v.string(),
    version: v.number(),
    template: v.string(),
    description: v.string(),
    stage: v.number(),
    isActive: v.boolean(),
    createdAt: v.string(),
  }).index("by_name_version", ["name", "version"]),

  // Audit Logs
  auditLog: defineTable({
    userId: v.optional(v.string()),
    action: v.string(),
    resourceType: v.optional(v.string()),
    resourceId: v.optional(v.string()),
    details: v.optional(v.string()), // stringified JSON
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_action", ["action"]),

  // Files
  files: defineTable({
    userId: v.optional(v.string()),
    fileName: v.string(),
    fileSize: v.number(),
    fileHash: v.string(),
    mimeType: v.string(),
    storageId: v.string(), // points to Convex file storage ID
    metadata: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_fileHash", ["fileHash"]),
}, {
  schemaValidation: false,
});

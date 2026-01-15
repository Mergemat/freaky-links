import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  links: defineTable({
    shortId: v.string(),
    originalUrl: v.string(),
    freakyPrefix: v.string(),
    createdAt: v.number(),
  }).index("by_shortId", ["shortId"]),
});

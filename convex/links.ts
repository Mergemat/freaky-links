import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateFreakyUrl, generateShortId } from "./generator";

export const createLink = mutation({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    // Basic URL validation
    try {
      new URL(args.url);
    } catch {
      throw new Error("Invalid URL");
    }

    const shortId = generateShortId();
    const { subdomain, path, fullUrl } = generateFreakyUrl(shortId);

    await ctx.db.insert("links", {
      shortId,
      originalUrl: args.url,
      freakyPrefix: `${subdomain}/${path}`,
      createdAt: Date.now(),
    });

    return {
      shortId,
      freakyUrl: fullUrl,
    };
  },
});

export const getLink = query({
  args: { shortId: v.string() },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("links")
      .withIndex("by_shortId", (q) => q.eq("shortId", args.shortId))
      .first();

    return link;
  },
});

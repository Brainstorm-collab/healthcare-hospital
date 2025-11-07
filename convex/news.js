import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all published news
export const getPublishedNews = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const news = await ctx.db
      .query("news")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    // Sort by published date (newest first)
    news.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));

    // Limit results if specified
    if (args.limit) {
      return news.slice(0, args.limit);
    }

    return news;
  },
});

// Get news by category
export const getNewsByCategory = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const news = await ctx.db
      .query("news")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();

    return news.filter((n) => n.published).sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
  },
});

// Create news article
export const createNews = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    content: v.string(),
    author: v.string(),
    image: v.optional(v.string()),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const newsId = await ctx.db.insert("news", {
      title: args.title,
      category: args.category,
      content: args.content,
      author: args.author,
      image: args.image,
      published: args.published,
      publishedAt: args.published ? Date.now() : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { newsId, success: true };
  },
});


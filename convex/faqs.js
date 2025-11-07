import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all FAQs
export const listFAQs = query({
  handler: async (ctx) => {
    const faqs = await ctx.db.query("faqs").collect();
    // Sort by order if available
    faqs.sort((a, b) => (a.order || 0) - (b.order || 0));
    return faqs;
  },
});

// Create FAQ
export const createFAQ = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    category: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const faqId = await ctx.db.insert("faqs", {
      question: args.question,
      answer: args.answer,
      category: args.category,
      order: args.order,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { faqId, success: true };
  },
});

// Update FAQ
export const updateFAQ = mutation({
  args: {
    faqId: v.id("faqs"),
    question: v.optional(v.string()),
    answer: v.optional(v.string()),
    category: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { faqId, ...updates } = args;
    const faq = await ctx.db.get(faqId);
    if (!faq) {
      throw new Error("FAQ not found");
    }

    await ctx.db.patch(faqId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});


import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Generate upload URL for profile picture
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save profile picture URL to user
export const saveProfilePicture = mutation({
  args: {
    userId: v.id("users"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Get the storage URL
    const url = await ctx.storage.getUrl(args.storageId);
    
    if (!url) {
      throw new Error("Failed to get storage URL");
    }

    // Update user's profile image
    await ctx.db.patch(args.userId, {
      profileImage: url,
      updatedAt: Date.now(),
    });

    return { url, success: true };
  },
});

// Delete profile picture
export const deleteProfilePicture = mutation({
  args: {
    userId: v.id("users"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Delete from storage
    await ctx.storage.delete(args.storageId);
    
    // Update user's profile image to empty
    await ctx.db.patch(args.userId, {
      profileImage: undefined,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});


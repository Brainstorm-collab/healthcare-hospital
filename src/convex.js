import { ConvexReactClient } from "convex/react";

// Get the Convex URL from environment variables
// This will be set when you run `npx convex dev`
const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "Missing VITE_CONVEX_URL environment variable. " +
    "Run `npx convex dev` to set it up."
  );
}

export const convex = new ConvexReactClient(convexUrl);


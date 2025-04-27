import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    
    return profile;
  },
});

export const createProfile = mutation({
  args: {
    name: v.string(),
    fitnessLevel: v.string(),
    availableDays: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("profiles", {
      userId,
      name: args.name,
      subscriptionStatus: "free",
      fitnessLevel: args.fitnessLevel,
      availableDays: args.availableDays,
      // Required fields with default values
      email: "",
      gender: "",
      dateOfBirth: Date.now(),
      daysRemaining: 0,
      preferredTime: "",
      sessionDuration: "",
    });
  },
});

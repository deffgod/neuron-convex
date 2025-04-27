import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // User Profile and Preferences
  profiles: defineTable({
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    gender: v.string(),
    dateOfBirth: v.number(),
    subscriptionStatus: v.string(),
    daysRemaining: v.number(),
    // Biometrics
    weight: v.optional(v.number()),
    height: v.optional(v.number()),
    waistCircumference: v.optional(v.number()),
    hipCircumference: v.optional(v.number()),
    restingHeartRate: v.optional(v.number()),
    maxHeartRate: v.optional(v.number()),
    stbIndex: v.optional(v.number()),
    calorieTarget: v.optional(v.number()),
    // Preferences
    fitnessLevel: v.string(),
    preferredTime: v.string(),
    sessionDuration: v.string(),
    availableDays: v.array(v.string()),
  }).index("by_user", ["userId"]),

  // User Goals
  userGoals: defineTable({
    userId: v.id("users"),
    goalType: v.string(),
    goalName: v.string(),
    priority: v.number(),
  }).index("by_user", ["userId"]),

  // Content Categories
  categories: defineTable({
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    imageUrl: v.string(),
  }),

  // Content Subcategories
  subcategories: defineTable({
    categoryId: v.id("categories"),
    name: v.string(),
    description: v.string(),
  }).index("by_category", ["categoryId"]),

  // Neuro Effects
  neuroEffects: defineTable({
    name: v.string(),
    description: v.string(),
  }),

  // Equipment
  equipment: defineTable({
    name: v.string(),
    description: v.string(),
    alternatives: v.array(v.string()),
  }),

  // Courses
  courses: defineTable({
    name: v.string(),
    description: v.string(),
    status: v.string(),
  }),

  // Videos
  videos: defineTable({
    name: v.string(),
    description: v.string(),
    duration: v.string(),
    minutes: v.number(),
    seconds: v.number(),
    totalSeconds: v.number(),
    videoLink: v.string(),
    videoPoster: v.string(),
    trainerName: v.string(),
    statusEmoji: v.string(),
    categoryId: v.id("categories"),
    subcategoryId: v.id("subcategories"),
  })
    .index("by_category", ["categoryId"])
    .index("by_subcategory", ["subcategoryId"]),

  // Video Effects
  videoEffects: defineTable({
    videoId: v.id("videos"),
    effectId: v.id("neuroEffects"),
  }).index("by_video", ["videoId"]),

  // Video Equipment
  videoEquipment: defineTable({
    videoId: v.id("videos"),
    equipmentId: v.id("equipment"),
  }).index("by_video", ["videoId"]),

  // Course Videos
  courseVideos: defineTable({
    courseId: v.id("courses"),
    videoId: v.id("videos"),
    sequenceOrder: v.number(),
  })
    .index("by_course", ["courseId"])
    .index("by_video", ["videoId"]),

  // User Course Enrollments
  userCourses: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    enrollmentDate: v.number(),
    expirationDate: v.number(),
    status: v.string(),
  }).index("by_user", ["userId"]),

  // User Progress
  userProgress: defineTable({
    userId: v.id("users"),
    completedWorkouts: v.number(),
    activityMinutes: v.number(),
    testingProgress: v.number(),
    // Physical metrics
    metrics: v.object({
      totalWorkouts: v.number(),
      totalMinutes: v.number(),
      streakDays: v.number(),
    }),
    // Cognitive metrics
    focusScore: v.optional(v.number()),
    memoryScore: v.optional(v.number()),
    reactionTime: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  // Video Metrics
  videoMetrics: defineTable({
    videoId: v.id("videos"),
    views: v.number(),
    likes: v.number(),
    completionCount: v.number(),
    updatedAt: v.number(),
  }).index("by_video", ["videoId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"], // Should be hashed
      select: false, // Prevent password from being sent in query results
    },
    avatarUrl: {
      type: String,
      default: "", // Can be default profile image URL
    },

    // ✅ Verification and Auth
    isVerified: {
      type: Boolean,
      default: false,
    },
    sendEmail: {
      type: Boolean,
      default: true,
    },

    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },

    // ✅ Role Management
    role: {
      type: String,
      enum: ["user", "admin", "agent", "support"],
      default: "user",
    },

    // ✅ Real-time Presence
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    socketId: {
      type: String,
      default: null,
    },

    // ✅ Login Method (Email or OAuth)
    authProvider: {
      type: String,
      enum: ["local", "google", "microsoft"],
      default: "local",
    },

    // ✅ Refresh Token Store (for security)
    refreshTokens: [
      {
        token: String,
        createdAt: { type: Date, default: Date.now },
        ip: String,
        userAgent: String,
      },
    ],

    // ✅ 2FA Placeholder
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

exports.User = mongoose.model("User", userSchema);

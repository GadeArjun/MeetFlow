const mongoose = require("mongoose");
const { Schema } = mongoose;

const meetingSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Meeting title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    // Creator of the meeting
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Time and date
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // e.g. "14:00"
      required: true,
    },
    endTime: {
      type: String, // e.g. "15:00"
      required: true,
    },

    // Unique meeting ID or code
    meetingCode: {
      type: String,
      required: true,
      unique: true,
    },
    meetingLink: {
      type: String,
      // required: true,
      unique: true,
    },
    // Optional password protection
    isProtected: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String, // Hashed if present
    },

    // Access control
    invitedEmails: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },

    // Participants (who joined)
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        email: String, // if user is a guest
      },
    ],

    // Meeting status
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);

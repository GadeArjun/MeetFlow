const express = require("express");
const router = express.Router();
const meetingController = require("../controller/meeting");
const auth = require("../middleware/auth");

// Create a new meeting
router.post("/", auth, meetingController.createMeeting);

// Get all meetings for the authenticated user
router.get("/", auth, meetingController.getUserMeetings);

// Get a specific meeting by code
router.get("/:code", auth, meetingController.getMeetingByCode);

// Update a meeting
router.put("/:id", auth, meetingController.updateMeeting);

// Delete a meeting
router.delete("/:id", auth, meetingController.deleteMeeting);

module.exports = router;

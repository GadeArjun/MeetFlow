const Meeting = require("../model/Meeting");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const sendMeetingInvite = require("../utils/sendMeetingInvite");
moment.tz.setDefault("Asia/Kolkata"); // Use your desired timezone

const generateMeetingCode = async () => {
  const { customAlphabet } = await import("nanoid");
  const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

  let code;
  let exists = true;
  while (exists) {
    code = nanoid();
    const meeting = await Meeting.findOne({ meetingCode: code });
    if (!meeting) {
      exists = false;
    }
  }
  return code;
};

// Create a new meeting
exports.createMeeting = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      // password,
      invitedEmails,
      // isPublic,
    } = req.body;

    const meetingCode = await generateMeetingCode(); // e.g., "V1StGXR8"
    const meetingLink = `/join-meeting/${meetingCode}`;

    console.log({ invitedEmails });

    // const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const meeting = new Meeting({
      title,
      description,
      date,
      startTime,
      endTime,
      // password: hashedPassword,
      // isProtected: !!password,
      invitedEmails,
      // isPublic: invitedEmails?.length > 0 || isPublic,
      createdBy: req.user.id,
      meetingCode,
      meetingLink,
    });

    await meeting.save();

    res.status(201).json({ meeting });
    const protocol = req.protocol;
    const host =
      req.get("host") === "127.0.0.1:8080"
        ? "5173-firebase-deskly-1753548820703.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev"
        : req.get("host");

    console.log({ protocol, host });

    sendMeetingInvite(invitedEmails, meeting, protocol, host);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while creating meeting." });
  }
};

// Get all meetings for the authenticated user

exports.getUserMeetings = async (req, res) => {
  try {
    const now = moment();

    let meetings = await Meeting.find({
      createdBy: req.user.id,
    });

    const updatedMeetings = await Promise.all(
      meetings.map(async (meeting) => {
        const meetingDate = moment(meeting.date).format("YYYY-MM-DD");

        const start = moment(
          `${meetingDate} ${meeting.startTime}`,
          "YYYY-MM-DD HH:mm"
        );
        const end = moment(
          `${meetingDate} ${meeting.endTime}`,
          "YYYY-MM-DD HH:mm"
        );

        let newStatus = meeting.status;

        if (now.isAfter(end)) {
          newStatus = "completed";
        } else if (now.isSameOrAfter(start) && now.isBefore(end)) {
          newStatus = "ongoing";
        } else if (now.isBefore(start)) {
          newStatus = "scheduled";
        }

        if (newStatus !== meeting.status) {
          meeting.status = newStatus;
          await meeting.save();
        }

        return meeting;
      })
    );

    // Separate categories
    const scheduledMeetings = updatedMeetings.filter(
      (m) => m.status === "scheduled"
    );
    const ongoingMeetings = updatedMeetings.filter(
      (m) => m.status === "ongoing"
    );
    const pastMeetings = updatedMeetings.filter(
      (m) => m.status === "completed"
    );

    // 📊 Analytics from past meetings
    const analytics = {
      totalPastMeetings: pastMeetings.length,
      meetingsByMonth: {},
      totalDurationHours: 0,
      avgDurationMinutes: 0,
    };

    let totalMinutes = 0;

    pastMeetings.forEach((m) => {
      const dateStr = moment(m.date).format("MMM YYYY");

      // Count by month
      if (!analytics.meetingsByMonth[dateStr]) {
        analytics.meetingsByMonth[dateStr] = 0;
      }
      analytics.meetingsByMonth[dateStr]++;

      // Duration calc
      const start = moment(
        `${moment(m.date).format("YYYY-MM-DD")} ${m.startTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const end = moment(
        `${moment(m.date).format("YYYY-MM-DD")} ${m.endTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const duration = end.diff(start, "minutes");

      totalMinutes += duration;
    });

    analytics.totalDurationHours = (totalMinutes / 60).toFixed(1);
    analytics.avgDurationMinutes =
      pastMeetings.length > 0
        ? Math.round(totalMinutes / pastMeetings.length)
        : 0;

    // Send response
    res.status(200).json({
      scheduledMeetings,
      ongoingMeetings,
      pastMeetings, // keep raw list if needed
      analytics, // send stats for visualization
    });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Server error while fetching meetings." });
  }
};

// Get a specific meeting by code
exports.getMeetingByCode = async (req, res) => {
  try {
    const { code } = req.params;
    console.log({ code });
    const meeting = await Meeting.findOne({ meetingCode: code });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found." });
    }

    res.status(200).json({ meeting });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching meeting." });
  }
};

// Update a meeting
exports.updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
      updates.isProtected = true;
    }

    const meeting = await Meeting.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found." });
    }

    res.status(200).json({ meeting });
  } catch (error) {
    res.status(500).json({ error: "Server error while updating meeting." });
  }
};

// Delete a meeting
exports.deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findByIdAndDelete(id);

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found." });
    }

    res.status(200).json({ message: "Meeting deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error while deleting meeting." });
  }
};

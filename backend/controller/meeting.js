const Meeting = require("../model/Meeting");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
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
      password,
      invitedEmails,
      isPublic,
    } = req.body;

    const meetingCode = await generateMeetingCode(); // e.g., "V1StGXR8"
    const meetingLink = `/join-meeting/${meetingCode}`;

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const meeting = new Meeting({
      title,
      description,
      date,
      startTime,
      endTime,
      password: hashedPassword,
      isProtected: !!password,
      invitedEmails,
      isPublic: invitedEmails?.length > 0 || isPublic,
      createdBy: req.user.id,
      meetingCode,
      meetingLink,
    });

    await meeting.save();

    res.status(201).json({ meeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while creating meeting." });
  }
};

// Get all meetings for the authenticated user

exports.getUserMeetings = async (req, res) => {
  try {
    const now = moment(); // current time in server's timezone

    // Fetch only scheduled and ongoing
    let meetings = await Meeting.find({
      createdBy: req.user.id,
      status: { $in: ["scheduled", "ongoing"] },
    });

    const updatedMeetings = await Promise.all(
      meetings.map(async (meeting) => {
        // Combine meeting.date with start and end time
        const meetingDate = moment(meeting.date).format("YYYY-MM-DD"); // formatted date only

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

    // Re-filter after update
    const filteredMeetings = updatedMeetings
      .filter((m) => m.status === "scheduled" || m.status === "ongoing")
      .sort((a, b) => {
        const aDateTime = moment(
          `${a.date.toISOString().split("T")[0]} ${a.startTime}`,
          "YYYY-MM-DD HH:mm"
        );
        const bDateTime = moment(
          `${b.date.toISOString().split("T")[0]} ${b.startTime}`,
          "YYYY-MM-DD HH:mm"
        );
        return bDateTime - aDateTime;
      });

    res.status(200).json({ meetings: filteredMeetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Server error while fetching meetings." });
  }
};

// Get a specific meeting by code
exports.getMeetingByCode = async (req, res) => {
  try {
    const { code } = req.params;
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

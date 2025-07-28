import React, { useContext, useState } from "react";
import "./CreateMeeting.css";
import {
  Calendar,
  Clock,
  MailPlus,
  XCircle,
  Link2,
  Send,
  Copy,
} from "lucide-react";
import axios from "axios";
import { MeetingContext } from "../../context/MeetingContext";

const CreateMeeting = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    password: "",
  });

  const [emails, setEmails] = useState([{ id: 1, value: "" }]);
  const [generatedLink, setGeneratedLink] = useState("");
  const [error, setError] = useState("");
  const { setMeetings } = useContext(MeetingContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index].value = value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    setEmails([...emails, { id: Date.now(), value: "" }]);
  };

  const removeEmailField = (index) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  const isValidTime = () => {
    const now = new Date();
    const selectedDate = new Date(form.date);
    const today = now.toISOString().split("T")[0];

    if (form.date === today) {
      const [hour, minute] = form.startTime.split(":");
      const formTime = new Date();
      formTime.setHours(+hour, +minute, 0);
      return formTime.getTime() > now.getTime();
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGeneratedLink("");

    if (!isValidTime()) {
      return setError("Start time must be in the future.");
    }

    const meetingCode = Math.random().toString(36).substring(2, 10);
    const meetingLink = `/join-meeting/${meetingCode}`;

    const validEmails = emails.map((e) => e.value.trim()).filter((e) => e);

    const payload = {
      title: form.title,
      description: form.description,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      password: form.password || null,
      invitedEmails: validEmails,
      isPublic: validEmails.length === 0, // open to all if no invitedEmails
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/meeting`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { meeting } = response.data;
      setMeetings((prev) => [meeting, ...prev]);
      setGeneratedLink(
        window.location.origin + (meeting.meetingLink || meetingLink)
      );
      alert("Meeting created successfully!");

      // Reset form
      setForm({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        password: "",
      });
      setEmails([{ id: 1, value: "" }]);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Something went wrong while creating meeting.";
      setError(msg);
    }
  };

  return (
    <div className="create-meeting-container">
      <h2>Create New Meeting</h2>

      {error && <p className="error-text">{error}</p>}

      <form className="meeting-form" onSubmit={handleSubmit}>
        <label>Meeting Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />

        <div className="row">
          <div>
            <label>
              <Calendar size={14} /> Date
            </label>
            <input
              type="date"
              name="date"
              min={new Date().toLocaleDateString("en-CA")}
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>
              <Clock size={14} /> Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>
              <Clock size={14} /> End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label>
          <MailPlus size={14} /> Invite Participants
        </label>
        {emails.map((email, index) => (
          <div className="email-row" key={email.id}>
            <span>{index + 1}.</span>
            <input
              type="email"
              placeholder="example@email.com"
              value={email.value}
              onChange={(e) => handleEmailChange(index, e.target.value)}
            />
            {emails.length > 1 && (
              <button
                type="button"
                onClick={() => removeEmailField(index)}
                className="remove-btn"
              >
                <XCircle size={18} />
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-email-btn" onClick={addEmailField}>
          + Add Email
        </button>

        <label>Password (optional)</label>
        <input
          type="text"
          name="password"
          value={form.password}
          placeholder="Meeting password"
          onChange={handleChange}
        />

        <button type="submit" className="create-button">
          Create Meeting
        </button>
      </form>

      {generatedLink && (
        <div className="meeting-link-box">
          <h4>
            <Link2 size={18} style={{ marginRight: "6px" }} />
            Meeting Link
          </h4>
          <div className="link-actions">
            <input type="text" readOnly value={generatedLink} />

            <div className="buttons">
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(`${generatedLink}`);
                  alert("Link copied to clipboard!");
                }}
              >
                <Copy size={16} />
                Copy
              </button>

              <a
                className="whatsapp-btn"
                href={`https://wa.me/?text=${encodeURIComponent(
                  "Join my Deskly meeting: " + generatedLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send size={16} />
                Share
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMeeting;

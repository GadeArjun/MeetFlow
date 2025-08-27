const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");

/**
 * Send meeting invitations to multiple emails
 * @param {Array} invitedEmails - List of emails to send invite to
 * @param {Object} meeting - Meeting details
 * @param {String} protocol - Protocol (http or https)
 * @param {String} domain - Domain name
 */
const sendMeetingInvite = async (invitedEmails, meeting, protocol, domain) => {
  if (!invitedEmails || invitedEmails.length === 0) return;
  const meetingLink = `${protocol}://${domain}/join-meeting/${meeting.meetingCode}`;
  console.log({ meetingLink });
  const logoPath = path.join(__dirname, "../", "public", "logo.png");
  console.log("Logo Path:", { logoPath });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const formattedDate = new Date(meeting.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeRange = `${meeting.startTime} - ${meeting.endTime}`;
  const subject = `📅 Invitation: ${meeting.title}`;

  // Full-width, responsive dark-themed email
  const htmlContent = `
  <div style="background-color:#0b1222; color:#e5e7eb; font-family:Arial, sans-serif; padding:0; margin:0; width:100%; min-height:100vh;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:800px; margin:auto; background:#0f172a; border-radius:12px; box-shadow:0 6px 20px rgba(0,0,0,.45); overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="text-align:center; padding:20px; background:#1e293b;">
                <img src="cid:meetflowlogo" alt="MeetFlow Logo" style="width:140px; height:auto; display:block; margin:auto;" />
              </td>
            </tr>

            <!-- Hero Section -->
            <tr>
              <td style="padding:40px 20px; text-align:center; background:#0f172a;">
                <h1 style="color:#4ade80; margin:0; font-size:26px;">Seamless Meetings.<br/>Anytime. Anywhere.</h1>
                <p style="color:#9ca3af; font-size:16px; margin:15px 0 25px;">
                  Connect, collaborate, and create with MeetFlow's high-quality video conferencing.
                </p>
                <a href="${meetingLink}" target="_blank" 
                  style="background:#7c3aed; color:#fff; text-decoration:none; padding:14px 28px; font-size:16px; border-radius:8px; display:inline-block; margin-right:10px;">
                  🔗 Join Meeting
                </a>
                <a href="${protocol}://${domain}" target="_blank" 
                  style="background:#3b82f6; color:#fff; text-decoration:none; padding:14px 28px; font-size:16px; border-radius:8px; display:inline-block;">
                  🌐 Visit Site
                </a>
              </td>
            </tr>

            <!-- Meeting Details -->
            <tr>
              <td style="padding:30px 20px; background:#1e293b;">
                <h2 style="color:#f472b6; margin:0 0 20px;">📌 Meeting Invitation Details</h2>
                <p style="font-size:16px; margin:8px 0;"><strong style="color:#4ade80;">Title:</strong> ${
                  meeting.title
                }</p>
                <p style="font-size:16px; margin:8px 0;"><strong style="color:#4ade80;">Description:</strong> ${
                  meeting.description || "No description provided"
                }</p>
                <p style="font-size:16px; margin:8px 0;"><strong style="color:#4ade80;">Date:</strong> ${formattedDate}</p>
                <p style="font-size:16px; margin:8px 0;"><strong style="color:#4ade80;">Time:</strong> ${timeRange}</p>
                <p style="font-size:16px; margin:8px 0;"><strong style="color:#4ade80;">Meeting Link:</strong> <a href="${meetingLink}" target="_blank" style="color:#3b82f6; text-decoration:none;">${meetingLink}</a></p>
              </td>
            </tr>

            <!-- Features Section -->
            <tr>
              <td style="padding:40px 20px; background:#0f172a; text-align:center;">
                <h2 style="color:#facc15;">✨ Key Features</h2>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:20px;">
                  <tr>
                    <td style="width:50%; padding:10px; color:#9ca3af; font-size:14px; text-align:left;">
                      ✅ High-Quality Video Calls<br/>
                      ✅ Screen Sharing<br/>
                      ✅ Meeting Recording
                    </td>
                    <td style="width:50%; padding:10px; color:#9ca3af; font-size:14px; text-align:left;">
                      ✅ Secure Access<br/>
                      ✅ Cross-Platform Support<br/>
                      ✅ Calendar Integration
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Why Choose Section -->
            <tr>
              <td style="padding:30px 20px; background:#1e293b;">
                <h2 style="color:#4ade80;">🚀 Why Choose MeetFlow?</h2>
                <ul style="color:#9ca3af; font-size:14px; line-height:1.6; padding-left:20px; margin:15px 0;">
                  <li>Intuitive Interface: Simple and fast meeting setup</li>
                  <li>Reliable Performance: Lag-free, consistent experience</li>
                  <li>Flexible Solutions: Scales from small teams to enterprises</li>
                  <li>Dedicated Support: Always here to help</li>
                </ul>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#0b1222; text-align:center; padding:30px;">
                <p style="color:#9ca3af; font-size:12px; margin:0;">
                  <a href="${protocol}://${domain}/" style="color:#3b82f6; text-decoration:none; margin:0 10px;">Home</a> |
                  <a href="${protocol}://${domain}/#features" style="color:#3b82f6; text-decoration:none; margin:0 10px;">Features</a> |
                  <a href="${protocol}://${domain}/#about" style="color:#3b82f6; text-decoration:none; margin:0 10px;">About</a> |
                  <a href="${protocol}://${domain}/#contact" style="color:#3b82f6; text-decoration:none; margin:0 10px;">Contact</a>
                </p>
                <p style="color:#9ca3af; font-size:12px; margin-top:15px;">© 2024 MeetFlow. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;

  for (const email of invitedEmails) {
    await transporter.sendMail({
      from: `"MeetFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.png",
          path: logoPath, // local file
          cid: "meetflowlogo", // must match cid in <img>
        },
      ],
    });
  }
};

module.exports = sendMeetingInvite;

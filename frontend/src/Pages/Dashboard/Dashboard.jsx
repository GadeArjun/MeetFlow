import React, { useContext, useEffect, useMemo, useRef } from "react";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  CalendarClock,
  PlayCircle,
  CheckCircle2,
  Radio,
  Video,
  TrendingUp,
} from "lucide-react";
import { MeetingContext } from "../../context/MeetingContext";
import "./Dashboard.css";
import Meta from "../../Components/Meta/Meta";

export default function Dashboard() {
  const {
    scheduledMeetings = [],
    ongoingMeetings = [],
    pastMeetings = [],
    analytics = {},
    meetingContextLoading,
  } = useContext(MeetingContext);

  const navigate = useNavigate();

  // ---------- Helpers ----------
  const getDateTime = (dateStr, timeStr, fallbackMins = 60) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return null;

    if (typeof timeStr === "string" && timeStr.includes(":")) {
      const [h, m] = timeStr.split(":").map((n) => Number(n));
      d.setHours(h || 0, m || 0, 0, 0);
    } else {
      d.setMinutes(d.getMinutes() + fallbackMins);
    }
    return d;
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const ongoing = ongoingMeetings.length > 0 ? ongoingMeetings[0] : null;

  // ---------- Derived analytics (fallbacks if backend doesn't send totals) ----------
  const computed = useMemo(() => {
    const completedCount = pastMeetings.filter(
      (m) => m.status === "completed"
    ).length;
    const totals = {
      total:
        analytics?.total ??
        scheduledMeetings.length + ongoingMeetings.length + pastMeetings.length,
      upcoming: analytics?.upcoming ?? scheduledMeetings.length,
      ongoing: analytics?.ongoing ?? ongoingMeetings.length,
      completed: analytics?.completed ?? completedCount,
    };
    return { totals, completedCount };
  }, [analytics, pastMeetings, scheduledMeetings, ongoingMeetings]);

  // ---------- Past meetings chart (custom canvas) ----------
  const chartRef = useRef(null);

  // Utility: devicePixelRatio-safe canvas sizing
  const resizeCanvas = (canvas, width, height) => {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return ctx;
  };

  // Prepare grouped counts by day (completed/cancelled)
  const byDay = useMemo(() => {
    const map = new Map(); // key: 'MMM DD', val: { completed, cancelled }
    pastMeetings.forEach((m) => {
      const key = formatDate(m.date);
      if (!map.has(key)) map.set(key, { completed: 0, cancelled: 0 });
      const bucket = map.get(key);
      if (m.status === "cancelled") bucket.cancelled += 1;
      else bucket.completed += 1; // default to completed if missing
    });
    return Array.from(map.entries()).map(([label, v]) => ({ label, ...v }));
  }, [pastMeetings]);

  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    if (byDay.length === 0) {
      const ctx = resizeCanvas(canvas, canvas.clientWidth || 640, 280);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const draw = () => {
      const width = canvas.clientWidth || 640;
      const height = 280;
      const ctx = resizeCanvas(canvas, width, height);

      // chart padding
      const pad = { top: 20, right: 24, bottom: 40, left: 40 };

      // axes area
      const innerW = width - pad.left - pad.right;
      const innerH = height - pad.top - pad.bottom;

      // scales
      const labels = byDay.map((d) => d.label);
      const maxY = Math.max(1, ...byDay.map((d) => d.completed + d.cancelled));

      const barGroupW = Math.max(24, innerW / Math.max(1, labels.length));
      const barW = Math.min(18, (barGroupW - 10) / 2); // two bars with gap

      // clear bg
      ctx.clearRect(0, 0, width, height);

      // panel bg
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(pad.left - 8, pad.top - 8, innerW + 16, innerH + 16);

      // axes
      ctx.strokeStyle = "#3a495f";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, height - pad.bottom);
      ctx.lineTo(width - pad.right, height - pad.bottom);
      ctx.moveTo(width - pad.right, height - pad.bottom);
      ctx.lineTo(width - pad.right, pad.top);
      ctx.stroke();

      // y ticks (0..maxY)
      ctx.fillStyle = "#9ca3af";
      ctx.font = "12px Inter, system-ui, sans-serif";
      const tickCount = Math.min(5, maxY);
      for (let i = 0; i <= tickCount; i++) {
        const yVal = Math.round((maxY / tickCount) * i);
        const y = height - pad.bottom - (yVal / maxY) * innerH;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(width - pad.right, y);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillText(String(yVal), pad.left - 24, y + 4);
      }

      // bars
      labels.forEach((label, i) => {
        const data = byDay[i];
        const baseX =
          pad.left + i * barGroupW + (barGroupW - (barW * 2 + 6)) / 2;
        // completed
        const hComp = (data.completed / maxY) * innerH;
        ctx.fillStyle = "#4ade80";
        ctx.fillRect(baseX, height - pad.bottom - hComp, barW, hComp);
        // cancelled
        const hCanc = (data.cancelled / maxY) * innerH;
        ctx.fillStyle = "#f87171";
        ctx.fillRect(
          baseX + barW + 6,
          height - pad.bottom - hCanc,
          barW,
          hCanc
        );

        // x labels
        ctx.fillStyle = "#cbd5e1";
        ctx.textAlign = "center";
        ctx.fillText(
          label,
          pad.left + i * barGroupW + barGroupW / 2,
          height - pad.bottom + 22
        );
      });

      // legend
      const legendY = pad.top - 4;
      const legendX = pad.left;
      ctx.textAlign = "left";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText("Completed", legendX + 20, legendY);
      ctx.fillText("Cancelled", legendX + 120, legendY);
      ctx.fillStyle = "#4ade80";
      ctx.fillRect(legendX, legendY - 9, 12, 12);
      ctx.fillStyle = "#f87171";
      ctx.fillRect(legendX + 100, legendY - 9, 12, 12);
    };

    // draw now + on resize
    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [byDay]);

  if (meetingContextLoading) {
    return <div className="loading">Loading meetings...</div>;
  }

  return (
    <>
      <Meta page={"dashboard"} />
      <div className="meetflow-dashboard">
        {/* Top Analytics */}
        <div className="analytics-panel">
          <div className="analytics-card">
            <div className="icon">
              <Activity size={18} />
            </div>
            <div className="label">Total</div>
            <div className="value">{computed.totals.total}</div>
          </div>
          <div className="analytics-card">
            <div className="icon">
              <CalendarClock size={18} />
            </div>
            <div className="label">Upcoming</div>
            <div className="value">{computed.totals.upcoming}</div>
          </div>
          <div className="analytics-card">
            <div className="icon">
              <PlayCircle size={18} />
            </div>
            <div className="label">Ongoing</div>
            <div className="value">{computed.totals.ongoing}</div>
          </div>
          <div className="analytics-card">
            <div className="icon">
              <CheckCircle2 size={18} />
            </div>
            <div className="label">Completed</div>
            <div className="value">{computed.totals.completed}</div>
          </div>
        </div>

        {/* Ongoing */}
        <div className={`ongoing-wrapper ${ongoing ? "has-live" : "no-live"}`}>
          {ongoing ? (
            <div className="countdown-card live">
              <div className="live-badge">
                <Radio size={14} /> Live now
              </div>
              <h3>{ongoing.title}</h3>
              <p className="sub">
                {new Date(`${ongoing.date}`).toLocaleDateString()} •{" "}
                {ongoing.startTime} - {ongoing.endTime || "—"}
              </p>
              <div className="countdown-wrap">
                <Countdown date={getDateTime(ongoing.date, ongoing.endTime)} />
              </div>
              <button
                className="join-btn"
                onClick={() => navigate(ongoing.meetingLink)}
              >
                <Video size={16} /> Join Live
              </button>
            </div>
          ) : (
            <div className="countdown-card empty">
              <h3>No ongoing meetings</h3>
              <p className="sub">
                We’ll highlight them here when a meeting starts.
              </p>
            </div>
          )}

          {/* Mini analytics nugget (optional) */}
          <div className="mini-card">
            <div className="mini-top">
              <TrendingUp size={16} />
              <span>Monthly Activity</span>
            </div>
            <div className="mini-body">
              <div className="mini-row">
                <span>Past Meetings</span>
                <b>{pastMeetings.length}</b>
              </div>
              <div className="mini-row">
                <span>Completed</span>
                <b>{computed.completedCount}</b>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled */}
        <div className="timeline-card scheduled">
          <h3>Scheduled Meetings</h3>
          {scheduledMeetings.length === 0 ? (
            <p className="empty">No upcoming meetings</p>
          ) : (
            <ul>
              {scheduledMeetings.map((m) => {
                const start = getDateTime(m.date, m.startTime);
                return (
                  <li key={m._id}>
                    <span className="date">{formatDate(m.date)}</span>
                    <span className="time">{m.startTime || "—"}</span>
                    <span className="title" title={m.title}>
                      {m.title}
                    </span>
                    <span className="countdown-small">
                      {start ? <Countdown date={start} /> : "—"}
                    </span>
                    <button
                      className="join-btn small"
                      onClick={() => navigate(m.meetingLink)}
                      disabled={m.status === "cancelled"}
                      aria-disabled={m.status === "cancelled"}
                    >
                      <Video size={14} /> Join
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Past Meetings Chart */}
        <div className="timeline-card past">
          <h3>Past Meetings Overview</h3>
          {pastMeetings.length === 0 ? (
            <p className="empty">No past meetings</p>
          ) : (
            <div className="canvas-wrap">
              <canvas ref={chartRef} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// src/Components/JoinMeeting/Chat.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import { X, Send } from "lucide-react";

/**
 * Props:
 * - isOpen: boolean
 * - toggleChat: () => void
 * - messages: Array<{ sender: string, text: string }>
 * - onSendMessage: (text: string) => void
 * - currentUserId: string
 */
const Chat = ({
  isOpen,
  toggleChat,
  messages = [],
  onSendMessage,
  currentUser,
}) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  console.log({ messages });

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed) {
      onSendMessage({
        message: trimmed,
        sender: currentUser.name,
        senderId: currentUser._id,
      });
      setMessage("");
    }
  };

  if (!isOpen) return null; // Hide completely if closed

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>Meeting Chat</span>
        <button className="chat-close-btn" onClick={toggleChat}>
          <X size={18} />
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">No messages yet</div>
        )}
        {messages.map((msg, index) => {
          const isSelf = msg.senderId === currentUser._id;
          return (
            <div
              key={index}
              className={`chat-message ${isSelf ? "self" : "other"}`}
            >
              {!isSelf ? (
                <div className="chat-sender">{msg.sender}</div>
              ) : (
                <div className="chat-sender">YOU</div>
              )}
              <div className="chat-bubble">{msg.message}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="chat-send-btn" onClick={handleSend}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chat;

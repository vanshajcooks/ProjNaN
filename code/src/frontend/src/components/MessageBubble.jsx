import { CheckCheck } from "lucide-react";

function MessageBubble({ message }) {
  return (
    <div
      className={`message-row ${
        message.own ? "own" : ""
      }`}
    >
      {!message.own && (
        <div className="message-avatar">
          {message.initials}
        </div>
      )}

      <div className="message-content">
        {!message.own && (
          <div className="message-meta">
            <strong>{message.sender}</strong>
            <span>{message.time}</span>
          </div>
        )}

        <div
          className={`message-bubble ${
            message.own
              ? "own-message"
              : "other-message"
          }`}
        >
          {message.message}
        </div>

        {message.own && (
          <div className="own-time">
            {message.time}
            <span className="message-check" style={{ display: "inline-flex", alignItems: "center" }}>
              <CheckCheck size={13} color="#a78bfa" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
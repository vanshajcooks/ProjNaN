import { useState } from "react";
import { Paperclip, Smile, AtSign, Send } from "lucide-react";

function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    onSend(message);

    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <form
      className="message-input-wrapper"
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className="input-tool"
        title="Attach file"
      >
        <Paperclip size={16} />
      </button>

      <button
        type="button"
        className="input-tool"
        title="Add emoji"
      >
        <Smile size={16} />
      </button>

      <textarea
        value={message}
        onChange={(event) =>
          setMessage(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder="Message #general..."
        rows="1"
      />

      <button
        type="button"
        className="input-tool"
        title="Mention someone"
      >
        <AtSign size={16} />
      </button>

      <button
        type="submit"
        className="send-button"
        disabled={!message.trim()}
      >
        <Send size={15} />
      </button>
    </form>
  );
}

export default ChatInput;
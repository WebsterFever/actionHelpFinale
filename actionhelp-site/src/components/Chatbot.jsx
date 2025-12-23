import React, { useState } from "react";
import styles from "./Chatbot.module.css";
import { useLanguage } from "../context/LanguageContext";

const Chatbot = () => {
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(1);

  const [messages, setMessages] = useState([
    {
      text: t.chatbot?.welcome || "Hi! I'm ActionHelpBot. How can I help you?",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");

  const openChat = () => {
    setOpen(true);
    setUnread(0);
  };

  const closeChat = () => setOpen(false);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userText = text.toLowerCase();
    const responses = t.chatbot?.responses || {};

    let botText = responses.default || "How can I help you?";
    if (/\b(hello|hi|hey|bonjour)\b/.test(userText)) {
      botText = responses.greetings || botText;
    } else if (userText.includes("help")) {
      botText = responses.help || botText;
    } else if (userText.includes("immigration")) {
      botText = responses.immigration || botText;
    } else if (/\b(bye|au revoir)\b/.test(userText)) {
      botText = responses.bye || botText;
    }

    setMessages((prev) => [
      ...prev,
      { text, sender: "user" },
      { text: botText, sender: "bot" },
    ]);

    setInput("");
  };

  return (
    <div className={styles.chatbotContainer}>
      {/* Floating trigger */}
      {!open && (
        <div className={styles.fabWrap}>
          <button
            type="button"
            className={styles.toggleButton}
            onClick={openChat}
            aria-label={t.chatbot?.toggleOpen || "Chat with us"}
          >
            💬
            {unread > 0 && <span className={styles.badge}>{unread}</span>}
          </button>

          {/* TEXT stays */}
          <span
            className={styles.fabLabel}
            onClick={openChat}
            role="button"
            tabIndex={0}
          >
            {t.chatbot?.toggleOpen || "Chat with us"}
          </span>
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div className={styles.chatWindow}>
          <button
            className={styles.closeTop}
            onClick={closeChat}
            aria-label={t.chatbot?.toggleClose || "Close chat"}
          >
            ×
          </button>

          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.sender === "bot" ? styles.bot : styles.user}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatbot?.placeholder || "Type here..."}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              type="button"
              className={styles.sendButton}
              onClick={handleSend}
            >
              {t.chatbot?.send || "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

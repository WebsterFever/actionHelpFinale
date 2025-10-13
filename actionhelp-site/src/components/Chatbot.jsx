import React, { useState } from "react";
import styles from "./Chatbot.module.css";
import { useLanguage } from "../context/LanguageContext";

const Chatbot = () => {
  const { t } = useLanguage();

  // closed by default; welcome message present → 1 unread
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
    setUnread(0); // user has seen messages
  };
  const closeChat = () => setOpen(false);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userText = text.toLowerCase();
    const responses = t.chatbot?.responses || {};

    let botText = responses.default || "How can I help you?";
    if (/\b(hello|hi|hey|bonjour|good (morning|night))\b/.test(userText)) {
      botText = responses.greetings || botText;
    } else if (userText.includes("help") || userText.includes("aide")) {
      botText = responses.help || botText;
    } else if (userText.includes("immigration")) {
      botText = responses.immigration || botText;
    } else if (/\b(bye|au revoir)\b/.test(userText)) {
      botText = responses.bye || botText;
    }

    setMessages((prev) => [...prev, { text }, { text: botText, sender: "bot" }]);
    if (!open) setUnread((u) => u + 1);
    setInput("");
  };

  // pre-resolve labels once for readability
  const openLabelLong = t.chatbot?.toggleOpen || "Chat with us";
  const openLabelShort = t.chatbot?.toggleOpenShort || openLabelLong || "Chat with us";
  const closeLabel = t.chatbot?.toggleClose || "Close chat";

  return (
    <div className={`${styles.chatbotContainer} ${open ? styles.open : ""}`}>
      {/* Floating toggle (hidden when open) */}
      {!open && (
        <div className={styles.fabWrap}>
          <button
            type="button"
            className={styles.toggleButton}
            onClick={openChat}
            aria-label={
              unread > 0
                ? `${unread} ${t.chatbot?.newMessage || "new messages"}. ${openLabelLong}`
                : openLabelLong
            }
            title={openLabelLong}
          >
            💬
            {unread > 0 && <span className={styles.badge}>{unread}</span>}
          </button>

          {/* Desktop & Mobile label (clean text) */}
          <span
            className={styles.fabLabel}
            role="button"
            tabIndex={0}
            onClick={openChat}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openChat()}
          >
            {openLabelShort}
          </span>
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div className={styles.chatWindow} role="dialog" aria-label={t.chatbot?.title || ""}>
          <button
            type="button"
            className={styles.closeTop}
            onClick={closeChat}
            aria-label={closeLabel}
            title={closeLabel}
          >
            ×
          </button>

          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.sender === "bot" ? styles.bot : styles.user}>
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
            <button type="button" onClick={handleSend} className={styles.sendButton}>
              {t.chatbot?.send || "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

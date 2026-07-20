import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, User, X } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I am your CRM Assistant. How can I help you with CRM Platform today? Ask me about features, pricing plans, free trials, or how to contact support!", sender: "bot", time: "Just now" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom of message list on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Listen for custom event to open the chatbot from external components
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-chatbot", handleOpenChatbot);
    return () => {
      window.removeEventListener("open-chatbot", handleOpenChatbot);
    };
  }, []);

  const getBotResponse = (text) => {
    const query = text.toLowerCase().trim();
    
    if (query.includes("pricing") || query.includes("cost") || query.includes("price") || query.includes("subscription") || query.includes("plan") || query.includes("rate")) {
      return "Our pricing plans are:\n\n• Starter: ₹0/month (up to 500 customers, pipeline & reports)\n• Professional: ₹2,499/month (unlimited customers, AI lead scoring, automation)\n• Enterprise: Custom pricing (advanced integration & support)\n\n💡 Save 20% by billing yearly! Would you like me to guide you to the Pricing section?";
    }
    if (query.includes("trial") || query.includes("free") || query.includes("test") || query.includes("try")) {
      return "Yes, we offer a 30-day free trial for our CRM Platform! No credit card is required. You can start by clicking any of the 'Start for free' or 'Start Free' buttons on this page.";
    }
    if (query.includes("feature") || query.includes("tool") || query.includes("capability") || query.includes("dashboard") || query.includes("pipeline") || query.includes("reports") || query.includes("ai")) {
      return "CRM Platform provides the following core features:\n\n1. 📊 Unified Dashboard (leads, revenue, and activities)\n2. 👥 Customer Management (profiles, history, and notes)\n3. 📈 Interactive Sales Pipeline\n4. 🤖 AI Assistant (email templates, summaries)\n5. 📝 Tasks & Collaboration tools\n6. 📈 Real-time Reports & Analytics";
    }
    if (query.includes("contact") || query.includes("support") || query.includes("email") || query.includes("phone") || query.includes("call") || query.includes("address") || query.includes("location") || query.includes("headquarter") || query.includes("reach")) {
      return "You can reach us using these options:\n\n• Email: hello@crmplatform.com\n• Phone: +91 98765 43210 (or toll-free 1800-420-7332)\n• Office: Hyderabad, Telangana, India\n\nYou can also send us a message directly via the contact form on this page!";
    }
    if (query.includes("what is crm") || query.includes("overview") || query.includes("what does") || query.includes("about")) {
      return "CRM stands for Customer Relationship Management. Our CRM Platform helps businesses track customer data, streamline sales pipelines, automate workflows, and boost productivity using AI.";
    }
    if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("hola") || query.includes("start") || query.includes("help")) {
      return "Hello! I am your CRM Assistant. How can I help you today? You can ask me about:\n\n• Pricing & Plans 💳\n• 30-Day Free Trial 🚀\n• Platform Features 📊\n• Contact Details & Support 📞";
    }
    
    return "I'm not sure I understand. I can help answer questions about:\n\n• Pricing & Plans 💳\n• 30-Day Free Trial 🚀\n• Platform Features 📊\n• Contact Details & Support 📞\n\nOr feel free to send us an email at hello@crmplatform.com!";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: inputVal.trim(),
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");

    // Simulate bot response after a brief delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(userMsg.text),
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  return (
      <>
        <style>{`.chatbot-wrapper {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 99999;
  font-family: 'Inter', system-ui, sans-serif;
}

/* Floating Chat Button */
.chatbot-float-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);
  transition: transform 200ms ease, background 200ms ease, box-shadow 200ms ease;
  position: relative;
}

.chatbot-float-btn:hover {
  transform: scale(1.05);
  background: #1d4ed8;
  box-shadow: 0 12px 35px rgba(37, 99, 235, 0.4);
}

.float-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  border: 2px solid #ffffff;
}

/* Chat Window */
.chatbot-window {
  width: 360px;
  height: 500px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: chatWindowOpen 300ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Header */
.chatbot-header {
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chatbot-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chatbot-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  border: 2px solid #ffffff;
}

.chatbot-header-info h4 {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.status-text {
  font-size: 11px;
  color: #10b981;
  font-weight: 600;
}

.chatbot-close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  transition: color 200ms ease;
}

.chatbot-close-btn:hover {
  color: #475569;
}

/* Messages Area */
.chatbot-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #fafbfc;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-bubble-wrapper {
  display: flex;
  width: 100%;
}

.message-bubble-wrapper.user {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
}

.message-bubble-wrapper.bot .message-bubble {
  background: #ffffff;
  color: #334155;
  border: 1px solid #e2e8f0;
  border-top-left-radius: 2px;
}

.message-bubble-wrapper.user .message-bubble {
  background: #2563eb;
  color: #ffffff;
  border-top-right-radius: 2px;
}

.message-time {
  display: block;
  font-size: 10px;
  color: #94a3b8;
  margin-top: 4px;
  text-align: right;
}

.message-bubble-wrapper.user .message-time {
  color: rgba(255, 255, 255, 0.7);
}

/* Input Form */
.chatbot-input-form {
  padding: 16px;
  background: #ffffff;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 12px;
  align-items: center;
}

.chatbot-input-form input {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 99px;
  padding: 10px 18px;
  font-size: 14px;
  outline: none;
  transition: border-color 200ms ease;
}

.chatbot-input-form input:focus {
  border-color: #2563eb;
}

.chatbot-send-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 200ms ease;
  flex-shrink: 0;
}

.chatbot-send-btn:hover {
  background: #1d4ed8;
}

/* Animation */
@keyframes chatWindowOpen {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 480px) {
  .chatbot-window {
    width: calc(100vw - 40px);
    height: calc(100vh - 100px);
    bottom: 80px;
    right: 20px;
  }
  .chatbot-wrapper {
    bottom: 20px;
    right: 20px;
  }
}
`}</style>
    <div className="chatbot-wrapper">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button 
          className="chatbot-float-btn" 
          onClick={() => setIsOpen(true)}
          aria-label="Open support chat"
        >
          <MessageSquare size={24} />
          <span className="float-badge"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <User size={18} />
                <span className="online-dot"></span>
              </div>
              <div>
                <h4>CRM Assistant</h4>
                <span className="status-text">Online</span>
              </div>
            </div>
            <button 
              className="chatbot-close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`message-bubble-wrapper ${msg.sender === "user" ? "user" : "bot"}`}
              >
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form className="chatbot-input-form" onSubmit={handleSend}>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type a message..."
              required
            />
            <button type="submit" className="chatbot-send-btn" aria-label="Send message">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  
      </>);
};

export default Chatbot;
import { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  X,
  Sparkles,
  Calendar,
  CheckCircle,
  MapPin,
  UtensilsCrossed,
  Gift,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../api";

export default function EastBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewBadge, setHasNewBadge] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: "Salam! Assalamualaikum! \nI am EastBot, the official restaurant assistant for *The East Junction Peshawar*. \n\nHow can I help you today? Ask me about:\n-  Our delicious menus & popular dishes\n-  Reservey a table right here\n-  Planning a beautiful customized birthday setup\n-  Location, timing, or direct WhatsApp ordering!",
          timestamp: /* @__PURE__ */ new Date()
        }
      ]);
      const timer = setTimeout(() => {
        setHasNewBadge(true);
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setHasNewBadge(false);
    }
  };
  const handleSend = async (textToSend) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;
    if (textToSend === input) {
      setInput("");
    }
    const userMsg = {
      id: "user_" + Date.now(),
      sender: "user",
      text: trimmed,
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));
      const res = await api.post("/chat", {
        message: trimmed,
        history: historyPayload
      });
      const data = res.data;
      const botMsg = {
        id: "bot_" + Date.now(),
        sender: "bot",
        text: data.text || "I was unable to process that. Please try again! Roman Urdu main bhee pooch sakte hain.",
        timestamp: /* @__PURE__ */ new Date(),
        reservationCreated: data.reservationCreated,
        messageCreated: data.messageCreated
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("EastBot Communication Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: "error_" + Date.now(),
          sender: "bot",
          text: "Kuch masla pesh aya hai. Please try again! Ya aap humein direct contact kr sakte hain: *0915840011*.",
          timestamp: /* @__PURE__ */ new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  const QuickReplies = [
    { label: "See Menu Items", text: "Please show me your menu items and popular dishes.", icon: <UtensilsCrossed className="w-3 h-3 text-amber-500" /> },
    { label: "Book a Table", text: "I want to reserve a table.", icon: <Calendar className="w-3 h-3 text-amber-500" /> },
    { label: "Birthday Event", text: "Do you offer decorations or packages for birthday event bookings?", icon: <Gift className="w-3 h-3 text-amber-500" /> },
    { label: "Location & Hours", text: "Where are you located and what are your opening timings?", icon: <MapPin className="w-3 h-3 text-amber-500" /> },
    { label: "WhatsApp Order", text: "How can I order via WhatsApp?", icon: <MessageCircle className="w-3 h-3 text-emerald-500" /> }
  ];
  return <>
      {
    /* FLOATING CHAT TOGGLER BUBBLE */
  }
      <div className="fixed bottom-6 right-24 z-[100] pointer-events-none">
        <motion.button
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    onClick={handleToggle}
    className="pointer-events-auto flex items-center gap-2 p-4 rounded-full bg-gradient-to-r from-stone-900 to-amber-950 text-amber-400 border border-[#d09733]/40 shadow-2xl hover:border-amber-400 cursor-pointer focus:outline-none relative group"
    id="eastbot-trigger-button"
  >
          {
    /* Pulsing indicator */
  }
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500" />
          </span>

          {isOpen ? <X className="w-5 h-5 text-amber-400" /> : <Bot className="w-5 h-5 text-amber-400 animate-pulse" />}

          <span className="text-xs font-serif uppercase tracking-widest font-bold hidden sm:inline px-1">
            {isOpen ? "Close" : "Ask EastBot"}
          </span>

          {hasNewBadge && !isOpen && <span className="absolute -top-10 right-0 bg-[#d09733] text-stone-950 font-mono text-[9px] font-bold py-1 px-2.5 rounded-lg shadow-lg border border-amber-300 animate-bounce whitespace-nowrap">
              Chat Open! 
            </span>}
        </motion.button>
      </div>

      {
    /* FLOATING INTERACTIVE CONCIERGE WINDOW */
  }
      <AnimatePresence>
        {isOpen && <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 40 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: 40 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    className="fixed bottom-24 right-6 w-[92vw] sm:w-[420px] h-[550px] bg-stone-950 border border-stone-850 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] z-[100] flex flex-col overflow-hidden pointer-events-auto"
    id="eastbot-chat-window"
  >
            {
    /* Elegant Header Banner */
  }
            <div className="bg-gradient-to-r from-stone-900 to-amber-950/80 p-4 border-b border-stone-850 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#d09733]/15 border border-[#d09733]/40 rounded-full text-amber-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-white text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                    EastBot <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  </h4>
                  <p className="text-[10px] text-stone-400 font-mono">Official AI Assistant • Online</p>
                </div>
              </div>
              <button
    onClick={handleToggle}
    className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-900 transition-colors focus:outline-none cursor-pointer"
    title="Minimize chat"
  >
                <X className="w-4 h-4" />
              </button>
            </div>

            {
    /* Chat Messages Body Container */
  }
            <div className="flex-grow p-4 overflow-y-auto space-y-4 class-scroller bg-stone-950/40 relative">
              {messages.map((msg) => <div
    key={msg.id}
    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
  >
                  <div
    className={`max-w-[85%] rounded-2xl p-3.5 text-xs inline-block leading-relaxed ${msg.sender === "user" ? "bg-[#d09733] text-stone-950 font-medium rounded-tr-none shadow-md" : "bg-stone-900/90 text-stone-200 border border-stone-850 rounded-tl-none"}`}
  >
                    {
    /* Bot avatar symbol inside chat logs */
  }
                    {msg.sender === "bot" && <div className="flex items-center gap-1.5 mb-1.5 font-serif font-bold text-[10px] tracking-wider uppercase text-amber-500 border-b border-stone-850 pb-1">
                        <Bot className="w-3 h-3 text-[#d09733]" /> EastBot
                      </div>}

                    {
    /* Format simple lines and markdown-like bolding */
  }
                    <p className="whitespace-pre-line">
                      {msg.text.split("\n").map((line, i) => {
    let formattedLine = line;
    if (line.trim().startsWith("- ")) {
      return <span key={i} className="block pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-amber-500">
                              {line.substring(2)}
                            </span>;
    }
    return <span key={i} className="block min-h-[4px]">{formattedLine}</span>;
  })}
                    </p>

                    {
    /* DYNAMIC CONFIRMATION LIVE CARD: Reservation Created */
  }
                    {msg.reservationCreated && <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-3 p-3 bg-stone-950 border border-emerald-500/30 rounded-lg text-[11px] text-stone-300 font-mono space-y-1.5"
  >
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[9px] tracking-wider border-b border-stone-850 pb-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Table Booked Live!
                        </div>
                        <div><span className="text-stone-500">RES ID:</span> <span className="text-stone-100 font-bold">{msg.reservationCreated.id}</span></div>
                        <div><span className="text-stone-500">GUEST:</span> <span className="text-amber-400">{msg.reservationCreated.name}</span></div>
                        <div><span className="text-stone-500">DATE:</span> {msg.reservationCreated.date}</div>
                        <div><span className="text-stone-500">TIME:</span> {msg.reservationCreated.time}</div>
                        <div><span className="text-stone-500">COUNT:</span> {msg.reservationCreated.guests} Pax</div>
                        {msg.reservationCreated.specialRequest && <div className="italic text-[10px] text-stone-400 mt-1">*{msg.reservationCreated.specialRequest}</div>}
                        <span className="block text-[8px] text-stone-500 mt-1 uppercase">Logged to Live Reservations Database</span>
                      </motion.div>}

                    {
    /* DYNAMIC CONFIRMATION LIVE CARD: Message/Birthday Query Created */
  }
                    {msg.messageCreated && <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-3 p-3 bg-stone-950 border border-amber-500/30 rounded-lg text-[11px] text-stone-300 font-mono space-y-1"
  >
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[9px] tracking-wider border-b border-stone-850 pb-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Inquiry Lodged Successfully
                        </div>
                        <div><span className="text-stone-500">NAME:</span> {msg.messageCreated.name}</div>
                        <div><span className="text-stone-500">PHONE:</span> {msg.messageCreated.phone}</div>
                        <div><span className="text-stone-500">SUBJECT:</span> {msg.messageCreated.subject}</div>
                        <span className="block text-[8px] text-stone-500 mt-1 uppercase">Our team will reach out immediately!</span>
                      </motion.div>}

                    <span className={`block text-[8px] text-right mt-1.5 font-mono ${msg.sender === "user" ? "text-stone-900" : "text-stone-500"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>)}

              {
    /* Bot typing state animated dot indicator */
  }
              {isLoading && <div className="flex justify-start">
                  <div className="bg-stone-900 border border-stone-850 rounded-2xl rounded-tl-none p-3 max-w-[85%] flex items-center space-x-1.5">
                    <span className="block w-2 bg-amber-400 h-2 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="block w-2 bg-amber-400 h-2 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="block w-2 bg-amber-400 h-2 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>}
              <div ref={messagesEndRef} />
            </div>

            {
    /* QUICK PRESETS CAROUSEL LIST */
  }
            <div className="px-3 py-2 border-t border-stone-850 bg-stone-950 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none select-none">
              {QuickReplies.map((reply, i) => <button
    key={i}
    onClick={() => handleSend(reply.text)}
    disabled={isLoading}
    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-[#d09733]/50 rounded-lg text-[10px] text-stone-400 hover:text-white font-serif tracking-wide transition-all select-none cursor-pointer shrink-0 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
  >
                  {reply.icon}
                  <span>{reply.label}</span>
                </button>)}
            </div>

            {
    /* Message input section footer */
  }
            <div className="p-3 bg-stone-950 border-t border-stone-850 flex items-center gap-2">
              <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        handleSend(input);
      }
    }}
    disabled={isLoading}
    placeholder="Ask EastBot / Sawal poochein..."
    className="flex-grow text-xs bg-stone-900 border border-stone-800 text-stone-100 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#d09733] focus:ring-1 focus:ring-[#d09733]/30 transition-all disabled:opacity-50"
  />
              <button
    onClick={() => handleSend(input)}
    disabled={isLoading || !input.trim()}
    className="p-2.5 bg-[#d09733] text-stone-950 hover:bg-amber-400 transition-all rounded-xl cursor-pointer disabled:opacity-45 disabled:pointer-events-none focus:outline-none"
    title="Send message"
  >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>}
      </AnimatePresence>
    </>;
}

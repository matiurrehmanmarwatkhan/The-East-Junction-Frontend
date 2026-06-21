import { useState, useEffect } from "react";
import {
  CalendarDays,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Bookmark,
  MapPin,
  PartyPopper
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
export default function ReservationsView({ selectedPackage, setSelectedPackage }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "19:00",
    guests: 4,
    specialRequest: ""
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [voucherId, setVoucherId] = useState("");
  useEffect(() => {
    if (selectedPackage) {
      setFormData((prev) => ({
        ...prev,
        specialRequest: `Booking inquiry for the: "${selectedPackage}" luxury celebration suite arrangement!`
      }));
    }
  }, [selectedPackage]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleGuestCountChange = (amount) => {
    setFormData((prev) => ({
      ...prev,
      guests: Math.max(1, Math.min(60, prev.guests + amount))
    }));
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      setStatus("error");
      setErrorMessage("Please fill in all mandatory indicators (Name, Phone, Date, and Time).");
      return;
    }
    setStatus("booking");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const uniqueId = `TEJ-RSV-${Math.floor(1e3 + Math.random() * 9e3)}`;
        setVoucherId(uniqueId);
        setStatus("completed");
        setSelectedPackage("");
      } else {
        throw new Error("Local server rejected table reservation parameters.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Could not link connection to reservation engine. Check network.");
    }
  };
  const timeSlots = [
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "23:00"
  ];
  return <section id="reservations-desk" className="bg-stone-950 min-h-screen pt-32 pb-24 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {
    /* Reservation headers */
  }
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.24em] text-gold-400 uppercase">Private Table Scheduler</p>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-bold mt-2.5">
            The Reservation <span className="text-gold-400 italic font-serif">Desk</span>
          </h2>
          <p className="text-stone-400 text-xs max-w-lg mx-auto mt-4 leading-relaxed">
            Reserve premium lounge dining, open balcony views, or custom birthday events. All bookings are registered directly and confirmed within minutes.
          </p>
          <div className="w-12 h-[1px] bg-gold-400/30 mx-auto mt-5" />
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {status !== "completed" ? (
    /* 1. INITIAL INPUT FORM */
    <motion.div
      key="input-form"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="glass-panel r-none border border-white/5 p-8 sm:p-12 shadow-2xl relative bg-[#0d0d0d]"
    >
                {selectedPackage && <div className="mb-8 p-4 border border-gold-400/25 bg-gold-400/5 text-gold-350 text-xs flex items-center justify-between">
                    <span className="flex items-center"><PartyPopper className="w-4 h-4 mr-2 text-gold-400 animate-bounce" /> Selected Event Suite: <strong className="ml-1 text-gold-450">{selectedPackage}</strong></span>
                    <button
      onClick={() => setSelectedPackage("")}
      className="text-stone-400 hover:text-white uppercase font-mono text-[9px] underline"
    >
                      Clear Setup
                    </button>
                  </div>}

                <h3 className="font-serif text-md text-white font-bold uppercase tracking-wider mb-8 border-b border-white/5 pb-4 flex items-center">
                  <CalendarDays className="w-5 h-5 text-gold-400 mr-2" />
                  <span>Choose Your Booking coordinates</span>
                </h3>

                <form onSubmit={handleFormSubmit} className="space-y-6 text-xs text-left">
                  
                  {
      /* First Section: Date & Guests counter */
    }
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {
      /* Date Picker */
    }
                    <div className="space-y-2">
                      <label className="text-stone-400 font-semibold uppercase tracking-wider block">Target Dinner Date <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
      type="date"
      name="date"
      required
      min={(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}
      value={formData.date}
      onChange={handleChange}
      className="w-full px-4 py-3 rounded-none text-white lg:text-xs glass-input text-xs cursor-text bg-stone-950"
    />
                      </div>
                    </div>

                    {
      /* Guest Selector */
    }
                    <div className="space-y-2">
                       <label className="text-stone-400 font-semibold uppercase tracking-wider block">Visitor Capacity Count <span className="text-red-500">*</span></label>
                       <div className="flex items-center space-x-4 bg-stone-950 border border-white/10 rounded-none p-1 max-w-[200px] h-[46px]">
                         <button
      type="button"
      onClick={() => handleGuestCountChange(-1)}
      className="w-10 h-10 border border-white/5 bg-stone-900 text-stone-300 font-bold hover:text-gold-400 hover:border-gold-400/35 transition-all focus:outline-none rounded-none"
    >
                           -
                         </button>
                         <span className="font-mono text-sm text-white font-bold text-center w-8">{formData.guests}</span>
                         <button
      type="button"
      onClick={() => handleGuestCountChange(1)}
      className="w-10 h-10 border border-white/5 bg-stone-900 text-stone-300 font-bold hover:text-gold-400 hover:border-gold-400/35 transition-all focus:outline-none rounded-none"
    >
                           +
                         </button>
                       </div>
                       <p className="text-[10px] text-stone-500 font-mono">Max group booking online: 60 guests.</p>
                    </div>

                  </div>

                  {
      /* Second Section: Hour slots selection */
    }
                  <div className="space-y-2">
                    <label className="text-stone-400 font-semibold uppercase tracking-wider block">Select Dining Time Slot <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-w-4xl">
                      {timeSlots.map((slot) => <button
      key={slot}
      type="button"
      onClick={() => setFormData((prev) => ({ ...prev, time: slot }))}
      className={`py-2 rounded-none border text-[10px] font-mono font-bold transition-all focus:outline-none ${formData.time === slot ? "bg-gold-400 border-gold-400 text-stone-950" : "bg-stone-950 border-white/10 hover:border-gold-400/30 text-stone-300"}`}
    >
                          {slot}
                        </button>)}
                    </div>
                  </div>

                  {
      /* Third Section: User Identity */
    }
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                    
                    {
      /* Full Name */
    }
                    <div className="space-y-2">
                      <label className="text-stone-400 font-semibold uppercase tracking-wider flex items-center"><User className="w-3.5 h-3.5 mr-1 text-gold-400" /> Full Name <span className="text-red-500">*</span></label>
                      <input
      type="text"
      name="name"
      required
      value={formData.name}
      onChange={handleChange}
      placeholder="e.g. Sameer Lodhi"
      className="w-full px-4 py-3 rounded-none text-white glass-input text-xs"
    />
                    </div>

                    {
      /* Phone Number */
    }
                    <div className="space-y-2">
                      <label className="text-stone-400 font-semibold uppercase tracking-wider flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-gold-400" /> WhatsApp / Cell <span className="text-red-500">*</span></label>
                      <input
      type="tel"
      name="phone"
      required
      value={formData.phone}
      onChange={handleChange}
      placeholder="e.g. 0333-9123456"
      className="w-full px-4 py-3 rounded-none text-white glass-input text-xs"
    />
                    </div>

                    {
      /* Email */
    }
                    <div className="space-y-2">
                      <label className="text-stone-400 font-semibold uppercase tracking-wider flex items-center"><Mail className="w-3.5 h-3.5 mr-1 text-gold-400" /> Email Address</label>
                      <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="e.g. sameer@gmail.com"
      className="w-full px-4 py-3 rounded-none text-white glass-input text-xs"
    />
                    </div>

                  </div>

                  {
      /* Special Requests */
    }
                  <div className="space-y-2 pt-4">
                    <label className="text-stone-400 font-semibold uppercase tracking-wider block">Special requests / Allergies / Table custom layouts</label>
                    <textarea
      name="specialRequest"
      value={formData.specialRequest}
      onChange={handleChange}
      rows={3}
      placeholder="Specify if anniversaries, requests for VIP family separation, flower settings, or dietary restrictions..."
      className="w-full px-4 py-3 rounded-none text-white glass-input text-xs resize-none"
    />
                  </div>

                  {
      /* Error reports */
    }
                  {status === "error" && <div className="p-4 border border-red-500/25 bg-red-950/20 text-red-400 font-medium rounded-none">
                      {errorMessage}
                    </div>}

                  {
      /* Convert call action */
    }
                  <button
      type="submit"
      disabled={status === "booking"}
      className="w-full py-4 bg-gold-400 text-stone-950 font-bold tracking-[0.16em] uppercase flex items-center justify-center space-x-2 shadow-lg transition-all rounded-none hover:brightness-110 cursor-pointer disabled:opacity-50"
    >
                    <Bookmark className="w-4 h-4" />
                    <span>{status === "booking" ? "Registering Diner Slot..." : "Confirm Royal Table Booking"}</span>
                  </button>

                </form>
              </motion.div>
  ) : (
    /* 2. SUCCESS VOUCHER CARD RECEIPT */
    <motion.div
      key="luxury-receipt"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto overflow-hidden glass-panel border border-gold-400/25 p-8 sm:p-10 shadow-[0_0_40px_rgba(212,175,55,0.12)] bg-[#0d0d0d] flex flex-col items-center text-center rounded-none"
    >
                
                {
      /* Visual badge top */
    }
                <div className="w-14 h-14 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 mb-6 animate-pulse">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <p className="text-[10px] font-mono tracking-[0.22em] text-gold-400 uppercase">Sovereign Booking Verified</p>
                <h3 className="font-serif text-2xl text-white font-bold mt-2.5">Diner Session Confirmed</h3>
                
                {
      /* Gold Crest code panel */
    }
                <div className="w-full border-t border-b border-dashed border-white/5 bg-stone-950 py-4.5 my-6">
                  <span className="text-stone-500 text-[9px] font-mono tracking-widest uppercase block mb-1">Confirmation Voucher Code</span>
                  <span className="font-mono text-xl text-gold-400 font-bold tracking-[0.16em] gold-glow">{voucherId}</span>
                </div>

                {
      /* Receipt Details checklist */
    }
                <div className="w-full text-left space-y-3.5 text-xs text-stone-300 pb-6 border-b border-white/5 mb-6">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Diner Name:</span>
                    <strong className="text-white text-right font-serif">{formData.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Seating Count:</span>
                    <strong className="text-white">{formData.guests} Persons</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Schedule Date:</span>
                    <strong className="text-gold-400">{formData.date}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Verification Time:</span>
                    <strong className="text-gold-400">{formData.time}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Phone Signal:</span>
                    <strong className="text-white">{formData.phone}</strong>
                  </div>
                  {formData.specialRequest && <div className="pt-2">
                      <span className="text-stone-500 block mb-1">Inductions requested:</span>
                      <p className="text-[11px] text-stone-400 italic bg-stone-950 p-2.5 rounded-none border border-white/5 leading-relaxed">
                        {formData.specialRequest}
                      </p>
                    </div>}
                </div>

                {
      /* GPS Reminder cards */
    }
                <div className="flex items-start space-x-2 text-stone-500 text-[10px] text-left leading-relaxed">
                  <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                  <p>
                    Show this verified voucher receipt at <strong>The East Junction Spogmai Plaza, University Road Peshawar</strong> reception deck to settle your exclusive table group.
                  </p>
                </div>

                {
      /* Settle new reservation button */
    }
                <button
      onClick={() => setStatus("idle")}
      className="mt-8 text-gold-400 hover:text-gold-300 text-xs font-mono uppercase tracking-wider underline focus:outline-none cursor-pointer"
    >
                  Create Another Reservation
                </button>

              </motion.div>
  )}
          </AnimatePresence>
        </div>

      </div>
    </section>;
}

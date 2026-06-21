import { useState } from "react";
import {
  Phone,
  MapPin,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
export default function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setStatus("error");
      setErrorMessage("Please complete all necessary fields (Name, Phone, and Message).");
      return;
    }
    setStatus("submitting");
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        throw new Error("Failed to post message to backend.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    }
  };
  return <section id="contact-coordinates" className="bg-stone-950 min-h-screen pt-32 pb-24 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {
    /* Title */
  }
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.24em] text-gold-400 uppercase">Get in Touch</p>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-bold mt-2.5">
            The East Junction <span className="text-gold-400 italic font-serif">Contact Desk</span>
          </h2>
          <p className="text-stone-400 text-xs max-w-lg mx-auto mt-4 leading-relaxed">
            Have a question, feedback, or a corporate proposal? Write to our customer support or dial 091-5840011 immediately.
          </p>
          <div className="w-12 h-[1px] bg-gold-400/30 mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {
    /* Left Column: Essential details & maps */
  }
          <div className="lg:col-span-5 space-y-8">
            
            {
    /* Quick Cards */
  }
            <div className="glass-panel p-6 rounded-none border border-white/5 bg-[#0d0d0d] space-y-6">
              
              {
    /* Location */
  }
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-none bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-white font-bold text-xs uppercase tracking-wider">Our Address</h4>
                  <p className="text-stone-400 text-xs mt-1.5 leading-relaxed">
                    Spogmai Plaza, Near Avon Super Store, University Road, Peshawar, Pakistan
                  </p>
                </div>
              </div>

              {
    /* Call hotlines */
  }
              <div className="flex items-start space-x-4 border-t border-white/5 pt-5">
                <div className="w-10 h-10 rounded-none bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-white font-bold text-xs uppercase tracking-wider">Hotlines & Direct Dial</h4>
                  <p className="text-stone-400 text-xs mt-1.5 leading-relaxed">
                    Local Inquiry Office: <a href="tel:091-5840011" className="text-gold-400 hover:underline font-mono">091-5840011</a> <br />
                    Cellular WhatsApp: <a href="https://wa.me/92915840011" className="text-gold-400 hover:underline font-mono">+92 91 5840011</a>
                  </p>
                </div>
              </div>

              {
    /* Email */
  }
              <div className="flex items-start space-x-4 border-t border-white/5 pt-5">
                <div className="w-10 h-10 rounded-none bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-white font-bold text-xs uppercase tracking-wider">Email Support</h4>
                  <p className="text-stone-400 text-xs mt-1.5 leading-relaxed">
                    Staff Inbox: info@theeastjunction.com <br />
                    Events Division: events@theeastjunction.com
                  </p>
                </div>
              </div>

            </div>

            {
    /* Simulated Live Google Maps Embed pointing directly to Spogmai Plaza Peshawar */
  }
            <div className="rounded-none overflow-hidden border border-white/5 h-64 shadow-2xl relative">
              <iframe
    title="The East Junction Location Map"
    src="https://maps.google.com/maps?q=Spogmai%20Plaza%20University%20Road%20Peshawar&t=&z=15&ie=UTF8&iwloc=&output=embed"
    width="100%"
    height="100%"
    style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.2) brightness(0.8)" }}
    allowFullScreen={true}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
            </div>

          </div>

          {
    /* Right Column: Contact form box */
  }
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 rounded-none border border-white/5 bg-[#0d0d0d] shadow-2xl relative">
              <h3 className="font-serif text-md text-white font-bold uppercase tracking-wider mb-6 border-b border-white/5 pb-4">
                Message Our Kitchen Manager
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                
                {
    /* Upper row: Name & Email */
  }
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-stone-400 font-semibold uppercase tracking-wider">Your Full Name <span className="text-red-500">*</span></label>
                    <input
    type="text"
    name="name"
    required
    value={formData.name}
    onChange={handleChange}
    placeholder="e.g. Bilal Afridi"
    className="w-full px-4 py-3 rounded-none text-white glass-input text-xs"
  />
                  </div>

                  <div className="space-y-2">
                    <label className="text-stone-400 font-semibold uppercase tracking-wider">Email Address</label>
                    <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="e.g. bilal@gmail.com"
    className="w-full px-4 py-3 rounded-none text-white glass-input text-xs"
  />
                  </div>
                </div>

                {
    /* Next row: Phone & Subject */
  }
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-stone-400 font-semibold uppercase tracking-wider">Phone number <span className="text-red-500">*</span></label>
                    <input
    type="tel"
    name="phone"
    required
    value={formData.phone}
    onChange={handleChange}
    placeholder="e.g. 0300-5840011"
    className="w-full px-4 py-3 rounded-none text-white glass-input text-xs"
  />
                  </div>

                  <div className="space-y-2">
                    <label className="text-stone-400 font-semibold uppercase tracking-wider">Subject Of Query</label>
                    <input
    type="text"
    name="subject"
    value={formData.subject}
    onChange={handleChange}
    placeholder="e.g. Catering, Reservation Issue, Birthday Customization"
    className="w-full px-4 py-3 rounded-none text-white glass-input text-xs"
  />
                  </div>
                </div>

                {
    /* Textarea message box */
  }
                <div className="space-y-2">
                  <label className="text-stone-400 font-semibold uppercase tracking-wider">Your Message <span className="text-red-500">*</span></label>
                  <textarea
    name="message"
    required
    value={formData.message}
    onChange={handleChange}
    rows={5}
    placeholder="Describe your inquiry or requested table settings in complete details..."
    className="w-full px-4 py-3 rounded-none text-white glass-input text-xs resize-none"
  />
                </div>

                {
    /* State alerts */
  }
                <AnimatePresence>
                  {status === "success" && <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    className="p-4 rounded-none border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 font-medium flex items-center space-x-2"
  >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Inquiry registered! Our chef manager will call you back shortly on your phone. See you soon!</span>
                    </motion.div>}

                  {status === "error" && <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    className="p-4 rounded-none border border-red-500/20 bg-red-950/20 text-red-400 font-medium flex items-center space-x-2"
  >
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>}
                </AnimatePresence>

                {
    /* Submit button */
  }
                <button
    type="submit"
    disabled={status === "submitting"}
    className="w-full py-4.5 bg-gold-400 text-stone-950 font-bold tracking-[0.16em] uppercase flex items-center justify-center space-x-2 shadow-lg transition-all rounded-none hover:brightness-110 cursor-pointer"
  >
                  <Send className="w-4 h-4" />
                  <span>{status === "submitting" ? "Sending Memo..." : "Transmit Message"}</span>
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>;
}

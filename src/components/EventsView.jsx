import { useState, useEffect } from "react";
import {
  Check,
  PartyPopper,
  CalendarCheck
} from "lucide-react";
import { motion } from "motion/react";
export default function EventsView({ setView, setSelectedPackage }) {
  const [eventSuites, setEventSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/events").then((res) => res.json()).then((data) => {
      setEventSuites(data);
    }).catch((err) => {
      console.error("Failed to load birthday event packages:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);
  const handleBookPackage = (packageName) => {
    setSelectedPackage(packageName);
    setView("reservations");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };
  return <section id="birthday-events" className="bg-stone-950 min-h-screen pt-32 pb-24 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {
    /* Banner Title */
  }
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.24em] text-gold-400 uppercase">Private Event Celebrations</p>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-bold mt-2.5">
            Birthday & Event <span className="text-gold-400 italic font-serif">Suites</span>
          </h2>
          <p className="text-stone-400 text-xs max-w-lg mx-auto mt-4 leading-relaxed">
            From intimate gatherings to royal banquets at Spogmai Plaza, we coordinate exquisite table layings, premium design elements, bespoke cakes, and personalized live music.
          </p>
          <div className="w-12 h-[1px] bg-gold-400/30 mx-auto mt-5" />
        </div>

        {
    /* Dynamic packages */
  }
        {loading ? <div className="space-y-12">
            {[1, 2].map((i) => <div key={i} className="glass-panel h-96 rounded-none shimmer-active" />)}
          </div> : <div className="space-y-12 max-w-5xl mx-auto">
            {eventSuites.map((pkg, idx) => <motion.div
    key={pkg.id}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: idx * 0.1 }}
    className={`rounded-none overflow-hidden glass-panel border relative grid grid-cols-1 lg:grid-cols-12 bg-[#0d0d0d] ${pkg.popular ? "border-gold-400/40" : "border-white/5"}`}
  >
                {
    /* Popular Badge Flag */
  }
                {pkg.popular && <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gold-400 text-stone-950 font-sans font-bold text-[10px] tracking-widest uppercase rounded-none">
                    Highly Requested
                  </div>}

                {
    /* Left Side picture: Cinematic close-up */
  }
                <div className="lg:col-span-4 h-64 lg:h-auto min-h-[300px] relative">
                  <img
    src={pkg.image}
    alt={pkg.name}
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover filter brightness-[0.7]"
  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 lg:bg-gradient-to-r lg:from-transparent lg:via-stone-950/25 lg:to-stone-950/95" />
                </div>

                {
    /* Right Side: content, price list, description & inclusions checklist */
  }
                <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-white/5 pb-4">
                      <h3 className="font-serif text-white text-xl sm:text-2xl font-bold uppercase tracking-wide">
                        {pkg.name}
                      </h3>
                      <div className="text-gold-400 font-mono text-xs sm:text-base font-extrabold flex items-center">
                        <span className="text-stone-400 text-xs font-normal mr-1.5 font-sans">Premium Tier:</span>
                        <span>{pkg.pricePerPerson} PKR <span className="text-stone-500 text-[10px] font-sans">/ Head</span></span>
                      </div>
                    </div>

                    <p className="text-stone-450 text-xs leading-relaxed mt-4">
                      {pkg.description}
                    </p>

                    {
    /* Check Inclusions */
  }
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                      {pkg.inclusions.map((inclusion, i) => <div key={i} className="flex items-start space-x-2 text-xs text-stone-350">
                          <Check className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                          <span>{inclusion}</span>
                        </div>)}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-2 text-xs text-stone-400 font-mono">
                      <PartyPopper className="w-4 h-4 text-gold-400" />
                      <span>Custom cake and setups can be modified on reservation.</span>
                    </div>

                    <button
    onClick={() => handleBookPackage(pkg.name)}
    className="px-6 py-3 rounded-none bg-gold-400 hover:bg-gold-500 text-stone-950 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
  >
                      <CalendarCheck className="w-4 h-4" />
                      <span>Reserve Celebration</span>
                    </button>
                  </div>
                </div>

              </motion.div>)}
          </div>}

        {
    /* Help box */
  }
        <div className="mt-16 text-center max-w-xl mx-auto glass-panel border border-white/5 p-8 rounded-none bg-[#0d0d0d]">
          <PartyPopper className="w-8 h-8 text-gold-400 mx-auto" />
          <h4 className="font-serif text-white text-lg font-bold mt-4">Require a Tailor-made Package?</h4>
          <p className="text-stone-400 text-xs mt-2 leading-relaxed">
            Need custom branding for corporate seminars, official award dinners, or surprise proposal dinners? Contact our dedicated event planner directly on WhatsApp or dial 091-5840011 for premium coordination.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <a
    href="mailto:events@theeastjunction.com"
    className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-stone-300 text-xs font-bold uppercase transition-all rounded-none"
  >
              Email Event Planner
            </a>
            <a
    href="https://wa.me/92915840011?text=Hi!%20I%20want%20to%20corporate%20cater%20or%20host%20a%20private%20custom%20anniversary%20dinner%20at%20The%20East%20Junction%20Peshawar"
    target="_blank"
    rel="noreferrer"
    className="px-5 py-2.5 bg-gold-400 hover:bg-gold-500 text-stone-950 text-xs font-bold uppercase transition-all hover:shadow-lg rounded-none text-center"
  >
              WhatsApp Event Manager
            </a>
          </div>
        </div>

      </div>
    </section>;
}

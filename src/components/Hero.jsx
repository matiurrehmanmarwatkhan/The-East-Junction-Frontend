import { ArrowRight, Sparkles, Clock, Compass } from "lucide-react";
import { motion } from "motion/react";
export default function Hero({ setView }) {
  return <section
    id="hero-banner"
    className="relative min-h-screen bg-stone-950 flex items-center justify-center overflow-hidden pt-20"
  >
      {
    /* Background Gradients and Ambient Orbs */
  }
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-10 w-96 h-96 bg-gold-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-gold-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-stone-950/80" />
        <img
    src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1600&q=80"
    alt="Luxury Restaurant Atmosphere"
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover object-center scale-105 select-none pointer-events-none filter brightness-[0.16] grayscale opacity-45"
  />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full py-12 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {
    /* Left Side: Elegant Text block */
  }
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-left space-y-6">
            <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    className="inline-flex items-center space-x-2 px-3 py-1.5 border border-gold-400/15 bg-gold-400/5 text-gold-400 text-[10px] font-semibold tracking-[0.22em] uppercase max-w-max"
  >
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span>THE PINNACLE OF LUXURY DINING</span>
            </motion.div>

            <motion.h2
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.1 }}
    className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-bold leading-[1.1] tracking-tight"
  >
              A Taste of <br />
              <span className="text-gold-400 italic font-serif">True Heritage</span>
            </motion.h2>

            <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.3 }}
    className="max-w-md text-stone-400 text-xs sm:text-sm md:text-base leading-relaxed font-sans tracking-wide"
  >
              Experience culinary masterwork in the heart of Peshawar. From fire-kissed Saffron skewers to chef-curated prime steaks at Spogmai Plaza, every recipe is a standard of royal hospitality.
            </motion.p>

            <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.5 }}
    className="flex flex-wrap items-center gap-4 pt-4"
  >
              <button
    onClick={() => setView("reservations")}
    className="px-8 py-3.5 border border-gold-400 bg-gold-400 text-stone-950 font-sans font-bold text-xs tracking-[0.16em] uppercase hover:bg-transparent hover:text-gold-400 transition-all duration-300 cursor-pointer"
  >
                Book Table
              </button>

              <button
    onClick={() => setView("menu")}
    className="px-8 py-3.5 border border-white/10 bg-white/5 text-white font-sans font-bold text-xs tracking-[0.16em] uppercase hover:bg-gold-400 hover:text-stone-950 hover:border-gold-400 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
  >
                <span>View Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {
    /* Quick Micro Stats */
  }
            <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.7 }}
    className="flex items-center gap-6 pt-8 border-t border-stone-900 text-[11px] font-mono tracking-widest text-stone-500 uppercase"
  >
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold-400/70" />
                <span>12 PM - 12 AM Daily</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-gold-400/70" />
                <span>Halal Certified</span>
              </div>
            </motion.div>
          </div>

          {
    /* Right Side: Visual Masterpiece Spinning Plate and Floating Plate Badge */
  }
          <div className="w-full lg:w-1/2 relative min-h-[420px] flex items-center justify-center">
            {
    /* Geometric Thin Frame Outline */
  }
            <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-2xl" />
            
            <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.2, delay: 0.3 }}
    className="relative w-full max-w-[460px] aspect-square rounded-2xl bg-stone-950/45 border border-white/5 backdrop-blur-md p-6 overflow-hidden flex flex-col justify-between"
  >
              {
    /* Decorative top grid */
  }
              <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-stone-600 select-none">
                N° 091-5840011
              </div>

              {
    /* Spinning Crest Inner circle */
  }
              <div className="flex-1 flex items-center justify-center relative">
                <div
    className="absolute w-72 h-72 rounded-full border border-gold-400/20 flex items-center justify-center animate-spin"
    style={{ animationDuration: "40s" }}
  >
                  <div className="w-60 h-60 rounded-full border border-gold-400/40 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border border-gold-400/60" />
                  </div>
                </div>

                {
    /* Main Food Specimen Image inside Geometric Mask */
  }
                <div className="relative w-56 h-56 rounded-full overflow-hidden border-2 border-gold-400 p-1 bg-stone-950 shadow-2xl group cursor-pointer">
                  <img
    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
    alt="Signature Turkish Mix Platter"
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover rounded-full filter brightness-95 group-hover:scale-110 transition-transform duration-[4000ms]"
  />
                  <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </div>

              {
    /* Float Plate Indicator Box */
  }
              <div className="relative mt-auto p-4 bg-stone-950/90 border border-white/10 rounded-lg flex justify-between items-end gap-4 text-left">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
                    <p className="text-gold-400 text-[9px] uppercase tracking-widest font-mono">Chef Recommendation</p>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1 leading-none">Turkish Mix Platter</h3>
                  <p className="text-[10px] text-stone-400 mt-1.5 leading-snug">Saffron Basmati, Flame-Broiled Kebab, Herb Chops</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-md sm:text-lg font-bold text-gold-400 font-mono">PKR 2,450</p>
                  <span className="text-[8px] uppercase tracking-wider text-stone-500 font-mono">Family Sharing</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>;
}

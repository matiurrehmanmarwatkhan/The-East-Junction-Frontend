import { useState, useEffect } from "react";
import { Menu, X, Phone, Calendar, ShieldAlert, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
export default function Header({ currentView, setView, isAdmin, logoutAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navLinks = [
    { label: "Home", key: "home" },
    { label: "Menu", key: "menu" },
    { label: "Reservations", key: "reservations" },
    { label: "Birthday Events", key: "events" },
    { label: "Gallery", key: "gallery" },
    { label: "Reviews", key: "reviews" },
    { label: "About", key: "about" },
    { label: "Contact", key: "contact" },
  ];
  const handleNavClick = (key) => {
    setView(key);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <header
      id="header-nav"
      className={`fixed top-0 left-0 w-full z-50 transition-all  duration-300 ${scrolled ? "bg-stone-950/95 backdrop-blur-xl border-b border-gold-400/15 py-3 shadow-2xl" : "bg-transparent py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo with Sleek rotate-45 Diamond Crest */}
          <div
            onClick={() => handleNavClick("home")}
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="relative w-8.5 h-8.5 flex items-center justify-center border border-gold-400/35 group-hover:border-gold-400 rotate-45 bg-stone-950/60 transition-all duration-500 shrink-0">
              <span className="-rotate-45 font-serif text-gold-400 font-bold text-md group-hover:scale-110 transition-transform">
                E
              </span>
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-gold-400" />
            </div>
            <div>
              <h1 className="font-serif text-md tracking-[0.16em] text-white font-bold group-hover:text-gold-300 transition-colors uppercase">
                The East <span className="text-gold-400">Junction</span>
              </h1>
              <p className="text-[8px] font-mono tracking-[0.22em] text-stone-400 uppercase mt-0.5 leading-none">
                Premium Family Dining
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.key)}
                className={`relative px-4 py-2 font-medium text-xs cursor-pointer tracking-[0.18em] uppercase transition-all duration-300 ${currentView === link.key ? "text-gold-400 font-semibold" : "text-stone-300 hover:text-gold-400"}`}
              >
                {link.label}
                {currentView === link.key && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-gold-400"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Callers */}
          <div className="hidden sm:flex items-center space-x-3">
            {isAdmin && (
              <button
                onClick={() => handleNavClick("admin")}
                className="flex items-center space-x-1.5 px-3 py-1.5 border border-red-500/25 cursor-pointer bg-red-950/25 text-[10px] text-red-400 font-mono tracking-tight uppercase hover:bg-red-950/45 transition-all ml-2"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Port</span>
              </button>
            )}

            <a
              href="tel:091-5840011"
              className="text-stone-300 hover:text-gold-400 transition-colors flex items-center space-x-1 text-xs font-mono mr-2"
            >
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>091-5840011</span>
            </a>

            <button
              onClick={() => handleNavClick("reservations")}
              className="relative overflow-hidden group px-6 py-2.5 cursor-pointer border border-gold-400/80 hover:border-gold-400 text-gold-400 font-sans font-bold text-[10px] tracking-widest uppercase bg-stone-950/40 hover:bg-gold-400 hover:text-stone-950 transition-all duration-305 shrink-0"
            >
              <div className="absolute inset-0 w-1/3 bg-white/10 skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-1000" />
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold-400 group-hover:text-stone-950 transition-colors" />
                <span>Reserve Table</span>
              </div>
            </button>
          </div>

          {/* Mobile Menu Actions */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => handleNavClick("reservations")}
              className="px-3 py-2 border border-gold-400/40 bg-stone-950 text-gold-400 text-xs font-bold"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-stone-800 bg-stone-950 text-stone-300 hover:text-gold-400 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu overlay with slide down animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-stone-950 border-b border-amber-500/15 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => handleNavClick(link.key)}
                  className={`block w-full text-left px-4 py-3 rounded text-sm font-medium tracking-wide uppercase transition-all duration-200 ${currentView === link.key ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-500" : "text-stone-300 hover:bg-stone-900 hover:text-amber-400"}`}
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-4 border-t border-stone-900 flex flex-col space-y-3 px-4">
                <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-amber-500" /> Mon -
                    Sun: 12 PM - 12 AM
                  </span>
                </div>

                <a
                  href="tel:091-5840011"
                  className="flex items-center justify-center space-x-2 w-full py-3 rounded border border-amber-500/20 bg-stone-900/60 text-amber-400 font-bold text-sm uppercase"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call: 091-5840011</span>
                </a>

                {isAdmin ? (
                  <button
                    onClick={() => {
                      logoutAdmin();
                      handleNavClick("home");
                    }}
                    className="w-full text-center py-2.5 rounded bg-red-950/30 text-red-400 text-xs font-mono uppercase border border-red-500/20"
                  >
                    Logout Admin Panel
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick("admin")}
                    className="w-full text-center py-2.5 rounded bg-stone-900 text-stone-400 text-xs font-mono uppercase hover:text-amber-400"
                  >
                    Staff Admin Portal
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

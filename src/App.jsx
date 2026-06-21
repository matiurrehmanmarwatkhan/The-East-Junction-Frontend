import { useState, useEffect } from "react";
import {
  Phone,
  MessageSquare,
  ChevronUp,
  Clock,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import MenuView from "./components/MenuView";
import GalleryView from "./components/GalleryView";
import EventsView from "./components/EventsView";
import ReviewsView from "./components/ReviewsView";
import AboutView from "./components/AboutView";
import ContactView from "./components/ContactView";
import ReservationsView from "./components/ReservationsView";
import AdminDashboard from "./components/AdminDashboard";
import EastBot from "./components/EastBot";

function MainApp({
  isAdmin,
  loginAdmin,
  logoutAdmin,
  selectedPackage,
  setSelectedPackage,
  showScrollTop,
  scrollToTop
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to map pathname to currentView string for Header highlight
  const getActiveView = (pathname) => {
    const path = pathname.replace(/^\//, "");
    return path || "home";
  };

  const currentView = getActiveView(location.pathname);

  // Backward compatible routing callback
  const setView = (view) => {
    const path = view === "home" ? "/" : `/${view}`;
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="app-root-wrapper" className="min-h-screen bg-stone-950 font-sans text-stone-300 selection:bg-amber-500 selection:text-stone-950 relative flex flex-col justify-between">
      {/* Upper Top Ribbon: Address Context */}
      <div className="bg-stone-900 border-b border-stone-850 text-[10px] font-mono tracking-widest text-[#d09733] py-2 px-4 text-center z-[60] relative uppercase flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
        <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-amber-500 shrink-0" /> Spogmai Plaza, Near Avon Store, University Road, Peshawar</span>
        <span className="hidden sm:inline text-stone-700">•</span>
        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-amber-500 shrink-0" /> Open Hours: 12:00 PM - 12:00 AM Daily</span>
      </div>

      {/* FIXED FLOATING GLASS HEADER */}
      <Header
        currentView={currentView}
        setView={setView}
        isAdmin={isAdmin}
        logoutAdmin={logoutAdmin}
      />

      {/* CORE TRANSITIONAL VIEWER BODY */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Routes>
              <Route path="/" element={<HomeView setView={setView} />} />
              <Route path="/menu" element={<MenuView />} />
              <Route path="/gallery" element={<GalleryView />} />
              <Route path="/events" element={<EventsView setView={setView} setSelectedPackage={setSelectedPackage} />} />
              <Route path="/reviews" element={<ReviewsView />} />
              <Route path="/about" element={<AboutView />} />
              <Route path="/contact" element={<ContactView />} />
              <Route path="/reservations" element={<ReservationsView selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} />} />
              <Route path="/admin" element={<AdminDashboard isAdmin={isAdmin} loginAdmin={loginAdmin} logoutAdmin={logoutAdmin} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* BRAND STATIC FOOTER */}
      <Footer setView={setView} />

      {/* STATIC FLOATING HIGHS-CONVERSION ACTION CHANNELS */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col space-y-3 pointer-events-none">
        {/* Floating Scroll to Top button */}
        {showScrollTop && <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="pointer-events-auto p-3.5 rounded-full bg-stone-900/90 text-stone-300 hover:text-amber-400 border border-stone-800 backdrop-blur-sm shadow-xl hover:-translate-y-1 transition-all cursor-pointer focus:outline-none"
          title="Scroll to Top"
        >
          <ChevronUp className="w-4.5 h-4.5" />
        </motion.button>}

        {/* Floating Call hotline Button */}
        <motion.a
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          href="tel:091-5840011"
          className="pointer-events-auto p-4 rounded-full bg-stone-900 border border-amber-500/20 backdrop-blur-md text-amber-400 font-bold shadow-2xl flex items-center justify-center hover:-translate-y-1 hover:border-amber-400 hover:shadow-amber-500/10 transition-all cursor-pointer"
          title="One Click Telephone Hotlines"
        >
          <Phone className="w-5 h-5" />
        </motion.a>

        {/* Floating WhatsApp Quick Order Button */}
        <motion.a
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          href="https://wa.me/92915840011?text=Hi%20The%20East%20Junction%20Peshawar!%20I%20would%2520like%2520to%2520view%2520table%2520reservations%2520for%2520tonight."
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto p-4 rounded-full bg-emerald-600 border border-emerald-500/30 backdrop-blur-md text-white font-bold shadow-2xl flex items-center justify-center hover:-translate-y-1 hover:bg-emerald-500 transition-all cursor-pointer"
          title="Direct WhatsApp Messenger Liaison"
        >
          <MessageSquare className="w-5 h-5" />
        </motion.a>
      </div>

      {/* EASTBOT INTERACTIVE AI RESTAURANT ASSISTANT */}
      <EastBot />
    </div>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const sessionToken = localStorage.getItem("TEJ_ADMIN_TOKEN");
    if (sessionToken) {
      setIsAdmin(true);
    }
    const handleScrollVisibility = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScrollVisibility);
    return () => window.removeEventListener("scroll", handleScrollVisibility);
  }, []);

  const loginAdmin = (token) => {
    setIsAdmin(true);
    localStorage.setItem("TEJ_ADMIN_TOKEN", token);
    window.location.href = "/admin"; // full reload to reset router states cleanly
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem("TEJ_ADMIN_TOKEN");
    window.location.href = "/";
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Router>
      <MainApp
        isAdmin={isAdmin}
        loginAdmin={loginAdmin}
        logoutAdmin={logoutAdmin}
        selectedPackage={selectedPackage}
        setSelectedPackage={setSelectedPackage}
        showScrollTop={showScrollTop}
        scrollToTop={scrollToTop}
      />
    </Router>
  );
}

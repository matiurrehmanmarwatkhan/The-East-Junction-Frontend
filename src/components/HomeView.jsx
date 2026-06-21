import { useState, useEffect } from "react";
import Hero from "./Hero";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
export default function HomeView({ setView }) {
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      fetch("/api/menu").then((res) => res.json()),
      fetch("/api/reviews").then((res) => res.json()),
      fetch("/api/events").then((res) => res.json())
    ]).then(([menuData, reviewData, eventData]) => {
      setFeaturedDishes(
        menuData.filter((item) => item.isFeatured).slice(0, 4)
      );
      setReviews(
        reviewData.filter(
          (r) => r.status === "approved" || r.rating >= 4
        )
      );
      setEvents(eventData.slice(0, 3));
    }).catch((err) => {
      console.error(
        "Failed to load server data in HomeView, utilizing stable luxury seeds:",
        err
      );
    }).finally(() => {
      setLoading(false);
    });
  }, []);
  const nextReview = () => {
    if (reviews.length === 0) return;
    setActiveReviewIndex((prev) => (prev + 1) % reviews.length);
  };
  const prevReview = () => {
    if (reviews.length === 0) return;
    setActiveReviewIndex(
      (prev) => (prev - 1 + reviews.length) % reviews.length
    );
  };
  return <div id="home-view" className="bg-stone-950 font-sans">
      {
    /* 1. HERO HEADER BANNER */
  }
      <Hero setView={setView} />

      {
    /* 2. CHERISHED FEATURED DISHES (Chef's Masterpieces) */
  }
      <section className="py-24 bg-gradient-to-b from-stone-950 to-[#0a0a0a] overflow-hidden relative border-b border-stone-900">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold-400/5 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[10px] font-mono tracking-[0.22em] text-gold-400 uppercase">
              Epicurean Creations
            </p>
            <h3 className="font-serif text-3xl sm:text-5xl text-white font-bold mt-2">
              The Chef's{" "}
              <span className="text-gold-400 italic font-serif">
                Signature Selection
              </span>
            </h3>
            <div className="w-12 h-[1px] bg-gold-400/30 mx-auto mt-4" />
          </div>

          {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => <div
    key={i}
    className="glass-panel rounded-none overflow-hidden h-96 shimmer-active"
  />)}
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredDishes.map((dish) => <motion.div
    key={dish.id}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    className="group relative rounded-none overflow-hidden glass-panel border border-white/5 hover:border-gold-400/40 transition-all flex flex-col h-full bg-[#0d0d0d] group"
  >
                  {
    /* Food Glistening image */
  }
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
    src={dish.image}
    alt={dish.name}
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-95"
  />

                    {
    /* Badge Tags */
  }
                    {dish.tags && dish.tags.length > 0 && <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        <span className="px-2 py-1 rounded-none bg-stone-950/90 backdrop-blur-sm border border-gold-400/25 text-[9px] font-mono font-semibold tracking-wider text-gold-400 uppercase">
                          {dish.tags[0]}
                        </span>
                      </div>}

                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-60" />
                  </div>

                  {
    /* Description Info */
  }
                  <div className="p-5 flex flex-col flex-grow">
                    <h4 className="font-serif text-md text-white font-bold group-hover:text-gold-400 transition-colors uppercase tracking-wider">
                      {dish.name}
                    </h4>
                    <p className="text-stone-400 text-xs leading-relaxed mt-2 line-clamp-2 flex-grow">
                      {dish.description}
                    </p>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                      <span className="font-mono text-sm font-extrabold text-gold-400">
                        {dish.price} PKR
                      </span>
                      <button
    onClick={() => setView("menu")}
    className="text-white cursor-pointer hover:text-gold-400 text-[10px] uppercase tracking-widest font-bold flex items-center transition-all group-hover:translate-x-1"
  >
                        <span>Order Now</span>
                        <ArrowRight className="w-3  h-3 ml-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>)}
            </div>}

          <div className="text-center mt-12">
            <button
    onClick={() => setView("menu")}
    className="px-8 py-3.5 border border-gold-400/50 text-xs font-bold tracking-[0.16em] text-gold-400 uppercase hover:bg-gold-400 hover:text-stone-950 transition-all cursor-pointer rounded-none bg-stone-950/40"
  >
              View Full Interactive Menu
            </button>
          </div>
        </div>
      </section>

      {
    /* 3. LUXURY BIRTHDAY CELEBRATION SERVICES */
  }
      <section className="py-24 bg-stone-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {
    /* Left side: Premium Narrative */
  }
            <div className="lg:col-span-5 space-y-6">
              <p className="text-xs font-mono tracking-widest text-amber-500 uppercase">
                Spogmai Plaza Celebrations
              </p>
              <h3 className="font-serif text-3xl sm:text-5xl text-white font-bold leading-tight">
                Celebrate Your <br />
                <span className="text-amber-300 italic font-serif">
                  Royal Milestones
                </span>{" "}
                With Us
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Hosting an upcoming birthday, anniversary, or corporate event?
                The East Junction specializes in creating breathtaking
                celebration spaces. Settle into our private VIP parlor with
                premium gold-plated custom details, gourmet multi-tier cakes,
                personalized invitations, and live musical violin sets designed
                to deliver a true WOW factor.
              </p>

              <div className="space-y-3.5 border-t border-stone-800/80 pt-6">
                <div className="flex items-center space-x-3 text-xs text-stone-300">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-450 text-[10px]">
                    ✨
                  </div>
                  <span>Exclusive Private VIP Lounge Hall Reservation</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-stone-300">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-450 text-[10px]">
                    ✨
                  </div>
                  <span>Gourmet Tiered Red Velvet / Chocolate Fudge Cakes</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-stone-300">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-450 text-[10px]">
                    ✨
                  </div>
                  <span>Bespoke Table Floristry & Gold Archway Setup</span>
                </div>
              </div>

              <button
    onClick={() => setView("events")}
    className="px-6 py-3.5 rounded bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 text-xs font-bold tracking-widest uppercase hover:shadow-lg transition-all"
  >
                Explore Celebration Packages
              </button>
            </div>

            {
    /* Right side: Image Collage */
  }
            <div className="lg:col-span-7 grid grid-cols-12 gap-4">
              <div className="col-span-8 rounded-lg overflow-hidden border border-amber-500/15 aspect-[4/3] relative group">
                <img
    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
    alt="Birthday setup"
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
  />
                <div className="absolute bottom-4 left-4 glass-panel px-3 py-1.5 rounded text-[10px] font-mono uppercase text-amber-400">
                  TURKISH DELECTABILITY
                </div>
              </div>
              <div className="col-span-4 rounded-lg overflow-hidden border border-amber-500/15 aspect-[3/4] relative group">
                <img
    src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80"
    alt="Corporate high tea"
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
  />
              </div>
              <div className="col-span-4 rounded-lg overflow-hidden border border-amber-500/15 aspect-[3/4] relative group">
                <img
    src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"
    alt="Luxury table arrangements"
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
  />
              </div>
              <div className="col-span-8 rounded-lg overflow-hidden border border-amber-500/15 aspect-[4/3] relative group">
                <img
    src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80"
    alt="Detergent interior"
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
  />
                <div className="absolute bottom-4 right-4 glass-panel px-3 py-1.5 rounded text-[10px] font-mono uppercase text-amber-400">
                  SOVEREIGN DINING
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* 4. AMAZING CUSTOM REVIEW CAROUSEL */
  }
      <section className="py-24 bg-gradient-to-b from-stone-900 to-stone-950 relative overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-mono tracking-widest text-amber-500 uppercase">
              Patron Testimonials
            </p>
            <h3 className="font-serif text-3xl sm:text-5xl text-white font-bold mt-2">
              Diner{" "}
              <span className="text-amber-400 italic font-serif">
                Perspectives
              </span>
            </h3>
            <div className="w-16 h-0.5 bg-amber-500/30 mx-auto mt-4" />
          </div>

          {reviews.length > 0 ? <div className="relative">
              {
    /* Carousel Panel with Framer entry */
  }
              <AnimatePresence mode="wait">
                <motion.div
    key={activeReviewIndex}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.4 }}
    className="glass-panel p-8 sm:p-12 rounded-2xl relative text-center border-amber-500/15 shadow-xl"
  >
                  <div className="inline-flex items-center space-x-1 mb-6">
                    {Array.from({
    length: reviews[activeReviewIndex].rating
  }).map((_, i) => <Star
    key={i}
    className="w-4 h-4 text-amber-400 fill-amber-400"
  />)}
                  </div>

                  <p className="font-serif text-md sm:text-lg text-stone-200 leading-relaxed italic mb-8">
                    "{reviews[activeReviewIndex].comment}"
                  </p>

                  <div>
                    <h5 className="font-serif text-white font-bold tracking-widest uppercase">
                      {reviews[activeReviewIndex].name}
                    </h5>
                    <p className="text-[#d09733] font-mono text-[10px] uppercase mt-1">
                      {reviews[activeReviewIndex].role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {
    /* Slider Controller buttons */
  }
              <div className="flex items-center justify-center space-x-4 mt-8">
                <button
    onClick={prevReview}
    className="p-3 rounded-full border border-stone-800 bg-stone-900/60 text-stone-400 hover:text-amber-400 hover:border-amber-400 transition-all focus:outline-none"
  >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-1.5">
                  {reviews.map((_, idx) => <button
    key={idx}
    onClick={() => setActiveReviewIndex(idx)}
    className={`w-1.5 h-1.5 rounded-full transition-all ${activeReviewIndex === idx ? "w-5 bg-amber-400" : "bg-stone-800"}`}
  />)}
                </div>
                <button
    onClick={nextReview}
    className="p-3 rounded-full border border-stone-800 bg-stone-900/60 text-stone-400 hover:text-amber-400 hover:border-amber-400 transition-all focus:outline-none"
  >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div> : <p className="text-center text-stone-500">
              Retrieving diner journals...
            </p>}

          {
    /* Prompt to submit reviews */
  }
          <div className="text-center mt-12 bg-stone-900/40 border border-stone-800/80 rounded-xl p-6 max-w-xl mx-auto">
            <h5 className="text-stone-300 text-xs font-semibold">
              Had an unforgettable dinner at Spogmai Plaza recently?
            </h5>
            <button
    onClick={() => setView("contact")}
    className="text-amber-400 hover:text-amber-300 text-[10px] uppercase font-mono tracking-wider underline mt-2 inline-flex items-center"
  >
              Share Your Journey With Our Chef
            </button>
          </div>
        </div>
      </section>

      {
    /* 5. ONLINE RESERVATION PROMPT CTA */
  }
      <section className="py-24 bg-stone-950 text-center relative overflow-hidden border-t border-stone-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-stone-950/90" />
          <img
    src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80"
    alt="Interior layout"
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover select-none pointer-events-none filter brightness-50"
  />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 z-10 space-y-6">
          <p className="text-xs font-mono tracking-widest text-[#d09733] uppercase">
            Table Reservations
          </p>
          <h3 className="font-serif text-3xl sm:text-5xl text-white font-extrabold leading-tight">
            Secure Your Culinary Seat
          </h3>
          <p className="max-w-lg mx-auto text-stone-300 text-xs sm:text-sm leading-relaxed">
            Whether a cozy weekend family dinner, dynamic corporate banquet, or
            an intimate birthday group, book now to avoid queue times.
            Confirmations are instantaneous.
          </p>

          <button
    onClick={() => setView("reservations")}
    className="px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 text-xs font-bold tracking-widest uppercase rounded shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 transition-all"
  >
            Settle Reservations Now
          </button>
        </div>
      </section>
    </div>;
}

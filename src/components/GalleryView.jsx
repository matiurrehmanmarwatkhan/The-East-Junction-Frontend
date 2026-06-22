import { useState, useEffect } from "react";
import {
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../api";

export default function GalleryView() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/gallery").then((res) => {
      setGalleryItems(res.data);
    }).catch((err) => {
      console.error("Failed to load gallery assets:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);
  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  );
  const openLightbox = (id) => {
    const idx = filteredItems.findIndex((item) => item.id === id);
    if (idx !== -1) setLightboxIndex(idx);
  };
  const closeLightbox = () => setLightboxIndex(null);
  const nextSlide = (e) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  };
  const prevSlide = (e) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems]);
  const categories = [
    { label: "All Masterpieces", key: "all" },
    { label: "Interiors & Lounge", key: "interior" },
    { label: "Gourmet Platters", key: "dishes" },
    { label: "Birthday Events", key: "events" },
    { label: "Artisanal Drinks", key: "drinks" }
  ];
  return <section id="gallery-v" className="bg-stone-950 min-h-screen pt-32 pb-24 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {
    /* Gallery titles */
  }
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.24em] text-gold-400 uppercase">Spogmai Plaza Aesthetics</p>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-bold mt-2.5">
            The East Junction <span className="text-gold-400 italic font-serif">Visual Journal</span>
          </h2>
          <p className="text-stone-400 text-xs max-w-lg mx-auto mt-4 leading-relaxed">
            Browse our cinematic interior architecture, curated dining displays, birthday set pieces, and expert barista creations. Tap any snapshot to initiate the full-screen master view.
          </p>
          <div className="w-12 h-[1px] bg-gold-400/30 mx-auto mt-5" />
        </div>

        {
    /* Categories filters */
  }
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => <button
    key={cat.key}
    onClick={() => setSelectedCategory(cat.key)}
    className={`px-5 py-2.5 rounded-none text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border ${selectedCategory === cat.key ? "bg-gold-400 border-gold-400 text-stone-950" : "bg-stone-950 border-white/5 hover:border-gold-400/30 text-stone-300"}`}
  >
              {cat.label}
            </button>)}
        </div>

        {
    /* Responsive Grid */
  }
        {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="glass-panel aspect-[4/3] rounded-none shimmer-active" />)}
          </div> : filteredItems.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => <motion.div
    key={item.id}
    layoutId={`gallery-wrap-${item.id}`}
    whileHover={{ y: -4 }}
    className="group relative rounded-none overflow-hidden glass-panel border border-white/5 bg-[#0d0d0d] aspect-[4/3] cursor-pointer"
    onClick={() => openLightbox(item.id)}
  >
                <img
    src={item.url}
    alt={item.title}
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
  />
                
                {
    /* Lightbox Trigger hover card */
  }
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                  <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest">{item.category}</span>
                  <h4 className="font-serif text-white text-sm font-semibold mt-1 tracking-wide leading-tight group-hover:gold-glow">{item.title}</h4>
                  <div className="absolute top-4 right-4 p-2 bg-stone-950/80 rounded-none border border-gold-400/20 text-gold-400">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>)}
          </div> : <div className="text-center py-20 bg-stone-950 border border-white/5 rounded-none max-w-md mx-auto">
            <ImageIcon className="w-10 h-10 text-stone-600 mx-auto" />
            <h4 className="font-serif text-white text-md font-semibold mt-4">Empty Gallery Portfolio</h4>
            <p className="text-stone-400 text-xs mt-2">No aesthetic images found matching this category filter.</p>
          </div>}

      </div>

      {
    /* Advanced Lightbox Portal overlay with fade transitions */
  }
      <AnimatePresence>
        {lightboxIndex !== null && <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-stone-950/95 backdrop-blur-md flex flex-col justify-center items-center p-4 select-none"
    onClick={closeLightbox}
  >
            {
    /* Top Close bar */
  }
            <div className="absolute top-6 right-6 z-[110]">
              <button
    onClick={closeLightbox}
    className="p-3 bg-stone-900 border border-white/10 rounded-none text-stone-400 hover:text-white transition-colors cursor-pointer"
  >
                <X className="w-6 h-6" />
              </button>
            </div>

            {
    /* Lightbox content slider wrap */
  }
            <div className="relative max-w-5xl w-full h-[70vh] flex items-center justify-center p-2">
              
              {
    /* Previous button */
  }
              <button
    onClick={prevSlide}
    className="absolute left-2 sm:-left-12 p-3 bg-stone-900/80 border border-white/10 rounded-none text-stone-400 hover:text-white hover:border-gold-400 transition-all z-20 cursor-pointer"
  >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {
    /* Main lightbox zoom figure */
  }
              <motion.div
    key={lightboxIndex}
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.95, opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="relative max-h-full max-w-full rounded-none overflow-hidden shadow-2xl border border-white/5"
    onClick={(e) => e.stopPropagation()}
  >
                <img
    src={filteredItems[lightboxIndex].url}
    alt={filteredItems[lightboxIndex].title}
    referrerPolicy="no-referrer"
    className="max-h-[70vh] w-auto max-w-full object-contain filter brightness-100"
  />
              </motion.div>

              {
    /* Next button */
  }
              <button
    onClick={nextSlide}
    className="absolute right-2 sm:-right-12 p-3 bg-stone-900/80 border border-white/10 rounded-none text-stone-400 hover:text-white hover:border-gold-400 transition-all z-20 cursor-pointer"
  >
                <ChevronRight className="w-6 h-6" />
              </button>

            </div>

            {
    /* Bottom title annotation card */
  }
            <div className="mt-6 text-center max-w-lg px-4" onClick={(e) => e.stopPropagation()}>
              <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest">{filteredItems[lightboxIndex].category}</span>
              <h3 className="font-serif text-lg text-white font-bold mt-1 uppercase tracking-wide">{filteredItems[lightboxIndex].title}</h3>
              <p className="text-stone-500 text-[10px] font-mono mt-2 uppercase font-semibold">Asset {lightboxIndex + 1} of {filteredItems.length}</p>
            </div>

          </motion.div>}
      </AnimatePresence>

    </section>;
}

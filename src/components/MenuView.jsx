import { useState, useEffect } from "react";
import {
  Search,
  Flame,
  Pizza,
  UtensilsCrossed,
  Grid,
  Phone,
  MessageSquare,
  Wine,
  IceCream,
  ChefHat,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../api";

export default function MenuView() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      api.get("/categories").then((res) => res.data),
      api.get("/menu").then((res) => res.data),
    ])
      .then(([cats, items]) => {
        setCategories(cats);
        setMenuItems(items);
      })
      .catch((err) => {
        console.error(
          "Failed to fetch menu in MenuView: using luxury local seeds",
          err,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case "Beef":
        return <ChefHat className="w-4 h-4" />;
      case "Pizza":
        return <Pizza className="w-4 h-4" />;
      case "Flame":
        return <Flame className="w-4 h-4" />;
      case "ChefHat":
        return <ChefHat className="w-4 h-4" />;
      case "UtensilsCrossed":
        return <UtensilsCrossed className="w-4 h-4" />;
      case "Soup":
        return (
          <UtensilsCrossed
            className="w-4 h-4"
            style={{ transform: "rotate(18ddeg)" }}
          />
        );
      case "Wine":
        return <Wine className="w-4 h-4" />;
      case "IceCream":
        return <IceCream className="w-4 h-4" />;
      default:
        return <Grid className="w-4 h-4" />;
    }
  };
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.categorySlug === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const makeWhatsAppLink = (dishName, price) => {
    const rawMessage = `Hi The East Junction Peshawar! I would like to order: ${dishName} (${price} PKR). Kindly let me know the preparation time and total delivery details at my address. Thank you!`;
    const encoded = encodeURIComponent(rawMessage);
    return `https://wa.me/92915840011?text=${encoded}`;
  };
  return (
    <section
      id="interactive-menu-view"
      className="bg-stone-950 min-h-screen pt-32 pb-24 text-stone-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Elite Banner Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.24em] text-gold-400 uppercase">
            Sovereign Dining Selection
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-bold mt-2.5">
            The East Junction{" "}
            <span className="text-gold-400 italic font-serif">A La Carte</span>
          </h2>
          <p className="text-stone-400 text-xs max-w-lg mx-auto mt-4 leading-relaxed">
            Search our luxury dishes, choose specific filters, and order
            directly to your door at Spogmai Plaza via instant WhatsApp
            integration. One click, infinite pleasure.
          </p>
          <div className="w-12 h-[1px] bg-gold-400/30 mx-auto mt-5" />
        </div>

        {/* Search & Dynamic Filter Actions */}
        <div className="space-y-8 mb-12">
          {/* Custom Glass Search Bar */}
          <div className="max-w-md mx-auto relative group">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gold-400/60 group-hover:text-gold-400 transition-colors" />
            <input
              type="text"
              placeholder="Search gourmet burgers, prime steaks, biryanis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-none bg-stone-950 border border-white/10 text-white text-xs tracking-wider glass-input"
            />
          </div>

          {/* Categories Tab Pill slider */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2.5 rounded-none text-xs font-semibold tracking-wider uppercase transition-all flex items-center space-x-2 border cursor-pointer ${selectedCategory === "all" ? "bg-gold-400 border-gold-400 text-stone-950 font-bold" : "bg-stone-950 border-white/5 hover:border-gold-400/40 text-stone-350"}`}
            >
              <Grid className="w-4 h-4" />
              <span>All Categories</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2.5 rounded-none text-xs font-semibold tracking-wider uppercase transition-all flex items-center space-x-2 border cursor-pointer ${selectedCategory === cat.slug ? "bg-gold-400 border-gold-400 text-stone-950 font-bold" : "bg-stone-950 border-white/5 hover:border-gold-400/40 text-[#cccccc]"}`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Grid of Menu Items */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="glass-panel h-[400px] rounded-none shimmer-active"
              />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-none overflow-hidden glass-panel border border-white/5 hover:border-gold-400/40 transition-all flex flex-col h-full bg-[#0d0d0d] group"
                >
                  {/* Photo with zoom */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-none bg-stone-950/90 backdrop-blur-sm border border-gold-400/25 text-[8px] font-mono tracking-widest text-gold-400 uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-40" />
                  </div>

                  {/* Core Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-serif text-lg text-white font-bold group-hover:text-gold-400 transition-colors tracking-wide leading-tight uppercase">
                        {item.name}
                      </h3>
                      <span className="font-mono text-[13px] font-extrabold text-gold-400 shrink-0 bg-gold-400/5 px-2.5 py-1 rounded-none border border-gold-400/20">
                        {item.price} PKR
                      </span>
                    </div>

                    <p className="text-stone-400 text-xs leading-relaxed mt-3 flex-grow line-clamp-3">
                      {item.description}
                    </p>

                    {/* Ordering Actions */}
                    <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
                      {/* Call support */}
                      <a
                        href="tel:091-5840011"
                        className="py-2.5 border border-white/10 hover:bg-white/5 text-stone-300 font-bold text-[10px] tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-colors rounded-none"
                      >
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>Call In Order</span>
                      </a>

                      {/* WhatsApp API order integration */}
                      <a
                        href={makeWhatsAppLink(item.name, item.price)}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 rounded-none bg-gold-400 hover:bg-gold-500 text-stone-950 font-bold text-[10px] tracking-widest uppercase flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-gold-500/5 hover:translate-y-[-1px] transition-transform duration-300"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp order</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-stone-900/20 border border-stone-800/80 rounded-2xl max-w-lg mx-auto">
            <span className="text-3xl">🍽️</span>
            <h4 className="font-serif text-lg text-white font-semibold mt-4">
              No matching dishes discovered
            </h4>
            <p className="text-stone-400 text-xs mt-2">
              Try adjusting your search query, or choosing a different filter
              category tab above.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-6 text-amber-400 hover:underline text-xs font-semibold"
            >
              Reset Filters & Show All
            </button>
          </div>
        )}

        {/* Quick Footer info bar */}
        <div className="mt-16 text-center text-xs text-stone-500 font-mono tracking-widest uppercase flex flex-wrap items-center justify-center gap-6">
          <span> MON-SUN: 12 PM - 12 AM</span>
          <span className="hidden sm:inline">•</span>
          <span> Delivery & Takeaway Available</span>
          <span className="hidden sm:inline">•</span>
          <span> Hotline: 091-5840011</span>
        </div>
      </div>
    </section>
  );
}

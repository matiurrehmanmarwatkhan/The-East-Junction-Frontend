import { useState, useEffect, useRef } from "react";
import {
  Star,
  Upload,
  X,
  Check,
  MessageSquare,
  Sparkles,
  Filter,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  Quote,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
const PRESET_DISH_IMAGES = [
  { name: "Turkish Platter", url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80" },
  { name: "Prime Burger", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80" },
  { name: "Tarragon Steak", url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80" },
  { name: "Saffron Biryani", url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=400&q=80" }
];
export default function ReviewsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedPresetImage, setSelectedPresetImage] = useState("");
  const [uploadedBase64Image, setUploadedBase64Image] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const fileInputRef = useRef(null);
  const loadReviewsData = () => {
    setLoading(true);
    fetch("/api/reviews").then((res) => res.json()).then((data) => {
      setReviews(data);
    }).catch((err) => {
      console.error("Failed to load reviews:", err);
    }).finally(() => {
      setLoading(false);
    });
  };
  useEffect(() => {
    loadReviewsData();
  }, []);
  const approvedReviews = reviews.filter((r) => r.status === "approved" || r.isApproved === true);
  const highRatedReviews = approvedReviews.filter((r) => r.rating >= 4);
  useEffect(() => {
    if (!autoPlay || highRatedReviews.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % highRatedReviews.length);
    }, 6e3);
    return () => clearInterval(interval);
  }, [autoPlay, highRatedReviews]);
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const convertFileToBase64 = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Diner image upload must be a valid image file.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setFormError("Culinary shot is too large. Choose an image under 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedBase64Image(reader.result);
      setSelectedPresetImage("");
    };
    reader.readAsDataURL(file);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setFormError("");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      convertFileToBase64(e.dataTransfer.files[0]);
    }
  };
  const handleFileSelect = (e) => {
    setFormError("");
    if (e.target.files && e.target.files[0]) {
      convertFileToBase64(e.target.files[0]);
    }
  };
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!name.trim()) return setFormError("Diner name file is required.");
    if (!message.trim()) return setFormError("Testimonial message content cannot be blank.");
    setSubmitting(true);
    const finalImage = uploadedBase64Image || selectedPresetImage || "";
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          rating,
          message,
          image: finalImage,
          role: "Valued Diner"
        })
      });
      if (response.ok) {
        setSubmittedSuccess(true);
        setName("");
        setEmail("");
        setRating(5);
        setMessage("");
        setUploadedBase64Image("");
        setSelectedPresetImage("");
        loadReviewsData();
        setTimeout(() => {
          setSubmittedSuccess(false);
        }, 5e3);
      } else {
        setFormError("We encountered a server glitch registering your review. Try again.");
      }
    } catch (err) {
      setFormError("Failed to dispatch review to the server.");
    } finally {
      setSubmitting(false);
    }
  };
  const totalCount = approvedReviews.length;
  const averageRating = totalCount > 0 ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1) : "5.0";
  const barCounts = [0, 0, 0, 0, 0];
  approvedReviews.forEach((r) => {
    const starIndex = Math.min(Math.max(r.rating, 1), 5) - 1;
    barCounts[starIndex]++;
  });
  const recommendationRate = totalCount > 0 ? Math.round((barCounts[4] + barCounts[3]) / totalCount * 100) : 100;
  const filteredReviews = approvedReviews.filter((r) => {
    if (activeFilter === "all") return true;
    return r.rating === Number(activeFilter);
  });
  return <section id="reviews-dashboard" className="bg-stone-950 min-h-screen pt-32 pb-24 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {
    /* Dynamic header */
  }
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.24em] text-gold-400 uppercase">Guest Chronicles</p>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-bold mt-2.5">
            Diner Stories & <span className="text-gold-400 italic font-serif">Aesthetics</span>
          </h2>
          <p className="text-stone-400 text-xs max-w-lg mx-auto mt-4 leading-relaxed">
            Read certified critiques and warm family testimonials celebrating our stone-baked, charcoal-grilled, and platinum event coordination at Spogmai Plaza, Peshawar.
          </p>
          <div className="w-12 h-[1px] bg-gold-400/30 mx-auto mt-5" />
        </div>

        {
    /* 1. TESTIMONIAL CAROUSEL PANEL */
  }
        {highRatedReviews.length > 0 && <div className="mb-20 max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-[9px] font-mono tracking-widest text-gold-400 uppercase flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" /> Highly Commended Journeys
              </span>
            </div>
            
            <div className="relative overflow-hidden border border-gold-400/15 bg-stone-900/10 backdrop-blur-md p-8 sm:p-14 text-center group">
              {
    /* Giant block quote decorative icon */
  }
              <div className="absolute top-6 left-6 text-gold-400/5 select-none pointer-events-none">
                <Quote className="w-24 h-24 stroke-[1]" />
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
    key={carouselIndex}
    initial={{ opacity: 0, scale: 0.98, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.98, y: -10 }}
    transition={{ duration: 0.5 }}
    className="relative z-10 flex flex-col items-center min-h-[160px] justify-center"
  >
                  <div className="inline-flex items-center space-x-1 mb-6">
                    {Array.from({ length: highRatedReviews[carouselIndex].rating }).map((_, i) => <Star key={i} className="w-4.5 h-4.5 text-gold-400 fill-gold-400" />)}
                  </div>

                  <p className="font-serif text-white text-md sm:text-xl leading-relaxed italic max-w-2xl text-stone-200">
                    "{highRatedReviews[carouselIndex].message || highRatedReviews[carouselIndex].comment}"
                  </p>

                  <div className="mt-6">
                    <h5 className="font-serif text-gold-400 text-xs tracking-widest uppercase font-bold">
                      {highRatedReviews[carouselIndex].name}
                    </h5>
                    <p className="text-stone-500 font-mono text-[9px] uppercase mt-1">
                      {highRatedReviews[carouselIndex].role || "Gold Tier Patron"}  •  Peshawar, PK
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {
    /* Slider Arrows */
  }
              <button
    onClick={() => {
      setAutoPlay(false);
      setCarouselIndex((prev) => (prev - 1 + highRatedReviews.length) % highRatedReviews.length);
    }}
    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-stone-950/60 border border-white/5 text-stone-400 hover:text-gold-400 hover:border-gold-400 transition-all cursor-pointer opacity-0 group-hover:opacity-100 hidden sm:block"
  >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
    onClick={() => {
      setAutoPlay(false);
      setCarouselIndex((prev) => (prev + 1) % highRatedReviews.length);
    }}
    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-stone-950/60 border border-white/5 text-stone-400 hover:text-gold-400 hover:border-gold-400 transition-all cursor-pointer opacity-0 group-hover:opacity-100 hidden sm:block"
  >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {
    /* Pagination Bullet Indicators */
  }
            <div className="flex items-center justify-center space-x-2 mt-4">
              {highRatedReviews.map((_, idx) => <button
    key={idx}
    onClick={() => {
      setAutoPlay(false);
      setCarouselIndex(idx);
    }}
    className={`h-1.5 rounded-full transition-all ${carouselIndex === idx ? "w-6 bg-gold-400" : "w-1.5 bg-stone-850 hover:bg-stone-700"}`}
  />)}
            </div>
          </div>}

        {
    /* 2. STATS OVERVIEW & RATING DISTRIBUTIONS */
  }
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {
    /* Average metrics scorecard */
  }
          <div className="lg:col-span-4 border border-white/5 bg-[#0d0d0d] p-6 sm:p-8 relative overflow-hidden group">
            <div className="relative z-10 text-center lg:text-left">
              <span className="text-[10px] font-mono text-gold-400 tracking-wider uppercase">Aggregate Trust Metric</span>
              <div className="flex items-baseline justify-center lg:justify-start gap-2 mt-2">
                <span className="text-5xl sm:text-6xl font-mono text-white font-extrabold">{averageRating}</span>
                <span className="text-stone-500 font-mono text-xs">/ 5.0</span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start space-x-1.5 mt-3 text-gold-400">
                {Array.from({ length: 5 }).map((_, i) => {
    const val = i + 1;
    const isFilled = val <= Math.round(Number(averageRating));
    return <Star
      key={i}
      className={`w-5.5 h-5.5 ${isFilled ? "fill-gold-400 text-gold-400" : "text-stone-800"}`}
    />;
  })}
              </div>

              <p className="text-stone-400 text-xs mt-6 leading-relaxed max-w-sm">
                Calculated dynamically from <span className="text-white font-semibold font-mono">{totalCount}</span> verified guest postings. Excellent service scoring with <span className="text-gold-400 font-bold font-mono">{recommendationRate}%</span> positive recommendation target.
              </p>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center lg:justify-start space-x-4">
                <div className="text-left">
                  <span className="text-white font-mono font-bold text-base block">{recommendationRate}%</span>
                  <span className="text-stone-500 text-[9px] uppercase font-mono mt-0.5">Would Recommend</span>
                </div>
                <div className="w-[1px] h-8 bg-white/5" />
                <div className="text-left">
                  <span className="text-white font-mono font-bold text-base block">100% Halal</span>
                  <span className="text-stone-500 text-[9px] uppercase font-mono mt-0.5">Certified Sourcing</span>
                </div>
              </div>
            </div>
          </div>

          {
    /* Rating progression bars block */
  }
          <div className="lg:col-span-8 border border-white/5 bg-[#0d0d0d] p-6 sm:p-8 h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-gold-400 tracking-wider uppercase">Score Proportions</span>
              <h3 className="font-serif text-white font-bold text-md uppercase mt-1 tracking-wide">Patron Feedback Distribution</h3>
            </div>
            
            <div className="space-y-4 mt-6">
              {[5, 4, 3, 2, 1].map((stars) => {
    const count = barCounts[stars - 1];
    const percentage = totalCount > 0 ? Math.round(count / totalCount * 100) : 0;
    return <div key={stars} className="flex items-center space-x-4 text-xs">
                    <span className="font-mono text-stone-400 w-4 font-bold">{stars}★</span>
                    <div className="flex-grow h-2 bg-stone-900 overflow-hidden relative border border-white/[0.02]">
                      <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="h-full bg-gold-400/80"
    />
                    </div>
                    <span className="font-mono text-stone-500 w-8 text-right">{percentage}%</span>
                    <span className="font-mono text-stone-600 text-[10px] w-6 text-right">({count})</span>
                  </div>;
  })}
            </div>

            <div className="mt-6 pt-5 border-t border-white/5 text-[10px] font-mono text-stone-500 text-center lg:text-left uppercase">
              * Verification audits handled securely in real-time by kitchen management
            </div>
          </div>

        </div>

        {
    /* 3. SUBMIT REVIEW FORM PANEL */
  }
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-stretch">
          
          {
    /* Form left content */
  }
          <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-8 border border-white/5 bg-[#0f0f0f] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-gold-400/5 blur-2xl pointer-events-none" />
            
            <div className="space-y-6">
              <div className="w-10 h-10 rounded border border-gold-400/30 bg-stone-950 flex items-center justify-center text-gold-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              
              <h3 className="font-serif text-white text-xl sm:text-2xl font-bold uppercase tracking-wide">
                Share Your <span className="text-gold-400 italic font-serif">Epicurean</span> Review
              </h3>
              
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                Had an unforgettable steak or traditional saffron mutton platter with family on University Road? Write your certified review to help shape our culinary milestones.
              </p>
              
              <div className="space-y-3.5 border-t border-white/5 pt-6 text-xs text-stone-350">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Interactive star selections</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Optional guest plate imagery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Admin moderated for privacy protection</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-stone-950/40 p-4 border border-white/5 text-[10px] font-mono text-stone-500 uppercase">
              🔒 Email addresses are used strictly for guest validation and will never be published format code.
            </div>
          </div>

          {
    /* Form write fields card */
  }
          <div className="lg:col-span-8 border border-white/5 bg-[#0d0d0d] p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {submittedSuccess ? <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    className="h-full flex flex-col justify-center items-center text-center py-12"
  >
                  <div className="w-16 h-16 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-6 animate-bounce">
                    <PartyPopper className="w-8 h-8" />
                  </div>
                  <p className="text-[10px] font-mono text-gold-400 tracking-widest uppercase">Thank you very much</p>
                  <h4 className="font-serif text-white text-2xl font-bold uppercase tracking-wide mt-2">Diner review registered!</h4>
                  <p className="text-stone-450 text-xs max-w-sm mt-3 leading-relaxed">
                    Our luxury chef reads all critiques carefully. Your rating is safely logged in our database and will render live cards once confirmed by admin.
                  </p>
                  <button
    onClick={() => setSubmittedSuccess(false)}
    className="mt-8 px-6 py-2.5 border border-white/10 hover:border-gold-400/45 hover:text-white transition-all text-xs uppercase font-mono "
  >
                    Post another critique
                  </button>
                </motion.div> : <motion.form
    onSubmit={handleReviewSubmit}
    className="space-y-6 text-left text-xs"
  >
                  {
    /* Name, Email Row */
  }
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-stone-400 font-mono tracking-wider uppercase text-[10px]">Your Name *</label>
                      <input
    type="text"
    required
    placeholder="e.g. Sameer Afridi"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full px-4 py-3 bg-stone-950/60 border border-white/5 focus:border-gold-400/50 rounded-none text-white focus:outline-none focus:ring-1 focus:ring-gold-400/50"
  />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-stone-400 font-mono tracking-wider uppercase text-[10px]">Your Email * (strictly confidential)</label>
                      <input
    type="email"
    required
    placeholder="e.g. sameer@family.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-4 py-3 bg-stone-950/60 border border-white/5 focus:border-gold-400/50 rounded-none text-white focus:outline-none focus:ring-1 focus:ring-gold-400/50"
  />
                    </div>
                  </div>

                  {
    /* Rating selection row */
  }
                  <div className="space-y-2 border-b border-white/5 pb-5">
                    <label className="text-stone-400 font-mono tracking-wider uppercase text-[10px] block">Star Rating Scale *</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((starNum) => {
    const isActive = starNum <= (hoverRating || rating);
    return <button
      key={starNum}
      type="button"
      onClick={() => setRating(starNum)}
      onMouseEnter={() => setHoverRating(starNum)}
      onMouseLeave={() => setHoverRating(0)}
      className="p-1 focus:outline-none hover:scale-110 transition-transform cursor-pointer"
      title={`${starNum} Star${starNum > 1 ? "s" : ""}`}
    >
                              <Star
      className={`w-8 h-8 ${isActive ? "text-gold-400 fill-gold-400" : "text-stone-850 hover:text-gold-400/40"}`}
    />
                            </button>;
  })}
                      </div>
                      
                      <span className="font-mono text-gold-400 text-xs font-bold uppercase ml-3">
                        {rating === 5 && "\u{1F947} Exquisite (5/5)"}
                        {rating === 4 && "\u2B50 Highly Pleased (4/5)"}
                        {rating === 3 && "\u{1F44C} Moderate Setup (3/5)"}
                        {rating === 2 && "\u26A0\uFE0F Needs Attention (2/5)"}
                        {rating === 1 && "\u{1F6A8} Displeasing (1/5)"}
                      </span>
                    </div>
                  </div>

                  {
    /* Message Critique Box */
  }
                  <div className="space-y-1.5">
                    <label className="text-stone-400 font-mono tracking-wider uppercase text-[10px]">Your Critique Message *</label>
                    <textarea
    required
    rows={4}
    placeholder="Comment on premium flavor balance, tarragon seasonings, waiter hospitality, Spogmai Plaza parking or birthday suite coordination..."
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    className="w-full px-4 py-3 bg-stone-950/60 border border-white/5 focus:border-gold-400/50 rounded-none text-white focus:outline-none focus:ring-1 focus:ring-gold-400/50 leading-relaxed font-sans"
  />
                  </div>

                  {
    /* Optional Image upload / drop area */
  }
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-white/5 pt-6">
                    
                    {
    /* Presets selection */
  }
                    <div className="md:col-span-4 space-y-2">
                      <label className="text-stone-400 font-mono tracking-wider uppercase text-[10px] block">Or Associated Dish Photo</label>
                      <div className="grid grid-cols-2 gap-2">
                        {PRESET_DISH_IMAGES.map((img) => <div
    key={img.name}
    onClick={() => {
      setSelectedPresetImage(img.url);
      setUploadedBase64Image("");
    }}
    className={`relative aspect-[4/3] rounded-none overflow-hidden cursor-pointer border hover:border-gold-400/40 transition-all ${selectedPresetImage === img.url ? "border-gold-400 ring-1 ring-gold-400" : "border-white/5"}`}
  >
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover filter brightness-[0.6] hover:brightness-[1]" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-stone-950/20" />
                            <div className="absolute bottom-1 left-1.5 text-[8px] uppercase tracking-wide text-white bg-stone-950/80 px-1 py-0.5 max-w-full truncate leading-none">
                              {img.name}
                            </div>
                            {selectedPresetImage === img.url && <div className="absolute top-1 right-1 p-0.5 bg-gold-400 text-stone-950">
                                <Check className="w-2 h-2 stroke-[4]" />
                              </div>}
                          </div>)}
                      </div>
                    </div>

                    {
    /* File Drop Area */
  }
                    <div className="md:col-span-8 space-y-2 flex flex-col justify-between">
                      <label className="text-stone-400 font-mono tracking-wider uppercase text-[10px] block">Upload Own Culinary Photo (Optional)</label>
                      
                      <div
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    onClick={() => fileInputRef.current?.click()}
    className={`flex-grow border border-dashed rounded-none transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer min-h-[105px] ${isDragging ? "border-gold-400 bg-gold-400/5 text-gold-400" : uploadedBase64Image ? "border-emerald-500/40 bg-emerald-500/[0.02]" : "border-white/10 hover:border-gold-400/30"}`}
  >
                        <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileSelect}
    accept="image/*"
    className="hidden"
  />

                        {uploadedBase64Image ? <div className="flex items-center space-x-3 text-left w-full h-full max-h-[80px]">
                            <img src={uploadedBase64Image} alt="Uploaded display" className="w-16 h-12 object-cover border border-emerald-500/20" referrerPolicy="no-referrer" />
                            <div className="flex-grow">
                              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Photo Configured!
                              </span>
                              <p className="text-[9px] text-stone-500 uppercase mt-0.5">Will be saved to database</p>
                            </div>
                            <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      setUploadedBase64Image("");
    }}
    className="p-1.5 bg-stone-900 border border-white/5 hover:text-red-400"
    title="Clear Upload"
  >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div> : selectedPresetImage ? <div className="flex items-center space-x-3 text-left w-full h-full max-h-[80px]">
                            <img src={selectedPresetImage} alt="Preset display" className="w-16 h-12 object-cover border border-gold-400/20" referrerPolicy="no-referrer" />
                            <div className="flex-grow">
                              <span className="text-[10px] font-mono text-gold-400 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Preset Associated!
                              </span>
                              <p className="text-[9px] text-stone-500 uppercase mt-0.5">Signature plate link card</p>
                            </div>
                            <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      setSelectedPresetImage("");
    }}
    className="p-1.5 bg-stone-900 border border-white/5 hover:text-red-400"
    title="Clear Preset"
  >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div> : <>
                            <Upload className="w-5 h-5 text-stone-500 group-hover:text-gold-400 mb-1.5 shrink-0" />
                            <p className="text-[10px] font-bold text-stone-300">Drag & Drop Culinary snapshot here *</p>
                            <p className="text-[9px] text-stone-500 mt-0.5 uppercase tracking-tight">Or tap to scan files (JPEG/PNG, Max 3MB)</p>
                          </>}
                      </div>
                    </div>

                  </div>

                  {
    /* Errors block */
  }
                  {formError && <div className="p-3.5 bg-red-950/20 border border-red-500/20 text-red-400 font-mono font-bold leading-none">
                      ⚠️ {formError}
                    </div>}

                  {
    /* Submit button bar */
  }
                  <div className="border-t border-white/5 pt-6 flex justify-end">
                    <button
    type="submit"
    disabled={submitting}
    className="px-8 py-3.5 rounded-none bg-gold-400 hover:bg-gold-500 disabled:bg-stone-800 text-stone-950 font-bold tracking-wider uppercase flex items-center space-x-2 cursor-pointer transition-all"
  >
                      <span>{submitting ? "Publishing Critique..." : "Transmit Verified Critique"}</span>
                    </button>
                  </div>

                </motion.form>}
            </AnimatePresence>
          </div>

        </div>

        {
    /* 4. PUBLIC CARDS GRID WITH RATING CATEGORY FILTER */
  }
        <div className="border-t border-white/5 pt-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
            <div>
              <span className="text-[10px] font-mono text-gold-400 tracking-wider uppercase">Diner Journals</span>
              <h3 className="font-serif text-white text-xl sm:text-2xl font-bold uppercase mt-1 tracking-wide">
                Diner Memoirs <span className="text-gold-400 italic">Archive</span>
              </h3>
            </div>

            {
    /* Filtering buttons */
  }
            <div className="flex flex-wrap gap-1.5 text-xs text-stone-400 font-mono">
              <span className="flex items-center text-[10px] md:mr-2 uppercase tracking-wide"><Filter className="w-3.5 h-3.5 mr-1 text-gold-400" /> Filter rating:</span>
              {[
    { label: "All Reviews", val: "all" },
    { label: "5\u2605 Only", val: "5" },
    { label: "4\u2605 Only", val: "4" },
    { label: "3\u2605 or lower", val: "3_lower" }
  ].map((btn) => {
    let active = false;
    if (btn.val === "all") active = activeFilter === "all";
    else if (btn.val === "5") active = activeFilter === "5";
    else if (btn.val === "4") active = activeFilter === "4";
    else active = ["1", "2", "3"].includes(activeFilter);
    return <button
      key={btn.val}
      onClick={() => {
        if (btn.val === "all" || btn.val === "5" || btn.val === "4") {
          setActiveFilter(btn.val);
        } else {
          setActiveFilter("3");
        }
      }}
      className={`px-3.5 py-1.5 border hover:border-gold-400/30 uppercase tracking-tight transition-all text-[10px] font-bold rounded-none cursor-pointer ${active ? "bg-gold-400 border-gold-400 text-stone-950" : "bg-stone-950 border-white/5 text-stone-300"}`}
    >
                    {btn.label}
                  </button>;
  })}
            </div>
          </div>

          {
    /* Cards Portfolio Display grid */
  }
          {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <div key={i} className="glass-panel h-64 rounded-none shimmer-active" />)}
            </div> : filteredReviews.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((rev) => {
    const initials = rev.name ? rev.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "G";
    return <motion.div
      key={rev.id}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border border-white/5 bg-[#0d0d0d] hover:border-gold-400/20 transition-all duration-300 flex flex-col justify-between group rounded-none"
    >
                    <div>
                      {
      /* Sub card image header if review has a food shot associated */
    }
                      {rev.image && <div className="aspect-[16/8] overflow-hidden border-b border-white/5 relative bg-stone-900">
                          <img
      src={rev.image}
      alt={`${rev.name}'s dish snapshot`}
      className="w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-95 group-hover:scale-105 transition-all duration-700"
      referrerPolicy="no-referrer"
    />
                          <div className="absolute top-2 left-2 bg-stone-900/90 border border-gold-400/20 px-2 py-0.5 text-[8px] uppercase tracking-widest text-gold-400 font-mono">
                            Associated Dish Shot
                          </div>
                        </div>}

                      {
      /* Content block */
    }
                      <div className="p-6">
                        
                        {
      /* Rating block & verification */
    }
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-0.5 text-gold-400">
                            {Array.from({ length: 5 }).map((_, i) => {
      const isFilled = i < rev.rating;
      return <Star
        key={i}
        className={`w-3.5 h-3.5 ${isFilled ? "fill-gold-400 text-gold-400" : "text-stone-850"}`}
      />;
    })}
                          </div>

                          <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 uppercase tracking-wider rounded-none ">
                            ✓ Verified Guest
                          </span>
                        </div>

                        {
      /* Review text message */
    }
                        <p className="text-stone-300 font-serif italic text-xs leading-relaxed line-clamp-4 group-hover:text-white transition-colors">
                          "{rev.message || rev.comment}"
                        </p>

                      </div>
                    </div>

                    {
      /* Bottom footer credit */
    }
                    <div className="px-6 pb-6 pt-4 border-t border-white/[0.02] flex items-center space-x-3 mt-auto">
                      {
      /* Round Initials Avatar */
    }
                      <div className="w-8 h-8 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center font-serif text-gold-400 text-xs font-bold leading-none shrink-0">
                        {initials}
                      </div>

                      <div className="min-w-0 flex-grow">
                        <h4 className="font-serif text-white font-bold text-xs uppercase tracking-wide truncate">
                          {rev.name}
                        </h4>
                        <div className="flex items-center space-x-1.5 mt-0.5 font-mono text-[9px] text-stone-500 uppercase">
                          <span className="truncate">{rev.role || "Patron"}</span>
                          <span>•</span>
                          <span>{rev.date || (rev.createdAt ? rev.createdAt.split("T")[0] : "2026-06-17")}</span>
                        </div>
                      </div>
                    </div>

                  </motion.div>;
  })}
            </div> : <div className="text-center py-20 bg-stone-950 border border-white/5 rounded-0 max-w-sm mx-auto">
              <ImageIcon className="w-10 h-10 text-stone-600 mx-auto" />
              <h4 className="font-serif text-white text-md font-semibold mt-4">No Reviews Found</h4>
              <p className="text-stone-450 text-xs mt-2">No approved reviews match the selected filter score.</p>
            </div>}
        </div>

      </div>
    </section>;
}

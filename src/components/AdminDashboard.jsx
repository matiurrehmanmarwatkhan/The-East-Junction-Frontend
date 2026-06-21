import { useState, useEffect } from "react";
import {
  Lock,
  Trash2,
  Calendar,
  Star,
  MessageSquare,
  PlusCircle,
  Grid,
  Database,
  Users,
  UtensilsCrossed,
  CheckCircle,
  XCircle,
  LogOut,
  Sparkles,
  RefreshCw,
  Image,
  Edit,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
export default function AdminDashboard({ loginAdmin, logoutAdmin, isAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("stats");
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);

  // File upload states
  const [menuFile, setMenuFile] = useState(null);
  const [eventFile, setEventFile] = useState(null);
  const [galleryFile, setGalleryFile] = useState(null);

  // Editing state variables
  const [editingMenu, setEditingMenu] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingGallery, setEditingGallery] = useState(null);

  const [reviewRatingFilter, setReviewRatingFilter] = useState("all");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    reservationsCount: 0,
    pendingReservations: 0,
    menuItemsCount: 0,
    reviewsCount: 0,
    messagesCount: 0,
  });
  const [menuForm, setMenuForm] = useState({
    name: "",
    description: "",
    price: "",
    categorySlug: "burgers",
    image: "",
    isFeatured: false,
    tags: "",
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    icon: "Grid",
  });
  const [eventForm, setEventForm] = useState({
    name: "",
    description: "",
    pricePerPerson: "",
    image: "",
    exclusions: "",
    popular: false,
  });
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "dishes",
    url: "",
  });
  const [refreshing, setRefreshing] = useState(false);

  // Authenticated fetch helper
  const fetchWithAuth = (url, options = {}) => {
    const token = localStorage.getItem("TEJ_ADMIN_TOKEN");
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  };

  const fetchAllAdminData = async () => {
    if (!isAdmin) return;
    setRefreshing(true);
    try {
      const [cats, items, resvs, revs, msgs, evts, statsInfo, galleryData] =
        await Promise.all([
          fetchWithAuth("/api/categories").then((res) => res.json()),
          fetchWithAuth("/api/menu").then((res) => res.json()),
          fetchWithAuth("/api/reservations").then((res) => res.json()),
          fetchWithAuth("/api/reviews").then((res) => res.json()),
          fetchWithAuth("/api/messages").then((res) => res.json()),
          fetchWithAuth("/api/events").then((res) => res.json()),
          fetchWithAuth("/api/stats").then((res) => res.json()),
          fetchWithAuth("/api/gallery").then((res) => res.json()),
        ]);
      setCategories(cats);
      setMenuItems(items);
      setReservations(resvs);
      setReviews(revs);
      setMessages(msgs);
      setEvents(evts);
      setStats(statsInfo);
      setGallery(galleryData);
    } catch (err) {
      console.error("Failed to sync backend datasets in Admin Dashboard:", err);
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchAllAdminData();
  }, [isAdmin]);
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        loginAdmin(data.token);
      } else {
        setLoginError(data.message || "Invalid system credentials.");
      }
    } catch {
      setLoginError("Failed to communicate with Express auth engine.");
    }
  };
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!menuForm.name || !menuForm.price) return;
    try {
      const parsedTags =
        typeof menuForm.tags === "string"
          ? menuForm.tags.split(",").map((t) => t.trim())
          : Array.isArray(menuForm.tags)
            ? menuForm.tags
            : [];
      const formData = new FormData();
      formData.append("name", menuForm.name);
      formData.append("description", menuForm.description);
      formData.append("price", menuForm.price);
      formData.append("categorySlug", menuForm.categorySlug);
      formData.append("isFeatured", menuForm.isFeatured);
      formData.append("tags", JSON.stringify(parsedTags));
      if (menuFile) {
        formData.append("image", menuFile);
      } else {
        formData.append("image", menuForm.image);
      }

      const url = editingMenu ? `/api/menu/${editingMenu}` : "/api/menu";
      const method = editingMenu ? "PUT" : "POST";

      const response = await fetchWithAuth(url, {
        method,
        body: formData,
      });
      if (response.ok) {
        setMenuForm({
          name: "",
          description: "",
          price: "",
          categorySlug: categories[0]?.slug || "burgers",
          image: "",
          isFeatured: false,
          tags: "",
        });
        setMenuFile(null);
        setEditingMenu(null);
        fetchAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteMenu = async (id) => {
    if (!confirm("Confirm excision of this gourmet asset?")) return;
    try {
      await fetchWithAuth(`/api/menu/${id}`, { method: "DELETE" });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleToggleFeatured = async (item) => {
    try {
      await fetchWithAuth(`/api/menu/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !item.isFeatured }),
      });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.slug) return;
    try {
      const response = await fetchWithAuth("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });
      if (response.ok) {
        setCategoryForm({ name: "", slug: "", icon: "Grid" });
        fetchAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteCategory = async (id) => {
    if (!confirm("Excising a category might leave dishes isolated. Proceed?"))
      return;
    try {
      await fetchWithAuth(`/api/categories/${id}`, { method: "DELETE" });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleUpdateReservation = async (id, status) => {
    try {
      await fetchWithAuth(`/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteReservation = async (id) => {
    if (!confirm("Excise this booking slot forever?")) return;
    try {
      await fetchWithAuth(`/api/reservations/${id}`, { method: "DELETE" });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleApproveReview = async (id) => {
    try {
      await fetchWithAuth(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleRejectReview = async (id) => {
    try {
      await fetchWithAuth(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteReview = async (id) => {
    try {
      await fetchWithAuth(`/api/reviews/${id}`, { method: "DELETE" });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleMarkMessageRead = async (id) => {
    try {
      await fetchWithAuth(`/api/messages/${id}`, { method: "PUT" });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteMessage = async (id) => {
    try {
      await fetchWithAuth(`/api/messages/${id}`, { method: "DELETE" });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.name || !eventForm.pricePerPerson) return;
    try {
      const parsedIncls = eventForm.exclusions
        ? eventForm.exclusions
            .split("\n")
            .map((i) => i.trim())
            .filter(Boolean)
        : [];
      const formData = new FormData();
      formData.append("name", eventForm.name);
      formData.append("description", eventForm.description);
      formData.append("pricePerPerson", eventForm.pricePerPerson);
      formData.append("popular", eventForm.popular);
      formData.append("exclusions", JSON.stringify(parsedIncls));
      if (eventFile) {
        formData.append("image", eventFile);
      } else {
        formData.append("image", eventForm.image);
      }

      const url = editingEvent ? `/api/events/${editingEvent}` : "/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const response = await fetchWithAuth(url, {
        method,
        body: formData,
      });
      if (response.ok) {
        setEventForm({
          name: "",
          description: "",
          pricePerPerson: "",
          image: "",
          exclusions: "",
          popular: false,
        });
        setEventFile(null);
        setEditingEvent(null);
        fetchAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteEvent = async (id) => {
    if (!confirm("Abolish this birthday celebration suite structure?")) return;
    try {
      await fetchWithAuth(`/api/events/${id}`, { method: "DELETE" });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleAddGallery = async (e) => {
    e.preventDefault();
    if (!galleryForm.title) return;
    try {
      const formData = new FormData();
      formData.append("title", galleryForm.title);
      formData.append("category", galleryForm.category);
      if (galleryFile) {
        formData.append("image", galleryFile);
      } else {
        formData.append("url", galleryForm.url);
      }

      const url = editingGallery
        ? `/api/gallery/${editingGallery}`
        : "/api/gallery";
      const method = editingGallery ? "PUT" : "POST";

      const response = await fetchWithAuth(url, {
        method,
        body: formData,
      });
      if (response.ok) {
        setGalleryForm({ title: "", category: "dishes", url: "" });
        setGalleryFile(null);
        setEditingGallery(null);
        fetchAllAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditMenuClick = (item) => {
    setEditingMenu(item.id);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      categorySlug: item.categorySlug,
      image: item.image,
      isFeatured: item.isFeatured,
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
    });
  };

  const handleCancelEditMenu = () => {
    setEditingMenu(null);
    setMenuForm({
      name: "",
      description: "",
      price: "",
      categorySlug: categories[0]?.slug || "burgers",
      image: "",
      isFeatured: false,
      tags: "",
    });
    setMenuFile(null);
  };

  const handleEditEventClick = (e) => {
    setEditingEvent(e.id);
    setEventForm({
      name: e.name,
      description: e.description,
      pricePerPerson: e.pricePerPerson.toString(),
      image: e.image,
      exclusions: Array.isArray(e.inclusions)
        ? e.inclusions.join("\n")
        : e.exclusions || "",
      popular: e.popular || false,
    });
  };

  const handleCancelEditEvent = () => {
    setEditingEvent(null);
    setEventForm({
      name: "",
      description: "",
      pricePerPerson: "",
      image: "",
      exclusions: "",
      popular: false,
    });
    setEventFile(null);
  };

  const handleEditGalleryClick = (g) => {
    setEditingGallery(g.id);
    setGalleryForm({
      title: g.title,
      category: g.category,
      url: g.url,
    });
  };

  const handleCancelEditGallery = () => {
    setEditingGallery(null);
    setGalleryForm({
      title: "",
      category: "dishes",
      url: "",
    });
    setGalleryFile(null);
  };
  const handleDeleteGallery = async (id) => {
    if (!confirm("Exterminate this gallery portrait record?")) return;
    try {
      await fetchWithAuth(`/api/gallery/${id}`, { method: "DELETE" });
      fetchAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };
  if (!isAdmin) {
    return (
      <section
        id="admin-login-p"
        className="bg-stone-950 min-h-screen pt-32 pb-24 flex items-center justify-center text-stone-300"
      >
        <div className="max-w-md w-full px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 rounded-2xl border border-amber-500/20 shadow-2xl bg-stone-900/60 text-center"
          >
            <div className="relative w-12 h-12 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-6">
              <Lock className="w-6 h-6" />
            </div>

            <p className="text-xs font-mono tracking-widest text-[#d09733] uppercase">
              Authorized Entry Only
            </p>
            <h3 className="font-serif text-2xl text-white font-bold mt-1">
              Staff Administration Portal
            </h3>
            <p className="text-stone-500 text-[11px] mt-2 mb-8 leading-relaxed">
              Unlock database models to configure pricing, accept table
              bookings, review messages, and Moderate diner testimonials.
            </p>

            <form
              onSubmit={handleLoginSubmit}
              className="space-y-4 text-xs text-left"
            >
              <div className="space-y-2">
                <label className="text-stone-400 font-semibold uppercase tracking-wider">
                  Account name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mati Ur Rehman"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded text-white glass-input text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-stone-400 font-semibold uppercase tracking-wider">
                  Passphrase
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded text-white glass-input text-xs font-mono"
                />
              </div>

              {loginError && (
                <div className="p-3.5 rounded border border-red-500/20 bg-red-950/20 text-red-400 font-bold font-mono">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4.5 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-sans font-bold text-xs tracking-widest uppercase rounded shadow-lg translate-y-2 transition-transform cursor-pointer"
              >
                Authenticate Session
              </button>
            </form>

            {/* <p className="text-[10px] text-stone-600 font-mono mt-12 uppercase">
        Demonstrator credentials: <br className="sm:hidden" />
        <strong>Mati Ur Rehman</strong> / <strong>Sasuke Uchiha</strong>
      </p> */}
          </motion.div>
        </div>
      </section>
    );
  }
  return (
    <section
      id="admin-control-desk"
      className="bg-stone-950 min-h-screen pt-32 pb-24 text-stone-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper Brand panel & Exit control */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-stone-900/40 border border-stone-850 p-6 rounded-xl gap-4 mb-8">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded border border-amber-500/20 flex items-center justify-center text-amber-500 bg-stone-950">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-white font-bold uppercase tracking-wider">
                TEJ Control Center
              </h2>
              <p className="text-stone-500 text-[10px] font-mono uppercase">
                Full MERN API Persistence Connected
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={fetchAllAdminData}
              disabled={refreshing}
              className="p-3 rounded border border-stone-800 hover:border-amber-500/40 cursor-pointer text-stone-400 hover:text-amber-400 bg-stone-950/40 transition-all flex items-center justify-center"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>

            <button
              onClick={logoutAdmin}
              className="px-4 py-2.5 rounded border cursor-pointer border-red-500/20 bg-red-950/20 text-red-400 font-bold font-mono text-xs uppercase hover:bg-red-950/40 transition-colors flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Port</span>
            </button>
          </div>
        </div>

        {/* Dynamic Sidebar Nav Tabs & Workspaces */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation drawer */}
          <div className="lg:col-span-3 space-y-2">
            {[
              {
                label: "Dashboard Intel",
                key: "stats",
                icon: <Sparkles className="w-4 h-4" />,
              },
              {
                label: "Manage Menu",
                key: "menu",
                icon: <UtensilsCrossed className="w-4 h-4" />,
              },
              {
                label: "Food Categories",
                key: "categories",
                icon: <Grid className="w-4 h-4" />,
              },
              {
                label: "Bookings",
                key: "reservations",
                icon: <Calendar className="w-4 h-4" />,
              },
              {
                label: "Review Approvals",
                key: "reviews",
                icon: <Star className="w-4 h-4" />,
              },
              {
                label: "Messages Inbox",
                key: "messages",
                icon: <MessageSquare className="w-4 h-4" />,
              },
              {
                label: "Celebrate Packages",
                key: "events",
                icon: <PlusCircle className="w-4 h-4" />,
              },
              {
                label: "Manage Gallery",
                key: "gallery",
                icon: <Image className="w-4 h-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full text-left px-4 py-3.5 rounded text-lg cursor-pointer font-semibold uppercase tracking-wider flex items-center space-x-3 transition-colors ${activeTab === tab.key ? "bg-amber-500 text-stone-950 font-bold border-l-4 border-amber-600" : "bg-stone-900/40 border border-stone-850 text-stone-300 hover:bg-stone-900 hover:text-amber-400"}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Core Workspace board */}
          <div className="lg:col-span-9 glass-panel rounded-xl border border-stone-850 p-6 sm:p-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* STATUS OVERVIEW TAB */}
              {activeTab === "stats" && (
                <motion.div
                  key="stats-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 text-left"
                >
                  <h3 className="font-serif text-white text-lg font-bold uppercase tracking-wider border-b border-stone-850 pb-3">
                    Database Telemetry & Live Indexes
                  </h3>

                  {/* Stats Grid */}
                  {(() => {
                    const approvedLiveReviews = reviews.filter(
                      (r) => r.status === "approved" || r.isApproved === true,
                    );
                    const avgScoreText =
                      approvedLiveReviews.length > 0
                        ? (
                            approvedLiveReviews.reduce(
                              (sum, r) => sum + r.rating,
                              0,
                            ) / approvedLiveReviews.length
                          ).toFixed(1)
                        : "5.0";
                    const pendingRevsCount = reviews.filter(
                      (r) => r.status === "pending" || !r.isApproved,
                    ).length;
                    return (
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="bg-stone-950/60 border border-stone-850 rounded-xl p-5 relative overflow-hidden group hover:border-[#d09733]/30 transition-all">
                          <span className="text-3xl font-mono text-white font-extrabold">
                            {stats.reservationsCount}
                          </span>
                          <p className="text-sky-500 text-[12px] font-mono tracking-widest uppercase mt-2">
                            Total Bookings
                          </p>
                          <div className="absolute right-3 top-3 text-stone-900 group-hover:text-amber-500/10 transition-colors">
                            <Calendar className="w-8 h-8 text-[#d09733]" />
                          </div>
                        </div>

                        <div className="bg-stone-950/60 border border-stone-880 rounded-xl p-5 relative overflow-hidden group hover:border-[#d09733]/30 transition-all">
                          <span className="text-3xl font-mono text-amber-400 font-extrabold">
                            {stats.pendingReservations}
                          </span>
                          <p className="text-sky-500 text-[12px] font-mono tracking-widest uppercase mt-2">
                            Unresolved Slots
                          </p>
                          <div className="absolute right-3 top-3 text-stone-900">
                            <Users className="w-8 h-8 text-[#d09733]" />
                          </div>
                        </div>

                        <div className="bg-stone-950/60 border border-stone-850 rounded-xl p-5 relative overflow-hidden group hover:border-[#d09733]/30 transition-all">
                          <span className="text-3xl font-mono text-white font-extrabold">
                            {stats.menuItemsCount}
                          </span>
                          <p className="text-sky-500 text-[12px] font-mono tracking-widest uppercase mt-2">
                            Active Dishes
                          </p>
                          <div className="absolute right-3 top-3 text-stone-900">
                            <UtensilsCrossed className="w-8 h-8 text-[#d09733]" />
                          </div>
                        </div>

                        <div className="bg-stone-950/60 border border-stone-850 rounded-xl p-5 relative overflow-hidden group hover:border-[#d09733]/30 transition-all">
                          <span className="text-3xl font-mono text-white font-extrabold">
                            {reviews.length}
                          </span>
                          <p className="text-sky-500 text-[12px] font-mono tracking-widest uppercase mt-2">
                            Total Reviews
                          </p>
                          <div className="absolute right-3 top-3 text-stone-900">
                            <Star className="w-8 h-8 text-[#d09733]" />
                          </div>
                        </div>

                        <div className="bg-stone-950/60 border border-[#d09733]/20 rounded-xl p-5 relative overflow-hidden group hover:border-[#d09733]/45 transition-all">
                          <span className="text-3xl font-mono text-amber-400 font-extrabold">
                            {avgScoreText} ★
                          </span>
                          <p className="text-sky-500 text-[12px] font-mono tracking-widest uppercase mt-2">
                            Average Star Rating
                          </p>
                          <div className="absolute right-3 top-3 text-[#d09733]/15">
                            <Star className="w-8 h-8 fill-current text-[#d09733]" />
                          </div>
                        </div>

                        <div className="bg-stone-950/60 border border-stone-850 rounded-xl p-5 relative overflow-hidden group hover:border-[#d09733]/30 transition-all">
                          <span className="text-3xl font-mono text-white font-extrabold">
                            {stats.messagesCount}
                          </span>
                          <p className="text-sky-500 text-[12px] font-mono tracking-widest uppercase mt-2">
                            Visitor Inquiries
                          </p>
                          <div className="absolute right-3 top-3 text-stone-900">
                            <MessageSquare className="w-8 h-8 text-[#d09733]" />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Diagnostic details */}
                  <div className="p-6 bg-stone-950/40 rounded-xl border border-stone-850">
                    <h4 className="font-serif text-amber-400 font-bold uppercase tracking-wider text-xs">
                      Architectural Persistence diagnostics
                    </h4>
                    <p className="text-stone-450 text-xs leading-relaxed mt-2">
                      The service is running in **Active Fullstack Mode**. All
                      categories, diner reservations, message logs, and dish
                      edits are actively encoded in filesystem JSON drivers
                      (`server-db.json`) immediately. Changes will persist
                      dynamically across page reloads.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* MANAGE MENU CRUD TAB */}
              {activeTab === "menu" && (
                <motion.div
                  key="menu-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 text-left"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-850 pb-4">
                    <h3 className="font-serif text-white text-lg font-bold uppercase tracking-wider">
                      Configure Gourmet Dishes
                    </h3>
                    <span className="text-stone-500 text-[10px] font-mono tracking-widest uppercase">
                      {menuItems.length} active menu objects
                    </span>
                  </div>

                  {/* Add/Edit dish form */}
                  <form
                    onSubmit={handleAddMenuItem}
                    className="bg-stone-950/40 border border-[#d09733]/30 rounded-xl p-6 space-y-4 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif text-[#d09733] font-bold uppercase tracking-widest text-xs">
                        {editingMenu
                          ? "Edit Gourmet Item"
                          : "Add New Gourmet Item"}
                      </h4>
                      {editingMenu && (
                        <button
                          type="button"
                          onClick={handleCancelEditMenu}
                          className="px-3 py-1 bg-stone-900 border border-stone-800 hover:border-red-500/40 hover:text-red-400 transition-all text-[10px] uppercase font-mono cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-stone-400 font-mono text-[9px] uppercase">
                          Dish Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sizzling Ribeye"
                          value={menuForm.name}
                          onChange={(e) =>
                            setMenuForm({ ...menuForm, name: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-stone-400 font-mono text-[9px] uppercase">
                          Price (PKR)
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 1950"
                          value={menuForm.price}
                          onChange={(e) =>
                            setMenuForm({ ...menuForm, price: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-stone-400 font-mono text-[9px] uppercase">
                          Category Slug
                        </label>
                        <select
                          value={menuForm.categorySlug}
                          onChange={(e) =>
                            setMenuForm({
                              ...menuForm,
                              categorySlug: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-stone-400 font-mono text-[9px] uppercase">
                          Photo Upload / URL
                        </label>
                        <div className="flex flex-col space-y-1.5">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setMenuFile(e.target.files[0])}
                            className="w-full px-3.5 py-1.5 rounded text-white glass-input text-xs"
                          />
                          <input
                            type="url"
                            placeholder="Or paste image URL"
                            value={menuForm.image}
                            onChange={(e) =>
                              setMenuForm({
                                ...menuForm,
                                image: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-stone-400 font-mono text-[9px] uppercase">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="Chef Special, Best Seller, Hot"
                          value={menuForm.tags}
                          onChange={(e) =>
                            setMenuForm({ ...menuForm, tags: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-stone-400 font-mono text-[9px] uppercase">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="Detailed ingredients and culinary process descriptors..."
                        value={menuForm.description}
                        onChange={(e) =>
                          setMenuForm({
                            ...menuForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={menuForm.isFeatured}
                        onChange={(e) =>
                          setMenuForm({
                            ...menuForm,
                            isFeatured: e.target.checked,
                          })
                        }
                        className="rounded border-stone-800 bg-stone-900 text-amber-500 focus:ring-amber-500 w-4 h-4"
                      />
                      <label
                        htmlFor="isFeatured"
                        className="text-stone-300 select-none"
                      >
                        Mark Feature Highlights (appears on home page slider)
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase tracking-wider rounded cursor-pointer"
                    >
                      {editingMenu
                        ? "Save Gourmet Changes"
                        : "Publish Culinary Asset"}
                    </button>
                  </form>

                  {/* Dishes audit Table list */}
                  <div className="overflow-x-auto border border-stone-850 rounded-xl bg-stone-950/20">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-stone-950 border-b border-stone-850 text-stone-500 font-mono uppercase text-[9px] tracking-wider">
                        <tr>
                          <th className="p-4">Dishes description</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-900 leading-normal">
                        {menuItems.map((item) => (
                          <tr key={item.id} className="hover:bg-stone-900/40">
                            <td className="p-4 flex items-center space-x-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <h5 className="font-bold text-white uppercase">
                                  {item.name}
                                </h5>
                                <p className="text-stone-500 text-[10px] line-clamp-1 max-w-[200px]">
                                  {item.description}
                                </p>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-[10px] text-stone-400 uppercase">
                              {item.categorySlug}
                            </td>
                            <td className="p-4 font-mono text-[#d09733] font-bold">
                              {item.price} PKR
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleToggleFeatured(item)}
                                className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${item.isFeatured ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-stone-900 text-stone-500"}`}
                              >
                                {item.isFeatured ? "Featured" : "Standard"}
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex justify-center space-x-1">
                                <button
                                  type="button"
                                  onClick={() => handleEditMenuClick(item)}
                                  className="text-stone-500 hover:text-amber-400 p-2 cursor-pointer"
                                  title="Edit Item"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMenu(item.id)}
                                  className="text-stone-500 hover:text-red-400 p-2 cursor-pointer"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* MANAGE CATEGORIES TAB */}
              {activeTab === "categories" && (
                <motion.div
                  key="categories-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 text-left"
                >
                  <h3 className="font-serif text-white text-lg font-bold uppercase tracking-wider border-b border-stone-850 pb-3">
                    Food & Beverage Classifications
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Add Category Form */}
                    <form
                      onSubmit={handleAddCategory}
                      className="bg-stone-950/40 border border-stone-850 p-6 rounded-xl space-y-4 text-xs"
                    >
                      <h4 className="font-serif text-amber-400 font-bold uppercase tracking-wider">
                        Append New Category
                      </h4>

                      <div className="space-y-1">
                        <label className="text-stone-400 font-mono text-[9px]">
                          Category name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sizzling Chinese"
                          value={categoryForm.name}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              name: e.target.value,
                              slug: e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "-"),
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-stone-400 font-mono text-[9px]">
                          Custom Slug path (auto)
                        </label>
                        <input
                          type="text"
                          required
                          value={categoryForm.slug}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              slug: e.target.value.toLowerCase(),
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-stone-400 font-mono text-[9px]">
                          Visual Menu Icon
                        </label>
                        <select
                          value={categoryForm.icon}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              icon: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                        >
                          <option value="ChefHat">
                            ChefHat Icon (Steaks, Mutton)
                          </option>
                          <option value="Pizza">Pizza Icon</option>
                          <option value="Flame">
                            Flame Icon (Chinese, Spicy)
                          </option>
                          <option value="Beef">
                            Beef Icon (Burgers, Grills)
                          </option>
                          <option value="Wine">
                            Wine Icon (Drinks, Cooler Mocktails)
                          </option>
                          <option value="IceCream">
                            IceCream Icon (Dessert, Kulfi)
                          </option>
                          <option value="UtensilsCrossed">
                            Utensils Icon (Platters)
                          </option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-amber-500 text-stone-950 font-bold uppercase tracking-wider rounded"
                      >
                        Register Category
                      </button>
                    </form>

                    {/* Category List */}
                    <div className="border border-stone-850 rounded-xl overflow-hidden bg-stone-950/20">
                      <div className="bg-stone-950 p-4 border-b border-stone-850 font-mono text-[9px] uppercase text-stone-500 tracking-wider">
                        Categories registries
                      </div>
                      <div className="divide-y divide-stone-900">
                        {categories.map((c) => (
                          <div
                            key={c.id}
                            className="p-4 flex items-center justify-between text-xs hover:bg-stone-900/20"
                          >
                            <div>
                              <strong className="text-white uppercase font-sans">
                                {c.name}
                              </strong>
                              <p className="text-stone-500 font-mono text-[9px] uppercase mt-0.5">
                                Slug: {c.slug} | Icon: {c.icon}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteCategory(c.id)}
                              className="text-stone-500 hover:text-red-400 p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* RESERVATIONS LEDGER TAB */}
              {activeTab === "reservations" && (
                <motion.div
                  key="reservations-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 text-left"
                >
                  <h3 className="font-serif text-white text-lg font-bold uppercase tracking-wider border-b border-stone-850 pb-3">
                    Table Reservations Ledger
                  </h3>

                  {reservations.length > 0 ? (
                    <div className="overflow-x-auto border border-stone-850 rounded-xl bg-stone-950/20">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-stone-950 border-b border-stone-850 text-stone-500 font-mono uppercase text-[9px] tracking-wider">
                          <tr>
                            <th className="p-4">Diner Detail</th>
                            <th className="p-4">Time slots</th>
                            <th className="p-4">Capacity</th>
                            <th className="p-4">Special Requests</th>
                            <th className="p-4">Verification</th>
                            <th className="p-4 text-center">Excise</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-900">
                          {reservations.map((r) => (
                            <tr key={r.id} className="hover:bg-stone-900/40">
                              <td className="p-4">
                                <strong className="text-white uppercase font-sans">
                                  {r.name}
                                </strong>
                                <p className="text-stone-500 font-mono text-[10px] mt-0.5">
                                  {r.phone}
                                </p>
                                <p className="text-stone-500 text-[10px]">
                                  {r.email}
                                </p>
                              </td>
                              <td className="p-4">
                                <span className="text-amber-400 font-mono font-bold block">
                                  {r.date}
                                </span>
                                <span className="text-stone-400 font-mono font-medium text-[10px] block mt-0.5">
                                  {r.time}
                                </span>
                              </td>
                              <td className="p-4 font-mono font-bold text-white text-center sm:text-left">
                                {r.guests} Pax
                              </td>
                              <td className="p-4">
                                <p className="max-w-[200px] text-stone-400 break-words italic text-[11px] leading-relaxed">
                                  {r.specialRequest || "None requested."}
                                </p>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2 ${r.status === "confirmed" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : r.status === "cancelled" ? "bg-red-500/15 text-red-400 border border-red-500/20" : "bg-amber-500/15 text-amber-400 border border-amber-500/20"}`}
                                >
                                  {r.status}
                                </span>

                                <div className="flex space-x-1">
                                  {r.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleUpdateReservation(
                                            r.id,
                                            "confirmed",
                                          )
                                        }
                                        className="text-emerald-400 hover:bg-emerald-500/10 p-1 border border-emerald-500/20 rounded"
                                        title="Approve Table"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleUpdateReservation(
                                            r.id,
                                            "cancelled",
                                          )
                                        }
                                        className="text-red-400 hover:bg-red-500/10 p-1 border border-red-500/20 rounded"
                                        title="Cancel Seating"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleDeleteReservation(r.id)}
                                  className="text-stone-500 hover:text-red-400 p-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-stone-500 py-12">
                      No active reservations recorded.
                    </p>
                  )}
                </motion.div>
              )}

              {/* REVIEW MODERATION QUEUE TAB */}
              {activeTab === "reviews" &&
                (() => {
                  const totalRevs = reviews.length;
                  const pendingRevs = reviews.filter(
                    (r) => r.status === "pending" || !r.isApproved,
                  ).length;
                  const approvedRevsCount = reviews.filter(
                    (r) => r.status === "approved" || r.isApproved,
                  ).length;
                  const rejectedRevs = reviews.filter(
                    (r) => r.status === "rejected",
                  ).length;
                  const liveOnly = reviews.filter(
                    (r) => r.status === "approved" || r.isApproved,
                  );
                  const averageLiveScore =
                    liveOnly.length > 0
                      ? (
                          liveOnly.reduce((sum, r) => sum + r.rating, 0) /
                          liveOnly.length
                        ).toFixed(1)
                      : "0.0";
                  const filteredReviewsList = reviews.filter((rev) => {
                    const matchesRating =
                      reviewRatingFilter === "all" ||
                      rev.rating === Number(reviewRatingFilter);
                    const isApprovedTerm =
                      rev.status === "approved" || rev.isApproved === true;
                    const isPendingTerm =
                      rev.status === "pending" ||
                      (!rev.status && !rev.isApproved);
                    const isRejectedTerm = rev.status === "rejected";
                    let matchesStatus = true;
                    if (reviewStatusFilter === "pending")
                      matchesStatus = isPendingTerm;
                    else if (reviewStatusFilter === "approved")
                      matchesStatus = isApprovedTerm;
                    else if (reviewStatusFilter === "rejected")
                      matchesStatus = isRejectedTerm;
                    return matchesRating && matchesStatus;
                  });
                  return (
                    <motion.div
                      key="reviews-tab"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6 text-left"
                    >
                      <div className="border-b border-stone-850 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h3 className="font-serif text-white text-lg font-bold uppercase tracking-wider">
                            Diner Journeys Moderation Desk
                          </h3>
                          <p className="text-[10px] font-mono text-stone-500 uppercase mt-0.5">
                            Filter, audit, and authorize guest testimonials
                            before public listing
                          </p>
                        </div>

                        <button
                          onClick={fetchAllAdminData}
                          className="px-3 py-1 bg-stone-900 border border-stone-800 hover:border-amber-500 hover:text-white transition-all text-[9.5px] font-mono uppercase"
                        >
                          🔄 Clear/Reload Sync
                        </button>
                      </div>

                      {/* Review Stats summary mini dashboard */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-stone-950/40 p-4 border border-stone-900">
                          <span className="text-[9px] font-mono text-stone-500 uppercase">
                            Average Live Rating
                          </span>
                          <div className="font-mono text-2xl text-white font-extrabold mt-1">
                            {averageLiveScore}★
                          </div>
                        </div>
                        <div className="bg-stone-950/40 p-4 border border-stone-900">
                          <span className="text-[9px] font-mono text-stone-500 uppercase">
                            Incoming Pending
                          </span>
                          <div className="font-mono text-2xl text-amber-500 font-extrabold mt-1">
                            {pendingRevs}
                          </div>
                        </div>
                        <div className="bg-stone-950/40 p-4 border border-stone-900">
                          <span className="text-[9px] font-mono text-stone-500 uppercase">
                            Approved Live
                          </span>
                          <div className="font-mono text-2xl text-emerald-400 font-extrabold mt-1">
                            {approvedRevsCount}
                          </div>
                        </div>
                        <div className="bg-stone-950/40 p-4 border border-stone-900">
                          <span className="text-[9px] font-mono text-stone-500 uppercase">
                            Total Logged
                          </span>
                          <div className="font-mono text-2xl text-stone-400 font-extrabold mt-1">
                            {totalRevs}
                          </div>
                        </div>
                      </div>

                      {/* Dual interactive moderation filtering filters */}
                      <div className="flex flex-col sm:flex-row gap-4 bg-[#0d0d0d] p-4 border border-stone-900">
                        {/* Rating FilterDropdown */}
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] font-mono text-stone-400 uppercase">
                            Filter By Rating Value
                          </label>
                          <select
                            value={reviewRatingFilter}
                            onChange={(e) =>
                              setReviewRatingFilter(e.target.value)
                            }
                            className="w-full bg-stone-950 border border-stone-850 text-stone-250 text-xs py-2 px-3 focus:outline-none focus:border-[#d09733]"
                          >
                            <option value="all">★ Show All Stars (1-5)</option>
                            <option value="5">★ 5 Stars Only</option>
                            <option value="4">★ 4 Stars Only</option>
                            <option value="3">★ 3 Stars Only</option>
                            <option value="2">★ 2 Stars Only</option>
                            <option value="1">★ 1 Star Only</option>
                          </select>
                        </div>

                        {/* Status FilterDropdown */}
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] font-mono text-stone-400 uppercase">
                            Filter By Publication Status
                          </label>
                          <select
                            value={reviewStatusFilter}
                            onChange={(e) =>
                              setReviewStatusFilter(e.target.value)
                            }
                            className="w-full bg-stone-950 border border-stone-850 text-stone-250 text-xs py-2 px-3 focus:outline-none focus:border-[#d09733]"
                          >
                            <option value="all">◎ Show All Statuses</option>
                            <option value="pending">
                              ⏳ Pending Verification
                            </option>
                            <option value="approved">
                              ✅ Published Active Live
                            </option>
                            <option value="rejected">
                              ❌ Rejected / Put Down
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* List Items */}
                      <div className="space-y-4">
                        {filteredReviewsList.length > 0 ? (
                          filteredReviewsList.map((rev) => {
                            const isPending =
                              rev.status === "pending" ||
                              (!rev.status && !rev.isApproved);
                            const isApproved =
                              rev.status === "approved" ||
                              rev.isApproved === true;
                            const isRejected = rev.status === "rejected";
                            return (
                              <div
                                key={rev.id}
                                className="bg-[#0b0b0b] border border-stone-900 p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 text-xs transition-colors hover:border-stone-800"
                              >
                                {/* Left detail sector */}
                                <div className="flex items-start space-x-4 min-w-0 flex-grow">
                                  {rev.image && (
                                    <div className="w-16 h-12 bg-stone-900 border border-stone-850 overflow-hidden shrink-0 mt-1">
                                      <img
                                        src={rev.image}
                                        alt="Guest culinary attachment"
                                        className="w-full h-full object-cover filter brightness-75 hover:brightness-100"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                  )}
                                  <div className="space-y-1.5 min-w-0">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                      <strong className="text-white uppercase font-sans tracking-wide">
                                        {rev.name}
                                      </strong>
                                      {rev.email && (
                                        <span className="text-[#d09733] font-mono text-[9px] lowercase opacity-80">
                                          ({rev.email})
                                        </span>
                                      )}
                                      <span className="text-stone-500 font-mono text-[9.5px] uppercase">
                                        • {rev.role || "Valued Diner"}
                                      </span>
                                      <span className="text-stone-500 font-mono text-[9.5px] uppercase">
                                        •{" "}
                                        {rev.date ||
                                          (rev.createdAt
                                            ? rev.createdAt.split("T")[0]
                                            : "Recent")}
                                      </span>
                                    </div>

                                    {/* Star row */}
                                    <div className="flex items-center text-amber-500">
                                      {Array.from({ length: rev.rating }).map(
                                        (_, i) => (
                                          <Star
                                            key={i}
                                            className="w-3.5 h-3.5 fill-current"
                                          />
                                        ),
                                      )}
                                      {Array.from({
                                        length: 5 - rev.rating,
                                      }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className="w-3.5 h-3.5 text-stone-800"
                                        />
                                      ))}
                                    </div>

                                    {/* Text critique message */}
                                    <p className="text-stone-300 italic leading-relaxed font-serif text-[12px]">
                                      "{rev.message || rev.comment}"
                                    </p>
                                  </div>
                                </div>

                                {/* Right dynamic moderation buttons column */}
                                <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto justify-end border-t border-stone-900 pt-4 lg:pt-0 lg:border-t-0">
                                  {/* Status badges */}
                                  {isApproved && (
                                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono uppercase font-extrabold tracking-wider">
                                      ✓ Active Live
                                    </span>
                                  )}
                                  {isRejected && (
                                    <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-mono uppercase font-extrabold tracking-wider">
                                      ✗ Rejected
                                    </span>
                                  )}
                                  {isPending && (
                                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-mono uppercase font-extrabold tracking-wider">
                                      ⏳ Pending Moderation
                                    </span>
                                  )}

                                  <div className="h-4 w-[1px] bg-stone-900 hidden sm:block" />

                                  {/* Interactive Action buttons */}
                                  {(isPending || isRejected) && (
                                    <button
                                      onClick={() =>
                                        handleApproveReview(rev.id)
                                      }
                                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold uppercase transition-colors rounded-xs cursor-pointer text-[10px]"
                                    >
                                      Approve Post
                                    </button>
                                  )}

                                  {(isPending || isApproved) && (
                                    <button
                                      onClick={() => handleRejectReview(rev.id)}
                                      className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold uppercase transition-all rounded-xs cursor-pointer text-[10px]"
                                    >
                                      Reject Post
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleDeleteReview(rev.id)}
                                    className="p-1.5 border border-stone-800 rounded-xs text-stone-500 hover:text-red-400 hover:border-red-500/20 cursor-pointer"
                                    title="Delete Permanent"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-12 border border-stone-900 bg-[#0c0c0c]">
                            <p className="font-serif text-stone-500 text-sm">
                              No matched reviews found in database.
                            </p>
                            <p className="text-[10px] font-mono text-stone-600 uppercase mt-1">
                              Adjust rating select filters or look for incoming
                              guest critiques
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}

              {/* CONTACT MESSAGE INBOX TAB */}
              {activeTab === "messages" && (
                <motion.div
                  key="messages-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 text-left"
                >
                  <h3 className="font-serif text-white text-lg font-bold uppercase tracking-wider border-b border-stone-850 pb-3">
                    Contact Queries Inquiries
                  </h3>

                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`border rounded-xl p-5 space-y-3 text-xs ${msg.isRead ? "bg-stone-950/10 border-stone-900" : "bg-amber-500/5 border-amber-500/15"}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-stone-850 pb-2">
                          <div>
                            <span className="text-[10px] font-mono tracking-widest text-[#d09733] uppercase">
                              Subject:
                            </span>
                            <h4 className="font-serif text-white font-bold text-sm uppercase mt-0.5">
                              {msg.subject}
                            </h4>
                          </div>
                          <span className="text-stone-500 font-mono text-[9px] uppercase mt-1 sm:mt-0">
                            {msg.date}
                          </span>
                        </div>

                        <p className="text-stone-300 leading-relaxed italic">
                          {msg.message}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-900 text-[11px]">
                          <div className="text-stone-400 font-mono space-x-3">
                            <span>
                              Diner:{" "}
                              <strong className="text-stone-200 uppercase">
                                {msg.name}
                              </strong>
                            </span>
                            <span>
                              Phone:{" "}
                              <a
                                href={`tel:${msg.phone}`}
                                className="text-amber-400 hover:underline"
                              >
                                {msg.phone}
                              </a>
                            </span>
                            {msg.email && (
                              <span>
                                Email:{" "}
                                <strong className="text-stone-200">
                                  {msg.email}
                                </strong>
                              </span>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            {!msg.isRead && (
                              <button
                                onClick={() => handleMarkMessageRead(msg.id)}
                                className="px-3 py-1 bg-stone-900 border border-stone-800 rounded hover:border-[#d09733] text-stone-300 font-bold uppercase"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1 border border-stone-800 rounded hover:border-red-500/20 text-stone-500 hover:text-red-450"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CELEBRATION EVENTS SUITE TAB */}
              {activeTab === "events" && (
                <motion.div
                  key="events-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 text-left"
                >
                  <h3 className="font-serif text-white text-lg font-bold uppercase tracking-wider border-b border-stone-850 pb-3">
                    Birthday Celebration suite Editor
                  </h3>

                  {/* Add/Edit Event Form */}
                  <form
                    onSubmit={handleAddEvent}
                    className="bg-stone-950/40 border border-[#d09733]/30 p-6 rounded-xl space-y-4 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif text-amber-400 font-bold uppercase tracking-wider">
                        {editingEvent
                          ? "Edit Event Suite"
                          : "Create New Event suite"}
                      </h4>
                      {editingEvent && (
                        <button
                          type="button"
                          onClick={handleCancelEditEvent}
                          className="px-3 py-1 bg-stone-900 border border-stone-800 hover:border-red-500/40 hover:text-red-400 transition-all text-[10px] uppercase font-mono cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1 font-mono">
                        <label className="text-stone-400 font-semibold uppercase block">
                          Package Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Royal Platinum"
                          value={eventForm.name}
                          onChange={(e) =>
                            setEventForm({ ...eventForm, name: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                        />
                      </div>

                      <div className="space-y-1 font-mono">
                        <label className="text-stone-400 font-semibold uppercase block">
                          Price Per Head (PKR)
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 4500"
                          value={eventForm.pricePerPerson}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              pricePerPerson: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                        />
                      </div>

                      <div className="space-y-1 font-mono">
                        <label className="text-stone-400 font-semibold uppercase block">
                          Banner Picture Upload / Link
                        </label>
                        <div className="flex flex-col space-y-1.5">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEventFile(e.target.files[0])}
                            className="w-full px-3.5 py-1.5 rounded text-white glass-input text-xs"
                          />
                          <input
                            type="url"
                            placeholder="Or paste background image URL"
                            value={eventForm.image}
                            onChange={(e) =>
                              setEventForm({
                                ...eventForm,
                                image: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 font-mono">
                      <label className="text-stone-400 font-semibold uppercase block">
                        Package inclusions (one list item per line)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Private VIP lounge access&#10;3-tier custom fondant cake&#10;Table florist arrange"
                        value={eventForm.exclusions}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            exclusions: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs resize-none"
                      />
                    </div>

                    <div className="space-y-1 font-mono">
                      <label className="text-stone-400 font-semibold uppercase block">
                        Package Summary Description
                      </label>
                      <input
                        type="text"
                        placeholder="A concise, high-end copy about what this package targets..."
                        value={eventForm.description}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                      />
                    </div>

                    <div className="flex items-center space-x-2 font-mono">
                      <input
                        type="checkbox"
                        id="popularEvent"
                        checked={eventForm.popular}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            popular: e.target.checked,
                          })
                        }
                        className="rounded border-stone-800 bg-stone-900 text-amber-500 focus:ring-amber-500 w-4 h-4"
                      />
                      <label htmlFor="popularEvent" className="text-stone-300">
                        Highlight as Recommended Package
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-500 text-stone-950 font-bold uppercase tracking-wider rounded cursor-pointer"
                    >
                      {editingEvent
                        ? "Save Event Changes"
                        : "Publish celebration Package"}
                    </button>
                  </form>

                  {/* Event lists */}
                  <div className="divide-y divide-stone-900 border border-stone-850 rounded-xl bg-stone-950/20">
                    {events.map((e) => (
                      <div
                        key={e.id}
                        className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={e.image}
                            alt={e.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <strong className="text-white uppercase font-serif text-sm">
                              {e.name}
                            </strong>
                            <p className="text-[#d09733] font-mono text-[9px] uppercase mt-0.5">
                              Price: {e.pricePerPerson} PKR/Head{" "}
                              {e.popular ? "(Highly Requested)" : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleEditEventClick(e)}
                            className="p-2 text-stone-500 hover:text-amber-400 cursor-pointer"
                            title="Edit Package"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(e.id)}
                            className="p-2 text-stone-500 hover:text-red-400 cursor-pointer"
                            title="Delete Package"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "gallery" && (
                <motion.div
                  key="gallery-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8 text-left"
                >
                  <div>
                    <h3 className="font-serif text-white text-lg font-bold uppercase tracking-wider border-b border-stone-850 pb-3">
                      Gallery Asset Management
                    </h3>
                    <p className="text-stone-500 text-[11px] mt-1">
                      Upload and display beautiful snapshots of dishes, drinks,
                      interiors, or events in the customer-facing gallery grid.
                    </p>
                  </div>

                  {/* Gallery Add/Edit Form */}
                  <form
                    onSubmit={handleAddGallery}
                    className="space-y-4 p-5 rounded-xl border border-[#d09733]/30 bg-stone-900/20 text-xs font-sans text-stone-300"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif text-[#d09733] font-bold uppercase tracking-widest text-xs">
                        {editingGallery
                          ? "Edit Gallery Portrait"
                          : "Add New Gallery Portrait"}
                      </h4>
                      {editingGallery && (
                        <button
                          type="button"
                          onClick={handleCancelEditGallery}
                          className="px-3 py-1 bg-stone-900 border border-stone-800 hover:border-red-500/40 hover:text-red-400 transition-all text-[10px] uppercase font-mono cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-stone-400 font-mono text-[9px] uppercase">
                          Portrait Title
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Saffron Roast Platter"
                          value={galleryForm.title}
                          onChange={(e) =>
                            setGalleryForm({
                              ...galleryForm,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-stone-400 font-mono text-[9px] uppercase">
                          Category Classification
                        </label>
                        <select
                          value={galleryForm.category}
                          onChange={(e) =>
                            setGalleryForm({
                              ...galleryForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                        >
                          <option value="dishes">Culinary Dishes</option>
                          <option value="interior">Interior Ambient</option>
                          <option value="events">Event Celebrations</option>
                          <option value="drinks">Refreshing Beverages</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1 font-mono">
                      <label className="text-stone-400 font-semibold uppercase block">
                        Image Upload / URL
                      </label>
                      <div className="flex flex-col space-y-1.5">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setGalleryFile(e.target.files[0])}
                          className="w-full px-3.5 py-1.5 rounded text-white glass-input text-xs"
                        />
                        <input
                          type="url"
                          placeholder="Or paste image URL"
                          value={galleryForm.url}
                          onChange={(e) =>
                            setGalleryForm({
                              ...galleryForm,
                              url: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded text-white glass-input text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-500 text-stone-950 font-bold uppercase tracking-wider rounded cursor-pointer"
                    >
                      {editingGallery
                        ? "Save Portrait Changes"
                        : "Publish Gallery Item"}
                    </button>
                  </form>

                  {/* Gallery List */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {gallery.map((g) => (
                      <div
                        key={g.id}
                        className="group bg-stone-900 border border-stone-850 rounded-xl overflow-hidden relative"
                      >
                        <img
                          src={g.url}
                          alt={g.title}
                          className="w-full h-28 object-cover transition-transform group-hover:scale-105 duration-350"
                          referrerPolicy="no-referrer"
                        />
                        <div className="p-2.5 text-[10px] space-y-1 text-left bg-stone-950/80">
                          <strong className="text-white block truncate uppercase font-serif">
                            {g.title}
                          </strong>
                          <span className="text-[#d09733] uppercase font-mono text-[8px] tracking-wider block">
                            Category: {g.category}
                          </span>
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <button
                              type="button"
                              onClick={() => handleEditGalleryClick(g)}
                              className="p-1.5 bg-stone-950/80 border border-stone-800 text-stone-300 rounded hover:bg-amber-500 hover:text-stone-950 transition-colors cursor-pointer"
                              title="Edit Gallery Item"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGallery(g.id)}
                              className="p-1.5 bg-red-950/80 border border-red-500/20 text-red-400 rounded hover:bg-red-900/80 transition-colors cursor-pointer"
                              title="Delete Gallery Item"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
dotenv.config();
const app = express();
const PORT = 3001;
const DB_PATH = path.join(process.cwd(), "server-db.json");
app.use(express.json());
function initDB() {
  if (fs.existsSync(DB_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    } catch {}
  }
  const defaultCategories = [
    { id: "cat_1", name: "Burgers", slug: "burgers", icon: "Beef" },
    { id: "cat_2", name: "Pizza", slug: "pizza", icon: "Pizza" },
    { id: "cat_3", name: "Chinese", slug: "chinese", icon: "Flame" },
    { id: "cat_4", name: "Steaks", slug: "steaks", icon: "ChefHat" },
    {
      id: "cat_5",
      name: "Platters",
      slug: "platters",
      icon: "UtensilsCrossed",
    },
    { id: "cat_6", name: "Pasta", slug: "pasta", icon: "Soup" },
    { id: "cat_7", name: "Biryani", slug: "biryani", icon: "Calendar" },
    { id: "cat_8", name: "Drinks", slug: "drinks", icon: "Wine" },
    { id: "cat_9", name: "Desserts", slug: "desserts", icon: "IceCream" },
  ];
  const defaultMenuItems = [
    {
      id: "menu_1",
      name: "Turkish Platter",
      description:
        "Premium selection of charcoal-sizzled lamb seekh, beef skewers, shish taouk tenders, and garlic flatbread on a bed of gold saffron-infused rice.",
      price: 1850,
      categorySlug: "platters",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      tags: ["Chef Special", "Premium", "Sharing Platter"],
    },
    {
      id: "menu_2",
      name: "Signature Gourmet Burger",
      description:
        "Char-crusted double prime brisket blend patty, caramelized balsamic onion marmalade, melted sharp cheddar, signature gold mayo, nested in toasted artisanal brioche.",
      price: 850,
      categorySlug: "burgers",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      tags: ["Best Seller", "Juicy"],
    },
    {
      id: "menu_3",
      name: "Tarragon Grilled Steak",
      description:
        "USDA Prime tenderloin medallion, flame-grilled and finished with pure butter, served with rich velvety garden-rosemary tarragon cream sauce and rustic garlic mash.",
      price: 1650,
      categorySlug: "steaks",
      image:
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      tags: ["Luxury Choice", "Prime Beef"],
    },
    {
      id: "menu_4",
      name: "The East Junction Truffle Pizza",
      description:
        "Ancient wood-fired sourdough hand-tossed crust, dynamic buffalo milk mozzarella pearls, roasted baby cherry tomatoes, finished with rich drizzle of white truffle oil.",
      price: 1450,
      categorySlug: "pizza",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      tags: ["Stone-baked", "Truffle Oil"],
    },
    {
      id: "menu_5",
      name: "Imperial Saffron Biryani",
      description:
        "Aromatic kettle-cooked recipe using premium aged Basmati. Infused with natural saffron, rich spice bouquets, juicy hand-cut mutton cubes, and crispy gold onions.",
      price: 1250,
      categorySlug: "biryani",
      image:
        "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      tags: ["Heritage", "Spicy"],
    },
    {
      id: "menu_6",
      name: "Chicken Mushroom Fettuccine",
      description:
        "Fresh egg-fettuccine pasta spun in standard parmesan reduction, sliced oven-herbed chicken breast, and wild pan-fried cremini mushrooms.",
      price: 1150,
      categorySlug: "pasta",
      image:
        "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      tags: ["Creamy", "Italian Style"],
    },
    {
      id: "menu_7",
      name: "Szechuan Glazed Chilli Chicken",
      description:
        "Double-cooked crispy organic chicken cubes tossed with charred Szechuan red chiles, scallion roots, honey reduction, and sesame dust.",
      price: 1250,
      categorySlug: "chinese",
      image:
        "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
      isFeatured: false,
      tags: ["Spicy Accent"],
    },
    {
      id: "menu_8",
      name: "Beef Steak Burger",
      description:
        "Thin-shaved tenderloin steak flash-saut\xE9ed with bell peppers and melted provolone cheese, served on a toasted sourdough roll with house steak-sauce glaze.",
      price: 950,
      categorySlug: "burgers",
      image:
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      tags: ["Gourmet Blend"],
    },
    {
      id: "menu_9",
      name: "Mint Lemonade Spritzer",
      description:
        "Muddled cool mint sprigs and organic swirled lime wedges, raw wild blossom honey, fine gray rock salt, and ice-cold mountain carbonated spring water.",
      price: 350,
      categorySlug: "drinks",
      image:
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      tags: ["Refresher", "Ice Cold"],
    },
    {
      id: "menu_10",
      name: "24K Gold Saffron Kulfi",
      description:
        "Traditional slow-reduced dense clotted-cream ice, infused with true grade-A saffron strings and green cardamom seeds, glazed with real edible golden foil shards.",
      price: 550,
      categorySlug: "desserts",
      image:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
      isFeatured: true,
      tags: ["Gold Plated", "Signature Dessert"],
    },
  ];
  const defaultBirthdayEvents = [
    {
      id: "event_1",
      name: "Royal Platinum Celebration",
      description:
        "Our signature luxury birthday program designed for VIP hosting, customized to offer the ultimate aesthetic impact with high-end luxury details.",
      pricePerPerson: 4500,
      image:
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
      inclusions: [
        "Exclusive access to the Private VIP Dining Lounge at Spogmai Plaza",
        "High-contrast fresh flower ceiling backdrops and premium gold archways",
        "Assorted 3-Tier Customized Fondant Celebration Cake",
        "Elite 4-course bespoke menu (Appetizer, Platters, Artisan Drinks, Saffron Desserts)",
        "Complimentary live table-side violinist for ambient sets",
        "Dedicated VIP service coordinators and complimentary professional photography",
      ],
      popular: true,
    },
    {
      id: "event_2",
      name: "Golden Jubilee Banquet",
      description:
        "Beautiful celebratory layout ideal for warm, joyful, and luxury-filled family birthday gatherings and corporate celebrations.",
      pricePerPerson: 3e3,
      image:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
      inclusions: [
        "Reserved semi-private wing area beautifully styled with custom candlelight arrangements",
        "Dynamic 2-Tier Signature Red Velvet or Chocolate Fudge cake",
        "Crafted 3-course menu including Signature Burgers and Chinese Glazed Specialities",
        "Premium immersive surround audio player output customizable to user taste",
        "Bespoke gold-foiled dynamic table name cards",
      ],
      popular: false,
    },
    {
      id: "event_3",
      name: "Elite Birthday High-Tea",
      description:
        "Sophisticated social or professional afternoon birthday event focused on a lighter, highly chic presentation style.",
      pricePerPerson: 1800,
      image:
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80",
      inclusions: [
        "Luxury styled high-tea buffet station with gold server towers",
        "Bespoke mini gourmet burger sliders and assorted miniature woodfired flatbreads",
        "Free-flowing glass Mint Lemonade spritzers & specialty brewed French-press coffees",
        "Elegantly themed table centerpiece bouquets and light background jazz",
      ],
      popular: false,
    },
  ];
  const defaultReviews = [
    {
      id: "rev_1",
      name: "Ayesha Khan",
      email: "ayesha.khan@peshawarcritics.com",
      role: "Peshawar Food Critic",
      rating: 5,
      comment:
        "An absolute masterclass in luxury dining. The Tarragon Grilled Steak is perfectly tender and seasoned to gourmet standards. The glassmorphic golden interior makes you feel like you are in London or Dubai. Spogmai Plaza has truly found its jewel.",
      message:
        "An absolute masterclass in luxury dining. The Tarragon Grilled Steak is perfectly tender and seasoned to gourmet standards. The glassmorphic golden interior makes you feel like you are in London or Dubai. Spogmai Plaza has truly found its jewel.",
      date: "2026-06-12",
      createdAt: "2026-06-12T12:00:00.000Z",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      isApproved: true,
      status: "approved",
    },
    {
      id: "rev_2",
      name: "Dr. Bilal Ahmed",
      email: "bilal.ahmed@gmail.com",
      role: "Regular Family Guest",
      rating: 5,
      comment:
        "The East Junction is Peshawar's finest spot for family dinners. Outstanding service, secure family environment, and generous portion sizes. The Turkish Platter is exceptionally juicy and easily feeds our heavy table group. 10/10!",
      message:
        "The East Junction is Peshawar's finest spot for family dinners. Outstanding service, secure family environment, and generous portion sizes. The Turkish Platter is exceptionally juicy and easily feeds our heavy table group. 10/10!",
      date: "2026-06-15",
      createdAt: "2026-06-15T10:30:00.000Z",
      image:
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
      isApproved: true,
      status: "approved",
    },
    {
      id: "rev_3",
      name: "Zubair Afridi",
      email: "zubair.afridi@gmail.com",
      role: "Corporate Lead Guide",
      rating: 5,
      comment:
        "Phenomenal layout for corporate gatherings! We booked the Royal Platinum Birthday setup for our director's surprise and the precision in flowers, food presentation, and live music blew everyone away. Customer service is fantastic.",
      message:
        "Phenomenal layout for corporate gatherings! We booked the Royal Platinum Birthday setup for our director's surprise and the precision in flowers, food presentation, and live music blew everyone away. Customer service is fantastic.",
      date: "2026-06-16",
      createdAt: "2026-06-16T15:24:00.000Z",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      isApproved: true,
      status: "approved",
    },
  ];
  const defaultGallery = [
    {
      id: "gal_1",
      url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
      title: "Luxury Dining Under Saffron Chandeliers",
      category: "interior",
    },
    {
      id: "gal_2",
      url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      title: "The Sovereign Sizzling Turkish Platter",
      category: "dishes",
    },
    {
      id: "gal_3",
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
      title: "Platinum Birthday Suite Arrangement",
      category: "events",
    },
    {
      id: "gal_4",
      url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
      title: "Barista Crafted Golden Honey Latte",
      category: "drinks",
    },
    {
      id: "gal_5",
      url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      title: "Our Signature Gourmet Dripping Cheese Burger",
      category: "dishes",
    },
    {
      id: "gal_6",
      url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80",
      title: "Modern Ambient Coffee Lounge",
      category: "interior",
    },
  ];
  const defaultReservations = [
    {
      id: "res_1",
      name: "Sameer Lodhi",
      email: "sameer.lodhi@gmail.com",
      phone: "0333-9123456",
      date: "2026-06-19",
      time: "20:30",
      guests: 6,
      specialRequest:
        "Near the window for a family anniversary celebrate, request the violin player if available.",
      status: "confirmed",
      createdAt: "2026-06-16T12:00:00.000Z",
    },
    {
      id: "res_2",
      name: "Mariam Shah",
      email: "mariam.shah@yahoo.com",
      phone: "0300-5840011",
      date: "2026-06-20",
      time: "19:00",
      guests: 15,
      specialRequest:
        "Golden Jubilee Birthday package event booking. Expecting custom flower table layouts.",
      status: "pending",
      createdAt: "2026-06-17T08:30:00.000Z",
    },
  ];
  const defaultMessages = [
    {
      id: "msg_1",
      name: "Kamran Bangash",
      email: "kamran.b@nexus.com.pk",
      phone: "0312-5551122",
      subject: "Corporate Catering Services Inquiries",
      message:
        "Hello! We would like to inquire about hosting a corporate dinner for 40 executives next Tuesday evening. Do you offer set-menu catering customizations and can we project visual files in the lounge? Kindly call back on my number.",
      date: "2026-06-16",
      isRead: false,
    },
  ];
  const dbData = {
    categories: defaultCategories,
    menuItems: defaultMenuItems,
    birthdayEvents: defaultBirthdayEvents,
    reviews: defaultReviews,
    gallery: defaultGallery,
    reservations: defaultReservations,
    messages: defaultMessages,
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), "utf-8");
  return dbData;
}
const db = initDB();
function saveDB() {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}
app.get("/api/settings", (req, res) => {
  res.json({
    restaurantName: "The East Junction",
    location:
      "Spogmai Plaza, Near Avon Super Store, University Road, Peshawar, Pakistan",
    phone: "091-5840011",
    email: "info@theeastjunction.com",
    whatsapp: "92915840011",
    // Raw for api linking
    instagramUser: "theeastjunction",
    mapUrl: "https://maps.google.com/?q=Spogmai+Plaza+University+Road+Peshawar",
  });
});
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const isMatch =
    (username === "Mati Ur Rehman" && password === "Sasuke Uchiha") ||
    (username?.trim() === "Mati Ur Rehman" && password === "Sasuke Uchiha");
  if (isMatch) {
    res.json({ success: true, token: "admin-junction-token-secured-091" });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid luxury admin credentials." });
  }
});
app.get("/api/categories", (req, res) => {
  res.json(db.categories);
});
app.post("/api/categories", (req, res) => {
  const { name, slug, icon } = req.body;
  const newCat = {
    id: "cat_" + Date.now(),
    name,
    slug: slug.toLowerCase(),
    icon: icon || "Utensils",
  };
  db.categories.push(newCat);
  saveDB();
  res.status(201).json(newCat);
});
app.delete("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  db.categories = db.categories.filter((c) => c.id !== id);
  saveDB();
  res.json({ success: true, message: "Category excised successfully." });
});
app.get("/api/menu", (req, res) => {
  res.json(db.menuItems);
});
app.post("/api/menu", (req, res) => {
  const { name, description, price, categorySlug, image, isFeatured, tags } =
    req.body;
  const newItem = {
    id: "menu_" + Date.now(),
    name,
    description,
    price: Number(price),
    categorySlug,
    image:
      image ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    isFeatured: Boolean(isFeatured),
    tags: tags || [],
  };
  db.menuItems.push(newItem);
  saveDB();
  res.status(201).json(newItem);
});
app.put("/api/menu/:id", (req, res) => {
  const { id } = req.params;
  const index = db.menuItems.findIndex((item) => item.id === id);
  if (index !== -1) {
    db.menuItems[index] = {
      ...db.menuItems[index],
      ...req.body,
      price: Number(req.body.price ?? db.menuItems[index].price),
    };
    saveDB();
    res.json(db.menuItems[index]);
  } else {
    res.status(404).json({ error: "Dish not found." });
  }
});
app.delete("/api/menu/:id", (req, res) => {
  const { id } = req.params;
  db.menuItems = db.menuItems.filter((i) => i.id !== id);
  saveDB();
  res.json({ success: true });
});
app.get("/api/events", (req, res) => {
  res.json(db.birthdayEvents);
});
app.post("/api/events", (req, res) => {
  const { name, description, pricePerPerson, exclusions, image, popular } =
    req.body;
  const newEvent = {
    id: "event_" + Date.now(),
    name,
    description,
    pricePerPerson: Number(pricePerPerson),
    image:
      image ||
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    inclusions: Array.isArray(exclusions) ? exclusions : [],
    popular: Boolean(popular),
  };
  db.birthdayEvents.push(newEvent);
  saveDB();
  res.status(201).json(newEvent);
});
app.delete("/api/events/:id", (req, res) => {
  const { id } = req.params;
  db.birthdayEvents = db.birthdayEvents.filter((e) => e.id !== id);
  saveDB();
  res.json({ success: true });
});
app.get("/api/reservations", (req, res) => {
  res.json(db.reservations);
});
app.post("/api/reservations", (req, res) => {
  const { name, email, phone, date, time, guests, specialRequest } = req.body;
  if (!name || !phone || !date || !time || !guests) {
    return res
      .status(400)
      .json({ error: "Required reservation files missing." });
  }
  const newRes = {
    id: "res_" + Date.now(),
    name,
    email: email || "",
    phone,
    date,
    time,
    guests: Number(guests),
    specialRequest: specialRequest || "",
    status: "pending",
    createdAt: /* @__PURE__ */ new Date().toISOString(),
  };
  db.reservations.unshift(newRes);
  saveDB();
  res.status(201).json(newRes);
});
app.put("/api/reservations/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = db.reservations.findIndex((r) => r.id === id);
  if (index !== -1) {
    db.reservations[index].status = status;
    saveDB();
    res.json(db.reservations[index]);
  } else {
    res.status(404).json({ error: "Reservation listing not found." });
  }
});
app.delete("/api/reservations/:id", (req, res) => {
  const { id } = req.params;
  db.reservations = db.reservations.filter((r) => r.id !== id);
  saveDB();
  res.json({ success: true });
});
app.get("/api/reviews", (req, res) => {
  res.json(db.reviews);
});
app.post("/api/reviews", (req, res) => {
  const { name, email, rating, message, comment, image, role } = req.body;
  const finalComment = message || comment || "";
  const finalRole = role || "Valued Diner";
  const finalCreatedDate = /* @__PURE__ */ new Date()
    .toISOString()
    .split("T")[0];
  const newReview = {
    id: "rev_" + Date.now(),
    name: name || "Anonymous Guest",
    email: email || "",
    rating: Number(rating || 5),
    message: finalComment,
    comment: finalComment,
    // support existing comments
    role: finalRole,
    date: finalCreatedDate,
    createdAt: /* @__PURE__ */ new Date().toISOString(),
    // requested ISO format
    image: image || "",
    // optional base64 or URL structure
    isApproved: false,
    // moderation by default
    status: "pending",
    // moderation by default
  };
  db.reviews.unshift(newReview);
  saveDB();
  res.status(201).json(newReview);
});
app.put("/api/reviews/:id", (req, res) => {
  const { id } = req.params;
  const { status, isApproved } = req.body;
  const index = db.reviews.findIndex((r) => r.id === id);
  if (index !== -1) {
    if (status !== void 0) {
      db.reviews[index].status = status;
      db.reviews[index].isApproved = status === "approved";
    } else if (isApproved !== void 0) {
      db.reviews[index].isApproved = isApproved;
      db.reviews[index].status = isApproved ? "approved" : "rejected";
    }
    saveDB();
    res.json(db.reviews[index]);
  } else {
    res.status(404).json({ error: "Review not found" });
  }
});
app.delete("/api/reviews/:id", (req, res) => {
  const { id } = req.params;
  db.reviews = db.reviews.filter((r) => r.id !== id);
  saveDB();
  res.json({ success: true });
});
app.get("/api/messages", (req, res) => {
  res.json(db.messages);
});
app.post("/api/messages", (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const newMsg = {
    id: "msg_" + Date.now(),
    name,
    email,
    phone,
    subject: subject || "General Inquiry",
    message,
    date: /* @__PURE__ */ new Date().toISOString().split("T")[0],
    isRead: false,
  };
  db.messages.unshift(newMsg);
  saveDB();
  res.status(201).json(newMsg);
});
app.put("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  const index = db.messages.findIndex((m) => m.id === id);
  if (index !== -1) {
    db.messages[index].isRead = true;
    saveDB();
    res.json(db.messages[index]);
  } else {
    res.status(404).json({ error: "Message not found" });
  }
});
app.delete("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  db.messages = db.messages.filter((m) => m.id !== id);
  saveDB();
  res.json({ success: true });
});
app.get("/api/gallery", (req, res) => {
  res.json(db.gallery);
});
app.post("/api/gallery", (req, res) => {
  const { url, title, category } = req.body;
  const newImg = {
    id: "gal_" + Date.now(),
    url:
      url ||
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    title: title || "Gourmet Snapshot",
    category: category || "dishes",
  };
  db.gallery.push(newImg);
  saveDB();
  res.status(201).json(newImg);
});
app.delete("/api/gallery/:id", (req, res) => {
  const { id } = req.params;
  db.gallery = db.gallery.filter((g) => g.id !== id);
  saveDB();
  res.json({ success: true });
});
app.get("/api/stats", (req, res) => {
  const reservationsCount = db.reservations.length;
  const pendingReservations = db.reservations.filter(
    (r) => r.status === "pending",
  ).length;
  const menuItemsCount = db.menuItems.length;
  const reviewsCount = db.reviews.length;
  const messagesCount = db.messages.length;
  res.json({
    reservationsCount,
    pendingReservations,
    menuItemsCount,
    reviewsCount,
    messagesCount,
  });
});
let aiClient = null;
function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn(
        "WARNING: GEMINI_API_KEY environment variable is not defined.",
      );
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message was provided." });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const lower = message.toLowerCase();
    let text =
      "Welcome to The East Junction Peshawar! I am EastBot, your server-side assistant. It seems there is no API key configured in our Secrets yet, but I am happy to help! We are located at Spogmai Plaza, Near Avon Super Store, University Road, Peshawar and open 11:00 AM to 12:00 AM. Call us at 0915840011.";
    if (
      lower.includes("reserve") ||
      lower.includes("table") ||
      lower.includes("booking") ||
      lower.includes("book")
    ) {
      text =
        "Absolutely! I can assist you with your table reservation. Please share your Name, Phone Number, Date, Time, and Guest Count, and we will get your table ready at The East Junction Peshawar!";
    } else if (
      lower.includes("location") ||
      lower.includes("kahan") ||
      lower.includes("address") ||
      lower.includes("where")
    ) {
      text =
        "The East Junction Peshawar is located at Spogmai Plaza, Near Avon Super Store, University Road, Peshawar. Drive over or find us on Google Maps!";
    } else if (
      lower.includes("menu") ||
      lower.includes("khana") ||
      lower.includes("dishes") ||
      lower.includes("eat")
    ) {
      text =
        "We have wonderful dishes! Some of our most popular are the Turkish Platter (Rs. 1850), Signature Gourmet Burger (Rs. 850), Tarragon Grilled Steak (Rs. 1650), and Chicken Mushroom Pasta (Rs. 1150). Try our refreshing Mint Lemonade too!";
    } else if (
      lower.includes("birthday") ||
      lower.includes("event") ||
      lower.includes("salgira")
    ) {
      text =
        "Yes! We specialize in premium Birthday event setups. Please share the Event Type, Date, Guest Count, and Decoration Requirements so we can organize it perfectly!";
    } else if (lower.includes("spicy") || lower.includes("spici")) {
      text =
        "I highly recommend our Fried Rice with Beef Chilli or our Signature Gourmet Burger if you enjoy hot and spicy flavors!";
    }
    return res.json({ text });
  }
  try {
    const ai = getAI();
    const currentMenuSummary = db.menuItems
      .map((item) => `- ${item.name}: Rs. ${item.price} (${item.description})`)
      .slice(0, 15)
      .join("\n");
    const systemInstruction = `You are EastBot, the official restaurant concierge and AI Assistant for "The East Junction Peshawar".
Your personality is friendly, professional, fast, helpful, and restaurant-focused. Use short, crisp, clear responses (maximum 2-3 sentences where possible, 4 sentences absolute max).

Languages:
- You speak fluently in English, Urdu, and Roman Urdu. Match the customer's language.
- If they write in English, reply in English.
- If they write in Roman Urdu (e.g., "kahan hain aap", "table reserve krna h"), respond in Roman Urdu: (e.g., "The East Junction Peshawar Spogmai Plaza, University Road pe hai. Aapki table reserve krne k liye details share krdein!").

Restaurant Information:
- Name: The East Junction
- Location: Spogmai Plaza, Near Avon Super Store, University Road, Peshawar
- Timings: 11:00 AM \u2013 12:00 AM daily
- Contact Phone: 0915840011
- Cuisine offered: Pizza, Burgers, Steaks, Pasta, Biryani, Fried Rice, Turkish Platters, BBQ, Beverages.
- Halal Status: 100% Halal options.
- Seating: Standard and outdoor seating is available.
- Kids options: Yes, kids menu options are available.

Our Current Live Menu Items:
${currentMenuSummary}

Popular Items to Recommend:
- Signature Gourmet Burger
- Beef Steak Burger
- Pizza
- Tarragon Grilled Chicken (Tarragon Grilled Steak)
- Chicken Mushroom Fettuccine Pasta
- Turkish Platter (excellent for family dinners)
- Fried Rice with Beef Chilli (outstanding spicy selection)
- Mint Lemonade (highly recommended for drinks)

Primary Goals:
1. Suggest dishes based on user preferences. NEVER make up items or false prices.
2. Direct customers gently toward Table Reservations or Birthday Event bookings.
3. Suggest a Custom Birthday Setup if a birthday or celebration is mentioned.
4. Promote direct WhatsApp ordering (via number 0915840011) if they seem ready to order or are exploring takeout.

Reservation Flow:
Ask and collect:
- Name
- Phone Number
- Date
- Time
- Number of Guests
Once you have these, trigger the 'addReservation' tool to write it to our active database, then summarize all details to the customer.

Birthday Event Flow:
Ask and collect:
- Event Type (e.g., Birthday Party, Corporate event)
- Date
- Guest Count
- Decoration Requirements
- Contact Number
Once collected, format a message and trigger the 'addContactMessage' tool with subject 'Birthday Booking Request' to submit it directly to the management, then summarize it.

Upselling Guidelines:
- Suggest Birthday Setup booking if they mention birthdays.
- Recommend the Turkish Platter or Saffron Biryani for dinners/families.
- Suggest Mint Lemonade if they mention beverages or drinks.
- Encourage WhatsApp ordering (0915840011) for home deliveries.`;
    const contents = [];
    if (Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });
    const addReservationTool = {
      functionDeclarations: [
        {
          name: "addReservation",
          description:
            "Creates a real table reservation at The East Junction. Call this once you have gathered: Name, Phone Number, Date, Time, and Number of Guests.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              phone: { type: Type.STRING },
              date: { type: Type.STRING, description: "YYYY-MM-DD format" },
              time: { type: Type.STRING, description: "HH:MM format" },
              guests: { type: Type.NUMBER },
              specialRequest: { type: Type.STRING },
            },
            required: ["name", "phone", "date", "time", "guests"],
          },
        },
        {
          name: "addContactMessage",
          description:
            "Creates an inquiry, reservation event or birthday booking in the contact ledger.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              phone: { type: Type.STRING },
              subject: { type: Type.STRING },
              message: { type: Type.STRING },
            },
            required: ["name", "phone", "subject", "message"],
          },
        },
      ],
    };
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        tools: [addReservationTool],
      },
    });
    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === "addReservation") {
        const args = call.args;
        const newRes = {
          id: "res_" + Date.now(),
          name: args.name,
          email: "",
          phone: args.phone,
          date: args.date,
          time: args.time,
          guests: Number(args.guests) || 2,
          specialRequest: args.specialRequest || "",
          status: "pending",
          createdAt: /* @__PURE__ */ new Date().toISOString(),
        };
        db.reservations.unshift(newRes);
        saveDB();
        try {
          const secondResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
              ...contents,
              response.candidates?.[0]?.content,
              {
                role: "tool",
                parts: [
                  {
                    functionResponse: {
                      name: "addReservation",
                      response: { success: true, reservation: newRes },
                    },
                  },
                ],
              },
            ],
            config: {
              systemInstruction,
              tools: [addReservationTool],
            },
          });
          return res.json({
            text: secondResponse.text,
            reservationCreated: newRes,
          });
        } catch {
          return res.json({
            text: `Shukriya! Table reserved ho gayi hai. Details:
- Name: ${newRes.name}
- Date: ${newRes.date} k liye
- Time: ${newRes.time}
- Guests: ${newRes.guests}
Hum jald hi aapse raabta krenge! Standard status pending hai.`,
            reservationCreated: newRes,
          });
        }
      }
      if (call.name === "addContactMessage") {
        const args = call.args;
        const newMsg = {
          id: "msg_" + Date.now(),
          name: args.name,
          email: "",
          phone: args.phone,
          subject: args.subject,
          message: args.message,
          date: /* @__PURE__ */ new Date().toISOString().split("T")[0],
          isRead: false,
        };
        db.messages.unshift(newMsg);
        saveDB();
        try {
          const secondResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
              ...contents,
              response.candidates?.[0]?.content,
              {
                role: "tool",
                parts: [
                  {
                    functionResponse: {
                      name: "addContactMessage",
                      response: { success: true, message: newMsg },
                    },
                  },
                ],
              },
            ],
            config: {
              systemInstruction,
              tools: [addReservationTool],
            },
          });
          return res.json({
            text: secondResponse.text,
            messageCreated: newMsg,
          });
        } catch {
          return res.json({
            text: `Thank you! Your event booking or inquiry has been received. Our team will contact you back on ${newMsg.phone} shortly!`,
            messageCreated: newMsg,
          });
        }
      }
    }
    return res.json({
      text: response.text,
    });
  } catch (error) {
    console.error("EXPRESS GEMINI ERROR:", error);
    return res.json({
      text: "The East Junction service is slightly busy. Aap direct reservations tab use kr sakte hain ya call kr sakte hain! We are always ready to serve you.",
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware loaded successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Luxury Restaurant Server running at http://localhost:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("FATAL: Failed to launch Express-Vite backend", err);
  process.exit(1);
});

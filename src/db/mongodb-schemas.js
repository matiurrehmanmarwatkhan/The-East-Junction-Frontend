/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * =========================================================================
 * THE EAST JUNCTION - MERN PRODUCTION DATABASE LAYER
 * Developed by: Senior MERN Stack Architect & Database Specialist
 * Target Engine: MongoDB (powered by Mongoose ODM)
 * =========================================================================
 * 
 * This file contains the complete, production-ready schema definitions for
 * MongoDB. These can be copy-pasted directly into a production Node-Express
 * database connection block.
 */
export const AdminSchemaDefinition = {
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  // Bcrypt encrypted hash
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ["superadmin", "manager"], default: "manager" },
  lastLogin: { type: Date, default: Date.now }
};
export const CategorySchemaDefinition = {
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  icon: { type: String, required: true, default: "Utensils" },
  // Name of Lucide Icon to draw on frontend
  active: { type: Boolean, default: true }
};
export const MenuItemSchemaDefinition = {
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  categorySlug: { type: String, required: true, ref: "Category" },
  // Binds to Category slug
  image: { type: String, required: true },
  // Image URL or Cloudinary safe link
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String, trim: true }],
  // e.g. ["Chef Special", "Spicy", "Best Seller"]
  createdAt: { type: Date, default: Date.now }
};
export const ReservationSchemaDefinition = {
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  // Format "03XX-XXXXXXX"
  date: { type: String, required: true },
  // Format "YYYY-MM-DD"
  time: { type: String, required: true },
  // Format "HH:MM" (24h or local clock)
  guests: { type: Number, required: true, min: 1, max: 100 },
  specialRequest: { type: String, trim: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
};
export const ReviewSchemaDefinition = {
  name: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  role: { type: String, default: "Valued Diner", trim: true },
  // e.g., "Peshawar Critic", "Local Guide"
  date: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending"
    // Requires admin review approval
  },
  createdAt: { type: Date, default: Date.now }
};
export const GallerySchemaDefinition = {
  url: { type: String, required: true },
  // Cloudinary CDN asset url
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ["interior", "dishes", "events", "drinks"],
    default: "dishes"
  },
  createdAt: { type: Date, default: Date.now }
};
export const BirthdayEventSchemaDefinition = {
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  pricePerPerson: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  inclusions: [{ type: String, trim: true }],
  // Packages includes: e.g. ["Live violin session", "Ballon arches"]
  popular: { type: Boolean, default: false }
};
export const ContactMessageSchemaDefinition = {
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  subject: { type: String, default: "General Inquiry", trim: true },
  message: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
};
export const RestaurantSettingsSchemaDefinition = {
  restaurantName: { type: String, required: true, default: "The East Junction" },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  whatsapp: { type: String, required: true },
  mapUrl: { type: String, required: true }
};

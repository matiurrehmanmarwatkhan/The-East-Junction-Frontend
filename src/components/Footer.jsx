import {
  Instagram,
  Phone,
  MapPin,
  Mail,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Heart,
  CalendarCheck,
} from "lucide-react";
export default function Footer({ setView }) {
  const currentYear = /* @__PURE__ */ new Date().getFullYear();
  const instaImages = [
    {
      url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80",
      tag: "#TurkishTreats",
    },
    {
      url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
      tag: "#DoublePrime",
    },
    {
      url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80",
      tag: "#SourdoughStone",
    },
    {
      url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80",
      tag: "#TarragonGlaze",
    },
    {
      url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=300&q=80",
      tag: "#SaffronBiryani",
    },
    {
      url: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=300&q=80",
      tag: "#FettuccineDream",
    },
  ];
  const handleLinkClick = (view) => {
    setView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer
      id="footer-main"
      className="bg-stone-950 border-t border-white/5 text-stone-300"
    >
      {/* Upper CTA - Dynamic reservation nudge */}
      <div className="border-b border-white/5 bg-stone-900/5">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-serif text-lg text-white font-bold tracking-wider">
              Plan Your Royal Evening
            </h4>
            <p className="text-stone-400 text-xs mt-1">
              Settle your family reservations instantly. Seating is premium and
              limited.
            </p>
          </div>
          <button
            onClick={() => handleLinkClick("reservations")}
            className="flex items-center space-x-2 px-6 py-3 rounded-none border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-stone-950 transition-all font-semibold font-sans text-xs tracking-wider uppercase bg-stone-950 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Table Securely</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Core Brand Identity */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 flex items-center justify-center rounded-none border border-gold-400/30 bg-[#0d0d0d]">
                <span className="font-serif text-gold-400 font-bold text-lg">
                  E
                </span>
              </div>
              <h3 className="font-serif text-md tracking-wider text-white font-bold uppercase">
                THE EAST <span className="text-gold-400">JUNCTION</span>
              </h3>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Peshawar's pinnacle family food experience. Blending authentic
              continental cuisine, local heritage, and gourmet turkish and steak
              recipes in an atmosphere of ultimate elegance.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5 text-xs text-stone-400">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-mono text-[11px]">
                  Mon - Sun: 12:00 PM - 12:00 AM
                </span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-stone-400">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>100% Halal-Certified Gourmet Kitchen</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Shortcuts */}
          <div>
            <h4 className="font-serif text-xs tracking-[0.2em] text-white uppercase mb-6 font-bold border-l border-gold-400 pl-3">
              Explore
            </h4>
            <ul className="space-y-3 text-xs">
              {[
                { label: "Sovereign Home", target: "home" },
                { label: "Gourmet Menu Selection", target: "menu" },
                { label: "Reservations Panel", target: "reservations" },
                { label: "Birthday Events Suite", target: "events" },
                { label: "Aesthetic Gallery", target: "gallery" },
                { label: "Our Story & Heritage", target: "about" },
                { label: "Contact & GPS Location", target: "contact" },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleLinkClick(item.target)}
                    className="hover:text-gold-400 transition-colors duration-200 flex items-center group text-stone-400 hover:translate-x-1 cursor-pointer text-left"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-gold-400 mr-1.5 transition-all text-[8px]">
                      ▶
                    </span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Local Touchpoints (Contact) */}
          <div className="space-y-6">
            <h4 className="font-serif text-xs tracking-[0.2em] text-white uppercase font-bold border-l border-gold-400 pl-3">
              Physical Address
            </h4>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3 text-stone-400">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Spogmai Plaza, Near Avon Super Store, University Road,
                  Peshawar, Pakistan
                </p>
              </div>

              <div className="flex items-center space-x-3 text-stone-400">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a
                  href="tel:091-5840011"
                  className="hover:text-gold-400 transition-colors font-mono"
                >
                  091-5840011
                </a>
              </div>

              <div className="flex items-center space-x-3 text-stone-400">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a
                  href="mailto:info@theeastjunction.com"
                  className="hover:text-gold-400 transition-colors"
                >
                  info@theeastjunction.com
                </a>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-stone-500 font-mono">
                STAFF ACCESS KEY
              </p>
              <button
                onClick={() => handleLinkClick("admin")}
                className="text-gold-400/70 hover:text-gold-400 text-xs font-mono underline transition-all flex items-center cursor-pointer"
              >
                <span>Dashboard Login</span>
                <ArrowUpRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>

          {/* Column 4: Premium Instagram simulation */}
          <div>
            <h4 className="font-serif text-xs tracking-[0.2em] text-white uppercase mb-6 font-bold border-l border-gold-400 pl-3">
              @theeastjunction
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {instaImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-square rounded-none overflow-hidden border border-white/5 bg-[#0d0d0d] cursor-pointer"
                  onClick={() => handleLinkClick("gallery")}
                >
                  <img
                    src={img.url}
                    alt="Instagram Grid Feed"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1">
                    <Instagram className="w-3.5 h-3.5 text-gold-400" />
                    <span className="text-[8px] font-mono text-gold-400 mt-1 uppercase tracking-tight">
                      {img.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-stone-500 font-mono mt-3 text-right">
              Live Instagram feed mockup
            </p>
          </div>
        </div>

        {/* Brand Copyright */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-4">
          <p>
            © {currentYear} The East Junction. All culinary copyrights reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>Created by</span>
            <span className="text-gold-400 font-bold">Mati Ur Rehman</span>
            <span>Developer</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

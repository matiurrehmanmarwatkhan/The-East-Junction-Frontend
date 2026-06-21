import { Award, ShieldCheck, History, Users } from "lucide-react";
import { motion } from "motion/react";
export default function AboutView() {
  return <section id="story-about" className="bg-stone-950 min-h-screen pt-32 pb-24 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {
    /* About Header titles */
  }
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono tracking-[0.24em] text-gold-400 uppercase">Sovereign Heritage</p>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-bold mt-2.5">
            The East Junction <span className="text-gold-400 italic font-serif">Legacy</span>
          </h2>
          <div className="w-12 h-[1px] bg-gold-400/30 mx-auto mt-5" />
        </div>

        {
    /* Narrative columns: Story & Vision */
  }
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          
          <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="space-y-6"
  >
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-gold-400 uppercase">
              <History className="w-4 h-4 text-gold-400" />
              <span>Established 2024</span>
            </div>
            
            <h3 className="font-serif text-2xl sm:text-3.5xl text-white font-bold leading-tight">
              Pioneering Modern Culinary Elegance In Peshawar
            </h3>
            
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Before launching **The East Junction**, our goal was to bridge the gap between historic Peshawar culinary heritage and modern fine dining styles. Located strategically at Spogmai Plaza on University Road (facing the bustling Avon Super Store), we engineered an environment where families, corporate colleagues, and university peers can group under glowing golden chandeliers to relax with high-quality recipes.
            </p>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Every detail is meticulously designed. From our hand-drawn spice infusions for Saffron biryanis, to the rigorous wood-fired temperature settings for artisanal sourdough doughs, we are fanatical about precision. We collaborate only with authorized halal slaughterhouses to obtain prime beef brisket and fresh organic lambs weekly.
            </p>

            {
    /* Signature Quote */
  }
            <div className="border-l-2 border-gold-400 bg-stone-900/40 p-5 rounded-none">
              <p className="font-serif text-stone-200 italic text-xs sm:text-sm">
                "To us, fine dining is not just a menu card — it's a series of sensory discoveries. The sizzle of the Turkish meat, the scent of slow-brewed cardamoms, and the warmth of a family circle are what define our craft."
              </p>
              <h5 className="font-mono text-[10px] text-gold-400 uppercase tracking-widest mt-4">— Executive Chef, The East Junction</h5>
            </div>
          </motion.div>

          {
    /* Right column: Image frame */
  }
          <motion.div
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="relative"
  >
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/5 to-transparent z-10" />
            <div className="rounded-none overflow-hidden border border-gold-400/15 relative aspect-[4/3] shadow-2xl">
              <img
    src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80"
    alt="Inside The East Junction Lounge"
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover scale-102 filter brightness-[0.75]"
  />
            </div>
            {
    /* Overlay statistics plaque */
  }
            <div className="absolute -bottom-6 -left-3 glass-panel border-gold-400/20 p-5 rounded-none flex items-center space-x-3 shadow-2xl z-20 bg-stone-950">
              <span className="text-3xl text-gold-400 font-bold">100%</span>
              <div>
                <p className="text-white text-xs font-bold font-serif uppercase tracking-wider">Halal-Sourced</p>
                <p className="text-stone-500 text-[9px] font-mono uppercase">Premium certified meat cuts</p>
              </div>
            </div>
          </motion.div>

        </div>

        {
    /* Brand Pillars & Values Grid */
  }
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {
    /* Pillar 1 */
  }
          <div className="glass-panel p-6 rounded-none border border-white/5 hover:border-gold-400/25 transition-all text-center space-y-4 bg-stone-950/40">
            <div className="w-12 h-12 rounded-none bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-gold-400 font-bold uppercase tracking-widest text-sm">Fine Ingredients</h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              We import real Turkish saffron, Kashmiri chiles, and use custom-blended white truffle oils to finish each dish with deep authenticity.
            </p>
          </div>

          {
    /* Pillar 2 */
  }
          <div className="glass-panel p-6 rounded-none border border-white/5 hover:border-gold-400/25 transition-all text-center space-y-4 bg-stone-950/40">
            <div className="w-12 h-12 rounded-none bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-gold-400 font-bold uppercase tracking-widest text-sm">Family Environment</h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              An elegant, alcohol-free, smoke-free setup. Comfortably separated tables and VIP zones custom-designed for premium household dining comfort.
            </p>
          </div>

          {
    /* Pillar 3 */
  }
          <div className="glass-panel p-6 rounded-none border border-white/5 hover:border-gold-400/25 transition-all text-center space-y-4 bg-stone-950/40">
            <div className="w-12 h-12 rounded-none bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-gold-400 font-bold uppercase tracking-widest text-sm">Artisanal Service</h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              Our service stewards are certified professionals, dedicated to table-side carving, precise plating, and swift attention.
            </p>
          </div>

        </div>

      </div>
    </section>;
}

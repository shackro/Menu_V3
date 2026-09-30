import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Star, Clock, Users, MapPin } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

export default function HeroSection() {
  const containerRef = useRef(null);
  const [isDark, setIsDark] = useState(true);

  // Listen for theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = document.documentElement;
    const updateTheme = () => setIsDark(el.classList.contains('dark'));
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const heroWords = ["Authentic", "Kenyan", "Cuisine", "Crafted", "Daily"];

  // Theme-aware hero images
  const heroImage = isDark
    ? "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80"
    : "https://images.pexels.com/photos/32972518/pexels-photo-32972518/free-photo-of-fresh-mint-cocktail-in-a-glass-on-table.jpeg?auto=format&fit=crop&q=80";

  const gradientOverlay = isDark
    ? "from-black/90 via-black/70 to-black/95"
    : "from-white/80 via-white/60 to-white/70";

  return (
      <div ref={containerRef} className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
      isDark ? 'bg-black' : 'bg-gray-50'
    }`}>

      {/* Background Image with Parallax */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${gradientOverlay} z-10 transition-all duration-500`} />
        <img
          src={heroImage}
          alt="Restaurant Hero"
          className="w-full h-full object-cover scale-110"
        />
      </motion.div>

      {/* Live Status Badge - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-20 right-4 md:right-8 z-30"
      >
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/20'
            : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20'
        }`}>
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">LIVE</span>
        </div>
      </motion.div>

      {/* Main Hero Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 text-center max-w-5xl mx-auto pt-16"
      >

        {/* Rating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`inline-flex items-center gap-2 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 border transition-all duration-300 ${
            isDark
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-black/10 border-black/20 text-gray-900'
          }`}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <Star className={`w-4 h-4 fill-current ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
          </motion.div>
          <span className="font-semibold text-sm">4.9 Google Rating</span>
          <span className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-700'}`}>• 2,847 reviews</span>
        </motion.div>

        {/* Animated Headline - Clean Word Animation */}
        <div className="mb-6 space-y-2">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {heroWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5 + i * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className={`inline-block mr-3 md:mr-4 ${
                  i === 1 ? (isDark ? 'text-amber-500' : 'text-amber-600') : ''
                }`}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Subtitle with line accents */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="relative mx-auto mb-10 w-full max-w-2xl"
        >
          <p className={`text-lg md:text-xl leading-relaxed px-4 transition-colors duration-300 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <span className="block">Authentic Kenyan cuisine crafted with passion.</span>
            <span className="mt-1 flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`h-px min-w-3 flex-1 ${
                  isDark
                    ? 'bg-gradient-to-r from-transparent to-amber-500/70'
                    : 'bg-gradient-to-r from-transparent to-amber-600/70'
                }`}
              />
              <span className="min-w-0 text-center">
                <span className={`font-semibold transition-colors duration-300 ${
                  isDark ? 'text-amber-500' : 'text-amber-600'
                }`}>
                  Scan, browse, and order
                </span>
                {' '}seamlessly straight to your table.
              </span>
              <span
                aria-hidden="true"
                className={`h-px min-w-3 flex-1 ${
                  isDark
                    ? 'bg-gradient-to-l from-transparent to-amber-500/70'
                    : 'bg-gradient-to-l from-transparent to-amber-600/70'
                }`}
              />
            </span>
          </p>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          {[
            { icon: Clock, label: "Open until", value: "11 PM" },
            { icon: Users, label: "Orders today", value: "12" },
            { icon: MapPin, label: "Location", value: "Westlands" }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm transition-all duration-300 ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    : 'bg-black/5 border-black/10 text-gray-900 hover:bg-black/10'
                }`}
                whileHover={{ scale: 1.03 }}
              >
                <Icon className={`w-4 h-4 ${isDark ? 'text-amber-500' : 'text-amber-600'}`} />
                <span className="text-xs">
                  {stat.label === "Orders today" || stat.label === "Location" ? (
                    <>
                      <span className="font-bold">{stat.value}</span>
                      {stat.label !== "Location" && <span> {stat.label}</span>}
                    </>
                  ) : (
                    <>
                      {stat.label} <span className="font-bold">{stat.value}</span>
                    </>
                  )}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/brand"
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-base transition-all duration-300 border backdrop-blur-md ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/30 text-white'
                  : 'bg-black/10 hover:bg-black/20 border-black/20 text-gray-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Our Story</span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/menu"
              className={`inline-flex items-center gap-2 px-10 py-3 rounded-full font-bold text-base transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-lg shadow-amber-500/30'
              }`}
            >
              <span>View Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`flex flex-col items-center gap-2 transition-colors duration-300 ${
              isDark ? 'text-white/40' : 'text-gray-600/40'
            }`}
          >
            <span className="text-[10px] uppercase tracking-widest">Scroll to explore</span>
            <div className={`w-px h-8 bg-gradient-to-b transition-colors duration-300 ${
              isDark
                ? 'from-amber-500 to-transparent'
                : 'from-amber-600 to-transparent'
            }`} />
          </motion.div>
        </motion.div>

      </motion.div>

      {/* Corner Accents - subtle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className={`absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 transition-colors duration-300 ${
          isDark ? 'border-amber-500/20' : 'border-amber-600/20'
        }`}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className={`absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 transition-colors duration-300 ${
          isDark ? 'border-amber-500/20' : 'border-amber-600/20'
        }`}
      />
    </div>
  );
}

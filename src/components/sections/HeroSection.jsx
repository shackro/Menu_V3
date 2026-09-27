import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Star, Clock, Users, MapPin } from 'lucide-react';
import { useRef } from 'react';

export default function HeroSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const heroWords = ["Freshly", "Prepared", "Every", "Single", "Day"];

  // Floating particles
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: Math.random() * 0.5 + 0.5,
    duration: Math.random() * 10 + 10
  }));

  // Animated connector lines
  const connectorVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 1,
      opacity: 0.6,
      transition: {
        duration: 1.5,
        delay: i * 0.3,
        ease: "easeInOut"
      }
    })
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-black">

      {/* Animated Background Image with Parallax */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/95 z-10" />
        <img
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80"
          alt="Restaurant Hero"
          className="w-full h-full object-cover scale-110"
        />
      </motion.div>

      {/* Animated Connector Lines */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none hidden md:block">
        <motion.path
          d="M 100 150 Q 300 250 500 300"
          fill="none"
          stroke="rgba(217, 119, 6, 0.4)"
          strokeWidth="2"
          strokeDasharray="8 8"
          variants={connectorVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        />
        <motion.path
          d="M 700 200 Q 500 350 300 400"
          fill="none"
          stroke="rgba(217, 119, 6, 0.4)"
          strokeWidth="2"
          strokeDasharray="8 8"
          variants={connectorVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        />
        <motion.path
          d="M 200 500 Q 400 450 600 500"
          fill="none"
          stroke="rgba(217, 119, 6, 0.3)"
          strokeWidth="1.5"
          variants={connectorVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        />
      </svg>

      {/* Floating Animated Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-amber-500/30 rounded-full z-10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [particle.scale, particle.scale * 1.5, particle.scale]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.id * 0.5
          }}
        />
      ))}

      {/* Top Left: Chef Profile Widget */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-24 left-4 md:left-8 z-30"
      >
        <div className="relative group">
          <motion.div
            className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <img
            src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&q=80"
            alt="Chef Marcus"
            className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-amber-500/50 shadow-2xl object-cover"
          />
          <motion.div
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3"
        >
          <p className="text-white font-bold text-sm flex items-center gap-1.5">
            🍳 Chef Marcus
          </p>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-gray-400 italic mt-0.5"
          >
            "Crafted with passion"
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Top Right: Live Status Badge */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute top-24 right-4 md:right-8 z-30"
      >
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-xs font-bold">Savanna Grill</span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">LIVE</span>
        </div>
      </motion.div>

      {/* Main Hero Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 text-center max-w-5xl mx-auto pt-20"
      >

        {/* Google Rating Badge with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 border border-white/20 shadow-xl"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          </motion.div>
          <span className="text-white font-semibold text-sm">4.9 Google Rating</span>
          <span className="text-white/60 text-xs">• 2,847 reviews</span>
        </motion.div>

        {/* Animated Headline with Word Tracking */}
        <div className="mb-6 space-y-2">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight"
          >
            {heroWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.5 + i * 0.15,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className={`inline-block mr-3 md:mr-4 ${
                  i === 2 ? 'text-amber-500' : 'text-white'
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transformPerspective: 1000
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Animated Subtitle with Connecting Line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="relative mb-10"
        >
          <motion.div
            className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-px bg-amber-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          />
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-8">
            Authentic Kenyan cuisine crafted with passion.
            <span className="text-amber-500 font-semibold"> Scan, browse, and order</span> seamlessly straight to your table.
          </p>
          <motion.div
            className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-px bg-amber-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          />
        </motion.div>

        {/* Live Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mb-10"
        >
          <motion.div
            className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-300">Open until <span className="text-white font-bold">11 PM</span></span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <Users className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-300"><span className="text-white font-bold">12</span> orders today</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-300">Westlands, Nairobi</span>
          </motion.div>
        </motion.div>

        {/* Dual Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Our Story Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/brand"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-bold text-base transition-all duration-300 shadow-xl"
            >
              <motion.span
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.span>
              <span>Our Story</span>
              <motion.div className="w-2 h-2 bg-amber-500 rounded-full" />
            </Link>
          </motion.div>

          {/* View Menu Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/menu"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-full font-bold text-base transition-all duration-300 shadow-2xl shadow-amber-600/30"
            >
              <span>View Digital Menu</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/40"
          >
            <span className="text-[10px] uppercase tracking-widest">Scroll to explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-amber-500 to-transparent" />
          </motion.div>
        </motion.div>

      </motion.div>

      {/* Decorative Corner Elements */}
      <motion.div
        className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-amber-500/30 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-amber-500/30 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
      />
    </div>
  );
}

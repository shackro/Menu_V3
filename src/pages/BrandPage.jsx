import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, Users, Leaf, Trophy, Phone, Mail, MapPin, Clock, MessageCircle, Instagram, Facebook, Twitter, Info } from 'lucide-react';

const BrandPage = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = document.documentElement;
    const updateTheme = () => setIsDark(el.classList.contains('dark'));
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const tabs = [
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'directions', label: 'Directions', icon: MapPin },
  ];

  return (
    <div className={`min-h-screen selection:bg-amber-500 antialiased overflow-x-hidden transition-colors duration-500 ${
      isDark
        ? 'bg-neutral-950 text-neutral-50 selection:text-black'
        : 'bg-gray-50 text-gray-900 selection:text-white'
    }`}>
      {/* Hero Section */}
      <section className={`relative pt-32 pb-20 px-4 md:px-6 border-b transition-colors duration-300 ${
        isDark ? 'border-neutral-800' : 'border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={{ ...fadeUp, transition: { delay: 0.2, duration: 0.6 } }}
            className={`text-xl md:text-2xl font-serif italic transition-colors duration-300 ${
              isDark ? 'text-amber-400' : 'text-amber-600'
            }`}
          >
            Crafting Authentic Kenyan Cuisine with Passion
          </motion.p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        isDark ? 'bg-neutral-900/95 border-neutral-800' : 'bg-white/95 border-gray-200'
      } backdrop-blur-md`}>
        <div className="max-w-4xl mx-auto flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] px-4 py-4 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? isDark
                      ? 'border-b-amber-500 text-amber-400'
                      : 'border-b-amber-600 text-amber-600'
                    : isDark
                      ? 'border-b-transparent text-neutral-400 hover:text-neutral-200'
                      : 'border-b-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'about' && <AboutSection isDark={isDark} />}
            {activeTab === 'contact' && <ContactSection isDark={isDark} />}
            {activeTab === 'directions' && <DirectionsSection isDark={isDark} />}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* CTA Section */}
      <section className={`py-16 px-4 md:px-6 border-t transition-colors duration-300 ${
        isDark ? 'border-neutral-800' : 'border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl font-black uppercase mb-4"
          >
            Experience the Difference
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ ...fadeUp, transition: { delay: 0.1 } }}
            className={`text-lg mb-8 transition-colors duration-300 ${
              isDark ? 'text-neutral-400' : 'text-gray-700'
            }`}
          >
            Visit Savanna Grill today and discover authentic Kenyan cuisine crafted with passion
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            href="/"
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
              isDark
                ? 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white'
                : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white'
            }`}
          >
            Back to Menu <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>
      </section>
    </div>
  );
};

function AboutSection({ isDark }) {
  return (
    <div className="space-y-12 pb-8">
      {/* Main Story */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className={`p-8 md:p-12 rounded-2xl transition-colors duration-300 ${
          isDark
            ? 'bg-neutral-900/50 border border-neutral-800'
            : 'bg-gray-100/50 border border-gray-200'
        }`}
      >
        <p className={`text-lg leading-relaxed mb-6 transition-colors duration-300 ${
          isDark ? 'text-neutral-300' : 'text-gray-800'
        }`}>
          Savanna Grill was born from a simple dream: to bring authentic Kenyan cuisine to the heart of Nairobi, where tradition meets modernity. Founded with passion for preserving our culinary heritage, we've grown into more than just a restaurant—we're a gathering place where stories are shared, connections are made, and memories are created around every meal.
        </p>

        <p className={`text-lg leading-relaxed transition-colors duration-300 ${
          isDark ? 'text-neutral-300' : 'text-gray-800'
        }`}>
          Every dish that leaves our kitchen is crafted with meticulous care, using only the finest locally-sourced ingredients. From our signature Nyama Choma to traditional Sukuma Wiki, each bite tells a story of Kenya's rich culinary traditions. Our team of talented chefs takes pride in delivering not just food, but an experience—a celebration of who we are as a nation.
        </p>
      </motion.div>

      {/* Our Values */}
      <div>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl font-black uppercase tracking-tighter mb-8"
        >
          Our Values
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: 'Passion', desc: 'We pour our hearts into every dish' },
            { icon: Leaf, title: 'Authenticity', desc: 'Genuine Kenyan flavors, no shortcuts' },
            { icon: Users, title: 'Community', desc: 'Building connections one meal at a time' },
            { icon: Trophy, title: 'Excellence', desc: 'Committed to the highest standards' }
          ].map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-xl transition-all duration-300 ${
                  isDark
                    ? 'bg-neutral-900/30 border border-neutral-800 hover:border-amber-500/30'
                    : 'bg-gray-100/50 border border-gray-200 hover:border-amber-500/30'
                }`}
              >
                <Icon className={`w-10 h-10 mb-3 transition-colors duration-300 ${
                  isDark ? 'text-amber-500' : 'text-amber-600'
                }`} />
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-neutral-400' : 'text-gray-700'
                }`}>{value.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Our Journey */}
      <div>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl font-black uppercase tracking-tighter mb-8"
        >
          Our Journey
        </motion.h2>

        <div className="space-y-4">
          {[
            { year: '2020', title: 'The Beginning', desc: 'Savanna Grill opens its doors in Westlands' },
            { year: '2021', title: 'Expansion', desc: 'Added spa & wellness services & room service' },
            { year: '2022', title: 'Innovation', desc: 'Launched digital menu system for seamless ordering' },
            { year: '2024', title: 'Community Hub', desc: 'Became a favorite gathering spot for all walks of life' }
          ].map((milestone, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex gap-6 p-6 rounded-xl transition-all duration-300 ${
                isDark
                  ? 'bg-neutral-900/30 border border-neutral-800'
                  : 'bg-gray-100/50 border border-gray-200'
              }`}
            >
              <div className={`flex items-center justify-center w-20 h-20 rounded-full flex-shrink-0 transition-colors duration-300 ${
                isDark ? 'bg-amber-500/10' : 'bg-amber-500/20'
              }`}>
                <span className={`font-black text-lg transition-colors duration-300 ${
                  isDark ? 'text-amber-500' : 'text-amber-600'
                }`}>{milestone.year}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                <p className={`transition-colors duration-300 ${
                  isDark ? 'text-neutral-400' : 'text-gray-700'
                }`}>{milestone.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactSection({ isDark }) {
  return (
    <div className="space-y-6 pb-8">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-3xl font-black uppercase tracking-tighter mb-2"
      >
        Get in Touch
      </motion.h2>
      <p className={`text-lg transition-colors duration-300 ${
        isDark ? 'text-neutral-400' : 'text-gray-700'
      }`}>
        We'd love to hear from you. Reach out through any of these channels.
      </p>

      <div className="space-y-4">
        <motion.a
          href="tel:+254703412694"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`flex items-center gap-4 p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
            isDark
              ? 'bg-neutral-900/30 border border-neutral-800 hover:border-green-500/50'
              : 'bg-gray-100/50 border border-gray-200 hover:border-green-500/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
            isDark ? 'bg-green-500/10' : 'bg-green-500/20'
          }`}>
            <Phone className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold">Call Us</p>
            <p className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-neutral-400' : 'text-gray-600'
            }`}>+254 703 412 694</p>
          </div>
        </motion.a>

        <motion.a
          href="mailto:hello@savannagrill.co.ke"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`flex items-center gap-4 p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
            isDark
              ? 'bg-neutral-900/30 border border-neutral-800 hover:border-blue-500/50'
              : 'bg-gray-100/50 border border-gray-200 hover:border-blue-500/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
            isDark ? 'bg-blue-500/10' : 'bg-blue-500/20'
          }`}>
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold">Email Us</p>
            <p className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-neutral-400' : 'text-gray-600'
            }`}>hello@savannagrill.co.ke</p>
          </div>
        </motion.a>

        <motion.a
          href="https://wa.me/254703412694"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`flex items-center gap-4 p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
            isDark
              ? 'bg-neutral-900/30 border border-neutral-800 hover:border-teal-500/50'
              : 'bg-gray-100/50 border border-gray-200 hover:border-teal-500/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
            isDark ? 'bg-teal-500/10' : 'bg-teal-500/20'
          }`}>
            <MessageCircle className="w-6 h-6 text-teal-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold">WhatsApp</p>
            <p className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-neutral-400' : 'text-gray-600'
            }`}>Quick responses, 9am-9pm</p>
          </div>
        </motion.a>
      </div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="pt-8 border-t" style={{
          borderColor: isDark ? 'rgb(38 38 38)' : 'rgb(209 213 219)'
        }}
      >
        <h3 className="text-xl font-bold mb-4">Follow Our Journey</h3>
        <div className="flex gap-3">
          <a
            href="#"
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl font-semibold transition-all duration-300 ${
              isDark
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white'
            }`}
          >
            <Instagram className="w-5 h-5" />
            <span>Instagram</span>
          </a>
          <a
            href="#"
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl font-semibold transition-all duration-300 ${
              isDark
                ? 'bg-blue-700 hover:bg-blue-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            <Facebook className="w-5 h-5" />
            <span>Facebook</span>
          </a>
          <a
            href="#"
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl font-semibold transition-all duration-300 ${
              isDark
                ? 'bg-sky-600 hover:bg-sky-500 text-white'
                : 'bg-sky-500 hover:bg-sky-400 text-white'
            }`}
          >
            <Twitter className="w-5 h-5" />
            <span>Twitter</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function DirectionsSection({ isDark }) {
  return (
    <div className="space-y-6 pb-8">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-3xl font-black uppercase tracking-tighter mb-2"
      >
        Find Us
      </motion.h2>
      <p className={`text-lg transition-colors duration-300 ${
        isDark ? 'text-neutral-400' : 'text-gray-700'
      }`}>
        We are conveniently located in the heart of Westlands, Nairobi.
      </p>

      {/* Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={`relative h-64 rounded-xl overflow-hidden border transition-colors duration-300 ${
          isDark ? 'border-neutral-800' : 'border-gray-200'
        }`}
      >
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
          alt="Map"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
          <MapPin className="w-12 h-12 text-amber-400 mb-2" />
          <p className={`text-sm font-semibold rounded-full px-4 py-2 backdrop-blur-md transition-colors duration-300 ${
            isDark
              ? 'bg-neutral-900/90 text-white'
              : 'bg-white/90 text-gray-900'
          }`}>
            Sarit Centre, Westlands
          </p>
        </div>
      </motion.div>

      {/* Address Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`p-6 rounded-xl transition-colors duration-300 ${
          isDark
            ? 'bg-neutral-900/30 border border-neutral-800'
            : 'bg-gray-100/50 border border-gray-200'
        }`}
      >
        <div className="flex items-start gap-4">
          <MapPin className={`w-6 h-6 flex-shrink-0 transition-colors duration-300 ${
            isDark ? 'text-amber-500' : 'text-amber-600'
          }`} />
          <div>
            <p className="font-bold mb-2">Address</p>
            <p className={`text-sm leading-relaxed transition-colors duration-300 ${
              isDark ? 'text-neutral-400' : 'text-gray-700'
            }`}>
              Sarit Centre, Westlands<br />
              Nairobi, Kenya
            </p>
          </div>
        </div>
      </motion.div>

      {/* Opening Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-xl transition-colors duration-300 ${
          isDark
            ? 'bg-neutral-900/30 border border-neutral-800'
            : 'bg-gray-100/50 border border-gray-200'
        }`}
      >
        <div className="flex items-start gap-4">
          <Clock className={`w-6 h-6 flex-shrink-0 transition-colors duration-300 ${
            isDark ? 'text-amber-500' : 'text-amber-600'
          }`} />
          <div className="flex-1">
            <p className="font-bold mb-3">Opening Hours</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  isDark ? 'text-neutral-400' : 'text-gray-700'
                }`}>Monday - Friday</span>
                <span className="font-semibold">10am - 11pm</span>
              </div>
              <div className="flex justify-between">
                <span className={`transition-colors duration-300 ${
                  isDark ? 'text-neutral-400' : 'text-gray-700'
                }`}>Saturday & Sunday</span>
                <span className="font-semibold">9am - 12am</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Get Directions Button */}
      <motion.a
        href="https://www.google.com/maps/search/Sarit+Centre+Westlands+Nairobi"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className={`flex items-center justify-center gap-2 w-full p-4 rounded-xl font-bold transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white'
            : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white'
        }`}
      >
        <MapPin className="w-5 h-5" />
        Get Directions in Google Maps
      </motion.a>
    </div>
  );
}

export default BrandPage;

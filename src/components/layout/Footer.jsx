import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, ArrowUp, Send } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    })
  };

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500' },
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50 dark:from-dark-card dark:to-dark text-gray-700 dark:text-gray-400 pt-16 pb-8 px-4 border-t border-gray-200 dark:border-gray-800 overflow-hidden">
      
      {/* Decorative Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        
        {/* Top Section: Brand + Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          
          {/* Brand Column */}
          <motion.div
            variants={fadeInUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Savanna Grill
              </h3>
            </div>
            <p className="mb-6 leading-relaxed max-w-md">
              Authentic Kenyan cuisine crafted with passion in the heart of Nairobi. 
              Scan, browse, and order seamlessly — straight to your table or for pickup.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <a href="tel:+254703412694" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" /> +254 703 412 694
              </a>
              <a href="mailto:hello@savannagrill.co.ke" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" /> hello@savannagrill.co.ke
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Nairobi, Kenya
              </span>
            </div>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div
            variants={fadeInUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:ml-auto"
          >
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Stay in the Loop 🍔
            </h4>
            <p className="text-sm mb-4">
              Get exclusive offers, new menu drops, and loyalty rewards straight to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 bg-white dark:bg-dark rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-gray-900 dark:text-white placeholder-gray-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-5 py-3 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </motion.button>
            </form>

            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-600 dark:text-green-400 mt-3 font-semibold"
              >
                ✅ Asante! You're subscribed.
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-8 origin-left"
        />

        {/* Bottom Section: Social + Back to Top + Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Social Icons */}
          <motion.div
            variants={fadeInUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex gap-3"
          >
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className={`w-11 h-11 rounded-full bg-gray-100 dark:bg-dark flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors duration-300 ${social.color} hover:text-white shadow-sm hover:shadow-lg`}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>

          {/* Back to Top Button (Now securely inside the footer) */}
          <motion.button
            onClick={scrollToTop}
            variants={fadeInUp}
            custom={2.5}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-full transition-all text-sm font-semibold border border-gray-200 dark:border-gray-700"
          >
            <ArrowUp className="w-4 h-4" />
            Back to Top
          </motion.button>

          {/* Copyright */}
          <motion.p
            variants={fadeInUp}
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-sm text-center md:text-right text-gray-600 dark:text-gray-400"
          >
            © {currentYear} <span className="font-semibold text-gray-900 dark:text-white">Savanna Grill</span>. 
            All rights reserved. Made with ❤️ in Nairobi.
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
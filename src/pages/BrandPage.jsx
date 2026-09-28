import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Users, Leaf, Trophy } from 'lucide-react';

const BrandPage = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

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

      {/* Main Story */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
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
      </section>

      {/* Our Values */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Our Values</h2>
          <p className={`text-sm transition-colors duration-300 ${
            isDark ? 'text-neutral-500' : 'text-gray-600'
          }`}>The principles that guide everything we do</p>
        </motion.div>

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
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Our Journey</h2>
        </motion.div>

        <div className="space-y-8">
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

export default BrandPage;

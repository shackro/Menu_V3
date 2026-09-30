import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, Users, Leaf, Trophy, Phone, Mail, MapPin, Clock, MessageCircle, Instagram, Facebook, Twitter, Info, Star, Linkedin, ExternalLink, Camera, Send } from 'lucide-react';

const BrandPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  const [activeTab, setActiveTab] = useState(() => (
    searchParams.get('tab') === 'posts' ? 'posts' : 'about'
  ));

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
    { id: 'posts', label: 'Our Stories', icon: MessageCircle },
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
        <div className="max-w-4xl mx-auto grid grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchParams(tab.id === 'about' ? {} : { tab: tab.id });
                }}
                className={`min-w-0 px-1 py-3 text-xs font-semibold capitalize border-b-2 transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 sm:px-3 sm:py-4 sm:text-sm ${
                  isActive
                    ? isDark
                      ? 'border-b-amber-500 text-amber-400'
                      : 'border-b-amber-600 text-amber-600'
                    : isDark
                      ? 'border-b-transparent text-neutral-400 hover:text-neutral-200'
                      : 'border-b-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="text-center leading-tight">{tab.label}</span>
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
            {activeTab === 'posts' && <StoriesSection isDark={isDark} />}
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

const guestReviews = [
  {
    id: 1,
    author: 'Sarah M.',
    dish: 'Choma Feast Board',
    rating: 5,
    text: 'The Choma Feast Board is absolutely unreal! Chef Marcus really outdid himself. The ambiance is perfect for a Friday night.',
    platform: 'Instagram',
    handle: '@sarah.eats.nbi',
  },
  {
    id: 2,
    author: 'James K.',
    dish: 'Nyama Platter',
    rating: 5,
    text: 'Best Nyama in Nairobi, hands down. The service was incredibly fast and the M-Pesa integration was seamless.',
    platform: 'Twitter',
    handle: '@jamesk_foodie',
  },
  {
    id: 3,
    author: 'Amina H.',
    dish: 'Belgian Waffles',
    rating: 4,
    text: 'Loved the Belgian Waffles! A bit busy on Sunday morning but totally worth the wait. Will definitely be back.',
    platform: 'Instagram',
    handle: '@amina.h',
  },
];

const socialReviews = [
  {
    id: 1,
    author: 'Developer',
    handle: '@techNinja254',
    platform: 'Twitter',
    rating: 5,
    text: 'Just spent 4 hours working from Savanna Grill. Best WiFi in Nairobi and the ugali is perfect for long coding sessions. This is now my official office!',
    likes: '1.2k',
    replies: 45,
    date: '2h ago',
  },
  {
    id: 2,
    author: 'Business Professional',
    handle: '@EntrepreneurKE',
    platform: 'LinkedIn',
    rating: 5,
    text: 'Hosted my quarterly team meeting at Savanna Grill. Professional atmosphere, amazing Nyama Choma platter, and their concierge service handled everything perfectly.',
    likes: '856',
    replies: 32,
    date: '1d ago',
  },
  {
    id: 3,
    author: 'Food Blogger',
    handle: '@TasteOfKenya',
    platform: 'Instagram',
    rating: 5,
    text: 'The authentic flavors at Savanna Grill are unmatched! Their Chapati & Sukuma Wiki combo is an absolute must-try. Modern restaurant with traditional soul.',
    likes: '2.4k',
    replies: 127,
    date: '3d ago',
  },
  {
    id: 4,
    author: 'Student',
    handle: '@UnivLife_Nai',
    platform: 'TikTok',
    rating: 5,
    text: 'Found my new study spot! Savanna Grill has affordable menu items, amazing ambiance, and they do not rush you out. Perfect for exam prep season.',
    likes: '3.8k',
    replies: 289,
    date: '5d ago',
  },
  {
    id: 5,
    author: 'Family Dad',
    handle: '@FamilyFirst_KE',
    platform: 'Facebook',
    rating: 5,
    text: 'Took the whole family to Savanna Grill for Sunday lunch. The kids loved the fresh juice bar and everyone left happy. Great family-friendly restaurant!',
    likes: '645',
    replies: 78,
    date: '1w ago',
  },
];

function StoriesSection({ isDark }) {
  const [storyForm, setStoryForm] = useState({ name: '', text: '' });
  const [reviewForm, setReviewForm] = useState({ name: '', dish: '', rating: 0, text: '' });
  const [submittedStories, setSubmittedStories] = useState([]);
  const [submittedReviews, setSubmittedReviews] = useState([]);

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
    isDark
      ? 'border-neutral-700 bg-neutral-800 text-white placeholder-neutral-500 focus:border-amber-500'
      : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-amber-500'
  }`;

  const submitStory = (event) => {
    event.preventDefault();
    setSubmittedStories((stories) => [
      { ...storyForm, id: Date.now() },
      ...stories,
    ]);
    setStoryForm({ name: '', text: '' });
  };

  const submitReview = (event) => {
    event.preventDefault();
    setSubmittedReviews((reviews) => [
      { ...reviewForm, id: Date.now() },
      ...reviews,
    ]);
    setReviewForm({ name: '', dish: '', rating: 0, text: '' });
  };

  return (
    <div className="space-y-12 pb-8">
      <header className="text-center">
        <p className={`mb-2 text-xs font-black uppercase tracking-[0.2em] ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
          Our Stories
        </p>
        <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">Community Voices</h2>
        <p className={`mx-auto mt-3 max-w-2xl text-sm sm:text-base ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
          Guest reviews and social posts from the Savanna Grill community.
        </p>
      </header>

      <section aria-labelledby="share-your-experience-title">
        <h3 id="share-your-experience-title" className="mb-5 text-xl font-bold sm:text-2xl">
          Share your experience
        </h3>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <form onSubmit={submitStory} className={`rounded-2xl border p-5 ${isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-gray-200 bg-white shadow-sm'}`}>
            <div className="mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5 text-amber-500" />
              <h4 className="font-bold">Post a story</h4>
            </div>
            <div className="space-y-3">
              <input className={inputClass} value={storyForm.name} onChange={(event) => setStoryForm({ ...storyForm, name: event.target.value })} placeholder="Your name" required />
              <textarea className={inputClass} rows="4" value={storyForm.text} onChange={(event) => setStoryForm({ ...storyForm, text: event.target.value })} placeholder="Tell us about your visit..." required />
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-amber-600">
                <Send className="h-4 w-4" /> Post story
              </button>
            </div>
          </form>

          <form onSubmit={submitReview} className={`rounded-2xl border p-5 ${isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-gray-200 bg-white shadow-sm'}`}>
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
              <h4 className="font-bold">Write a review</h4>
            </div>
            <div className="space-y-3">
              <input className={inputClass} value={reviewForm.name} onChange={(event) => setReviewForm({ ...reviewForm, name: event.target.value })} placeholder="Your name" required />
              <input className={inputClass} value={reviewForm.dish} onChange={(event) => setReviewForm({ ...reviewForm, dish: event.target.value })} placeholder="Dish you ordered" required />
              <div className="flex items-center gap-1" aria-label="Choose a rating">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button key={rating} type="button" onClick={() => setReviewForm({ ...reviewForm, rating })} aria-label={`${rating} stars`}>
                    <Star className={`h-6 w-6 ${rating <= reviewForm.rating ? 'fill-amber-500 text-amber-500' : isDark ? 'text-neutral-700' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <textarea className={inputClass} rows="3" value={reviewForm.text} onChange={(event) => setReviewForm({ ...reviewForm, text: event.target.value })} placeholder="Tell us about your experience..." required />
              <button type="submit" disabled={!reviewForm.rating} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50">
                <Send className="h-4 w-4" /> Submit review
              </button>
            </div>
          </form>
        </div>
      </section>

      {submittedStories.length > 0 && (
        <section aria-labelledby="new-stories-title">
          <h3 id="new-stories-title" className="mb-5 text-xl font-bold sm:text-2xl">Community stories</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {submittedStories.map((story) => (
              <article key={story.id} className={`rounded-2xl border p-5 ${isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-gray-200 bg-white shadow-sm'}`}>
                <p className={`mb-3 text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>“{story.text}”</p>
                <p className="text-sm font-bold">{story.name}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {submittedReviews.length > 0 && (
        <section aria-labelledby="new-reviews-title">
          <h3 id="new-reviews-title" className="mb-5 text-xl font-bold sm:text-2xl">New reviews</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {submittedReviews.map((review) => (
              <article key={review.id} className={`rounded-2xl border p-5 ${isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-gray-200 bg-white shadow-sm'}`}>
                <div className="mb-3 flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? 'fill-amber-500 text-amber-500' : isDark ? 'text-neutral-700' : 'text-gray-300'}`} />)}
                </div>
                <p className={`mb-3 text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>“{review.text}”</p>
                <p className="text-sm font-bold">{review.name}</p>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>Ordered: {review.dish}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="guest-reviews-title">
        <h3 id="guest-reviews-title" className="mb-5 flex items-center gap-2 text-xl font-bold sm:text-2xl">
          <Star className="h-5 w-5 fill-amber-500 text-amber-500" /> Guest Reviews
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {guestReviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`flex min-w-0 flex-col rounded-2xl border p-5 ${
                isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-gray-200 bg-white shadow-sm'
              }`}
            >
              <div className="mb-3 flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`h-4 w-4 ${
                    i < review.rating ? 'fill-amber-500 text-amber-500' : isDark ? 'text-neutral-700' : 'text-gray-300'
                  }`} />
                ))}
              </div>
              <p className={`mb-5 flex-1 break-words text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
                “{review.text}”
              </p>
              <div className={`border-t pt-3 ${isDark ? 'border-neutral-800' : 'border-gray-100'}`}>
                <p className="font-bold">{review.author}</p>
                <p className={`mb-3 text-xs ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>Ordered: {review.dish}</p>
                <SocialProfileLink platform={review.platform} handle={review.handle} isDark={isDark} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section aria-labelledby="social-reviews-title">
        <h3 id="social-reviews-title" className="mb-5 flex items-center gap-2 text-xl font-bold sm:text-2xl">
          <MessageCircle className="h-5 w-5 text-primary" /> Top Social Posts
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {socialReviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className={`min-w-0 rounded-2xl border p-5 ${
                isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-gray-200 bg-white shadow-sm'
              }`}
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="break-words text-sm font-bold">{review.author}</p>
                  <SocialProfileLink platform={review.platform} handle={review.handle} isDark={isDark} />
                </div>
                <SocialProfileLink platform={review.platform} handle={review.handle} isDark={isDark} badge />
              </div>
              <div className="mb-3 flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: review.rating }, (_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className={`break-words text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
                “{review.text}”
              </p>
              <div className={`mt-4 flex flex-wrap justify-between gap-2 border-t pt-3 text-xs ${
                isDark ? 'border-neutral-800 text-neutral-500' : 'border-gray-100 text-gray-500'
              }`}>
                <span>{review.likes} likes · {review.replies} replies</span>
                <span>{review.date}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SocialProfileLink({ platform, handle, isDark, badge = false }) {
  if (typeof handle !== 'string' || !handle.trim()) return null;
  const username = handle.trim().replace(/^@+/, '');
  const platformKey = platform.toLowerCase();
  const profiles = {
    instagram: {
      label: 'Instagram',
      url: `https://www.instagram.com/${encodeURIComponent(username)}/`,
      Icon: Instagram,
    },
    twitter: {
      label: 'X / Twitter',
      url: `https://x.com/${encodeURIComponent(username)}`,
      Icon: Twitter,
    },
    x: {
      label: 'X',
      url: `https://x.com/${encodeURIComponent(username)}`,
      Icon: Twitter,
    },
    linkedin: {
      label: 'LinkedIn',
      url: `https://www.linkedin.com/in/${encodeURIComponent(username)}/`,
      Icon: Linkedin,
    },
    tiktok: {
      label: 'TikTok',
      url: `https://www.tiktok.com/@${encodeURIComponent(username)}`,
      Icon: MessageCircle,
    },
    facebook: {
      label: 'Facebook',
      url: `https://www.facebook.com/${encodeURIComponent(username)}`,
      Icon: Facebook,
    },
  };
  const profile = profiles[platformKey];
  if (!profile || !username) return null;
  const Icon = profile.Icon;

  return (
    <a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${profile.label} profile for ${handle}`}
      title={`Open ${profile.label} profile`}
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
        badge
          ? `shrink-0 px-2.5 py-1 text-[10px] font-bold ${
              isDark ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            }`
          : `text-[11px] font-semibold hover:underline ${
              isDark ? 'text-neutral-400 hover:text-amber-400' : 'text-gray-500 hover:text-amber-700'
            }`
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {badge ? profile.label : <span className="break-all">{handle}</span>}
      <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
    </a>
  );
}

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

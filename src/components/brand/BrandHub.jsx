import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, MapPin, Phone, MessageCircle, 
  Instagram, Facebook, Twitter, Mail, Clock, 
  Car, Star, ExternalLink, Users, Award, Leaf, Heart
} from 'lucide-react';
import { fetchBrandData } from '@/api/cms';

// Icon mapping for dynamic rendering based on CMS string values
const iconMap = {
  Leaf, Users, Award, Heart, MapPin, Phone, MessageCircle, 
  Instagram, Facebook, Twitter, Mail, Clock, Car, Star, ExternalLink, Info
};

export default function BrandHub() {
  const [activeTab, setActiveTab] = useState('about');
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'posts', label: 'Social Posts', icon: MessageCircle },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'directions', label: 'Directions', icon: MapPin },
  ];

  useEffect(() => {
    fetchBrandData().then(data => {
      setBrandData(data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load brand data:', err);
      setLoading(false);
    });
  }, []);

  const renderContent = () => {
    if (!brandData) return null;
    
    switch (activeTab) {
      case 'posts': return <PostsSection data={brandData.posts} />;
      case 'about': return <AboutSection data={brandData.about} />;
      case 'contact': return <ContactSection data={brandData.contact} />;
      case 'directions': return <DirectionsSection data={brandData.directions} />;
      default: return <AboutSection data={brandData.about} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading brand story...</p>
        </div>
      </div>
    );
  }

  if (!brandData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20 flex items-center justify-center p-8 text-center">
        <div>
          <p className="text-red-500 font-semibold mb-2">Failed to load brand data.</p>
          <button onClick={() => window.location.reload()} className="text-primary hover:underline">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20 pb-28">
      
      {/* Scrollable Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Bottom Navigation for Brand Page */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:border-gray-800 dark:bg-dark-card/95">
        <div className="mx-auto grid max-w-4xl grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`min-w-0 px-1 py-3 text-sm font-semibold capitalize border-t-2 transition-colors flex flex-col items-center justify-center gap-1 sm:px-3 sm:py-4 ${
                  isActive 
                    ? 'border-t-primary text-primary' 
                    : 'border-t-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-center text-[9px] leading-tight sm:text-[10px]">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ================= ABOUT / OUR STORY SECTION =================
function AboutSection({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg"
      >
        <img 
          src={data.heroImage} 
          alt="Restaurant Interior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{data.title}</h2>
          <p className="text-white/80 text-sm md:text-base">{data.subtitle}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {data.stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="bg-primary/10 dark:bg-primary/20 p-4 md:p-6 rounded-2xl text-center"
          >
            <span className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</span>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Story */}
      <div className="space-y-4">
        {data.story.map((paragraph, i) => (
          <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Mission & Values */}
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl border border-primary/20">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Our Mission
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.mission}</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Our Core Values</h3>
          {data.values.map((value, i) => {
            const Icon = iconMap[value.icon] || Info;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex gap-4 p-4 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">{value.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{value.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Team */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {data.team.map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="text-center bg-white dark:bg-dark-card p-4 rounded-2xl border border-gray-100 dark:border-gray-800"
            >
              <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-2 border-primary/20" />
              <p className="font-bold text-gray-900 dark:text-white">{member.name}</p>
              <p className="text-sm text-primary">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Customer Reviews */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-current" />
          What Our Guests Say
        </h3>
        <div className="space-y-3">
          {data.reviews.map((review, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white dark:bg-dark-card p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-auto">{review.date}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 italic">"{review.text}"</p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">— {review.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ================= POSTS / SOCIAL FEED SECTION =================
function PostsSection({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Updates</h2>
        <div className="flex gap-2">
          <a href="#" className="p-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 hover:bg-pink-200 transition">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 transition">
            <Facebook className="w-5 h-5" />
          </a>
        </div>
      </div>

      {data.map((post, i) => (
        <motion.div 
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
          className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <img src={post.image} alt="Post" className="w-full h-64 object-cover" />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">SG</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">savanna_grill</span>
              <span className="text-xs text-gray-500">• {post.time}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{post.caption}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> {post.comments}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ================= CONTACT SECTION =================
function ContactSection({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-4 pb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Get in Touch</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">We'd love to hear from you. Reach out through any of these channels.</p>

      <div className="space-y-3">
        <a href={`tel:${data.phone}`} className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary transition group">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 dark:text-white">Call Us</p>
            <p className="text-sm text-gray-500">{data.phone}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </a>

        <a href={`mailto:${data.email}`} className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary transition group">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 dark:text-white">Email Us</p>
            <p className="text-sm text-gray-500">{data.email}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </a>

        <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary transition group">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 dark:text-white">WhatsApp</p>
            <p className="text-sm text-gray-500">Quick responses, 9am-9pm</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </a>
      </div>

      {/* Social Media */}
      <div className="pt-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Follow Our Journey</h3>
        <div className="flex gap-3">
          <a href={data.socials.instagram} className="flex-1 flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/20">
            <Instagram className="w-5 h-5" />
            <span className="text-sm">Instagram</span>
          </a>
          <a href={data.socials.facebook} className="flex-1 flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-2xl font-semibold hover:opacity-90 transition shadow-lg shadow-blue-600/20">
            <Facebook className="w-5 h-5" />
            <span className="text-sm">Facebook</span>
          </a>
          <a href={data.socials.twitter} className="flex-1 flex items-center justify-center gap-2 p-4 bg-sky-500 text-white rounded-2xl font-semibold hover:opacity-90 transition shadow-lg shadow-sky-500/20">
            <Twitter className="w-5 h-5" />
            <span className="text-sm">Twitter</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ================= DIRECTIONS SECTION =================
function DirectionsSection({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-4 pb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Find Us</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">We are conveniently located in the heart of Westlands.</p>

      {/* Map Placeholder */}
      <div className="relative h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" 
          alt="Map" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <MapPin className="w-12 h-12 text-primary mb-2 drop-shadow-lg" />
          <p className="text-sm font-semibold text-gray-900 dark:text-white bg-white/90 dark:bg-dark-card/90 px-4 py-2 rounded-full shadow-lg">
            Sarit Centre, Westlands
          </p>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white mb-1">Address</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{data.address}</p>
          </div>
        </div>
      </div>

      {/* Hours */}
      <div className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 dark:text-white mb-2">Opening Hours</p>
            <div className="space-y-1 text-sm">
              {data.hours.map((slot, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{slot.days}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{slot.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Parking */}
      <div className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Car className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white mb-1">Parking</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{data.parking}</p>
          </div>
        </div>
      </div>

      {/* Get Directions Button */}
      <a 
        href={data.mapLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full p-4 bg-primary hover:bg-secondary text-white rounded-2xl font-bold transition shadow-lg shadow-primary/20 mt-4"
      >
        <MapPin className="w-5 h-5" />
        Get Directions in Google Maps
      </a>
    </div>
  );
}
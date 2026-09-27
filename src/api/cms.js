// ============================================================================
// src/api/cms.js - CMS API Integration
// ============================================================================
// 🎯 CURRENT MODE: Static Mock Data Only
// ✅ Compatibility functions that return mock data (no real API calls)
// ✅ Components can use same imports and function calls as before
// ✅ But now it's all local static data - zero backend dependency
// ============================================================================

// 1. Direct import of mock data (static)
import { categories as categoriesData, menuItems as itemsData } from '@/lib/mockData';

// 2. Compatibility functions (components can still call these - they return mock data)
export async function fetchCategories() {
  return Promise.resolve(categoriesData);
}

export async function fetchMenuItems() {
  return Promise.resolve(itemsData);
}

export async function fetchMenuItemByDocId(documentId) {
  const item = itemsData.find(i => i.documentId === documentId);
  return Promise.resolve(item || null);
}

export async function fetchBrandData() {
  return Promise.resolve(brandData);
}

// Also export as direct constants
export { categoriesData as categories, itemsData as menuItems };

// 3. Image URL resolver (handles both mock data arrays and CMS single images)
export function getCmsImageUrl(imageData, size = 'medium') {
  if (!imageData) return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80';
  // Handle mock data: array of { url, label } objects
  if (Array.isArray(imageData)) {
    return imageData[0]?.url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80';
  }
  // Handle CMS data: direct URL string or object with url property
  return imageData?.url || imageData || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80';
}

// 4. Get multiple dish images
export function getDishImages(imageArray = []) {
  return imageArray || [];
}

// ============================================================================
// 🏢 BRAND & ABOUT PAGE DATA (Static Mock Data)
// ============================================================================

export const brandData = {
  about: {
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    title: 'Our Heritage',
    subtitle: 'A decade of culinary excellence in the heart of Nairobi',
    stats: [
      { value: '10+', label: 'Years of Excellence' },
      { value: '50k+', label: 'Happy Guests' },
      { value: '4.9', label: 'Google Rating' }
    ],
    story: [
      'Founded in 2014 in the heart of Westlands, Savanna Grill was born from a simple belief: that authentic Kenyan cuisine deserves a modern, elegant setting.',
      'We source our ingredients from local farmers across Kenya, ensuring every dish tells the story of our land. From our signature Nyama Choma to our carefully crafted cocktails, everything is made with passion and pride.'
    ],
    mission: 'To celebrate Kenyan culinary heritage through innovative cuisine, exceptional service, and a warm, welcoming atmosphere that feels like home.',
    values: [
      { title: 'Sustainability', desc: 'We partner with local farmers and use eco-friendly practices.', icon: 'Leaf' },
      { title: 'Community', desc: 'We support local artists, musicians, and cultural events.', icon: 'Users' },
      { title: 'Quality', desc: 'Every dish is crafted with the finest ingredients and care.', icon: 'Award' }
    ],
    team: [
      { name: 'Chef Marcus', role: 'Head Chef', image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=400&q=80' },
      { name: 'Grace Wanjiku', role: 'Restaurant Manager', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80' },
      { name: 'David Ochieng', role: 'Head Bartender', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' }
    ],
    reviews: [
      { name: 'Sarah M.', rating: 5, text: 'Best Nyama Choma in Nairobi! The ambiance is incredible.', date: '1 week ago' },
      { name: 'James K.', rating: 5, text: 'Perfect spot for business lunches. Professional service.', date: '2 weeks ago' },
      { name: 'Amina H.', rating: 4, text: 'Love the authentic Kenyan flavors. Will definitely return!', date: '3 weeks ago' }
    ]
  },
  posts: [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      caption: 'Fresh Nyama Choma straight from the grill 🔥 #SavannaGrill #NyamaChoma #NairobiEats',
      likes: 247,
      comments: 18,
      time: '2 hours ago'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
      caption: 'Friday nights hit different with our signature cocktails 🍸 Book your table now!',
      likes: 189,
      comments: 12,
      time: '1 day ago'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      caption: 'Chef Marcus preparing our famous Pilau recipe passed down through generations 🍚✨',
      likes: 432,
      comments: 34,
      time: '3 days ago'
    }
  ],
  contact: {
    phone: '+254 703 412 694',
    email: 'hello@savannagrill.co.ke',
    whatsapp: '254703412694',
    socials: {
      instagram: '#',
      facebook: '#',
      twitter: '#'
    }
  },
  directions: {
    address: 'Sarit Centre, 2nd Floor, Westlands, Nairobi, Kenya',
    hours: [
      { days: 'Monday - Friday', time: '8:00 AM - 11:00 PM' },
      { days: 'Saturday - Sunday', time: '9:00 AM - 12:00 AM' }
    ],
    parking: 'Free parking available at Sarit Centre basement. Valet service available on weekends.',
    mapLink: 'https://maps.google.com/?q=Sarit+Centre+Nairobi'
  }
};

console.log('✅ Using Static Mock Data - No Backend API Calls');

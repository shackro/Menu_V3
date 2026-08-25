// src/api/cms.js

import { 
  getCategories as getMockCategories, 
  getMenuItems as getMockMenuItems, 
  getMenuItemByDocId as getMockMenuItem,
  getCmsImageUrl as getMockImageUrl 
} from '@/lib/mockData';

// 🎯 TOGGLE BACKEND HERE:
// Set to `true` to use the 60-item Mock Data (Instant, works perfectly on Vercel).
// Set to `false` to use the live Strapi CMS (May have Render spin-up delays).
const USE_MOCK_DATA = true; 

const BASE_URL = 'https://restaurant-menu-cms-s0ac.onrender.com/api';
const RESTAURANT_ID = '47da0aad-679c-48b4-91e7-ef38d92c8ad0';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80';

// ==========================================
// REAL API FUNCTIONS (Live Strapi CMS)
// ==========================================
async function fetchRealCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories?filters[restaurant_id][$eq]=${RESTAURANT_ID}&sort=sort_order:asc`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.warn('⚠️ Real categories fetch failed, falling back to mock:', error.message);
    return getMockCategories(); // 🛡️ Auto-fallback prevents crashes
  }
}

async function fetchRealMenuItems() {
  try {
    const query = new URLSearchParams({
      'filters[restaurant_id][$eq]': RESTAURANT_ID,
      'populate': 'category,inclusions,suggested_addons,image'
    });
    const res = await fetch(`${BASE_URL}/menu-items?${query}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.warn('⚠️ Real menu items fetch failed, falling back to mock:', error.message);
    return getMockMenuItems(); // 🛡️ Auto-fallback prevents crashes
  }
}

async function fetchRealMenuItemByDocId(identifier) {
  try {
    if (!identifier) return null;

    // 1. Try by documentId first (Strapi v5 / Document ID plugin)
    const query = new URLSearchParams({
      'filters[documentId][$eq]': String(identifier),
      'populate': 'category,inclusions,suggested_addons,image'
    });
    let res = await fetch(`${BASE_URL}/menu-items?${query}`);
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let data = await res.json();
    let item = data.data?.[0];
    
    // 2. Fallback: try numeric ID if documentId fails (Strapi v4 compatibility)
    if (!item && !isNaN(identifier)) {
      const fallbackQuery = new URLSearchParams({
        'filters[id][$eq]': String(identifier),
        'populate': 'category,inclusions,suggested_addons,image'
      });
      const fallbackRes = await fetch(`${BASE_URL}/menu-items?${fallbackQuery}`);
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        item = fallbackData.data?.[0];
      }
    }
    
    return item || null;
  } catch (error) {
    console.warn(`⚠️ Real item fetch failed for ${identifier}, falling back to mock:`, error.message);
    return getMockMenuItem(identifier); // 🛡️ Auto-fallback prevents "Dish not found"
  }
}

function getRealCmsImageUrl(imageData, size = 'medium') {
  if (!imageData?.data?.attributes) return FALLBACK_IMAGE;
  const formats = imageData.data.attributes.formats;
  let url = formats?.[size]?.url || formats?.small?.url || formats?.medium?.url || imageData.data.attributes.url;
  return url?.startsWith('http') ? url : `${BASE_URL.replace('/api', '')}${url}` || FALLBACK_IMAGE;
}

// ==========================================
// EXPORTS (Environment & Fallback Aware)
// ==========================================

export const fetchCategories = USE_MOCK_DATA ? getMockCategories : fetchRealCategories;
export const fetchMenuItems = USE_MOCK_DATA ? getMockMenuItems : fetchRealMenuItems;
export const fetchMenuItemByDocId = USE_MOCK_DATA ? getMockMenuItem : fetchRealMenuItemByDocId;

export function getCmsImageUrl(imageData, size = 'medium') {
  // The mock resolver is smart enough to handle both mock structures AND real CMS structures
  const mockUrl = getMockImageUrl(imageData, size);
  if (mockUrl !== FALLBACK_IMAGE) return mockUrl;
  
  return USE_MOCK_DATA ? mockUrl : getRealCmsImageUrl(imageData, size);
}

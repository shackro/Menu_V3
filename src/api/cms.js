// const BASE_URL = 'https://restaurant-menu-cms-s0ac.onrender.com/api';
// const RESTAURANT_ID = '47da0aad-679c-48b4-91e7-ef38d92c8ad0';
// const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80';

// /**
//  * Resolves CMS image URLs with intelligent Cloudinary format selection.
//  * Per API docs: "Use the smallest format that fits the UI slot... rather than always loading image.url"
//  * 
//  * @param {object} imageData - The image object from Strapi response
//  * @param {'thumbnail'|'small'|'medium'|'large'} size - Preferred Cloudinary format
//  * @returns {string} Optimized image URL or fallback
//  */
// export function getCmsImageUrl(imageData, size = 'medium') {
//   if (!imageData?.data?.attributes) {
//     return FALLBACK_IMAGE;
//   }

//   const attributes = imageData.data.attributes;
//   const formats = attributes.formats;

//   // Cascade through sizes: requested → smaller alternatives → original
//   let imageUrl = formats?.[size]?.url 
//               || formats?.small?.url 
//               || formats?.medium?.url 
//               || formats?.thumbnail?.url 
//               || attributes.url;

//   // Handle relative vs absolute URLs (Strapi returns relative paths for local uploads)
//   return imageUrl?.startsWith('http') 
//     ? imageUrl 
//     : `${BASE_URL.replace('/api', '')}${imageUrl}` || FALLBACK_IMAGE;
// }

// /**
//  * Fetches all published categories ordered by sort_order.
//  * Returns empty array on failure to prevent UI crashes during Render spin-up.
//  */
// export async function fetchCategories() {
//   try {
//     const res = await fetch(
//       `${BASE_URL}/categories?filters[restaurant_id][$eq]=${RESTAURANT_ID}&sort=sort_order:asc`
//     );
    
//     if (!res.ok) {
//       console.warn(`Categories fetch failed with status ${res.status}. Server may be spinning up.`);
//       return [];
//     }
    
//     const data = await res.json();
//     return data.data || [];
//   } catch (error) {
//     console.error('Error fetching categories:', error.message);
//     return [];
//   }
// }

// /**
//  * Fetches all published menu items with explicit relation population.
//  * Uses targeted populate instead of * for optimal payload size.
//  */
// export async function fetchMenuItems() {
//   try {
//     const query = new URLSearchParams({
//       'filters[restaurant_id][$eq]': RESTAURANT_ID,
//       'populate': 'category,inclusions,suggested_addons,image'
//     });
    
//     const res = await fetch(`${BASE_URL}/menu-items?${query}`);
    
//     if (!res.ok) {
//       console.warn(`Menu items fetch failed with status ${res.status}. Server may be spinning up.`);
//       return [];
//     }
    
//     const data = await res.json();
//     return data.data || [];
//   } catch (error) {
//     console.error('Error fetching menu items:', error.message);
//     return [];
//   }
// }

// /**
//  * Fetches a single menu item by documentId with full relation population.
//  * Returns null if not found or on error.
//  */
// export async function fetchMenuItemByDocId(documentId) {
//   try {
//     const query = new URLSearchParams({
//       'filters[documentId][$eq]': documentId,
//       'populate': 'category,inclusions,suggested_addons,image'
//     });
    
//     const res = await fetch(`${BASE_URL}/menu-items?${query}`);
    
//     if (!res.ok) {
//       console.warn(`Single item fetch failed with status ${res.status}.`);
//       return null;
//     }
    
//     const data = await res.json();
//     return data.data?.[0] || null;
//   } catch (error) {
//     console.error('Error fetching menu item by ID:', error.message);
//     return null;
//   }
// }


// src/api/cms.js
import { 
  getCategories as getMockCategories, 
  getMenuItems as getMockMenuItems, 
  getMenuItemByDocId as getMockMenuItem,
  getCmsImageUrl as getMockImageUrl 
} from '@/lib/mockData';

const IS_DEV = import.meta.env.DEV; // True in 'npm run dev', False in 'npm run build'
const BASE_URL = 'https://restaurant-menu-cms-s0ac.onrender.com/api';
const RESTAURANT_ID = '47da0aad-679c-48b4-91e7-ef38d92c8ad0';

// --- REAL API FUNCTIONS (Used in Production) ---
async function fetchRealCategories() {
  const res = await fetch(`${BASE_URL}/categories?filters[restaurant_id][$eq]=${RESTAURANT_ID}&sort=sort_order:asc`);
  const data = await res.json();
  return data.data || [];
}

async function fetchRealMenuItems() {
  const query = new URLSearchParams({
    'filters[restaurant_id][$eq]': RESTAURANT_ID,
    'populate': 'category,inclusions,suggested_addons,image'
  });
  const res = await fetch(`${BASE_URL}/menu-items?${query}`);
  const data = await res.json();
  return data.data || [];
}

async function fetchRealMenuItemByDocId(documentId) {
  const query = new URLSearchParams({
    'filters[documentId][$eq]': documentId,
    'populate': 'category,inclusions,suggested_addons,image'
  });
  const res = await fetch(`${BASE_URL}/menu-items?${query}`);
  const data = await res.json();
  return data.data?.[0] || null;
}

function getRealCmsImageUrl(imageData, size = 'medium') {
  if (!imageData?.data?.attributes) return getMockImageUrl(null);
  const formats = imageData.data.attributes.formats;
  let url = formats?.[size]?.url || formats?.small?.url || formats?.medium?.url || imageData.data.attributes.url;
  return url?.startsWith('http') ? url : `${BASE_URL.replace('/api', '')}${url}` || getMockImageUrl(null);
}

// --- ENVIRONMENT-AWARE EXPORTS ---
// When running locally (npm run dev), it uses the 60-item mock data instantly.
// When deployed (npm run build), it fetches from the live Strapi CMS.
export const fetchCategories = IS_DEV ? getMockCategories : fetchRealCategories;
export const fetchMenuItems = IS_DEV ? getMockMenuItems : fetchRealMenuItems;
export const fetchMenuItemByDocId = IS_DEV ? getMockMenuItem : fetchRealMenuItemByDocId;

export function getCmsImageUrl(imageData, size = 'medium') {
  return IS_DEV ? getMockImageUrl(imageData, size) : getRealCmsImageUrl(imageData, size);
}
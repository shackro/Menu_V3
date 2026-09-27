# 🎭 Mock Data Setup Guide

## Overview

The Digmenu application is currently configured to use **mock data exclusively**. This means:
- ✅ No backend server required
- ✅ Works offline
- ✅ Instant development
- ✅ Full feature testing
- ✅ Same API structure as real backend

**All real API calls are commented out** and ready to be enabled when you connect a real backend.

---

## Current Setup

### Files Involved

1. **`src/api/cms.js`** - API integration layer
   - Imports and re-exports mock functions
   - Contains commented-out real API code
   - Returns mock data with realistic structure

2. **`src/lib/mockData.js`** - Mock data definitions
   - 60 menu items across 9 categories
   - 120+ Unsplash images (2 per item)
   - Brand/about page data
   - Exports functions matching real API interface

### Mock Data Contents

```
Total Items: 60
├── Breakfast: 10 items
├── Lunch: 10 items  
├── Dinner: 10 items
├── Desserts: 10 items
├── Bar & Cocktails: 5 items
├── Coffee & Drinks: 5 items
├── Spa & Wellness: 5 items
├── Room Service: 2 items
└── Concierge & Events: 3 items

Images: 120+ high-quality photos from Unsplash
Categories: 9 with emojis & metadata
Extra Data: Team info, reviews, contact, social media
```

---

## How It Works

### 1. Export Flow

```
src/api/cms.js (exports)
    ↓
    ├─→ fetchCategories() → imports from mockData.js
    ├─→ fetchMenuItems() → imports from mockData.js
    ├─→ fetchMenuItemByDocId() → imports from mockData.js
    ├─→ getCmsImageUrl() → imports from mockData.js
    ├─→ getDishImages() → imports from mockData.js
    └─→ fetchBrandData() → uses BRAND_MOCK_DATA object

src/lib/mockData.js (exports)
    ├─→ categories array
    ├─→ menuItems array (60 items)
    ├─→ getCategories() function
    ├─→ getMenuItems() function
    ├─→ getMenuItemByDocId() function
    ├─→ getCmsImageUrl() function
    └─→ getDishImages() function
```

### 2. Component Usage

Components import and use just like they would with a real API:

```javascript
// In any React component:
import { fetchMenuItems, fetchCategories } from '@/api/cms';

// Usage is identical to real API:
const items = await fetchMenuItems();  // Returns mock data
const cats = await fetchCategories();  // Returns mock data
```

**The component doesn't know or care if data is mock or real!**

---

## Mock Data Structure

### Menu Item Object
```javascript
{
  id: 100,
  documentId: "item100",
  name: "Classic Eggs Benedict",
  description: "Freshly prepared daily with premium, locally sourced ingredients.",
  price: 850,
  is_available: true,
  status_badge: "best_seller" | "chefs_choice" | null,
  spice_level: "mild" | "medium" | "hot" | null,
  is_halal: boolean,
  is_vegetarian: boolean,
  is_vegan: boolean,
  restaurant_id: "47da0aad-679c-48b4-91e7-ef38d92c8ad0",
  category: {
    documentId: "cat001",
    name: "Breakfast"
  },
  inclusions: [
    { label: "Coffee or Tea" }
  ],
  suggested_addons: [],
  images: [
    { url: "https://...", label: "Main View" },
    { url: "https://...", label: "Plated Detail" }
  ]
}
```

### Category Object
```javascript
{
  id: 1,
  documentId: "cat001",
  name: "Breakfast",
  icon_emoji: "🍳",
  sort_order: 1,
  restaurant_id: "47da0aad-679c-48b4-91e7-ef38d92c8ad0"
}
```

---

## Using Mock Data in Development

### Everything Just Works™

No special configuration needed. When you run the app:

```bash
npm run dev
```

1. App requests menu items
2. Mock functions return instantly
3. Components render with mock data
4. Full feature functionality

### Console Output

When app starts, you'll see:
```
✅ CMS API: Using MOCK DATA (Development Mode)
💡 To switch to real backend:
   1. Update VITE_API_BASE_URL in .env.local
   2. Uncomment real API functions in src/api/cms.js
   3. Restart dev server
```

---

## Switching to Real Backend

### Step 1: Update Environment

Edit `.env.local`:
```diff
- VITE_API_BASE_URL=http://localhost:3000/api
+ VITE_API_BASE_URL=https://your-real-backend.com/api
  VITE_RESTAURANT_ID=47da0aad-679c-48b4-91e7-ef38d92c8ad0
```

### Step 2: Uncomment Real API Code

In `src/api/cms.js`, find the **"REAL BACKEND API INTEGRATION"** section (around line 365).

Uncomment the real API functions:
- `fetchCategories()`
- `fetchMenuItems()`
- `fetchMenuItemByDocId(id)`
- `getCmsImageUrl(image)`
- `fetchBrandData()`

### Step 3: Remove Mock Exports

Comment out or delete the mock exports at the top of `src/api/cms.js`:
```javascript
// BEFORE:
export {
  getCategories as fetchCategories,
  getMenuItems as fetchMenuItems,
  getMenuItemByDocId as fetchMenuItemByDocId,
} from '@/lib/mockData';

// AFTER (comment out):
// export {
//   getCategories as fetchCategories,
//   getMenuItems as fetchMenuItems,
//   getMenuItemByDocId as fetchMenuItemByDocId,
// } from '@/lib/mockData';
```

### Step 4: Restart Dev Server

```bash
npm run dev
```

**That's it!** The app will now use real API data while maintaining the exact same structure and functionality.

---

## When You're Deployed

### With Mock Data (Current)
- Works everywhere instantly
- No backend dependency
- Great for demos, staging, previews
- Can be production-ready if intended

### With Real Backend
1. Update API URLs in production env vars
2. Ensure CORS is configured on backend
3. API responses match mock structure
4. App works identically to development

---

## Testing with Mock Data

### Manual Testing Checklist
- [ ] Load homepage
- [ ] Browse menu by category
- [ ] Click individual dishes
- [ ] View dish details with images
- [ ] Add items to cart
- [ ] View cart page
- [ ] Test dark mode toggle
- [ ] Check responsive design (mobile/tablet)
- [ ] Visit brand/about page
- [ ] Check console for errors

### Sample Items to Test
- **Breakfast**: "Classic Eggs Benedict" (id: 100)
- **Lunch**: "Beef Pilau" (id: 201)
- **Dinner**: "Nyama Choma Platter" (id: 301)
- **Drinks**: "Fresh Passion Juice" (id: 401)

Each has full details, images, dietary info, etc.

---

## Common Questions

### Q: Can I use mock data in production?
**A:** Yes! If this is a demo, landing page, or menu preview site, mock data is perfectly fine. You can keep this indefinitely.

### Q: Will components break when I switch to real API?
**A:** No! As long as your API returns data in the same structure as the mock data, everything works without code changes.

### Q: Can I keep both mock and real?
**A:** Yes! You could add a feature flag in `.env.local`:
```
VITE_USE_MOCK_DATA=true  # or false
```

Then switch between them in `src/api/cms.js`.

### Q: What if my API response is different?
**A:** You'll need to transform the API response to match the mock structure. Add a transformation layer in `src/api/cms.js`.

### Q: Can I add more mock items?
**A:** Absolutely! Edit `src/lib/mockData.js` and add to the `menuItems` array. Follow the same structure.

---

## Files Reference

| File | Purpose | Lines |
|------|---------|-------|
| `src/api/cms.js` | API layer (mock exports + real API commented) | 450+ |
| `src/lib/mockData.js` | Mock data definitions | 324 |
| `.env.local` | Environment configuration | 10 |

---

## Summary

✅ **Current Status**: Mock data only, fully functional  
✅ **Components**: All work with mock data  
✅ **Images**: 120+ quality images loaded  
✅ **Ready to switch**: Real API code prepared and commented  
✅ **No breaking changes**: Switch to real API seamlessly  

**You can start building and testing immediately with zero backend setup!** 🎉

When you're ready for a real backend, just uncomment the code and update the API URL. Simple!

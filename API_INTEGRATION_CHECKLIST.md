# 🔄 API Integration Checklist

Use this checklist when you're ready to switch from mock data to a real backend API.

## Pre-Integration

- [ ] Backend API is deployed and running
- [ ] Backend endpoint URLs documented
- [ ] API response structure known (match it to mock structure)
- [ ] CORS configured on backend (allow localhost for dev)
- [ ] Authentication method decided (if needed)

## Step-by-Step Migration

### 1. Environment Setup
```bash
# Edit .env.local
VITE_API_BASE_URL=https://your-api.com/api
VITE_RESTAURANT_ID=47da0aad-679c-48b4-91e7-ef38d92c8ad0
```

- [ ] API base URL updated
- [ ] Restaurant ID set (or fetched dynamically)
- [ ] Authentication tokens configured (if needed)

### 2. API Layer Updates (src/api/cms.js)

**Option A: Comment Out Mock Exports**
```javascript
// Disable mock data:
// export {
//   getCategories as fetchCategories,
//   ...
// } from '@/lib/mockData';
```
- [ ] Mock category export commented
- [ ] Mock menu items export commented
- [ ] Mock item by ID export commented

**Option B: Uncomment Real API Functions**
```javascript
// Uncomment from "REAL BACKEND API INTEGRATION" section:
// export async function fetchCategories() { ... }
// export async function fetchMenuItems() { ... }
// export async function fetchMenuItemByDocId() { ... }
```
- [ ] `fetchCategories()` uncommented & tested
- [ ] `fetchMenuItems()` uncommented & tested
- [ ] `fetchMenuItemByDocId()` uncommented & tested
- [ ] `getCmsImageUrl()` uncommented & tested
- [ ] `fetchBrandData()` uncommented & tested

### 3. Response Structure Validation

Verify your API returns data matching mock structure:

**Categories Response**
```javascript
[
  {
    id: 1,
    documentId: "cat001",
    name: "Breakfast",
    icon_emoji: "🍳",
    sort_order: 1,
    restaurant_id: "..."
  }
]
```
- [ ] API returns categories array
- [ ] Each category has required fields
- [ ] Sort order respected

**Menu Items Response**
```javascript
[
  {
    id: 100,
    documentId: "item100",
    name: "Item Name",
    description: "...",
    price: 1000,
    is_available: true,
    category: { documentId: "...", name: "..." },
    images: [{ url: "...", label: "..." }],
    ...
  }
]
```
- [ ] API returns items array
- [ ] Each item has required fields
- [ ] Image URLs are absolute or properly resolved
- [ ] Category relation populated

### 4. Image Handling

Update `getCmsImageUrl()` if needed:
```javascript
export function getCmsImageUrl(imageData, size = 'medium') {
  // Adapt to your API's image structure
  if (imageData?.url) return imageData.url;
  // ... handle your specific format
}
```
- [ ] Images load correctly
- [ ] Fallback image works
- [ ] Different sizes/formats handled

### 5. Error Handling

Real API needs proper error handling:
```javascript
export async function fetchMenuItems() {
  try {
    const res = await fetch(/* ... */);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error:', error);
    return []; // Return empty array as fallback
  }
}
```
- [ ] Network errors handled gracefully
- [ ] Empty arrays returned on failure (not null)
- [ ] Error messages logged
- [ ] App doesn't crash on API errors

### 6. Testing

Run through the test cases:

**Menu Loading**
```bash
npm run dev
# Open http://localhost:5173/menu
```
- [ ] Menu page loads
- [ ] Categories display
- [ ] Items load from real API
- [ ] No console errors

**Dish Details**
- [ ] Click a dish to view details
- [ ] Images load from real API
- [ ] All fields display correctly
- [ ] Price, description, dietary info shown

**Cart Functionality**
- [ ] Add items to cart
- [ ] Remove items
- [ ] Update quantities
- [ ] Prices calculate correctly

**Brand Page**
```bash
# Open http://localhost:5173/brand
```
- [ ] Brand data loads from real API
- [ ] Images display
- [ ] Team info shows
- [ ] Contact details visible

### 7. Performance & Caching

Consider adding caching for better UX:
```javascript
// Add simple cache:
const cache = {};

export async function fetchMenuItems() {
  if (cache.items) return cache.items;
  const items = await fetch(/* ... */);
  cache.items = items;
  return items;
}
```
- [ ] Caching strategy decided
- [ ] Load times acceptable
- [ ] Implement caching (if needed)

### 8. Authentication (If Required)

Add auth header to requests:
```javascript
export async function fetchMenuItems() {
  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}` };
  const res = await fetch(url, { headers });
  // ...
}
```
- [ ] Auth tokens included in headers
- [ ] Token refresh logic implemented (if needed)
- [ ] 401/403 errors handled

### 9. Deployment

Before going live:
```bash
# Build for production
npm run build

# Test production build
npm run preview
```
- [ ] Production build succeeds
- [ ] Preview works with real API
- [ ] No console errors
- [ ] All features working

### 10. Going Live

- [ ] Update production `.env` with real API URL
- [ ] Deploy to hosting (Vercel, etc)
- [ ] Test in production
- [ ] Monitor for API errors
- [ ] Monitor performance

## Rollback Plan

If real API has issues, quickly revert:

1. **Revert to mock (git)**
```bash
git checkout HEAD -- src/api/cms.js
npm run dev
```

2. **Or manually**
- Comment out real API functions
- Uncomment mock exports
- Restart dev server

- [ ] Rollback procedure documented
- [ ] Team knows how to revert

## Performance Checklist

- [ ] API response times < 1 second
- [ ] Images load quickly (or use CDN)
- [ ] Implement pagination (if 60+ items)
- [ ] Add loading states
- [ ] Add error boundaries

## Monitoring

Set up error tracking:
- [ ] API error logging enabled
- [ ] Performance monitoring active
- [ ] User error reporting working

## Documentation

- [ ] Update API docs in project
- [ ] Document custom API modifications
- [ ] Add team notes to README
- [ ] Create runbook for troubleshooting

## Post-Launch

- [ ] Monitor API uptime
- [ ] Track error rates
- [ ] Gather performance metrics
- [ ] Plan optimizations

---

## Quick Commands

```bash
# View what data structure app expects
cat src/lib/mockData.js | head -200

# View real API code (commented)
cat src/api/cms.js | grep -A 20 "REAL BACKEND"

# Check environment
cat .env.local

# Start dev server
npm run dev

# Build for production
npm run build
```

## Support

If you hit issues:
1. Check that API response matches mock structure
2. Look for console errors
3. Check API is returning valid JSON
4. Verify CORS headers
5. Check `.env.local` is correct
6. Restart dev server

---

**Status**: ✅ Ready to integrate real backend  
**Last Updated**: 2026-09-27

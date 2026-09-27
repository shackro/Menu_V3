# 📊 API: Mock vs Real - Quick Reference

## Function Comparison

### fetchCategories()

**Mock Version (Current)**
```javascript
// Returns instantly
const categories = await fetchCategories();
// Result: [{ id: 1, name: "Breakfast", ... }, ...]
```

**Real Version (Commented Out)**
```javascript
// Calls your backend
const res = await fetch(`${BASE_URL}/categories?filters[restaurant_id][$eq]=${RESTAURANT_ID}`);
const data = await res.json();
return data.data || [];
```

---

### fetchMenuItems()

**Mock Version (Current)**
```javascript
// Returns 60 items instantly
const items = await fetchMenuItems();
// Result: [{ id: 100, name: "Eggs Benedict", ... }, ...]
```

**Real Version (Commented Out)**
```javascript
// Calls your backend
const query = new URLSearchParams({
  'filters[restaurant_id][$eq]': RESTAURANT_ID,
  'populate': 'category,inclusions,suggested_addons,image'
});
const res = await fetch(`${BASE_URL}/menu-items?${query}`);
const data = await res.json();
return data.data || [];
```

---

### fetchMenuItemByDocId(id)

**Mock Version (Current)**
```javascript
// Finds item by documentId
const item = await fetchMenuItemByDocId('item100');
// Result: { id: 100, name: "Eggs Benedict", ... }
```

**Real Version (Commented Out)**
```javascript
// Fetches from backend by documentId
const query = new URLSearchParams({
  'filters[documentId][$eq]': String(identifier),
  'populate': 'category,inclusions,suggested_addons,image'
});
const res = await fetch(`${BASE_URL}/menu-items?${query}`);
const data = await res.json();
return data.data?.[0] || null;
```

---

### getCmsImageUrl(imageData)

**Mock Version (Current)**
```javascript
// Returns image URL from array or object
const url = getCmsImageUrl({ url: 'https://...' });
// Result: "https://images.unsplash.com/..."
```

**Real Version (Commented Out)**
```javascript
// Handles Strapi format with image variants
if (imageData?.formats?.medium?.url) {
  return imageData.formats.medium.url;
}
return imageData.url || FALLBACK_IMAGE;
```

---

### fetchBrandData()

**Mock Version (Current)**
```javascript
// Returns mock brand data with 300ms delay
const brand = await fetchBrandData();
// Result: { about: {...}, posts: [...], contact: {...} }
```

**Real Version (Commented Out)**
```javascript
// Fetches brand data from backend
const res = await fetch(`${BASE_URL}/brand-page?populate=*`);
if (!res.ok) throw new Error('Failed to fetch');
return await res.json();
```

---

## Data Structure Match

Both mock and real must return same structure:

### Menu Item Structure
```javascript
{
  id: 100,                          // Unique ID
  documentId: "item100",            // Document ID (for lookups)
  name: "Eggs Benedict",            // Item name
  description: "...",               // Description
  price: 850,                       // Price in cents
  is_available: true,               // Availability
  status_badge: "best_seller",      // Optional: "best_seller"|"chefs_choice"
  spice_level: "mild",              // Optional: "mild"|"medium"|"hot"
  is_halal: true,                   // Dietary info
  is_vegetarian: false,             // Dietary info
  is_vegan: false,                  // Dietary info
  restaurant_id: "47da0aad...",    // Restaurant ID
  
  // Relations
  category: {
    documentId: "cat001",
    name: "Breakfast"
  },
  
  // Arrays
  inclusions: [
    { label: "Coffee or Tea" }
  ],
  suggested_addons: [],
  
  // Images
  images: [
    { url: "https://...", label: "Main View" },
    { url: "https://...", label: "Plated Detail" }
  ]
}
```

### Category Structure
```javascript
{
  id: 1,
  documentId: "cat001",
  name: "Breakfast",
  icon_emoji: "🍳",
  sort_order: 1,
  restaurant_id: "47da0aad..."
}
```

### Brand Data Structure
```javascript
{
  about: {
    heroImage: "https://...",
    title: "Our Heritage",
    subtitle: "...",
    stats: [{ value: "10+", label: "Years" }],
    story: ["...", "..."],
    mission: "...",
    values: [{ title: "...", desc: "...", icon: "Leaf" }],
    team: [{ name: "...", role: "...", image: "..." }],
    reviews: [{ name: "...", rating: 5, text: "...", date: "..." }]
  },
  posts: [
    { id: 1, image: "...", caption: "...", likes: 247, comments: 18, time: "2h ago" }
  ],
  contact: {
    phone: "+254...",
    email: "hello@...",
    whatsapp: "254...",
    socials: { instagram: "#", facebook: "#", twitter: "#" }
  },
  directions: {
    address: "...",
    hours: [{ days: "Monday-Friday", time: "9am-11pm" }],
    parking: "Free parking...",
    mapLink: "https://..."
  }
}
```

---

## Return Values

| Function | Mock Returns | Real Returns | Notes |
|----------|--------------|--------------|-------|
| `fetchCategories()` | Promise<Array> | Promise<Array> | Same structure |
| `fetchMenuItems()` | Promise<Array> | Promise<Array> | Same structure |
| `fetchMenuItemByDocId()` | Promise<Object\|null> | Promise<Object\|null> | Single item or null |
| `getCmsImageUrl()` | String (URL) | String (URL) | Falls back to default |
| `fetchBrandData()` | Promise<Object\|null> | Promise<Object\|null> | Brand data or null |

---

## Error Handling

| Scenario | Mock Behavior | Real Behavior |
|----------|--------------|--------------|
| Item not found | Returns `null` | Returns `null` |
| API down | Returns empty array `[]` | Returns empty array `[]` |
| Bad image URL | Returns fallback | Returns fallback |
| CORS error | N/A (no network) | Caught by try/catch |
| Invalid JSON | N/A | Caught by try/catch |

---

## Key Differences

| Aspect | Mock | Real |
|--------|------|------|
| **Speed** | Instant | Depends on network (1-2s typical) |
| **Data** | Fixed 60 items | Dynamic, your backend |
| **Network** | No calls | HTTP/HTTPS requests |
| **Errors** | Never fails | Can fail (handle gracefully) |
| **CORS** | Not needed | Must be configured |
| **Auth** | Not needed | Add if required |
| **Images** | Unsplash URLs | Your image CDN/server |

---

## How to Validate Your Real API

Before deploying:

```bash
# 1. Check response from API
curl "https://your-api.com/api/categories?filters[restaurant_id][$eq]=47da0aad..."

# 2. Expected response format:
{
  "data": [
    { "id": 1, "name": "Breakfast", ... },
    ...
  ]
}

# 3. Test fetchCategories() returns array
# 4. Test fetchMenuItems() returns items with images
# 5. Test fetchMenuItemByDocId(id) finds single item
# 6. Test getCmsImageUrl() returns valid URLs
# 7. Test with network offline (should handle gracefully)
```

---

## Switch Checklist

- [ ] API responds with same structure as mock
- [ ] All required fields present in API response
- [ ] Images load from API URLs
- [ ] Error handling works (no crashes)
- [ ] Performance acceptable (< 2 seconds)
- [ ] CORS configured
- [ ] Console shows no errors
- [ ] Cart/checkout works with real data
- [ ] Dark mode works with real data
- [ ] Responsive design works with real data

---

## After You Switch

Monitor for:
- API response times
- Network errors
- Missing data fields
- Image loading issues
- CORS errors
- 404/500 responses

If issues arise, you can always revert to mock data by commenting/uncommenting the exports.

---

**The mock and real versions are designed to be drop-in replacements. Switch with zero code changes in components!**

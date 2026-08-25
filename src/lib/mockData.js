// src/lib/mockData.js
// 60 Items | 120 Images (2 views per item) | Full Hotel Service Coverage

const RESTAURANT_ID = "47da0aad-679c-48b4-91e7-ef38d92c8ad0";

// Helper to generate consistent documentIds
const genId = (prefix, num) => `${prefix}${String(num).padStart(3, '0')}`;

// Curated Unsplash Image Pairs (Main View + Detail/Plated View)
const IMG = {
  burger: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80'
  ],
  steak: [
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  ],
  pizza: [
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
  ],
  pasta: [
    'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
  ],
  salad: [
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80'
  ],
  chicken: [
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  ],
  seafood: [
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595170539493-9aa235b89a19?auto=format&fit=crop&w=800&q=80'
  ],
  dessert: [
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80'
  ],
  cocktail: [
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80'
  ],
  coffee: [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
  ],
  breakfast: [
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80'
  ],
  spa: [
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80'
  ],
  room: [
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
  ],
  hotel: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'
  ],
  nyama: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  ugali: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
  pilau: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  chapati: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  tea: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
  fish: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
  cocktail: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
};

export function getMenuItems() { return Promise.resolve(menuItems); }
export function getMenuItemByDocId(documentId) { return Promise.resolve(menuItems.find(i => i.documentId === documentId) || null); }

export const categories = [
  { id: 1, documentId: genId('cat', 1), name: "Breakfast", icon_emoji: "🍳", sort_order: 1, restaurant_id: RESTAURANT_ID },
  { id: 2, documentId: genId('cat', 2), name: "Lunch", icon_emoji: "☀️", sort_order: 2, restaurant_id: RESTAURANT_ID },
  { id: 3, documentId: genId('cat', 3), name: "Dinner", icon_emoji: "🍽️", sort_order: 3, restaurant_id: RESTAURANT_ID },
  { id: 4, documentId: genId('cat', 4), name: "Desserts", icon_emoji: "🍰", sort_order: 4, restaurant_id: RESTAURANT_ID },
  { id: 5, documentId: genId('cat', 5), name: "Bar & Cocktails", icon_emoji: "🍸", sort_order: 5, restaurant_id: RESTAURANT_ID },
  { id: 6, documentId: genId('cat', 6), name: "Coffee & Drinks", icon_emoji: "☕", sort_order: 6, restaurant_id: RESTAURANT_ID },
  { id: 7, documentId: genId('cat', 7), name: "Spa & Wellness", icon_emoji: "💆‍♀️", sort_order: 7, restaurant_id: RESTAURANT_ID },
  { id: 8, documentId: genId('cat', 8), name: "Room Service", icon_emoji: "🛎️", sort_order: 8, restaurant_id: RESTAURANT_ID },
  { id: 9, documentId: genId('cat', 9), name: "Concierge & Events", icon_emoji: "🥂", sort_order: 9, restaurant_id: RESTAURANT_ID },
];

// 60 Items with 2 images each (120 total images)
export const menuItems = [
  // BREAKFAST (1-10)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 100 + i, documentId: genId('item', 100 + i),
    name: ["Classic Eggs Benedict", "Avocado Toast Supreme", "Belgian Waffles", "Full English Breakfast", 
           "Smoked Salmon Bagel", "French Toast Stack", "Omelette Station", "Granola Power Bowl",
           "Pancake Trio", "Breakfast Burrito"][i],
    description: "Freshly prepared daily with premium, locally sourced ingredients.", 
    price: 850 + (i * 50), is_available: true, 
    status_badge: i === 0 ? "best_seller" : null, spice_level: null,
    is_halal: true, is_vegetarian: i % 2 === 0, is_vegan: i === 7,
    restaurant_id: RESTAURANT_ID, 
    category: { documentId: genId('cat', 1), name: "Breakfast" },
    inclusions: [{ label: "Coffee or Tea" }], 
    suggested_addons: [], 
    images: [
      { url: IMG.breakfast[0], label: 'Main View' }, 
      { url: IMG.breakfast[1], label: 'Plated Detail' }
    ]
  })),

  // LUNCH (11-20)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 200 + i, documentId: genId('item', 200 + i),
    name: ["Grilled Chicken Caesar", "Beef Burger Deluxe", "Margherita Pizza", "Thai Green Curry",
           "Tuna Poke Bowl", "Club Sandwich", "Falafel Wrap", "Seafood Pasta",
           "BBQ Ribs Plate", "Veggie Buddha Bowl"][i],
    description: "Served with house salad and artisan bread basket.", 
    price: 1200 + (i * 100), is_available: true, 
    status_badge: i === 1 ? "best_seller" : i === 2 ? "chefs_choice" : null,
    spice_level: i === 3 ? "medium" : i === 8 ? "hot" : null,
    is_halal: true, is_vegetarian: [6, 9].includes(i), is_vegan: [6, 9].includes(i),
    restaurant_id: RESTAURANT_ID, 
    category: { documentId: genId('cat', 2), name: "Lunch" },
    inclusions: [{ label: "Side Salad" }, { label: "Bread Basket" }], 
    suggested_addons: [], 
    images: [
      { url: [IMG.burger, IMG.pizza, IMG.pasta, IMG.salad, IMG.chicken][i % 5][0], label: 'Main View' }, 
      { url: [IMG.burger, IMG.pizza, IMG.pasta, IMG.salad, IMG.chicken][i % 5][1], label: 'Ingredients' }
    ]
  })),

  // DINNER (21-30)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 300 + i, documentId: genId('item', 300 + i),
    name: ["Ribeye Steak 300g", "Pan-Seared Salmon", "Lamb Chops Rack", "Truffle Mushroom Pasta",
           "Whole Grilled Sea Bass", "Beef Wellington", "Duck Confit", "Lobster Thermidor",
           "Venison Medallions", "Chicken Tikka Masala"][i],
    description: "Chef's signature preparation with seasonal accompaniments.", 
    price: 2500 + (i * 200), is_available: true, 
    status_badge: i === 0 ? "best_seller" : i === 5 ? "chefs_choice" : null,
    spice_level: i === 9 ? "medium" : null,
    is_halal: [0, 2, 5, 9].includes(i), is_vegetarian: [3].includes(i), is_vegan: false,
    restaurant_id: RESTAURANT_ID, 
    category: { documentId: genId('cat', 3), name: "Dinner" },
    inclusions: [{ label: "Roasted Vegetables" }, { label: "Potato Duo" }], 
    suggested_addons: [], 
    images: [
      { url: [IMG.steak, IMG.seafood, IMG.pasta][i % 3][0], label: 'Main View' }, 
      { url: [IMG.steak, IMG.seafood, IMG.pasta][i % 3][1], label: 'Plated' }
    ]
  })),

  // DESSERTS (31-35)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: 400 + i, documentId: genId('item', 400 + i),
    name: ["Chocolate Lava Cake", "Crème Brûlée", "Tiramisu Classic", "New York Cheesecake", "Fruit Tart Seasonal"][i],
    description: "Handcrafted desserts to complete your dining experience.", 
    price: 450 + (i * 40), is_available: true, 
    status_badge: i === 0 ? "best_seller" : null, spice_level: null,
    is_halal: true, is_vegetarian: true, is_vegan: false,
    restaurant_id: RESTAURANT_ID, 
    category: { documentId: genId('cat', 4), name: "Desserts" },
    inclusions: [{ label: "Vanilla Ice Cream" }], 
    suggested_addons: [], 
    images: [
      { url: IMG.dessert[0], label: 'Main View' }, 
      { url: IMG.dessert[1], label: 'Cross Section' }
    ]
  })),

  // BAR & COCKTAILS (36-45)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 500 + i, documentId: genId('item', 500 + i),
    name: ["Old Fashioned", "Negroni", "Mojito Classic", "Espresso Martini", "Whiskey Sour",
           "Gin & Tonic Premium", "Margarita Frozen", "Bloody Mary", "Dark 'n' Stormy", "Aperol Spritz"][i],
    description: "Crafted by our award-winning mixologists using premium spirits.", 
    price: 600 + (i * 50), is_available: true, status_badge: null, spice_level: null,
    is_halal: false, is_vegetarian: true, is_vegan: true,
    restaurant_id: RESTAURANT_ID, 
    category: { documentId: genId('cat', 5), name: "Bar & Cocktails" },
    inclusions: [], suggested_addons: [], 
    images: [
      { url: IMG.cocktail[0], label: 'Main View' }, 
      { url: IMG.cocktail[1], label: 'Garnish Detail' }
    ]
  })),

  // COFFEE & DRINKS (46-50)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: 600 + i, documentId: genId('item', 600 + i),
    name: ["Fresh Orange Juice", "Mango Smoothie", "Iced Americano", "Cappuccino", "Matcha Latte"][i],
    description: "Refreshing beverages made with natural, organic ingredients.", 
    price: 250 + (i * 30), is_available: true, status_badge: null, spice_level: null,
    is_halal: true, is_vegetarian: true, is_vegan: true,
    restaurant_id: RESTAURANT_ID, 
    category: { documentId: genId('cat', 6), name: "Coffee & Drinks" },
    inclusions: [], suggested_addons: [], 
    images: [
      { url: IMG.coffee[0], label: 'Main View' }, 
      { url: IMG.coffee[1], label: 'Latte Art' }
    ]
  })),

  // SPA & WELLNESS (51-55)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: 700 + i, documentId: genId('svc', 700 + i),
    name: ["Swedish Massage 60min", "Deep Tissue Therapy", "Hot Stone Treatment", "Aromatherapy Session", "Facial Rejuvenation"][i],
    description: "Professional wellness treatments in our luxury spa suite.", 
    price: 3000 + (i * 500), is_available: true, 
    status_badge: i === 0 ? "best_seller" : null, spice_level: null,
    is_halal: true, is_vegetarian: true, is_vegan: true,
    restaurant_id: RESTAURANT_ID, 
    category: { documentId: genId('cat', 7), name: "Spa & Wellness" },
    inclusions: [{ label: "Herbal Tea" }, { label: "Robe & Slippers" }], 
    suggested_addons: [], 
    images: [
      { url: IMG.spa[0], label: 'Treatment Room' }, 
      { url: IMG.spa[1], label: 'Ambiance' }
    ]
  })),

  // ROOM SERVICE (56-57)
  ...Array.from({ length: 2 }, (_, i) => ({
    id: 800 + i, documentId: genId('svc', 800 + i),
    name: ["In-Room Dining Setup", "Champagne Welcome Tray"][i],
    description: "Luxury dining and amenities delivered directly to your room.", 
    price: 2000 + (i * 400), is_available: true, status_badge: null, spice_level: null,
    is_halal: true, is_vegetarian: true, is_vegan: false,
    restaurant_id: RESTAURANT_ID, 
    category: { documentId: genId('cat', 8), name: "Room Service" },
    inclusions: [{ label: "Table Setup" }, { label: "Fresh Flowers" }], 
    suggested_addons: [], 
    images: [
      { url: IMG.room[0], label: 'Room Setup' }, 
      { url: IMG.room[1], label: 'Detail View' }
    ]
  })),

  // CONCIERGE & EVENTS (58-60)
  ...Array.from({ length: 3 }, (_, i) => ({
    id: 900 + i, documentId: genId('svc', 900 + i),
    name: ["City Walking Tour Private", "Wedding Venue Booking", "Corporate Event Package"][i],
    description: "Curated experiences and unforgettable celebrations in our elegant spaces.", 
    price: 2500 + (i * 5000), is_available: true, 
    status_badge: i === 1 ? "chefs_choice" : null, spice_level: null,
    is_halal: true, is_vegetarian: true, is_vegan: true,
    restaurant_id: RESTAURANT_ID, 
    category: { documentId: genId('cat', 9), name: "Concierge & Events" },
    inclusions: [{ label: "Dedicated Coordinator" }], 
    suggested_addons: [], 
    images: [
      { url: IMG.hotel[0], label: 'Venue View' }, 
      { url: IMG.hotel[1], label: 'Event Setup' }
    ]
  })),
  // BREAKFAST
  { id: 101, documentId: genId('item', 101), name: "Kenyan Tea & Mandazi", description: "Freshly brewed chai with cardamom, served with 3 warm, fluffy mandazi.", price: 250, is_available: true, status_badge: "best_seller", spice_level: null, is_halal: true, is_vegetarian: true, is_vegan: false, restaurant_id: RESTAURANT_ID, category: { documentId: genId('cat', 1), name: "Breakfast" }, inclusions: [{ label: "Refill on Tea" }], suggested_addons: [], image: IMG.tea },
  { id: 102, documentId: genId('item', 102), name: "Full Kenyan Breakfast", description: "Two eggs, beef sausages, toast, grilled tomatoes, and a side of fresh fruit.", price: 650, is_available: true, status_badge: null, spice_level: null, is_halal: true, is_vegetarian: false, is_vegan: false, restaurant_id: RESTAURANT_ID, category: { documentId: genId('cat', 1), name: "Breakfast" }, inclusions: [{ label: "Fresh Juice" }], suggested_addons: [], image: IMG.nyama },
  
  // LUNCH
  { id: 201, documentId: genId('item', 201), name: "Beef Pilau", description: "Aromatic basmati rice cooked in rich beef broth with traditional Swahili spices.", price: 600, is_available: true, status_badge: "best_seller", spice_level: "mild", is_halal: true, is_vegetarian: false, is_vegan: false, restaurant_id: RESTAURANT_ID, category: { documentId: genId('cat', 2), name: "Lunch" }, inclusions: [{ label: "Kachumbari Salad" }], suggested_addons: [], image: IMG.pilau },
  { id: 202, documentId: genId('item', 202), name: "Chapati & Sukuma Wiki", description: "Two soft, layered chapatis served with sautéed collard greens and beef stew.", price: 450, is_available: true, status_badge: null, spice_level: null, is_halal: true, is_vegetarian: false, is_vegan: false, restaurant_id: RESTAURANT_ID, category: { documentId: genId('cat', 2), name: "Lunch" }, inclusions: [{ label: "Extra Gravy" }], suggested_addons: [], image: IMG.chapati },
  
  // DINNER
  { id: 301, documentId: genId('item', 301), name: "Nyama Choma Platter", description: "500g of premium grilled goat meat, tender and juicy, served with ugali and kachumbari.", price: 1800, is_available: true, status_badge: "chefs_choice", spice_level: null, is_halal: true, is_vegetarian: false, is_vegan: false, restaurant_id: RESTAURANT_ID, category: { documentId: genId('cat', 3), name: "Dinner" }, inclusions: [{ label: "Ugali" }, { label: "Kachumbari" }], suggested_addons: [], image: IMG.nyama },
  { id: 302, documentId: genId('item', 302), name: "Wet Fry Tilapia", description: "Whole Lake Victoria tilapia pan-fried in rich tomato, onion, and dhania gravy.", price: 1200, is_available: true, status_badge: null, spice_level: "medium", is_halal: true, is_vegetarian: false, is_vegan: false, restaurant_id: RESTAURANT_ID, category: { documentId: genId('cat', 3), name: "Dinner" }, inclusions: [{ label: "Ugali or Rice" }], suggested_addons: [], image: IMG.fish },

  // DRINKS
  { id: 401, documentId: genId('item', 401), name: "Fresh Passion Juice", description: "100% pure, freshly squeezed Kenyan passion fruit.", price: 300, is_available: true, status_badge: null, spice_level: null, is_halal: true, is_vegetarian: true, is_vegan: true, restaurant_id: RESTAURANT_ID, category: { documentId: genId('cat', 4), name: "Drinks & Bar" }, inclusions: [], suggested_addons: [], image: IMG.cocktail },
  { id: 402, documentId: genId('item', 402), name: "Tusker Lager", description: "Kenya's favorite premium lager beer, served ice cold.", price: 350, is_available: true, status_badge: "best_seller", spice_level: null, is_halal: false, is_vegetarian: true, is_vegan: true, restaurant_id: RESTAURANT_ID, category: { documentId: genId('cat', 4), name: "Drinks & Bar" }, inclusions: [], suggested_addons: [], image: IMG.cocktail },
];

// Export helper functions matching your API layer
export function getCategories() {
  return Promise.resolve(categories);
}


/**
 * Mock Image Resolver
 * Handles the new 'images' array structure for multi-POV galleries
 */
export function getCmsImageUrl(imageData, size = 'medium') {
  // If it's an array (our mock multi-view structure), return the first URL
  if (Array.isArray(imageData)) {
    return imageData[0]?.url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80';
  }
  
  // If it's a single object (standard CMS structure)
  if (imageData?.url) return imageData.url;
  if (imageData?.data?.attributes?.url) return imageData.data.attributes.url;
  
  // Fallback
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80';
}

/**
 * Get all images for a dish (for the gallery)
 */
export function getDishImages(imageData) {
  if (Array.isArray(imageData)) return imageData;
  if (imageData?.url) return [{ url: imageData.url, label: 'Main View' }];
  if (imageData?.data?.attributes?.url) return [{ url: imageData.data.attributes.url, label: 'Main View' }];
  return [{ url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80', label: 'Default' }];
}
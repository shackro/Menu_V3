# 🍽️ Savanna Grill Menu - Local Development Setup

## Project Overview
**Digmenu 1.2** is a React + Vite restaurant menu web application for Savanna Grill in Nairobi. Built with modern web technologies for fast performance and smooth user experience.

### Tech Stack
- **Frontend**: React 18.2 + Vite 5
- **Styling**: TailwindCSS 3.4 + PostCSS
- **State Management**: Zustand 4.4
- **Routing**: React Router 6.14
- **Animations**: Framer Motion 10.12
- **Icons**: Lucide React 0.253
- **Build Tool**: Vite 5

---

## Prerequisites
- Node.js 16+ (latest LTS recommended)
- npm 8+

## Installation & Setup

### 1. Install Dependencies (if not already done)
```bash
cd /home/kaliuser/Documents/Web/Menu/Digmenu_1.2
npm install
```

### 2. Configure Local Environment
A `.env.local` file is provided with sensible defaults for local development:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_RESTAURANT_ID=47da0aad-679c-48b4-91e7-ef38d92c8ad0
VITE_DEV_SERVER_HOST=localhost
VITE_DEV_SERVER_PORT=5173
VITE_ENABLE_MOCK_DATA=true
VITE_ENABLE_DEBUG=true
```

**Note**: Currently using mock data for development. Update `VITE_API_BASE_URL` when backend is ready.

### 3. Start Development Server
```bash
npm run dev
```

The app will start at: **http://localhost:5173**

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## Project Structure
```
src/
├── api/           # API integration & mock data
│   └── cms.js    # Currently using mock data
├── components/    # Reusable React components
│   ├── layout/   # Navbar, Footer
│   ├── cart/     # Shopping cart features
│   ├── brand/    # Brand/About pages
│   ├── menu/     # Menu display
│   └── widgets/  # Floating cart, avatars, etc.
├── context/       # React Context (Currency context)
├── pages/         # Full page components
│   ├── HomePage.jsx
│   ├── MenuPage.jsx
│   ├── DishPage.jsx
│   ├── CartPage.jsx
│   └── TablePage.jsx
├── store/         # Zustand store configuration
├── utils/         # Helper utilities
├── lib/           # Mock data and shared logic
├── App.jsx        # Main app component & routing
├── main.jsx       # React entry point
└── index.css      # Global styles
```

---

## Key Routes
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomePage | Landing/home page |
| `/menu` | MenuPage | Browse all menu items |
| `/dish/:id` | DishPage | View individual dish details |
| `/cart` | CartPage | Shopping cart view |
| `/table/:tableId` | TablePage | Table ordering |
| `/brand` | BrandHub | About/brand information |

---

## Development Features

### Mock Data (Development Mode)
The app currently uses mock data defined in `src/lib/mockData.js`. This is re-exported from `src/api/cms.js`:
- Menu categories and items
- Dish images and details
- Brand/about page content
- Social media posts

### Switching to Real API
When your backend is ready:
1. Update `VITE_API_BASE_URL` in `.env.local`
2. Replace the exports in `src/api/cms.js` with real fetch calls
3. The commented-out code in `cms.js` shows the original API structure

### Dark Mode
The app supports dark mode via Tailwind classes:
- Toggle in navbar or via `dark:` CSS classes
- Uses system preference as default

### Global State (Zustand)
Located in `src/store/` - manages:
- Shopping cart
- User currency/language
- Table data
- Order state

---

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server on http://localhost:5173 |
| `npm run build` | Build for production to `dist/` |
| `npm run preview` | Preview production build locally |

---

## Common Issues & Solutions

### Port 5173 Already in Use
```bash
# Kill process on port 5173 or use a different port:
npm run dev -- --port 5174
```

### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Hot Reload Not Working
- Ensure `.env.local` `VITE_DEV_SERVER_HOST=localhost`
- Check firewall isn't blocking port 5173
- Restart dev server: `npm run dev`

### Import Errors with @ Alias
The `@` alias is configured in `vite.config.js` to point to `src/`:
```js
// Instead of: import x from '../../../utils'
// Use:        import x from '@/utils'
```

---

## Deployment

### Vercel (Pre-configured)
The project includes `vercel.json` for Vercel deployment. Simply push to your repo and connect to Vercel.

### Other Platforms
```bash
npm run build
# Upload `dist/` folder to your hosting
```

---

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari 12+

---

## Next Steps
1. [ ] Run `npm run dev` and verify app loads at localhost:5173
2. [ ] Test the menu browsing and cart features
3. [ ] When backend is ready, update API configuration
4. [ ] Deploy to Vercel or your preferred hosting

---

## Contact & Support
For issues or questions about the setup, check the comments in:
- `src/api/cms.js` - API integration notes
- `vite.config.js` - Build configuration
- `.env.local` - Environment setup

**Happy developing!** 🎉

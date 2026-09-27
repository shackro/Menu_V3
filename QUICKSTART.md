# 🚀 Quick Start Guide

## 30-Second Setup

```bash
# 1. Navigate to project
cd /home/kaliuser/Documents/Web/Menu/Digmenu_1.2

# 2. Start development server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

## What's Configured ✅

- ✅ Node dependencies installed (`node_modules/`)
- ✅ `.env.local` configured for localhost development
- ✅ Vite dev server (port 5173)
- ✅ React 18 + Hot Module Replacement (HMR)
- ✅ TailwindCSS pre-configured
- ✅ Path alias `@` → `src/`
- ✅ React Router for navigation
- ✅ Mock data for development (no backend needed yet)

## Development Workflow

### Start Development
```bash
npm run dev
# Server starts at http://localhost:5173
# Changes auto-reload in browser
```

### Build for Production
```bash
npm run build
# Output in `dist/` folder
```

### Preview Production Build Locally
```bash
npm run preview
# Preview at http://localhost:4173
```

## Key Features to Test

1. **Home Page** - `/`
2. **Menu** - `/menu` (uses mock data)
3. **Individual Dish** - `/dish/:id` (click a dish from menu)
4. **Shopping Cart** - `/cart`
5. **Brand/About** - `/brand`
6. **Dark Mode** - Toggle in navbar

## File Quick Reference

| File | Purpose |
|------|---------|
| `.env.local` | Local dev environment variables |
| `src/main.jsx` | React entry point |
| `src/App.jsx` | Main app + routing |
| `src/api/cms.js` | API integration (currently mock data) |
| `src/lib/mockData.js` | Mock menu/brand data |
| `vite.config.js` | Vite build configuration |
| `tailwind.config.js` | TailwindCSS styling |
| `SETUP.md` | Complete setup documentation |

## Troubleshooting

**Server won't start?**
```bash
npm install
npm run dev
```

**Port 5173 in use?**
```bash
npm run dev -- --port 5174
```

**Hot reload not working?**
- Restart dev server
- Check `.env.local` VITE_DEV_SERVER_HOST=localhost

**Import errors?**
- Use `@/` prefix for files in `src/`
- Example: `import X from '@/utils/helper'`

## Next: Backend Integration

When your backend API is ready:
1. Update `VITE_API_BASE_URL` in `.env.local`
2. Replace mock calls in `src/api/cms.js` with real fetch
3. Test with your backend running

## Ready to Develop! 🎉

Start with:
```bash
./dev.sh
```
Or:
```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

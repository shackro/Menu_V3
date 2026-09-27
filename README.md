# 🍽️ Savanna Grill Menu - Digmenu 1.2

A modern, responsive restaurant menu web application built with React, Vite, and TailwindCSS.

## 🚀 Quick Start

```bash
cd Digmenu_1.2
npm run dev
```

Open http://localhost:5173 in your browser.

## 📋 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 30-second setup guide
- **[SETUP.md](./SETUP.md)** - Complete setup & development guide
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Setup status & next steps

## ✨ Features

- 🎨 Modern, responsive UI with TailwindCSS
- 🌙 Dark mode support
- 🛒 Shopping cart functionality
- 📱 Mobile-optimized
- ⚡ Fast development with Vite & HMR
- 🎭 Smooth animations with Framer Motion
- 🎯 Type-safe with path aliases (@/...)
- 🏪 Ready for backend API integration

## 🛠️ Tech Stack

- **React 18.2** - UI framework
- **Vite 5** - Build tool & dev server
- **TailwindCSS 3.4** - Styling
- **React Router 6.14** - Client-side routing
- **Zustand 4.4** - State management
- **Framer Motion 10.12** - Animations
- **Lucide React 0.253** - Icons

## 📦 Available Scripts

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Build for production (dist/)
npm run preview  # Preview production build locally
./dev.sh         # Quick start script
```

## 🗺️ Routes

- `/` - Home
- `/menu` - Browse menu items
- `/dish/:id` - View dish details
- `/cart` - Shopping cart
- `/table/:tableId` - Table ordering
- `/brand` - About/brand page

## 💾 Development Mode

Currently using **mock data** for development (no backend needed).

- 60+ menu items
- 9 categories
- 120+ images from Unsplash
- Full brand/about data

When backend is ready, update `.env.local` and `src/api/cms.js`.

## 🚀 Deployment

### Vercel (Pre-configured)
Push to GitHub and connect to Vercel. Config in `vercel.json`.

### Other Platforms
```bash
npm run build
# Deploy dist/ folder to your host
```

## 📝 Environment Setup

See `.env.local` for local development configuration:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_DEV_SERVER_PORT` - Dev server port (5173)
- `VITE_ENABLE_MOCK_DATA` - Toggle mock data

## 🔗 Project Structure

```
src/
├── api/         - API integration & mock data
├── components/  - Reusable React components
├── pages/       - Full page views
├── store/       - Zustand state management
├── context/     - React Context (Currency)
├── lib/         - Mock data & utilities
├── utils/       - Helper functions
└── App.jsx      - Main app component
```

## 🐛 Troubleshooting

**Port in use?**
```bash
npm run dev -- --port 5174
```

**Dependencies issue?**
```bash
npm install
```

**Need help?** Check `SETUP.md` for complete troubleshooting guide.

## 📚 Learn More

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

---

**Status**: ✅ Ready for development  
**Last Updated**: 2026-09-27

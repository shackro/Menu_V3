import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Layout & Widgets
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartPipeline from './components/cart/CartPipeline';
import PaymentPrompt from './components/cart/PaymentPrompt';
import FoodAvatarWidget from './components/widgets/FoodAvatarWidget';
// import AIChatbotWidget from './components/widgets/AIChatbotWidget';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import DishPage from './pages/DishPage';
import CartPage from './pages/CartPage';
import TablePage from './pages/TablePage';
import BrandPage from './pages/BrandPage';
import StaffDashboard from './pages/StaffDashboard';
import StaffLogin from './pages/StaffLogin';
import OrdersPage from './pages/OrdersPage';
import ReceiptPage from './pages/ReceiptPage';

// Context
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </Router>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith('/staff');

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-screen flex-col"
      >
        {!isStaffRoute && <Navbar />}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/brand" element={<BrandPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/dish/:id" element={<DishPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/receipt/:orderId" element={<ReceiptPage />} />
            <Route path="/table/:tableId" element={<TablePage />} />
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/staff/login" element={<StaffLogin />} />
          </Routes>
        </main>

        {!isStaffRoute && <Footer />}
      </motion.div>

      {!isStaffRoute && (
        <>
          <CartPipeline />
          <PaymentPrompt />
          <FoodAvatarWidget />
        </>
      )}
    </div>
  );
}
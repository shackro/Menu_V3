import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Layout & Widgets
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingCart from './components/cart/FloatingCart';
import FoodAvatarWidget from './components/widgets/FoodAvatarWidget';
// import AIChatbotWidget from './components/widgets/AIChatbotWidget';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import DishPage from './pages/DishPage';
import CartPage from './pages/CartPage';
import TablePage from './pages/TablePage';

// Context
import { CurrencyProvider } from './context/CurrencyContext';

export default function App() {
  return (
    <CurrencyProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-white transition-colors duration-300 font-sans">
          
          {/* Clean fade-in animation on mount (No blur/scale effects) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col"
          >
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/dish/:id" element={<DishPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/table/:tableId" element={<TablePage />} />
              </Routes>
            </main>
            
            <Footer />
          </motion.div>
          
          {/* Global Widgets */}
          <FloatingCart />
          <FoodAvatarWidget />
          {/* <AIChatbotWidget /> */}
          
        </div>
      </Router>
    </CurrencyProvider>
  );
}
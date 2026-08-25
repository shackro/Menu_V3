import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: "Hello! 👋 Ask me about our menu, allergens, or opening hours!" }]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      let reply = "I'm not sure about that. Please call us at +254 703 412 694!";
      const lower = userMsg.toLowerCase();
      if (lower.includes('halal') || lower.includes('allergen')) reply = "Yes, our chicken and beef are 100% Halal certified! ☪️ Check the green badges on our menu.";
      else if (lower.includes('hour') || lower.includes('open') || lower.includes('saa')) reply = "We are open Monday to Sunday, 10:00 AM - 11:00 PM. 🕒";
      else if (lower.includes('spicy') || lower.includes('hot') || lower.includes('pilipili')) reply = "You can choose Mild 🌶, Medium 🌶🌶, or Hot 🌶🌶🌶 spice levels when customizing your dish!";
      else if (lower.includes('mpesa') || lower.includes('pay') || lower.includes('lipa')) reply = "We accept M-Pesa! 📱 Just click 'Send Order via WhatsApp' and we'll share payment details.";
      
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="mb-4 w-80 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col origin-bottom-right">
            <div className="bg-primary p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Savanna Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-dark scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-2xl rounded-br-sm' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2 bg-white dark:bg-dark-card">
              <input placeholder="Ask a question..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-1 p-2.5 rounded-xl bg-gray-100 dark:bg-dark border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSend} className="p-2.5 bg-primary text-white rounded-xl flex items-center justify-center"><Send className="w-4 h-4" /></motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button onClick={() => setIsOpen(!isOpen)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4 rounded-full shadow-2xl flex items-center justify-center relative">
        <MessageCircle className="w-6 h-6" />
        {!isOpen && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />}
      </motion.button>
    </div>
  );
}

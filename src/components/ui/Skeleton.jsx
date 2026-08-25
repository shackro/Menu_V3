import { motion } from 'framer-motion';
export default function Skeleton({ className }) {
  return (
    <motion.div 
      animate={{ opacity: [0.5, 0.8, 0.5] }} 
      transition={{ duration: 1.5, repeat: Infinity }} 
      className={`bg-gray-200 dark:bg-gray-800 rounded-xl ${className}`} 
    />
  );
}

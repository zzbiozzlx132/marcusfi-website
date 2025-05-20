// src/components/WelcomeModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext'; // Assuming you have this context

interface WelcomeModalProps {
  onBegin: () => void; // Callback when người dùng nhấp "Click to begin"
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onBegin }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showBeginText, setShowBeginText] = useState(false); // Changed from showBeginButton
  const { language } = useLanguage();

  const content = {
    en: {
      loadingText: "Initializing Your Experience...",
      beginText: "Click Anywhere to Begin" // Changed text
    },
    vi: {
      loadingText: "Đang Khởi Tạo Trải Nghiệm Của Bạn...",
      beginText: "Nhấp Bất Cứ Đâu Để Bắt Đầu" // Changed text
    }
  };
  const t = content[language] || content.en;

  useEffect(() => {
    if (loadingProgress < 100) {
      const timer = setTimeout(() => {
        setLoadingProgress(prev => Math.min(prev + 2, 100)); // Slightly faster loading
      }, 40); // Adjusted speed
      return () => clearTimeout(timer);
    } else {
      const buttonTimer = setTimeout(() => {
        setShowBeginText(true);
      }, 300); // Shorter delay
      return () => clearTimeout(buttonTimer);
    }
  }, [loadingProgress]);

  const handleModalInteraction = () => {
    if (showBeginText) {
      onBegin();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 backdrop-blur-lg p-4"
      onClick={handleModalInteraction} // Click anywhere on modal triggers this
      style={{ cursor: showBeginText ? 'pointer' : 'default' }} // Change cursor when clickable
    >
      <AnimatePresence mode="wait">
        {!showBeginText ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
            onClick={(e) => e.stopPropagation()} // Prevent triggering onBegin while loading
          >
            <div className="w-16 h-16 border-4 border-dashed border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-purple-400">
              {t.loadingText}
            </p>
            <p className="text-3xl font-bold text-gray-100 mt-1">
              {loadingProgress}%
            </p>
             <div className="w-64 max-w-xs h-2 bg-gray-800 rounded-full mt-3 mx-auto overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.05, ease: "linear" }}
                />
            </div>
          </motion.div>
        ) : (
          <motion.div // This is now a div containing text
            key="beginTextContainer"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "backOut" }}
            className="text-center p-6"
          >
            <p className="text-2xl font-semibold text-gray-100 animate-pulse">
              {t.beginText}
            </p>
            {/* You can add a sub-text if needed, e.g., "to continue" */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WelcomeModal;
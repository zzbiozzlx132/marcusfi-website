// src/components/ProcessStepNode.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Lock, ChevronDown, ChevronUp, LucideIcon, BookOpen } from 'lucide-react'; // Bỏ UserPlus, LogIn
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface ProcessStepNodeProps {
  id: string;
  stepNumber: number;
  title: string;
  summary: string;
  icon: LucideIcon;
  content: React.ReactNode;
  isUnlocked: boolean;
  isActive: boolean;
  alignment: 'left' | 'right';
  onClick: () => void;
}

// Nội dung cho CTA bên trong ProcessStepNode, cập nhật text cho Sign In/Sign Up
const stepNodeCtaContent: Record<string, {
    ctaTextIntro: string; // Ví dụ: "Để theo dõi tiến trình..."
    signInLinkText: string; // Text cho link "Sign In"
    signUpLinkText: string; // Text cho link "Sign Up"
    orText: string; // Chữ "hoặc" hoặc "or"
}> = {
    en: {
        ctaTextIntro: "To track progress, get detailed tasks, and receive personalized support, please",
        signInLinkText: "Sign In",
        signUpLinkText: "Sign Up",
        orText: "or"
    },
    vi: {
        ctaTextIntro: "Để theo dõi tiến trình, nhận nhiệm vụ chi tiết và đồng hành sát sao, hãy",
        signInLinkText: "Đăng Nhập",
        signUpLinkText: "Đăng Ký",
        orText: "hoặc"
    }
};

const ProcessStepNode: React.FC<ProcessStepNodeProps> = ({
  id,
  stepNumber,
  title,
  summary,
  icon: Icon,
  content,
  isUnlocked, // Luôn là true cho FE show
  isActive,
  alignment,
  onClick,
}) => {
  const { language } = useLanguage();
  const ctaText = stepNodeCtaContent[language] || stepNodeCtaContent.en;

  const cardVariants = { /* ... giữ nguyên từ phiên bản trước ... */
    hidden: { opacity: 0, x: alignment === 'left' ? -70 : 70, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.5, type: 'spring', stiffness: 90, damping: 14, delay: stepNumber * 0.08 },
    },
  };

  const contentVariants = { /* ... giữ nguyên từ phiên bản trước ... */
    collapsed: { opacity: 0, height: 0, marginTop: 0, y: -10 },
    expanded: { opacity: 1, height: 'auto', marginTop: '0.75rem', y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }},
  };

  // Styling (giữ nguyên hoặc điều chỉnh nhẹ nếu cần)
  const baseBg = isActive ? 'bg-slate-700/60' : 'bg-slate-800/80';
  const hoverBg = 'hover:bg-slate-700/70';
  const ringColor = isActive ? 'ring-2 ring-[#6e00ff] shadow-xl shadow-[#6e00ff]/20' : 'ring-1 ring-slate-700/80';
  const headerTextColor = isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#ff007a]' : 'text-[#c084fc]';
  const summaryColor = 'text-gray-400/90';
  const iconBg = isActive ? 'bg-gradient-to-br from-[#8f00ff] to-[#e100ff]' : 'bg-[#6e00ff]';
  const iconTimelineBg = isActive ? 'bg-gradient-to-br from-[#8f00ff] to-[#e100ff] animate-pulse' : 'bg-slate-600';


  return (
    <motion.div
      id={id}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={`md:w-[47%] p-0.5 relative ${
        alignment === 'left' ? 'md:mr-auto' : 'md:ml-auto'
      }`}
    >
      <motion.div /* ... Icon trên đường timeline ... */
        className={`absolute top-1/2 -translate-y-1/2
        ${alignment === 'left' ? 'md:-right-[2.2rem] lg:-right-[2.6rem]' : 'md:-left-[2.2rem] lg:-left-[2.6rem]'}
        hidden md:flex items-center justify-center w-9 h-9 rounded-full z-20 border-2 border-slate-700/50
        ${iconTimelineBg}
        `}
         whileHover={{ scale: 1.2, rotate: 3 }}
         title={title}
      >
        <Icon size={18} className="text-white" />
      </motion.div>

      <div
        className={`rounded-xl shadow-lg transition-all duration-300 ease-in-out ${ringColor} ${baseBg} ${hoverBg} backdrop-blur-md cursor-pointer`}
        onClick={onClick}
        aria-expanded={isActive}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      >
        <header className="p-4 sm:p-5 flex justify-between items-center min-h-[5rem] sm:min-h-[5.5rem]">
          <div className="flex items-center flex-grow min-w-0">
            <motion.div
              className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mr-3 text-base sm:text-lg font-bold
              ${iconBg} text-white shadow-md`}
              whileHover={{ scale: 1.1, y: -1 }}
              transition={{ type: "spring", stiffness: 300, damping: 8 }}
            >
              {stepNumber}
            </motion.div>
            <div className="flex-grow min-w-0">
              <h3 className={`text-sm sm:text-base md:text-md font-semibold ${headerTextColor} transition-colors duration-300`}>
                {title}
              </h3>
              {!isActive && <p className={`text-xs sm:text-[0.8rem] ${summaryColor} mt-0.5 line-clamp-2`}>{summary}</p>}
            </div>
          </div>
          <motion.div whileTap={{ scale: 0.8 }} className="ml-2 flex-shrink-0 self-center">
            {isActive ? <ChevronUp size={20} className="text-[#c084fc]" /> : <ChevronDown size={20} className="text-gray-500" />}
          </motion.div>
        </header>

        <AnimatePresence initial={false}>
          {isActive && (
            <motion.section
              key={`${id}-content-section`}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={contentVariants}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-slate-700/50"
            >
              <div className="prose prose-xs sm:prose-sm prose-invert max-w-none mt-3 text-slate-300/90 links:text-amber-400 hover:links:text-amber-300 selection:bg-[#6e00ff] selection:text-white">
                {content}
              </div>
              {/* CTA Đăng nhập / Đăng ký - Giữ nguyên style khung, chỉ thay đổi text */}
              <div className="mt-5 p-3 bg-gradient-to-r from-[#6e00ff]/10 via-transparent to-transparent border-l-4 border-[#6e00ff] rounded-md text-center text-xs sm:text-sm">
                <BookOpen size={18} className="mx-auto mb-1.5 text-[#c084fc]" />
                <p className="text-purple-200/80">
                  {ctaText.ctaTextIntro}{' '}
                  {/* Link Sign Up */}
                  <Link
                    to="/signup" // Hoặc dùng alert nếu chưa có trang
                    onClick={(e) => {
                        e.stopPropagation();
                        alert('Trang Đăng Ký sắp ra mắt!');
                    }}
                    className="font-semibold text-amber-400 hover:text-amber-300 underline"
                  >
                    {ctaText.signUpLinkText}
                  </Link>
                  {' '}{ctaText.orText}{' '}
                  {/* Link Sign In */}
                  <Link
                    to="/signin" // Hoặc dùng alert nếu chưa có trang
                    onClick={(e) => {
                        e.stopPropagation();
                        alert('Trang Đăng Nhập sắp ra mắt!');
                    }}
                    className="font-semibold text-amber-400 hover:text-amber-300 underline"
                  >
                    {ctaText.signInLinkText}
                  </Link>
                  !
                </p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProcessStepNode;
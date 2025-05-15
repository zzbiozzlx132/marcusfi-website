// src/components/LanguageSwitch.tsx
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const isEnglish = language === 'en';

  const toggleSwitch = () => {
    setLanguage(isEnglish ? 'vi' : 'en');
  };

  const enBackground = 'bg-[#6e00ff]'; // Màu tím cho EN
  const viBackground = 'bg-gradient-to-r from-[#ff007a] to-[#e100ff]'; // Màu gradient hồng cho VI

  return (
    <button
      onClick={toggleSwitch}
      // Giảm kích thước nút: h-6 (24px), w-12 (48px)
      className={`relative inline-flex items-center h-6 w-12 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
        isEnglish ? `focus:ring-[#6e00ff] ${enBackground}` : `focus:ring-[#ff007a] ${viBackground}`
      }`}
      aria-label={`Switch to ${isEnglish ? 'Vietnamese' : 'English'}`}
      role="switch"
      aria-checked={!isEnglish}
    >
      <span className="sr-only">Toggle Language</span>

      {/* Chấm tròn trắng di chuyển */}
      <span
        className={`
          absolute top-[0.125rem] left-[0.125rem] inline-flex items-center justify-center // Điều chỉnh top/left
          w-5 h-5 bg-white rounded-full shadow-md // Giảm kích thước chấm tròn: w-5 h-5 (20px)
          transition-all duration-300 ease-in-out
          transform // Thêm transform ở đây để đảm bảo translate hoạt động
          ${isEnglish ? 'translate-x-0' : 'translate-x-[calc(100%-0.125rem)] sm:translate-x-6'} // Điều chỉnh translate-x
        `}
      >
        {/* Hiển thị chữ bên trong chấm tròn */}
        <span className={`text-[0.6rem] font-bold transition-opacity duration-200 ease-in-out ${isEnglish ? 'opacity-100 text-[#6e00ff]' : 'opacity-0'}`}> {/* Giảm font chữ */}
          EN
        </span>
        <span className={`absolute text-[0.6rem] font-bold transition-opacity duration-200 ease-in-out ${!isEnglish ? 'opacity-100 text-[#ff007a]' : 'opacity-0'}`}> {/* Giảm font chữ */}
          VI
        </span>
      </span>
    </button>
  );
};

export default LanguageSwitch;
// src/pages/TimerBlockPage.tsx
import React, { useState } from 'react'; // Thêm useState
import { Link } from 'react-router-dom';
import TimerBlock from '../components/TimerBlock';
import { ArrowLeft } from 'lucide-react';

const TimerBlockPage: React.FC = () => {
  // State này sẽ được TimerBlock cập nhật thông qua prop callback
  const [isPageInFocusMode, setIsPageInFocusMode] = useState(false);

  return (
    <div 
      className={`min-h-screen py-12 sm:py-16 md:py-20 transition-colors duration-300 ease-in-out
                  ${isPageInFocusMode 
                    ? 'bg-black' 
                    : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'}`
                  }
    >
      <div className="container mx-auto px-4">
        {/* Phần Header của trang - sẽ ẩn đi khi isPageInFocusMode là true */}
        <div className={`text-center mb-8 sm:mb-10 transition-opacity duration-300 ${isPageInFocusMode ? 'opacity-0 h-0 overflow-hidden pointer-events-none' : 'opacity-100'}`}>
          <div className="relative max-w-xl mx-auto">
            <Link 
              to="/" 
              className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-xs sm:text-sm text-purple-600 hover:text-purple-800 transition-colors group py-2 pr-2"
            >
              <ArrowLeft size={16} className="mr-1 transition-transform group-hover:-translate-x-0.5" />
              Trang chủ
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Timer Block
            </h1>
          </div>
        </div>
        
        {/* Truyền callback xuống TimerBlock để nó có thể báo cho trang này biết khi nào vào/ra focus mode */}
        <TimerBlock setIsPageInFocusMode={setIsPageInFocusMode} />
      </div>
    </div>
  );
};

export default TimerBlockPage;
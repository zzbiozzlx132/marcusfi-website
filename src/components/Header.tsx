// Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, BarChart3, UserCircle } from 'lucide-react'; // Bỏ Globe2 nếu không dùng ở đâu khác
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitch from './LanguageSwitch'; // Import component mới

// Định nghĩa kiểu cho nội dung header (giữ nguyên từ lần trước)
interface HeaderContentType {
  home: string;
  process: string;
  blog: string;
  resources: string;
  signIn: string;
  signUp: string;
  account: string;
  switchToVietnamese?: string;
  switchToEnglish?: string;
}
interface AppContentType {
  en: HeaderContentType;
  vi: HeaderContentType;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const { language } = useLanguage(); // Chỉ cần language, setLanguage đã được dùng trong LanguageSwitch
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
      const mobileMenuToggle = document.querySelector('button[aria-controls="mobile-menu"]');
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuToggle && !mobileMenuToggle.contains(event.target as Node)
        ) {
        setIsMenuOpen(false);
      }
    };
    if (isAccountDropdownOpen || isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountDropdownOpen, isMenuOpen]);

  // Bỏ hàm toggleLanguage ở đây vì LanguageSwitch tự xử lý
  // const toggleLanguage = () => {
  //   setLanguage(language === 'en' ? 'vi' : 'en');
  //   setIsAccountDropdownOpen(false);
  // };

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
    setIsMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsAccountDropdownOpen(false);
  }

  const closeMobileMenu = () => setIsMenuOpen(false);

  const closeAllPopups = () => {
    setIsAccountDropdownOpen(false);
    setIsMenuOpen(false);
  }

  const headerContent: AppContentType = {
    en: {
      home: 'Home',
      process: 'Process',
      blog: 'Blog',
      resources: 'Resources',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      switchToVietnamese: 'Switch to Vietnamese',
      account: 'Account',
    },
    vi: {
      home: 'Trang chủ',
      process: 'Quy trình',
      blog: 'Blog',
      resources: 'Tài nguyên',
      signIn: 'Đăng nhập',
      signUp: 'Đăng ký',
      switchToEnglish: 'Chuyển sang Tiếng Anh',
      account: 'Tài khoản',
    }
  };
  const t = headerContent[language as keyof AppContentType] || headerContent.en;

  return (
    <header
      className={`fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] sm:w-11/12 md:w-10/12 max-w-6xl rounded-full backdrop-blur-xl ${
        isScrolled || isMenuOpen || isAccountDropdownOpen ? 'bg-white/80 shadow-lg ring-1 ring-black ring-opacity-5' : 'bg-white/50'
      }`}
    >
      <div className="px-4 sm:px-6 py-2.5 sm:py-3">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center flex-shrink-0" onClick={closeAllPopups}>
            <BarChart3 className="h-7 w-7 text-[#6e00ff]" />
            <span className="ml-2 text-lg font-bold bg-gradient-to-r from-[#6e00ff] to-[#ff007a] text-transparent bg-clip-text">marcusfi</span>
          </Link>

          <div className="hidden md:flex items-center space-x-5 lg:space-x-6">
            <Link to="/" onClick={closeAllPopups} className="text-gray-700 hover:text-[#6e00ff] transition-colors text-sm font-medium">{t.home}</Link>
            <Link to="/process" onClick={closeAllPopups} className="text-gray-700 hover:text-[#6e00ff] transition-colors text-sm font-medium">{t.process}</Link>
            <Link to="/blog" onClick={closeAllPopups} className="text-gray-700 hover:text-[#6e00ff] transition-colors text-sm font-medium">{t.blog}</Link>
            <Link to="/resources" onClick={closeAllPopups} className="text-gray-700 hover:text-[#6e00ff] transition-colors text-sm font-medium">{t.resources}</Link>
          </div>

          <div className="hidden md:flex items-center space-x-3 lg:space-x-4"> {/* Tăng space-x nếu cần */}
            {/* Thay thế nút cũ bằng LanguageSwitch */}
            <LanguageSwitch />

            <div className="relative" ref={accountDropdownRef}>
              <button
                onClick={toggleAccountDropdown}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-500/10 transition-colors"
                aria-label={t.account}
                aria-expanded={isAccountDropdownOpen}
                aria-haspopup="true"
              >
                <UserCircle className="h-6 w-6 text-gray-700" />
              </button>
              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-xl shadow-2xl py-2 z-20 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Link
                    to="/signin"
                    onClick={closeAllPopups}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6e00ff] transition-colors"
                  >
                    {t.signIn}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeAllPopups}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6e00ff] transition-colors"
                  >
                    {t.signUp}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden text-gray-700 p-1 -mr-1 rounded-md hover:bg-gray-500/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#6e00ff]"
            onClick={toggleMobileMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Open main menu"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {isMenuOpen && (
          <div id="mobile-menu" ref={mobileMenuRef} className="md:hidden bg-white/95 backdrop-blur-md mt-3 rounded-2xl p-4 shadow-2xl ring-1 ring-black ring-opacity-5">
            <div className="flex flex-col space-y-2">
              <Link to="/" onClick={closeMobileMenu} className="block px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">{t.home}</Link>
              <Link to="/process" onClick={closeMobileMenu} className="block px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">{t.process}</Link>
              <Link to="/blog" onClick={closeMobileMenu} className="block px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">{t.blog}</Link>
              <Link to="/resources" onClick={closeMobileMenu} className="block px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">{t.resources}</Link>

              <div className="border-t border-gray-200/80 pt-3 mt-2 space-y-2.5">
                <Link to="/signin" onClick={closeMobileMenu} className="block w-full text-center px-3 py-2.5 text-sm font-semibold text-[#6e00ff] rounded-lg border-2 border-[#6e00ff] hover:bg-[#6e00ff]/10 transition-colors">{t.signIn}</Link>
                <Link to="/signup" onClick={closeMobileMenu} className="block w-full text-center px-3 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#8f00ff] to-[#e100ff] hover:from-[#9e00ff] hover:to-[#ff00e0] rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">{t.signUp}</Link>
              </div>
              
              {/* Sử dụng LanguageSwitch trong menu mobile */}
              <div className="flex justify-center mt-3 pt-3 border-t border-gray-200/80">
                 <LanguageSwitch />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
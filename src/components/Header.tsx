// src/components/Header.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react'; // << THÊM useCallback
import { Menu, X, BarChart3, UserCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitch from './LanguageSwitch';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';
import { useAuth } from '../contexts/AuthContext';

interface HeaderContentType {
  home: string;
  process: string;
  blog: string;
  resources: string;
  signIn: string;
  signUp: string;
  account: string;
  dashboard: string;
  logout: string;
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
  const { language } = useLanguage();
  const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth();
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const closeAllPopups = useCallback(() => {
    setIsAccountDropdownOpen(false);
    setIsMenuOpen(false);
  }, []); // Các hàm setIs... là ổn định

  const openSignInModal = useCallback(() => {
    closeAllPopups();
    setIsSignInModalOpen(true);
  }, [closeAllPopups]); // Phụ thuộc vào closeAllPopups

  const openSignUpModal = useCallback(() => {
    closeAllPopups();
    setIsSignUpModalOpen(true);
  }, [closeAllPopups]); // Phụ thuộc vào closeAllPopups

  // useEffect để lắng nghe location.state và mở modal
  useEffect(() => {
    // Ép kiểu an toàn cho location.state
    const locState = location.state as { openModal?: 'signIn' | 'signUp' } | null;

    if (locState?.openModal) {
      const modalToOpen = locState.openModal;
      
      // Xóa state ngay sau khi đọc để tránh mở lại modal không mong muốn
      // Quan trọng: sử dụng location.pathname hiện tại (sau khi đã điều hướng về '/')
      navigate(location.pathname, { state: {}, replace: true });

      if (modalToOpen === 'signIn') {
        // console.log("Header: Received openModal 'signIn' from state, opening modal.");
        openSignInModal();
      } else if (modalToOpen === 'signUp') {
        // console.log("Header: Received openModal 'signUp' from state, opening modal.");
        openSignUpModal();
      }
    }
  }, [location, navigate, openSignInModal, openSignUpModal]); // Thêm openSignInModal, openSignUpModal vào dependencies


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
      const mobileMenuToggle = document.querySelector('button[aria-controls="mobile-menu"]');
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && mobileMenuToggle && !mobileMenuToggle.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isAccountDropdownOpen || isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountDropdownOpen, isMenuOpen]);

  const toggleAccountDropdown = () => {
    if (isAuthLoading) return;
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
    setIsMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsAccountDropdownOpen(false);
  };
  
  const closeMobileMenuOnly = useCallback(() => {
    setIsMenuOpen(false);
  }, []);


  const closeSignInModal = () => setIsSignInModalOpen(false);
  const closeSignUpModal = () => setIsSignUpModalOpen(false);

  const switchToSignUp = () => {
    closeSignInModal();
    openSignUpModal();
  };

  const switchToSignIn = () => {
    closeSignUpModal();
    openSignInModal();
  };

  const handleLogout = () => {
    logout();
    closeAllPopups();
  };

  const headerContent: AppContentType = {
    en: { /* ... nội dung tiếng Anh ... */ 
        home: 'Home', process: 'Process', blog: 'Blog', resources: 'Resources',
        signIn: 'Sign In', signUp: 'Sign Up', account: 'Account',
        dashboard: 'Dashboard', logout: 'Log Out'
    },
    vi: { /* ... nội dung tiếng Việt ... */
        home: 'Trang chủ', process: 'Quy trình', blog: 'Bài viết', resources: 'Tài nguyên',
        signIn: 'Đăng nhập', signUp: 'Đăng ký', account: 'Tài khoản',
        dashboard: 'Bảng điều khiển', logout: 'Đăng xuất'
    }
  };
  const t = headerContent[language as keyof AppContentType] || headerContent.en;

  return (
    <>
      <header
        className={`fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-[95%] sm:w-11/12 md:w-10/12 max-w-6xl rounded-full backdrop-blur-xl ${
          isScrolled || isMenuOpen || isAccountDropdownOpen ? 'bg-white/80 shadow-lg ring-1 ring-black ring-opacity-5' : 'bg-white/50'
        }`}
      >
        {/* PHẦN JSX CỦA NAV VÀ MOBILE MENU GIỮ NGUYÊN NHƯ CODE HEADER TRƯỚC ĐÓ BẠN ĐÃ CÓ */}
        {/* Đảm bảo các nút Sign In/Sign Up gọi openSignInModal/openSignUpModal */}
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

            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <LanguageSwitch />
              <div className="relative" ref={accountDropdownRef}>
                <button
                  onClick={toggleAccountDropdown}
                  disabled={isAuthLoading}
                  className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-500/10 transition-colors disabled:opacity-50"
                  aria-label={t.account}
                  aria-expanded={isAccountDropdownOpen}
                  aria-haspopup="true"
                >
                  {isAuthenticated && user?.name ? (
                    <span className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-r from-[#6e00ff] to-[#ff007a] text-white text-xs font-semibold">
                      {user.name.substring(0, 1).toUpperCase()}
                    </span>
                  ) : (
                    <UserCircle className="h-6 w-6 text-gray-700" />
                  )}
                </button>
                {isAccountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-xl shadow-2xl py-2 z-20 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-200">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/dashboard" 
                          onClick={closeAllPopups}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6e00ff] transition-colors"
                        >
                          {t.dashboard}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                          {t.logout}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={openSignInModal}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6e00ff] transition-colors"
                        >
                          {t.signIn}
                        </button>
                        <button
                          onClick={openSignUpModal}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6e00ff] transition-colors"
                        >
                          {t.signUp}
                        </button>
                      </>
                    )}
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
                <Link to="/" onClick={closeMobileMenuOnly} className="block px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">{t.home}</Link>
                <Link to="/process" onClick={closeMobileMenuOnly} className="block px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">{t.process}</Link>
                <Link to="/blog" onClick={closeMobileMenuOnly} className="block px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">{t.blog}</Link>
                <Link to="/resources" onClick={closeMobileMenuOnly} className="block px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">{t.resources}</Link>

                <div className="border-t border-gray-200/80 pt-3 mt-2 space-y-2.5">
                  {isAuthenticated ? (
                     <>
                        <div className="px-3 py-2 text-center">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={closeMobileMenuOnly}
                          className="block w-full text-center px-3 py-2.5 text-sm font-semibold text-[#6e00ff] rounded-lg border-2 border-transparent hover:bg-[#6e00ff]/10 transition-colors"
                        >
                          {t.dashboard}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-center px-3 py-2.5 text-sm font-semibold text-red-600 rounded-lg border-2 border-transparent hover:bg-red-500/10 transition-colors"
                        >
                          {t.logout}
                        </button>
                      </>
                  ) : (
                    <>
                      <button
                        onClick={openSignInModal}
                        className="block w-full text-center px-3 py-2.5 text-sm font-semibold text-[#6e00ff] rounded-lg border-2 border-[#6e00ff] hover:bg-[#6e00ff]/10 transition-colors"
                      >
                        {t.signIn}
                      </button>
                      <button
                        onClick={openSignUpModal}
                        className="block w-full text-center px-3 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#8f00ff] to-[#e100ff] hover:from-[#9e00ff] hover:to-[#ff00e0] rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        {t.signUp}
                      </button>
                    </>
                  )}
                </div>

                <div className="flex justify-center mt-3 pt-3 border-t border-gray-200/80">
                  <LanguageSwitch />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {!isAuthenticated && (
        <>
          <SignInModal
            isOpen={isSignInModalOpen}
            onClose={closeSignInModal}
            onSwitchToSignUp={switchToSignUp}
          />
          <SignUpModal
            isOpen={isSignUpModalOpen}
            onClose={closeSignUpModal}
            onSwitchToSignIn={switchToSignIn}
          />
        </>
      )}
    </>
  );
};

export default Header;
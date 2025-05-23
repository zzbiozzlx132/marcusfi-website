// src/components/Header.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu, X, BarChart3, UserCircle, ChevronDown,
  Settings as SettingsIcon, Clock, DollarSign, PiggyBank,
  Coffee, Scale, Calculator
} from 'lucide-react';
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
  tools: string;
  timerBlock: string;
  fiCalculator: string;
  simpleBudgetPlanner: string;
  latteFactor: string;
  debtOrInvest: string;
  compoundInterest: string;
  tool3: string;
  tool4: string;
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
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const { language } = useLanguage();
  const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth();
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const closeAllPopups = useCallback(() => {
    setIsAccountDropdownOpen(false);
    setIsToolsDropdownOpen(false);
    setIsMenuOpen(false);
    setIsMobileToolsOpen(false);
  }, []);

  const openSignInModal = useCallback(() => {
    closeAllPopups();
    setIsSignInModalOpen(true);
  }, [closeAllPopups]);

  const openSignUpModal = useCallback(() => {
    closeAllPopups();
    setIsSignUpModalOpen(true);
  }, [closeAllPopups]);

  useEffect(() => {
    const locState = location.state as { openModal?: 'signIn' | 'signUp' } | null;
    if (locState?.openModal) {
      const modalToOpen = locState.openModal;
      navigate(location.pathname, { state: {}, replace: true });
      if (modalToOpen === 'signIn') {
        openSignInModal();
      } else if (modalToOpen === 'signUp') {
        openSignUpModal();
      }
    }
  }, [location, navigate, openSignInModal, openSignUpModal]);

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
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
      const mobileMenuToggle = document.querySelector('button[aria-controls="mobile-menu"]');
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuToggle && !mobileMenuToggle.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
        setIsMobileToolsOpen(false);
      }
    };
    if (isAccountDropdownOpen || isMenuOpen || isToolsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountDropdownOpen, isMenuOpen, isToolsDropdownOpen]);

  const toggleAccountDropdown = () => {
    if (isAuthLoading) return;
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
    setIsToolsDropdownOpen(false);
    setIsMenuOpen(false);
    setIsMobileToolsOpen(false);
  };

  const toggleToolsDropdown = () => {
    setIsToolsDropdownOpen(!isToolsDropdownOpen);
    setIsAccountDropdownOpen(false);
    setIsMenuOpen(false);
    setIsMobileToolsOpen(false);
  };

  const toggleMobileMenu = () => {
    const newMenuOpenState = !isMenuOpen;
    setIsMenuOpen(newMenuOpenState);
    setIsAccountDropdownOpen(false);
    setIsToolsDropdownOpen(false);
    if (!newMenuOpenState) {
      setIsMobileToolsOpen(false);
    }
  };
  
  const handleMobileLinkClick = useCallback(() => {
    setIsMenuOpen(false);
    setIsMobileToolsOpen(false);
  }, []);


  const closeSignInModal = () => setIsSignInModalOpen(false);
  const closeSignUpModal = () => setIsSignUpModalOpen(false);
  const switchToSignUp = () => { closeSignInModal(); openSignUpModal(); };
  const switchToSignIn = () => { closeSignUpModal(); openSignInModal(); };
  const handleLogout = () => { logout(); closeAllPopups(); };

  const headerContent: AppContentType = {
    en: { 
        home: 'Home', process: 'Process', blog: 'Blog', resources: 'Resources',
        tools: 'Tools', timerBlock: 'Timer Block', fiCalculator: 'FI Calculator', 
        simpleBudgetPlanner: 'Budget Planner',
        latteFactor: 'Latte Factor',
        debtOrInvest: 'Debt or Invest',
        compoundInterest: 'Compound Interest',
        tool3: 'More Tools Soon', 
        tool4: 'Stay Tuned',
        signIn: 'Sign In', signUp: 'Sign Up', account: 'Account',
        dashboard: 'Dashboard', logout: 'Log Out'
    },
    vi: { 
        home: 'Trang chủ', process: 'Quy trình', blog: 'Bài viết', resources: 'Tài nguyên',
        tools: 'Công cụ', timerBlock: 'Timer Block', fiCalculator: 'Máy tính FI',
        simpleBudgetPlanner: 'Kế hoạch Ngân sách',
        latteFactor: 'Chi Phí Cơ Hội',
        debtOrInvest: 'Nợ Hay Đầu Tư?',
        compoundInterest: 'Tính Lãi Kép',
        tool3: 'Công cụ khác (Sắp có)', 
        tool4: 'Chờ đón nhé',
        signIn: 'Đăng nhập', signUp: 'Đăng ký', account: 'Tài khoản',
        dashboard: 'Bảng điều khiển', logout: 'Đăng xuất'
    }
  };
  const t = headerContent[language as keyof AppContentType] || headerContent.en;

  const headerBaseClasses = "fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-[95%] sm:w-11/12 md:w-10/12 max-w-6xl";
  // Khi menu mobile mở, header chính vẫn giữ hình dạng bo tròn nhưng nền và bóng sẽ trong suốt
  const headerShapeClasses = isMenuOpen ? "rounded-t-2xl sm:rounded-2xl" : "rounded-full"; 
  const headerBackdropBlurClasses = isMenuOpen ? "" : "backdrop-blur-xl"; 
  
  let headerEffectiveStyles = "";
  if (isMenuOpen) {
    // Khi menu mobile mở, thanh header chính trở nên trong suốt và không có bóng đổ/viền
    headerEffectiveStyles = "bg-transparent shadow-none ring-0"; 
  } else if (isScrolled || isAccountDropdownOpen || isToolsDropdownOpen) {
    // Các trạng thái active khác (cuộn, dropdown desktop mở)
    headerEffectiveStyles = "bg-white shadow-lg ring-1 ring-gray-200";
  } else {
    // Trạng thái inactive mặc định
    headerEffectiveStyles = "bg-white/90 shadow-sm"; 
  }

  return (
    <>
      <header
        className={`${headerBaseClasses} ${headerShapeClasses} ${headerBackdropBlurClasses} ${headerEffectiveStyles}`}
      >
        <div className="px-4 sm:px-6 py-2.5 sm:py-3"> {/* Padding này vẫn giữ cho logo/nút X có khoảng cách */}
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center flex-shrink-0" onClick={closeAllPopups}>
              <BarChart3 className="h-7 w-7 text-[#6e00ff]" />
              <span className="ml-2 text-lg font-bold bg-gradient-to-r from-[#6e00ff] to-[#ff007a] text-transparent bg-clip-text">marcusfi</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link to="/" onClick={closeAllPopups} className="px-3 py-2 text-gray-700 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-md hover:bg-gray-500/5">{t.home}</Link>
              <Link to="/process" onClick={closeAllPopups} className="px-3 py-2 text-gray-700 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-md hover:bg-gray-500/5">{t.process}</Link>
              
              <div className="relative" ref={toolsDropdownRef}>
                <button
                  onClick={toggleToolsDropdown}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-md hover:bg-gray-500/5"
                  aria-expanded={isToolsDropdownOpen}
                  aria-haspopup="true"
                >
                  {t.tools}
                  <ChevronDown size={16} className={`ml-1.5 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isToolsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 origin-top-left bg-white rounded-xl shadow-2xl py-2 z-20 ring-1 ring-gray-200 focus:outline-none">
                    <Link to="/timer-block" onClick={closeAllPopups} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6e00ff] transition-colors">
                      <Clock size={16} className="mr-2.5 text-purple-500" /> {t.timerBlock}
                    </Link>
                    <Link to="/fi-calculator" onClick={closeAllPopups} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6e00ff] transition-colors">
                      <DollarSign size={16} className="mr-2.5 text-green-500" /> {t.fiCalculator}
                    </Link>
                    <Link to="/budget-planner" onClick={closeAllPopups} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6e00ff] transition-colors">
                      <PiggyBank size={16} className="mr-2.5 text-pink-500" /> {t.simpleBudgetPlanner}
                    </Link>
                    <Link to="/latte-factor" onClick={closeAllPopups} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6e00ff] transition-colors">
                      <Coffee size={16} className="mr-2.5 text-yellow-600" /> {t.latteFactor}
                    </Link>
                    <Link to="/debt-or-invest" onClick={closeAllPopups} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6e00ff] transition-colors">
                      <Scale size={16} className="mr-2.5 text-blue-500" /> {t.debtOrInvest}
                    </Link>
                    <Link to="/compound-interest" onClick={closeAllPopups} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#6e00ff] transition-colors">
                      <Calculator size={16} className="mr-2.5 text-teal-500" /> {t.compoundInterest}
                    </Link>
                    <div className="border-t my-1.5 border-gray-100"></div>
                    <span className="flex items-center px-4 py-2.5 text-sm text-gray-400 cursor-default opacity-75">
                      <SettingsIcon size={16} className="mr-2.5" /> {t.tool3}
                    </span>
                     <span className="flex items-center px-4 py-2.5 text-sm text-gray-400 cursor-default opacity-75">
                      <SettingsIcon size={16} className="mr-2.5" /> {t.tool4}
                    </span>
                  </div>
                )}
              </div>

              <Link to="/blog" onClick={closeAllPopups} className="px-3 py-2 text-gray-700 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-md hover:bg-gray-500/5">{t.blog}</Link>
              <Link to="/resources" onClick={closeAllPopups} className="px-3 py-2 text-gray-700 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-md hover:bg-gray-500/5">{t.resources}</Link>
            </div>

            {/* Desktop Account & Language Switch */}
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
                   <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-xl shadow-2xl py-2 z-20 ring-1 ring-gray-200 focus:outline-none">
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

            {/* Mobile Menu Toggle Button */}
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

          {/* Mobile Menu Content */}
          {isMenuOpen && (
            <div id="mobile-menu" ref={mobileMenuRef} className="md:hidden bg-white mt-3 rounded-2xl p-4 shadow-2xl ring-1 ring-gray-200"> 
              <div className="flex flex-col space-y-1">
                <Link to="/" onClick={handleMobileLinkClick} className="block px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">{t.home}</Link>
                <Link to="/process" onClick={handleMobileLinkClick} className="block px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">{t.process}</Link>
                
                <div className="border-t border-gray-200/60 my-2"></div>
                <button
                  onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                  className="flex items-center justify-between w-full px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5"
                  aria-expanded={isMobileToolsOpen}
                >
                  <span>{t.tools}</span> 
                  <ChevronDown size={18} className={`text-gray-500 group-hover:text-[#6e00ff] transition-transform duration-200 ${isMobileToolsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileToolsOpen && (
                  <div className="pl-3 mt-1 space-y-1">
                     <Link to="/timer-block" onClick={handleMobileLinkClick} className="flex items-center px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">
                        <Clock size={16} className="mr-3 text-purple-500" /> {t.timerBlock}
                     </Link>
                     <Link to="/fi-calculator" onClick={handleMobileLinkClick} className="flex items-center px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">
                        <DollarSign size={16} className="mr-3 text-green-500" /> {t.fiCalculator}
                     </Link>
                     <Link to="/budget-planner" onClick={handleMobileLinkClick} className="flex items-center px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">
                        <PiggyBank size={16} className="mr-3 text-pink-500" /> {t.simpleBudgetPlanner}
                     </Link>
                     <Link to="/latte-factor" onClick={handleMobileLinkClick} className="flex items-center px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">
                        <Coffee size={16} className="mr-3 text-yellow-600" /> {t.latteFactor}
                     </Link>
                     <Link to="/debt-or-invest" onClick={handleMobileLinkClick} className="flex items-center px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">
                        <Scale size={16} className="mr-3 text-blue-500" /> {t.debtOrInvest}
                     </Link>
                     <Link to="/compound-interest" onClick={handleMobileLinkClick} className="flex items-center px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">
                        <Calculator size={16} className="mr-3 text-teal-500" /> {t.compoundInterest}
                     </Link>
                     <div className="border-t border-gray-200/40 my-1.5 mx-3"></div>
                     <span className="flex items-center px-3 py-2.5 text-gray-500 text-sm font-medium rounded-lg cursor-default opacity-80">
                        <SettingsIcon size={16} className="mr-3" /> {t.tool3}
                     </span>
                     <span className="flex items-center px-3 py-2.5 text-gray-500 text-sm font-medium rounded-lg cursor-default opacity-80">
                        <SettingsIcon size={16} className="mr-3" /> {t.tool4}
                     </span>
                  </div>
                )}
                <div className="border-t border-gray-200/60 mt-2 pt-1"></div>

                <Link to="/blog" onClick={handleMobileLinkClick} className="block px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">{t.blog}</Link>
                <Link to="/resources" onClick={handleMobileLinkClick} className="block px-3 py-2.5 text-gray-800 hover:text-[#6e00ff] transition-colors text-sm font-medium rounded-lg hover:bg-gray-500/5">{t.resources}</Link>

                <div className="border-t border-gray-200/80 pt-3 mt-2 space-y-2.5">
                  {isAuthenticated ? (
                     <>
                        <div className="px-3 py-2 text-center">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={handleMobileLinkClick}
                          className="block w-full text-center px-3 py-2.5 text-sm font-semibold text-[#6e00ff] rounded-lg border-2 border-transparent hover:bg-[#6e00ff]/10 transition-colors"
                        >
                          {t.dashboard}
                        </Link>
                        <button
                          onClick={() => { handleLogout(); handleMobileLinkClick(); }}
                          className="block w-full text-center px-3 py-2.5 text-sm font-semibold text-red-600 rounded-lg border-2 border-transparent hover:bg-red-500/10 transition-colors"
                        >
                          {t.logout}
                        </button>
                      </>
                  ) : (
                    <>
                      <button
                        onClick={() => { openSignInModal(); handleMobileLinkClick(); }}
                        className="block w-full text-center px-3 py-2.5 text-sm font-semibold text-[#6e00ff] rounded-lg border-2 border-[#6e00ff] hover:bg-[#6e00ff]/10 transition-colors"
                      >
                        {t.signIn}
                      </button>
                      <button
                        onClick={() => { openSignUpModal(); handleMobileLinkClick(); }}
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
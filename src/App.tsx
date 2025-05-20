// src/App.tsx
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

import MusicPlayer from './components/MusicPlayer';
import WelcomeModal from './components/WelcomeModal';
import MainLayout from './components/MainLayout';
import ScrollToTop from './components/ScrollToTop';

// Page Components
const Hero = lazy(() => import('./components/Hero'));
const Problem = lazy(() => import('./components/Problem'));
const LeadMagnet = lazy(() => import('./components/LeadMagnet'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const BlogPreview = lazy(() => import('./components/BlogPreview'));
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const SinglePostPage = lazy(() => import('./pages/SinglePostPage'));
const ProcessPage = lazy(() => import('./pages/ProcessPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));

const myMusicTracks = [
  { id: 'local_track1', title: 'Nhạc Nền 1', src: '/marcusfi-website/music1.mp3' },
  { id: 'local_track2', title: 'Nhạc Nền 2', src: '/marcusfi-website/music2.mp3' },
  { id: 'local_track3', title: 'Nhạc Nền 3', src: '/marcusfi-website/music3.mp3' },
  { id: 'local_track4', title: 'Nhạc Nền 4', src: '/marcusfi-website/music4.mp3' },
  { id: 'local_track5', title: 'Nhạc Nền 5', src: '/marcusfi-website/music5.mp3' },
  { id: 'local_track6', title: 'Nhạc Nền 6', src: '/marcusfi-website/music6.mp3' },
  { id: 'local_track7', title: 'Nhạc Nền 7', src: '/marcusfi-website/music7.mp3' },
  { id: 'local_track8', title: 'Nhạc Nền 8', src: '/marcusfi-website/music8.mp3' },
  { id: 'local_track9', title: 'Nhạc Nền 9', src: '/marcusfi-website/music9.mp3' },
  { id: 'local_track10', title: 'Nhạc Nền 10', src: '/marcusfi-website/music10.mp3' },
];

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950">
    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-400"></div>
    <p className="text-white text-lg ml-4 font-display">Đang tải MarcusFI...</p>
  </div>
);

function App() {
  // showWelcomeModal sẽ luôn là true khi component App được mount (tức là mỗi khi F5)
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  const handleBeginJourney = () => {
    setShowWelcomeModal(false);
    setUserHasInteracted(true);
    // XÓA DÒNG SAU ĐỂ KHÔNG LƯU VÀO LOCALSTORAGE NỮA
    // localStorage.setItem('userWelcomed', 'true');
  };

  // XÓA HOẶC COMMENT LẠI KHỐI useEffect NÀY
  // useEffect(() => {
  //   const welcomed = localStorage.getItem('userWelcomed');
  //   if (welcomed === 'true') {
  //     setShowWelcomeModal(false);
  //     setUserHasInteracted(true);
  //   }
  // }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter basename="/marcusfi-website">
          <ScrollToTop />
          
          {showWelcomeModal && <WelcomeModal onBegin={handleBeginJourney} />}

          <div className={showWelcomeModal ? 'opacity-30 pointer-events-none transition-opacity duration-500' : 'opacity-100 transition-opacity duration-500'}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={
                    <>
                      <Hero />
                      <Problem />
                      <LeadMagnet />
                      <Testimonials />
                      <BlogPreview />
                    </>
                  } />
                  <Route path="/blog" element={<BlogListPage />} />
                  <Route path="/blog/:slug" element={<SinglePostPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/contact" element={<ContactUsPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                </Route>

                <Route path="/process" element={<ProcessPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                
                <Route path="*" element={
                    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4">
                      <div className="text-center flex-grow flex flex-col justify-center items-center">
                          <h1 className="text-5xl sm:text-7xl font-display text-purple-500 mb-4 animate-pulse-glow">404</h1>
                          <p className="text-xl sm:text-2xl text-gray-300 mb-8 text-center">Oops! Trang bạn đang tìm kiếm dường như đã lạc vào vũ trụ MarcusFI rồi.</p>
                          <RouterLink
                            to="/"
                            className="inline-flex items-center group px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors text-white shadow-lg hover:shadow-purple-500/50"
                          >
                            Quay Về Cổng Chính
                          </RouterLink>
                      </div>
                    </div>
                } />
              </Routes>
            </Suspense>
          </div>
          
          {myMusicTracks.length > 0 && (
            <MusicPlayer 
              tracks={myMusicTracks} 
              triggerPlayAfterInteraction={userHasInteracted} 
            />
          )}

        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
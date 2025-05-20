// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

// << 1. IMPORT MUSIC PLAYER >>
import MusicPlayer from './components/MusicPlayer'; // Đảm bảo đường dẫn này đúng

// Layout Components
import MainLayout from './components/MainLayout';
import ScrollToTop from './components/ScrollToTop';

// Page Components (Sử dụng lazy loading)
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

// << 2. ĐỊNH NGHĨA DANH SÁCH NHẠC VỚI FILE LOCAL >>
// THAY THẾ TÊN FILE CHO ĐÚNG VỚI FILE TRONG THƯ MỤC /public CỦA BẠN
const myMusicTracks = [
  { id: 'local_track1', title: 'Nhạc Nền 1', src: '/music1.mp3' },
  { id: 'local_track2', title: 'Nhạc Nền 2', src: '/music2.mp3' },
  { id: 'local_track3', title: 'Nhạc Nền 3', src: '/music3.mp3' },
  { id: 'local_track4', title: 'Nhạc Nền 4', src: '/music4.mp3' },
  { id: 'local_track5', title: 'Nhạc Nền 5', src: '/music5.mp3' },
  { id: 'local_track6', title: 'Nhạc Nền 6', src: '/music6.mp3' },
  { id: 'local_track7', title: 'Nhạc Nền 7', src: '/music7.mp3' },
  { id: 'local_track8', title: 'Nhạc Nền 8', src: '/music8.mp3' },
  { id: 'local_track9', title: 'Nhạc Nền 9', src: '/music9.mp3' },
  { id: 'local_track10', title: 'Nhạc Nền 10', src: '/music10.mp3' },
  // Hãy đảm bảo bạn có đủ 10 file nhạc từ music1.mp3 đến music10.mp3 trong thư mục public
  // Hoặc điều chỉnh danh sách này cho phù hợp với số lượng và tên file thực tế của bạn.
];


export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950">
    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-400"></div>
    <p className="text-white text-lg ml-4 font-display">Đang tải MarcusFI...</p>
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Các trang sử dụng MainLayout */}
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

              {/* Các trang có layout riêng */}
              <Route path="/process" element={<ProcessPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Route cho trang không tìm thấy */}
              <Route path="*" element={
                <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4">
                  <div className="text-center flex-grow flex flex-col justify-center items-center">
                      <h1 className="text-5xl sm:text-7xl font-display text-purple-500 mb-4 animate-pulse-glow">404</h1>
                      <p className="text-xl sm:text-2xl text-gray-300 mb-8 text-center">Oops! Trang bạn đang tìm kiếm dường như đã lạc vào vũ trụ MarcusFI rồi.</p>
                      <Link
                        to="/"
                        className="inline-flex items-center group px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors text-white shadow-lg hover:shadow-purple-500/50"
                      >
                        Quay Về Cổng Chính
                      </Link>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
          
          {/* << 3. RENDER MUSIC PLAYER >> */}
          {/* Component này sẽ được hiển thị trên tất cả các trang */}
          {/* Chỉ render nếu có danh sách nhạc */}
          {myMusicTracks.length > 0 && <MusicPlayer tracks={myMusicTracks} initialAutoplay={false} />}
          {/* Bạn có thể đổi initialAutoplay={true} nếu vẫn muốn thử tự động phát, */}
          {/* nhưng false sẽ đáng tin cậy hơn và yêu cầu người dùng nhấp để phát. */}

        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
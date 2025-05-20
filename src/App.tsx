// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
// Giả sử MainLayout đã được tách ra file src/components/MainLayout.tsx
import MainLayout from './components/MainLayout'; // << 1. IMPORT MainLayout TỪ FILE RIÊNG
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


// Component Loading Spinner
// << 2. THÊM "export" ĐỂ CÁC FILE KHÁC CÓ THỂ IMPORT
export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950">
    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-400"></div>
    <p className="text-white text-lg ml-4 font-display">Đang tải MarcusFI...</p>
  </div>
);

// Bỏ định nghĩa MainLayout ở đây nếu bạn đã tách ra file src/components/MainLayout.tsx
// const MainLayout: React.FC = () => { ... }; 

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          {/* Suspense ở đây là fallback chung cho toàn bộ Routes nếu cần */}
          {/* Tuy nhiên, MainLayout cũng có Suspense riêng cho Outlet của nó */}
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Các trang sử dụng MainLayout (có Header, Footer chung) */}
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

              {/* Các trang có layout riêng hoặc không dùng MainLayout */}
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
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
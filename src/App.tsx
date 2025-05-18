// src/App.tsx
import React, { Suspense, lazy } from 'react';
// THÊM Link VÀO IMPORT NÀY
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

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


// Component Loading Spinner
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950">
    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-400"></div>
    <p className="text-white text-lg ml-4 font-display">Đang tải MarcusFI...</p>
  </div>
);

// Layout chính cho các trang có Header và Footer chung
const MainLayout: React.FC = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen bg-white dark:bg-slate-900 selection:bg-purple-500 selection:text-white">
      <Header />
      <main className="flex-grow pt-16 sm:pt-20 md:pt-24"> {/* Điều chỉnh padding-top cho phù hợp với chiều cao Header */}
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
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
            </Route>

            {/* Trang Process sẽ có layout riêng */}
            <Route path="/process" element={<ProcessPage />} />

            {/* Route cho trang không tìm thấy */}
            <Route path="*" element={
              <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4">
                <div className="text-center flex-grow flex flex-col justify-center items-center">
                    {/* Giữ lại motion nếu bạn đã import framer-motion ở đâu đó hoặc bỏ đi nếu không dùng */}
                    <h1 className="text-5xl sm:text-7xl font-display text-purple-500 mb-4 animate-pulse-glow">404</h1>
                    <p className="text-xl sm:text-2xl text-gray-300 mb-8 text-center">Oops! Trang bạn đang tìm kiếm dường như đã lạc vào vũ trụ MarcusFI rồi.</p>
                    {/* Sử dụng Link đã import */}
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
    </LanguageProvider>
  );
}

export default App;
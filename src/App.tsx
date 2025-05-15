// src/App.tsx
import React from 'react'; // Giữ lại import React nếu bạn dùng phiên bản React < 17 hoặc có lý do khác
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import LeadMagnet from './components/LeadMagnet';
import Testimonials from './components/Testimonials';
import BlogPreview from './components/BlogPreview'; // Bạn có thể giữ lại hoặc sau này thay bằng link đến /blog
import Footer from './components/Footer';

// 1. IMPORT TRANG BLOG LIST PAGE
import BlogListPage from './pages/BlogListPage'; // Đảm bảo đường dẫn này đúng

// 2. IMPORT TRANG SINGLE POST PAGE
import SinglePostPage from './pages/SinglePostPage'; // THÊM DÒNG NÀY - Đảm bảo bạn đã tạo file này

// Ví dụ các component trang khác (bạn có thể sẽ tạo sau)
// import ProcessPage from './pages/ProcessPage';


function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="font-sans flex flex-col min-h-screen bg-white"> {/* Thêm bg-white nếu muốn nền mặc định */}
          <Header />
          {/* THÊM PADDING TOP CHO PHẦN CONTENT CHÍNH */}
          <div className="flex-grow pt-16 sm:pt-20 md:pt-24"> {/* Điều chỉnh padding-top cho phù hợp với chiều cao Header của bạn */}
            <Routes>
              <Route path="/" element={
                <main>
                  <Hero />
                  <Problem />
                  <Solution />
                  <LeadMagnet />
                  <Testimonials />
                  <BlogPreview />
                </main>
              } />

              {/* ROUTE CHO BLOG LIST PAGE */}
              <Route path="/blog" element={<BlogListPage />} />

              {/* 3. THÊM ROUTE CHO SINGLE POST PAGE */}
              <Route path="/blog/:slug" element={<SinglePostPage />} />

              {/* Các Route khác sẽ được thêm sau, ví dụ: */}
              {/* <Route path="/process" element={<ProcessPage />} /> */}

            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
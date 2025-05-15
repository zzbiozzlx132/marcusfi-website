import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // useLocation không còn cần thiết ở đây
import { LanguageProvider } from './contexts/LanguageContext'; // useLanguage cũng không cần ở đây nữa
import Header from './components/Header';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import LeadMagnet from './components/LeadMagnet';
import Testimonials from './components/Testimonials';
import BlogPreview from './components/BlogPreview';
import Footer from './components/Footer';
// Không import 'framer-motion' nữa
// Không import useLocation hay useLanguage ở đây nữa (trừ khi bạn dùng cho mục đích khác)

// Không cần component AnimatedRoutes nữa

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="font-sans flex flex-col min-h-screen">
          <Header />
          <div className="flex-grow">
            {/* Sử dụng Routes trực tiếp */}
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
              {/* Thêm các Route khác của bạn ở đây nếu có */}
              {/* Ví dụ:
              <Route path="/process" element={<ProcessPage />} />
              <Route path="/blog" element={<BlogPage />} />
              */}
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
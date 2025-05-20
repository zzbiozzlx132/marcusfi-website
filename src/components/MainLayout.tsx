// src/components/MainLayout.tsx
import React, { Suspense } from 'react'; // Suspense đã có trong code App.tsx gốc của bạn cho Outlet
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Giả sử Header được import ở đây hoặc trong App.tsx và truyền vào
import Footer from './Footer'; // Giả sử Footer được import ở đây hoặc trong App.tsx và truyền vào
import { LoadingSpinner } from '../App'; // Import LoadingSpinner từ App.tsx hoặc định nghĩa lại ở đây nếu muốn

// Layout chính cho các trang có Header và Footer chung
const MainLayout: React.FC = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen 
                   bg-gradient-to-b from-white to-[#f8f0ff] 
                   dark:bg-gradient-to-b dark:from-slate-900 dark:to-[#1e1b2e] 
                   selection:bg-purple-500 selection:text-white"
    >
      <Header />
      <main className="flex-grow pt-16 sm:pt-20 md:pt-24"> {/* Điều chỉnh padding-top cho phù hợp với chiều cao Header */}
        <Suspense fallback={<LoadingSpinner />}> {/* Đảm bảo Outlet được bọc trong Suspense */}
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
// src/components/MainLayout.tsx
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { LoadingSpinner } from '../App';

const MainLayout: React.FC = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen
                   bg-gradient-to-b from-white to-[#f8f0ff] // Luôn sử dụng gradient nền sáng này
                   /* XÓA BỎ HOẶC COMMENT LẠI DÒNG SAU ĐỂ KHÔNG ÁP DỤNG NỀN TỐI */
                   /* dark:bg-gradient-to-b dark:from-slate-900 dark:to-[#1e1b2e] */
                   selection:bg-purple-500 selection:text-white"
    >
      <Header />
      <main className="flex-grow pt-16 sm:pt-20 md:pt-24">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
// src/components/MainLayout.tsx
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { LoadingSpinner } from '../App';

const MainLayout: React.FC = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen
                   bg-gradient-to-b from-white to-[#f8f0ff] // << Nền gradient sáng cho TOÀN BỘ MainLayout
                   selection:bg-purple-500 selection:text-white"
    >
      <Header />
      {/* Xóa bg-lime-400 khỏi thẻ <main> để nó thừa hưởng nền từ div cha */}
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
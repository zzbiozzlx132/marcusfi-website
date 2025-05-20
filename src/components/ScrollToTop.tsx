// src/components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Thêm pathname vào dependency array để useEffect chạy mỗi khi pathname thay đổi

  return null; // Component này không render ra bất kỳ UI nào
};

export default ScrollToTop;
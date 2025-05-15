import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const [email, setEmail] = useState('');
  const { language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  const content = {
    en: {
      title: "Your Starting Point and Launchpad for Your",
      titleHighlight: "Financial Freedom Journey",
      description: "If you're looking to learn about financial freedom and feel overwhelmed by tons of information online, hundreds of courses, and thousands of YouTube videos, then put it all aside. Start simply by entering your email and click to begin your journey to financial freedom.",
      emailPlaceholder: "Enter your email...",
      buttonText: "Start Your Journey",
      privacyNote: "We respect your privacy. No spam!"
    },
    vi: {
      title: "Điểm Khởi Đầu và Bệ Phóng cho",
      titleHighlight: "Hành Trình Tự Do Tài Chính",
      description: "Nếu bạn đang tìm hiểu về tự do tài chính và cảm thấy choáng ngợp bởi quá nhiều thông tin trực tuyến, hàng trăm khóa học và hàng nghìn video YouTube, hãy gác tất cả sang một bên. Hãy bắt đầu đơn giản bằng cách nhập email của bạn và nhấp để bắt đầu hành trình đến tự do tài chính.",
      emailPlaceholder: "Nhập email của bạn...",
      buttonText: "Bắt Đầu Hành Trình", 
      privacyNote: "Chúng tôi tôn trọng quyền riêng tư của bạn. Không spam!"
    }
  };

  const t = content[language];

  return (
    <section className="min-h-screen flex flex-col justify-center pt-32 pb-20 bg-gradient-to-b from-white to-[#f8f0ff]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {t.title}{' '}
            <span className="bg-gradient-to-r from-[#6e00ff] to-[#ff007a] text-transparent bg-clip-text">
              {t.titleHighlight}
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            {t.description}
          </p>
          
          <form onSubmit={handleSubmit} className="group max-w-md mx-auto mb-4">
            {/* Thẻ div chứa input và button */}
            <div className="relative flex items-center transform transition-transform duration-300 hover:scale-[1.02]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                // py-3 của input sẽ xác định chiều cao tổng thể của khu vực này
                className="w-full px-4 py-3 rounded-full border border-[#c084fc] focus:border-[#6e00ff] focus:ring-2 focus:ring-[#6e00ff]/20 outline-none transition-all pr-32 md:pr-40 lg:pr-48" // Tăng padding-right nếu cần cho nút dài hơn
                required
              />
              <button
                type="submit"
                // Đã thêm top-1, bottom-1 và loại bỏ style={{ height: ... }}
                className="absolute top-1 bottom-1 right-1 bg-gradient-to-r from-[#8f00ff] to-[#e100ff] hover:from-[#9e00ff] hover:to-[#ff00e0] text-white font-medium py-2 px-6 rounded-full transition-all duration-300 flex items-center justify-center whitespace-nowrap text-sm"
              >
                {t.buttonText}
                <Send className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>
          
          <p className="text-sm text-gray-500">
            {t.privacyNote}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
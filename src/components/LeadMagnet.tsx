import React, { useState } from 'react'; // Thêm useState để quản lý email
import { Gift, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext'; // Đảm bảo đường dẫn này chính xác

const LeadMagnet: React.FC = () => {
  const [email, setEmail] = useState(''); // State cho input email
  const { language } = useLanguage();

  // Hàm xử lý khi submit form (tương tự Hero)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý logic gửi email ở đây
    console.log('Lead magnet email submitted:', email);
    setEmail(''); // Reset email sau khi submit
  };

  const content = {
    en: {
      mainTitle: "What's Inside the 'Financial Orientation for Young People' Toolkit?",
      mainDescription: "Get started with our comprehensive toolkit designed to help you build a strong financial foundation.",
      giftSectionTitle: "A Special Gift Just For You",
      listItem1: "Step-by-step guide to setting up an effective personal budget",
      listItem2: "Common financial mistakes to avoid and how to prevent them",
      listItem3: "Easy-to-understand saving and investment concepts",
      listItem4: "Ready-to-use templates for immediate practice",
      formTitle: "Get Your Free Financial Toolkit",
      emailPlaceholder: "Enter your email address",
      buttonText: "Get Free Access",
      privacyNote: "We respect your privacy. No spam!"
    },
    vi: {
      mainTitle: "Bên Trong Bộ Công Cụ 'Định Hướng Tài Chính Cho Người Trẻ' Có Gì?",
      mainDescription: "Bắt đầu với bộ công cụ toàn diện của chúng tôi được thiết kế để giúp bạn xây dựng nền tảng tài chính vững chắc.",
      giftSectionTitle: "Một Món Quà Đặc Biệt Dành Riêng Cho Bạn",
      listItem1: "Hướng dẫn từng bước để thiết lập ngân sách cá nhân hiệu quả",
      listItem2: "Những sai lầm tài chính phổ biến cần tránh và cách phòng ngừa",
      listItem3: "Các khái niệm tiết kiệm và đầu tư dễ hiểu",
      listItem4: "Mẫu biểu sẵn có để thực hành ngay lập tức",
      formTitle: "Nhận Miễn Phí Bộ Công Cụ Tài Chính Của Bạn",
      emailPlaceholder: "Nhập địa chỉ email của bạn",
      buttonText: "Nhận Miễn Phí Ngay",
      privacyNote: "Chúng tôi tôn trọng quyền riêng tư của bạn. Không spam!"
    }
  };

  // Chọn nội dung dựa trên ngôn ngữ hiện tại, fallback về tiếng Anh nếu không có
  const t = content[language] || content.en;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.mainTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.mainDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-[#6e00ff]/10 to-[#ff007a]/10 p-8 rounded-2xl">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <Gift className="h-12 w-12 text-[#6e00ff] mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t.giftSectionTitle}
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <ArrowRight className="h-6 w-6 text-[#6e00ff] mr-2 flex-shrink-0" />
                  <span>{t.listItem1}</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-6 w-6 text-[#6e00ff] mr-2 flex-shrink-0" />
                  <span>{t.listItem2}</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-6 w-6 text-[#6e00ff] mr-2 flex-shrink-0" />
                  <span>{t.listItem3}</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-6 w-6 text-[#6e00ff] mr-2 flex-shrink-0" />
                  <span>{t.listItem4}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                {t.formTitle}
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4"> {/* Thêm onSubmit */}
                <input
                  type="email"
                  value={email} // Thêm value
                  onChange={(e) => setEmail(e.target.value)} // Thêm onChange
                  placeholder={t.emailPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-[#c084fc] focus:border-[#6e00ff] focus:ring-2 focus:ring-[#6e00ff]/20 outline-none transition-all"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#8f00ff] to-[#e100ff] hover:from-[#9e00ff] hover:to-[#ff00e0] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                >
                  {t.buttonText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </form>
              <p className="text-sm text-gray-500 mt-4 text-center">
                {t.privacyNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
// src/components/Footer.tsx
import React from 'react';
import { BarChart3, Mail, MapPin, Phone, Link as LinkIconLucide } from 'lucide-react'; // Đổi tên Link của lucide để tránh trùng
import { useLanguage } from '../contexts/LanguageContext';
import { Link as RouterLink } from 'react-router-dom'; // Đổi tên Link của react-router-dom

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const content = {
    en: {
      tagline: "Transforming Businesses with Intelligent Financial Solutions and Technology",
      quickLinksTitle: "Quick Links",
      homeLink: "Home",
      servicesLinkText: "Services",
      processLink: "Our Process",
      blogLink: "Blog", 
      resourcesLink: "Resources", 

      legalTitle: "Legal",
      faqLink: "FAQ",
      termsLink: "Terms of Service",
      privacyLink: "Privacy Policy",

      contactUsTitle: "Contact Us",
      address: "Long Thanh My Ward, Thu Duc City, HCMC, Vietnam", // << ĐỊA CHỈ MỚI
      phone: "+84 85 222 2625", // << SỐ ĐIỆN THOẠI MỚI (đã thêm khoảng trắng cho dễ đọc)
      email: "info@marcusfi.com",   // Giữ nguyên
      timezoneNote: "(Hanoi Time, GMT+7)", // << GHI CHÚ MÚI GIỜ MỚI
      contactPageLink: "Contact Page",
      copyrightReserved: "All rights reserved."
      // Bỏ Office Hours
    },
    vi: {
      tagline: "Chuyển đổi Doanh nghiệp với Giải pháp Tài chính Thông minh và Công nghệ",
      quickLinksTitle: "Liên Kết Nhanh",
      homeLink: "Trang Chủ",
      servicesLinkText: "Dịch Vụ",
      processLink: "Quy Trình",
      blogLink: "Bài Viết",
      resourcesLink: "Tài Nguyên",

      legalTitle: "Pháp Lý",
      faqLink: "Câu Hỏi Thường Gặp",
      termsLink: "Điều Khoản Dịch Vụ",
      privacyLink: "Chính Sách Bảo Mật",

      contactUsTitle: "Liên Hệ Chúng Tôi",
      address: "Phường Long Thạnh Mỹ, TP. Thủ Đức, TP.HCM, Việt Nam", // << ĐỊA CHỈ MỚI
      phone: "+84 85 222 2625", // << SỐ ĐIỆN THOẠI MỚI
      email: "info@marcusfi.com",
      timezoneNote: "(Giờ Hà Nội, GMT+7)", // << GHI CHÚ MÚI GIỜ MỚI
      contactPageLink: "Trang Liên Hệ",
      copyrightReserved: "Bản quyền đã được bảo hộ."
      // Bỏ Office Hours
    }
  };

  const t = content[language] || content.en;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"> {/* Giữ 5 cột */}
          {/* Column 1: Brand and Social */}
          <div>
            <RouterLink to="/" className="flex items-center mb-4 hover:opacity-80 transition-opacity">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">marcusfi</span>
            </RouterLink>
            <p className="text-gray-400 mb-4 text-sm">
              {t.tagline}
            </p>
            {/* ... Social media icons ... */}
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              {/* Thêm các icon social khác nếu có */}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.quickLinksTitle}</h3>
            <ul className="space-y-2">
              <li><RouterLink to="/" className="text-gray-400 hover:text-white transition-colors">{t.homeLink}</RouterLink></li>
              <li><RouterLink to="/process" className="text-gray-400 hover:text-white transition-colors">{t.processLink}</RouterLink></li>
              <li><RouterLink to="/blog" className="text-gray-400 hover:text-white transition-colors">{t.blogLink}</RouterLink></li>
              <li><RouterLink to="/resources" className="text-gray-400 hover:text-white transition-colors">{t.resourcesLink}</RouterLink></li>
              {/* Bạn có thể thêm các link khác ở đây nếu muốn, ví dụ Dịch vụ, Về chúng tôi */}
            </ul>
          </div>
          
          {/* Column 3: Legal (Trước đây là Services) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.legalTitle}</h3>
            <ul className="space-y-2">
              <li><RouterLink to="/faq" className="text-gray-400 hover:text-white transition-colors">{t.faqLink}</RouterLink></li>
              <li><RouterLink to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">{t.termsLink}</RouterLink></li>
              <li><RouterLink to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">{t.privacyLink}</RouterLink></li>
            </ul>
          </div>

          {/* Column 4: Có thể để trống hoặc thêm nội dung khác nếu bạn có 5 cột */}
          {/* Nếu chỉ muốn 4 cột, bạn có thể xóa cột này và điều chỉnh grid thành lg:grid-cols-4 */}
          <div>
             {/* Ví dụ: Thêm link dịch vụ ở đây nếu không muốn ở Quick Links */}
             {/* <h3 className="text-lg font-semibold mb-4">Services</h3> <ul className="space-y-2"><li>...</li></ul> */}
          </div>


          {/* Column 5: Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.contactUsTitle}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">{t.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <a href={`tel:${t.phone.replace(/\s/g, '')}`} className="text-gray-400 hover:text-white transition-colors">{t.phone}</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <a href={`mailto:${t.email}`} className="text-gray-400 hover:text-white transition-colors">{t.email}</a>
              </li>
               <li className="pt-1"> {/* Ghi chú múi giờ */}
                <span className="text-xs text-gray-500">{t.timezoneNote}</span>
              </li>
              <li className="pt-1">
                <RouterLink to="/contact" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  {t.contactPageLink}
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} marcusfi. {t.copyrightReserved}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
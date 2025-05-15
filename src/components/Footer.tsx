import React from 'react';
import { BarChart3, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext'; // Đảm bảo đường dẫn này chính xác

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại một cách động

  const content = {
    en: {
      tagline: "Transforming Businesses with Intelligent Financial Solutions and Technology",
      quickLinksTitle: "Quick Links",
      homeLink: "Home",
      servicesLinkText: "Services", // Link text under Quick Links
      processLink: "Our Process",
      aboutUsLink: "About Us",
      contactLink: "Contact",
      servicesTitle: "Services", // Title for Services section
      investmentManagement: "Investment Management",
      wealthGrowth: "Wealth Growth",
      financialAnalytics: "Financial Analytics",
      marketIntelligence: "Market Intelligence",
      techIntegration: "Tech Integration",
      contactUsTitle: "Contact Us",
      address: "123 Finance Street, New York, NY 10001",
      phone: "+1 (555) 123-4567", // Giữ nguyên hoặc có thể thêm mô tả nếu cần dịch
      email: "info@marcusfi.com",   // Giữ nguyên
      copyrightReserved: "All rights reserved."
    },
    vi: {
      tagline: "Chuyển đổi Doanh nghiệp với Giải pháp Tài chính Thông minh và Công nghệ",
      quickLinksTitle: "Liên Kết Nhanh",
      homeLink: "Trang Chủ",
      servicesLinkText: "Dịch Vụ",
      processLink: "Quy Trình",
      aboutUsLink: "Về Chúng Tôi",
      contactLink: "Liên Hệ",
      servicesTitle: "Dịch Vụ",
      investmentManagement: "Quản Lý Đầu Tư",
      wealthGrowth: "Tăng Trưởng Tài Sản",
      financialAnalytics: "Phân Tích Tài Chính",
      marketIntelligence: "Thông Tin Thị Trường",
      techIntegration: "Tích Hợp Công Nghệ",
      contactUsTitle: "Liên Hệ Chúng Tôi",
      address: "123 Đường Tài Chính, New York, NY 10001", // Địa chỉ có thể giữ nguyên hoặc dịch tùy theo yêu cầu
      phone: "+1 (555) 123-4567",
      email: "info@marcusfi.com",
      copyrightReserved: "Bản quyền đã được bảo hộ."
    }
  };

  const t = content[language] || content.en;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand and Social */}
          <div>
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">marcusfi</span>
            </div>
            <p className="text-gray-400 mb-4 text-sm"> {/* Thêm text-sm cho tagline */}
              {t.tagline}
            </p>
            <div className="flex space-x-4">
              {/* Social media icons - giữ nguyên vì chúng là SVG và không có text */}
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.quickLinksTitle}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t.homeLink}</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">{t.servicesLinkText}</a></li>
              <li><a href="#process" className="text-gray-400 hover:text-white transition-colors">{t.processLink}</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">{t.aboutUsLink}</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">{t.contactLink}</a></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.servicesTitle}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t.investmentManagement}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t.wealthGrowth}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t.financialAnalytics}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t.marketIntelligence}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t.techIntegration}</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.contactUsTitle}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" /> {/* Thêm flex-shrink-0 */}
                <span className="text-gray-400">{t.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400">{t.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400">{t.email}</span>
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
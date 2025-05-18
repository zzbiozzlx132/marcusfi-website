// src/pages/ResourcesPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { HardDriveDownload, ExternalLink, Construction, ListChecks } from 'lucide-react';

// Nội dung đa ngôn ngữ cho trang "Đang phát triển" (Giữ nguyên như trước)
const underConstructionContent: Record<string, {
    pageTitle: string;
    mainHeading: string;
    descriptionLine1: string;
    descriptionLine2: string;
    accessTempResourcesButton: string;
    tempResourcesLinkText: string;
    stayTuned: string;
}> = {
    en: {
        pageTitle: "Resources - Under Development",
        mainHeading: "Our Resources Hub is Growing!",
        descriptionLine1: "We're currently curating a fantastic collection of templates, e-books, and tools to empower your financial journey.",
        descriptionLine2: "This section is under active development and will be launched soon with a full library of valuable assets.",
        accessTempResourcesButton: "Access Current Resources (Google Sheet)",
        tempResourcesLinkText: "While we build, you can access our curated list of resources here:",
        stayTuned: "Stay tuned for exciting updates!",
    },
    vi: {
        pageTitle: "Tài Nguyên - Đang Phát Triển",
        mainHeading: "Kho Tài Nguyên Của Chúng Tôi Đang Lớn Dần!",
        descriptionLine1: "Chúng tôi hiện đang tổng hợp một bộ sưu tập tuyệt vời gồm các mẫu, sách điện tử và công cụ để tiếp sức cho hành trình tài chính của bạn.",
        descriptionLine2: "Chuyên mục này đang được tích cực phát triển và sẽ sớm ra mắt với một thư viện đầy đủ các tài sản giá trị.",
        accessTempResourcesButton: "Truy cập Tài liệu Hiện tại (Google Sheet)",
        tempResourcesLinkText: "Trong lúc chờ đợi, bạn có thể truy cập danh sách tài nguyên chọn lọc của chúng tôi tại đây:",
        stayTuned: "Hãy theo dõi để nhận những cập nhật thú vị nhé!",
    }
};

// ĐẶT LINK GOOGLE SHEET CỦA BẠN VÀO ĐÂY
const GOOGLE_SHEET_RESOURCES_LINK = "https://docs.google.com/spreadsheets/d/1VOAVVhB2JNCDniLdPgyULLqOrORPLnnA9Jm3he9QiA8/edit?usp=sharing";

const ResourcesPage: React.FC = () => {
  const { language } = useLanguage();
  const t = underConstructionContent[language] || underConstructionContent.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-100 flex flex-col font-sans selection:bg-[#6e00ff] selection:text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 flex flex-col justify-center items-center text-center py-28 sm:py-32 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99], delay: 0.1 }}
          className="max-w-2xl w-full bg-white/70 backdrop-blur-lg p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl border border-gray-200/70"
        >
          <Construction className="w-16 h-16 sm:w-20 sm:h-20 text-[#6e00ff] mx-auto mb-6 opacity-80" strokeWidth={1.5} />

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-[#6e00ff] to-[#ff007a] text-transparent bg-clip-text">
              {t.mainHeading}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">
            {t.descriptionLine1}
          </p>
          <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed">
            {t.descriptionLine2}
          </p>

          <div className="bg-purple-50/70 p-4 sm:p-5 rounded-lg border border-purple-200/80 mb-8">
            <div className="flex items-center justify-center mb-2 text-purple-700">
                <ListChecks size={20} className="mr-2"/>
                <h3 className="text-sm sm:text-base font-semibold ">{t.tempResourcesLinkText}</h3>
            </div>
            <motion.a // Thay Link bằng thẻ <a>
              href={GOOGLE_SHEET_RESOURCES_LINK} // Sử dụng link trực tiếp
              target="_blank" // Mở trong tab mới
              rel="noopener noreferrer" // Quan trọng cho bảo mật và SEO khi mở link ngoài
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#6e00ff] to-[#8f00ff] hover:from-[#7a1aff] hover:to-[#9e00ff] text-white text-sm sm:text-base font-medium rounded-lg shadow-lg hover:shadow-[#8f00ff]/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6e00ff] focus:ring-offset-purple-50"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <HardDriveDownload size={18} className="mr-2" />
              {t.accessTempResourcesButton}
              <ExternalLink size={14} className="ml-2 opacity-70" /> {/* Icon báo hiệu link ngoài */}
            </motion.a>
          </div>

          <p className="text-base sm:text-lg font-semibold text-purple-700 animate-pulse">
            {t.stayTuned}
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;
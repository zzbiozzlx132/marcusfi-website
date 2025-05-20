// src/pages/ContactUsPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'; // Thêm Clock
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage

const ContactUsPage: React.FC = () => {
  const { language } = useLanguage(); // Sử dụng hook
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Nội dung đa ngôn ngữ cho trang Contact Us
  const pageContent = {
    en: {
      pageTitle: "Get in",
      pageTitleHighlight: "Touch",
      pageSubtitle: "Have questions about your financial journey? We're here to help you every step of the way.",
      contactInfoTitle: "Contact Information",
      emailTitle: "Email",
      primaryEmail: "info@marcusfi.com",
      phoneTitle: "Phone",
      phoneNumber: "+84 85 222 2625", // SỐ ĐIỆN THOẠI MỚI
      addressTitle: "Address",
      addressDetailLine1: "Long Thanh My Ward,", // ĐỊA CHỈ MỚI - Tách dòng để dễ hiển thị
      addressDetailLine2: "Thu Duc City, HCMC, Vietnam",
      timezoneNote: "(Hanoi Time, GMT+7)",
      formTitle: "Send us a Message",
      yourNameLabel: "Your Name",
      emailAddressLabel: "Email Address",
      subjectLabel: "Subject",
      messageLabel: "Message",
      sendMessageButton: "Send Message"
    },
    vi: {
      pageTitle: "Liên Hệ",
      pageTitleHighlight: "Chúng Tôi",
      pageSubtitle: "Bạn có câu hỏi về hành trình tài chính của mình? Chúng tôi ở đây để hỗ trợ bạn trên mỗi bước đường.",
      contactInfoTitle: "Thông Tin Liên Hệ",
      emailTitle: "Email",
      primaryEmail: "info@marcusfi.com",
      phoneTitle: "Điện thoại",
      phoneNumber: "+84 85 222 2625",
      addressTitle: "Địa chỉ",
      addressDetailLine1: "Phường Long Thạnh Mỹ,",
      addressDetailLine2: "Thành phố Thủ Đức, TP.HCM, Việt Nam",
      timezoneNote: "(Giờ Hà Nội, GMT+7)",
      formTitle: "Gửi Tin Nhắn cho Chúng Tôi",
      yourNameLabel: "Tên của bạn",
      emailAddressLabel: "Địa chỉ Email",
      subjectLabel: "Chủ đề",
      messageLabel: "Nội dung tin nhắn",
      sendMessageButton: "Gửi Tin Nhắn"
    }
  };

  const t = pageContent[language] || pageContent.en;

  return (
    // Nền của trang này sẽ được MainLayout.tsx quản lý nếu ContactUsPage là con của MainLayout
    // Nếu không, bạn có thể thêm class nền gradient vào div dưới đây.
    // className="min-h-screen bg-gradient-to-b from-white to-[#f8f0ff] dark:bg-gradient-to-b dark:from-slate-900 dark:to-[#1e1b2e]"
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-950 py-12 sm:py-16"> {/* Giữ lại nền gốc của bạn và thêm dark mode */}
      <div className="container mx-auto px-4"> {/* Thêm padding-top cho nội dung nếu Header là fixed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.pageTitle} <span className="bg-gradient-to-r from-[#6e00ff] to-[#ff007a] text-transparent bg-clip-text">{t.pageTitleHighlight}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t.pageSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Cột thông tin liên hệ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 h-full"> {/* Thêm h-full nếu muốn 2 cột cao bằng nhau */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.contactInfoTitle}</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-[#6e00ff] mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t.emailTitle}</h3>
                    {/* Giữ nguyên chỉ một email */}
                    <a href={`mailto:${t.primaryEmail}`} className="text-gray-600 dark:text-gray-300 hover:text-[#6e00ff] dark:hover:text-purple-400 break-all">
                      {t.primaryEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-[#6e00ff] mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t.phoneTitle}</h3>
                    {/* Chỉ hiển thị số điện thoại mới */}
                    <a href={`tel:${t.phoneNumber.replace(/\s/g, '')}`} className="text-gray-600 dark:text-gray-300 hover:text-[#6e00ff] dark:hover:text-purple-400">
                      {t.phoneNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-[#6e00ff] mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t.addressTitle}</h3>
                    {/* Hiển thị địa chỉ mới */}
                    <p className="text-gray-600 dark:text-gray-300">
                      {t.addressDetailLine1}<br />
                      {t.addressDetailLine2}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bỏ phần Office Hours, thay bằng ghi chú múi giờ */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                 <div className="flex items-center">
                    <Clock className="h-5 w-5 text-[#6e00ff] mr-3 flex-shrink-0" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.timezoneNote}</p>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Cột Form liên hệ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 h-full"> {/* Thêm h-full */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.formTitle}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-us-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.yourNameLabel}
                  </label>
                  <input
                    type="text"
                    id="contact-us-name" // Đổi ID để đảm bảo tính duy nhất
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#6e00ff] focus:border-[#6e00ff] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-us-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.emailAddressLabel}
                  </label>
                  <input
                    type="email"
                    id="contact-us-email" // Đổi ID
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#6e00ff] focus:border-[#6e00ff] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-us-subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.subjectLabel}
                  </label>
                  <input
                    type="text"
                    id="contact-us-subject" // Đổi ID
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#6e00ff] focus:border-[#6e00ff] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-us-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.messageLabel}
                  </label>
                  <textarea
                    id="contact-us-message" // Đổi ID
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#6e00ff] focus:border-[#6e00ff] transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#6e00ff] to-[#ff007a] hover:from-[#7a1aff] hover:to-[#ff00e0] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg hover:shadow-purple-500/50"
                >
                  {t.sendMessageButton}
                  <Send className="ml-2 h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
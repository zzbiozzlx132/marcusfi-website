import React, { useState } from 'react';
import { Gift, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext'; // Đảm bảo đường dẫn này chính xác

const LeadMagnet: React.FC = () => {
  const [email, setEmail] = useState('');
  // << THÊM CÁC STATE CẦN THIẾT >>
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  // << KẾT THÚC THÊM STATE >>

  const { language } = useLanguage();

  // << CẬP NHẬT HÀM XỬ LÝ SUBMIT >>
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setIsError(false);

    // Thông tin Google Form (Sử dụng cùng form với Hero)
    const googleFormActionUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeBYQQgP0Eyv97G3k0G5D6BlDX00VbCfrU48j2uanWv-Kt6fg/formResponse';
    const emailInputName = 'entry.741330706';

    const formData = new FormData();
    formData.append(emailInputName, email);

    try {
      await fetch(googleFormActionUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      console.log('Lead magnet email submitted:', email);
      setMessage(t.successMessage); // Sử dụng tin nhắn thành công
      setEmail(''); // Reset email

    } catch (error) {
      console.error('Error submitting Lead Magnet to Google Form:', error);
      setMessage(t.errorMessage); // Sử dụng tin nhắn lỗi
      setIsError(true);
    } finally {
        setIsSubmitting(false);
    }
  };
  // << KẾT THÚC CẬP NHẬT HÀM >>

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
      privacyNote: "We respect your privacy. No spam!",
      successMessage: "Thank you! Your toolkit is on its way.", // << Thêm message
      errorMessage: "Oops! Something went wrong. Please try again." // << Thêm message
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
      privacyNote: "Chúng tôi tôn trọng quyền riêng tư của bạn. Không spam!",
      successMessage: "Cảm ơn bạn! Bộ công cụ sẽ sớm được gửi đến bạn.", // << Thêm message
      errorMessage: "Ôi! Có lỗi xảy ra. Vui lòng thử lại." // << Thêm message
    }
  };

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
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-[#c084fc] focus:border-[#6e00ff] focus:ring-2 focus:ring-[#6e00ff]/20 outline-none transition-all"
                  required
                  disabled={isSubmitting} // << Thêm disabled
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#8f00ff] to-[#e100ff] hover:from-[#9e00ff] hover:to-[#ff00e0] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" // << Thêm class disabled
                  disabled={isSubmitting} // << Thêm disabled
                >
                  {isSubmitting ? (language === 'vi' ? 'Đang gửi...' : 'Submitting...') : t.buttonText}
                  {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
              </form>
              {/* << THÊM PHẦN HIỂN THỊ MESSAGE >> */}
              {message && (
                <p className={`text-sm mt-4 text-center ${isError ? 'text-red-500' : 'text-green-600'}`}>
                  {message}
                </p>
              )}
              {/* << KẾT THÚC THÊM MESSAGE >> */}

              {/* Chỉ hiển thị ghi chú khi chưa có message */}
              {!message && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  {t.privacyNote}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;
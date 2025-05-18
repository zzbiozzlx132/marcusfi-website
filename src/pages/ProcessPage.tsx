// src/pages/ProcessPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ProcessStepNode from '../components/ProcessStepNode'; // Đảm bảo đường dẫn này ĐÚNG

// SỬA ĐỔI: Import thêm "type LucideIcon"
import { type LucideIcon, Zap, ShieldCheck, TrendingUp, DollarSign, Brain, Target, Route as RouteIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// --- Interface và Data ---
interface ProcessPageContentType {
  pageTitleLine1: string;
  pageTitleLine2: string;
  pageDescription: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
  ctaLoginPrompt: string;
  ctaLoginLink: string;
  steps: Array<{
    id: string;
    title: string;
    summary: string;
    icon: LucideIcon; // SỬA ĐỔI: Đổi React.ElementType thành LucideIcon
    content: (tCommon: CommonTranslations) => React.ReactNode;
    isUnlocked: boolean;
    isCompleted: boolean;
  }>;
}
interface CommonTranslations {
  toolsExpenseTrackerLinkText?: string;
}

// Define a type for the language-specific content
type LanguageSpecificContent = {
  en: ProcessPageContentType;
  vi: ProcessPageContentType;
  // Add other language keys here if they follow ProcessPageContentType
};

// Define the overall type for processPageContentData
interface ProcessPageData {
  languages: LanguageSpecificContent;
  common: Record<string, CommonTranslations>; // 'en', 'vi' keys for common translations
}

// Adjusted Data Structure
const processPageContentData: ProcessPageData = {
  languages: { // Nest language-specific content under 'languages'
    en: {
      pageTitleLine1: "Your Financial Freedom",
      pageTitleLine2: "Journey with MarcusFI",
      pageDescription: "This isn't just theory. This is a detailed roadmap with concrete tasks to help you conquer financial freedom, step by step. MarcusFI is with you!",
      ctaTitle: "Ready to Write Your Own Financial Story?",
      ctaDescription: "This journey requires perseverance, but the reward is priceless: freedom, peace of mind, and the ability to live the life you've always dreamed of. MarcusFI provides the roadmap and tools, but YOU are the captain.",
      ctaButton: "Sign Up & Start Now",
      ctaLoginPrompt: "Already have an account?",
      ctaLoginLink: "Sign in here",
      steps: [
        { id: 'step-1-foundation', title: 'Step 1: Understand Yourself & Build Habit Foundations', summary: 'Control cash flow, identify financial "leaks," and start your smart savings journey.', icon: Zap,
          content: (tCommon) => ( <div className="space-y-3"> <p>A journey of a thousand miles begins with a single step...</p> <h4 className="font-semibold text-base text-[#c084fc] mt-2 mb-1">Core Tasks:</h4> <ul className="list-disc list-inside space-y-1.5 pl-4 text-sm"><li><strong>Track Expenses (30 days):</strong> ... <Link to="/tools/expense-tracker" className="text-amber-400 hover:text-amber-300 underline">{tCommon.toolsExpenseTrackerLinkText || "MarcusFI Expense Tracker"}</Link> ...</li><li><strong>Analyze & Identify "Blind Spots":</strong> ...</li><li><strong>Set Initial Savings Goals:</strong> ...</li><li><strong>Build a Positive Money Mindset:</strong> ...</li></ul> <p className="italic text-gray-500 dark:text-gray-400 pt-1 text-sm"><em>"Habit is either the best of servants or the worst of masters." - Nathaniel Emmons</em></p> </div> ),
          isUnlocked: true, isCompleted: false,
        },
        { id: 'step-2-emergency-fund', title: 'Step 2: Create an Emergency Fund & Safety Net', summary: 'Build a solid emergency fund for unexpected situations, protecting you from debt and keeping long-term plans on track.', icon: ShieldCheck,
          content: (tCommon) => ( <div className="space-y-3"><p>Life is full of unforeseen surprises...</p><h4 className="font-semibold text-base text-[#c084fc] mt-2 mb-1">Core Tasks:</h4><ul className="list-disc list-inside space-y-1.5 pl-4 text-sm"><li><strong>Define Fund Target:</strong> ...</li><li><strong>Choose Suitable Storage:</strong> ...</li><li><strong>Contribute Regularly & Automate:</strong> ...</li><li><strong>Fund Usage Rules:</strong> ...</li></ul><p className="italic text-gray-500 dark:text-gray-400 pt-1 text-sm"><em>"Hope for the best, prepare for the worst, and take whatever comes." - Anonymous</em></p></div> ),
          isUnlocked: true, isCompleted: false,
        },
        { id: 'step-3-debt-management', title: 'Step 3: Conquer Debt & Achieve Financial Liberation', summary: 'Understand debt types, build smart repayment strategies to reduce interest burdens and accelerate your freedom journey.', icon: DollarSign,
          content: (tCommon) => ( <div className="space-y-3"><p>Bad debt ...</p><h4 className="font-semibold text-base text-[#c084fc] mt-2 mb-1">Core Tasks:</h4><ul className="list-disc list-inside space-y-1.5 pl-4 text-sm"><li><strong>List & Categorize Debt:</strong> ...</li><li><strong>Prioritize High-Interest Debt:</strong> ...</li><li><strong>Negotiate Interest Rates (If Possible):</strong> ...</li><li><strong>Avoid New Bad Debt:</strong> ...</li></ul><p className="italic text-gray-500 dark:text-gray-400 pt-1 text-sm"><em>"Interest is a monster that can devour your assets if not controlled." - Warren Buffett (paraphrased)</em></p></div> ),
          isUnlocked: true, isCompleted: false,
        },
        { id: 'step-4-investment-mindset', title: 'Step 4: Unlock Investment Mindset & Grow Assets', summary: 'Learn basic investment channels, determine your risk appetite, and start the journey of making your money work for you.', icon: TrendingUp,
          content: (tCommon) => ( <div className="space-y-3"><p>Saving is necessary, but ...</p><h4 className="font-semibold text-base text-[#c084fc] mt-2 mb-1">Core Tasks:</h4><ul className="list-disc list-inside space-y-1.5 pl-4 text-sm"><li><strong>Learn Basic Investment Knowledge:</strong> ...</li><li><strong>Determine Risk Appetite:</strong> ...</li><li><strong>Start Small & Diversify:</strong> ...</li><li><strong>Long-Term Thinking & Patience:</strong> ...</li></ul><p className="italic text-gray-500 dark:text-gray-400 pt-1 text-sm"><em>"Don't put all your eggs in one basket." - Proverb</em></p></div> ),
          isUnlocked: true, isCompleted: false,
        },
        { id: 'step-5-lifelong-learning', title: 'Step 5: Personal Development & Lifelong Learning', summary: 'Continuously enhance knowledge and skills to increase your value, expand income opportunities, and adapt to a changing world.', icon: Brain,
          content: (tCommon) => ( <div className="space-y-3"><p>Your greatest asset is yourself...</p><h4 className="font-semibold text-base text-[#c084fc] mt-2 mb-1">Core Tasks:</h4><ul className="list-disc list-inside space-y-1.5 pl-4 text-sm"><li><strong>Identify Skills to Improve/Learn:</strong> ...</li><li><strong>Invest in Education:</strong> ...</li><li><strong>Build Your Network:</strong> ...</li><li><strong>Stay Curious & Adaptable:</strong> ...</li></ul><p className="italic text-gray-500 dark:text-gray-400 pt-1 text-sm"><em>"An investment in knowledge pays the best interest." - Benjamin Franklin</em></p></div> ),
          isUnlocked: true, isCompleted: false,
        }
      ],
    },
    vi: {
      pageTitleLine1: "Hành Trình Tự Do",
      pageTitleLine2: "Tài Chính Cùng MarcusFI",
      pageDescription: "Đây không chỉ là lý thuyết. Đây là bản đồ chi tiết, với những nhiệm vụ cụ thể, giúp bạn từng bước chinh phục mục tiêu tự do tài chính. MarcusFI đồng hành cùng bạn!",
      ctaTitle: "Sẵn Sàng Viết Nên Câu Chuyện Tài Chính Của Riêng Bạn?",
      ctaDescription: "Hành trình này đòi hỏi sự kiên trì, nhưng phần thưởng là vô giá: sự tự do, an tâm và khả năng sống cuộc đời bạn hằng mơ ước. MarcusFI cung cấp lộ trình và công cụ, nhưng chính BẠN là người thuyền trưởng.",
      ctaButton: "Đăng Ký & Bắt Đầu Ngay",
      ctaLoginPrompt: "Đã có tài khoản?",
      ctaLoginLink: "Đăng nhập tại đây",
      steps: [
          { id: 'step-1-foundation', title: 'Bước 1: Thấu Hiểu Bản Thân & Xây Móng Thói Quen', summary: 'Kiểm soát dòng tiền, nhận diện "rò rỉ" tài chính và bắt đầu hành trình tiết kiệm thông minh.', icon: Zap,
          content: (tCommon) => ( <div className="space-y-3"> <p>Hành trình vạn dặm bắt đầu từ một bước chân...</p> <h4 className="font-semibold text-base text-[#c084fc] mt-2 mb-1">Nhiệm Vụ Cốt Lõi:</h4> <ul className="list-disc list-inside space-y-1.5 pl-4 text-sm"><li><strong>Theo dõi chi tiêu (30 ngày):</strong> ... <Link to="/tools/expense-tracker" className="text-amber-400 hover:text-amber-300 underline">{tCommon.toolsExpenseTrackerLinkText || "Công cụ Theo dõi Chi tiêu MarcusFI"}</Link> ...</li><li><strong>Phân tích & Nhận diện "Điểm mù":</strong> ...</li><li><strong>Thiết lập Mục tiêu Tiết kiệm Ban đầu:</strong> ...</li><li><strong>Xây dựng Tư duy Tích cực về Tiền:</strong> ...</li></ul> <p className="italic text-gray-500 dark:text-gray-400 pt-1 text-sm"><em>"Thói quen là người đầy tớ tuyệt vời hoặc ông chủ tồi tệ." - Nathaniel Emmons</em></p> </div> ),
          isUnlocked: true, isCompleted: false,
        },
        { id: 'step-2-emergency-fund', title: 'Bước 2: Kiến Tạo Quỹ Khẩn Cấp & Lá Chắn An Toàn', summary: 'Xây dựng quỹ dự phòng vững chắc cho những tình huống bất ngờ, bảo vệ bạn khỏi nợ nần và giữ vững kế hoạch dài hạn.', icon: ShieldCheck,
          content: (tCommon) => ( <div className="space-y-3"><p>Cuộc sống luôn ẩn chứa những bất ngờ...</p><h4 className="font-semibold text-base text-[#c084fc] mt-2 mb-1">Nhiệm Vụ Cốt Lõi:</h4><ul className="list-disc list-inside space-y-1.5 pl-4 text-sm"><li><strong>Xác định Mục tiêu Quỹ:</strong> ...</li><li><strong>Lựa chọn Kênh Lưu Trữ Phù Hợp:</strong> ...</li><li><strong>Đều Đặn Đóng Góp & Tự Động Hóa:</strong> ...</li><li><strong>Quy tắc Sử dụng Quỹ:</strong> ...</li></ul><p className="italic text-gray-500 dark:text-gray-400 pt-1 text-sm"><em>"Hãy chuẩn bị cho điều tồi tệ nhất, hy vọng điều tốt nhất, và chấp nhận những gì đến." - Khuyết danh</em></p></div> ),
          isUnlocked: true, isCompleted: false,
        },
        { id: 'step-3-debt-management', title: 'Bước 3: Chinh Phục Nợ Nần & Giải Phóng Tài Chính', summary: 'Hiểu rõ các loại nợ, xây dựng chiến lược trả nợ thông minh để giảm bớt gánh nặng lãi suất và tăng tốc hành trình tự do.', icon: DollarSign,
          content: (tCommon) => ( <div className="space-y-3"><p>Nợ xấu ...</p><h4 className="font-semibold text-base text-[#c084fc] mt-2 mb-1">Nhiệm Vụ Cốt Lõi:</h4><ul className="list-disc list-inside space-y-1.5 pl-4 text-sm"><li><strong>Liệt kê & Phân loại Nợ:</strong> ...</li><li><strong>Ưu tiên Trả Nợ Lãi Suất Cao:</strong> ...</li><li><strong>Đàm Phán Lãi Suất (Nếu có thể):</strong> ...</li><li><strong>Tránh Tạo Thêm Nợ Xấu:</strong> ...</li></ul><p className="italic text-gray-500 dark:text-gray-400 pt-1 text-sm"><em>"Lãi suất là con quái vật có thể ăn mòn tài sản của bạn nếu không được kiểm soát." - Warren Buffett (diễn giải)</em></p></div> ),
          isUnlocked: true, isCompleted: false,
        },
        { id: 'step-4-investment-mindset', title: 'Bước 4: Khai Mở Tư Duy Đầu Tư & Gia Tăng Tài Sản', summary: 'Tìm hiểu các kênh đầu tư cơ bản, xác định khẩu vị rủi ro và bắt đầu hành trình để tiền của bạn làm việc cho bạn.', icon: TrendingUp,
          content: (tCommon) => ( <div className="space-y-3"><p>Tiết kiệm là cần thiết, nhưng ...</p><h4 className="font-semibold text-base text-[#c084fc] mt-2 mb-1">Nhiệm Vụ Cốt Lõi:</h4><ul className="list-disc list-inside space-y-1.5 pl-4 text-sm"><li><strong>Học Kiến Thức Đầu Tư Cơ Bản:</strong> ...</li><li><strong>Xác định Khẩu Vị Rủi Ro:</strong> ...</li><li><strong>Bắt Đầu Với Số Vốn Nhỏ & Đa Dạng Hóa:</strong> ...</li><li><strong>Tư Duy Dài Hạn & Kiên Nhẫn:</strong> ...</li></ul><p className="italic text-gray-500 dark:text-gray-400 pt-1 text-sm"><em>"Đừng bỏ tất cả trứng vào một giỏ." - Ngạn ngữ</em></p></div> ),
          isUnlocked: true, isCompleted: false,
        },
        { id: 'step-5-lifelong-learning', title: 'Bước 5: Phát Triển Bản Thân & Học Tập Trọn Đời', summary: 'Liên tục nâng cao kiến thức, kỹ năng để gia tăng giá trị bản thân, mở rộng cơ hội thu nhập và thích ứng với thế giới thay đổi.', icon: Brain,
          content: (tCommon) => ( <div className="space-y-3"><p>Tài sản lớn nhất của bạn chính là bản thân bạn...</p><h4 className="font-semibold text-base text-[#c084fc] mt-2 mb-1">Nhiệm Vụ Cốt Lõi:</h4><ul className="list-disc list-inside space-y-1.5 pl-4 text-sm"><li><strong>Xác định Kỹ Năng Cần Cải Thiện/Học Mới:</strong> ...</li><li><strong>Đầu Tư Vào Giáo Dục:</strong> ...</li><li><strong>Xây Dựng Mạng Lưới Quan Hệ (Networking):</strong> ...</li><li><strong>Luôn Tò Mò & Thích Nghi:</strong> ...</li></ul><p className="italic text-gray-500 dark:text-gray-400 pt-1 text-sm"><em>"Đầu tư vào kiến thức mang lại lãi suất cao nhất." - Benjamin Franklin</em></p></div> ),
          isUnlocked: true, isCompleted: false,
        }
      ],
    },
  },
  common: {
    en: { toolsExpenseTrackerLinkText: "MarcusFI Expense Tracker" },
    vi: { toolsExpenseTrackerLinkText: "Công cụ Theo dõi Chi tiêu MarcusFI" }
  }
};
// ----- Kết thúc Interface và Data -----

const ProcessPage: React.FC = () => {
  const { language } = useLanguage();
  // Adjust how you access the data
  const pageText = processPageContentData.languages[language as keyof LanguageSpecificContent] || processPageContentData.languages.en;
  const commonTranslations = processPageContentData.common[language as keyof typeof processPageContentData.common] || processPageContentData.common.en;

  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const stepsContainerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: stepsContainerRef,
    offset: ["start center", "end center"]
  });

  const pathOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.3, 1, 1, 0.3]);
  const pathDraw = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const currentSteps = pageText.steps;
    const currentActiveStepExists = currentSteps.some(step => step.id === activeStepId);
    if (activeStepId && !currentActiveStepExists) {
      setActiveStepId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, pageText.steps, activeStepId]);

  const handleStepClick = (stepId: string) => {
    setActiveStepId(prevId => (prevId === stepId ? null : stepId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white flex flex-col selection:bg-[#6e00ff] selection:text-white font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem] font-display font-bold mb-3 leading-tight">
            <span className="block text-gray-200/90">{pageText.pageTitleLine1}</span>
            <span className="bg-gradient-to-r from-[#6e00ff] to-[#ff007a] text-transparent bg-clip-text block mt-1">
              {pageText.pageTitleLine2}
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300/70 max-w-2xl mx-auto">
            {pageText.pageDescription}
          </p>
        </motion.div>

        <div className="relative py-8 px-2 md:px-0" ref={stepsContainerRef}>
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] z-0 rounded-full"
            style={{
              opacity: pathOpacity,
              height: '100%',
            }}
          >
            <motion.div
              className="h-full w-full bg-gradient-to-b from-[#6e00ff]/70 via-[#a855f7]/50 to-[#c084fc]/30"
              style={{
                scaleY: pathDraw,
                transformOrigin: 'top',
              }}
            />
          </motion.div>

          <div className="relative z-10 space-y-8 md:space-y-10 pb-10 sm:pb-16">
            {pageText.steps.map((step, index) => (
              <ProcessStepNode
                key={step.id}
                id={step.id} // Thêm id prop cho ProcessStepNode nếu nó yêu cầu
                stepNumber={index + 1}
                title={step.title}
                summary={step.summary}
                icon={step.icon}
                content={step.content(commonTranslations)}
                isUnlocked={true} // Assuming you might change this later based on user progress
                // isCompleted={false} // Prop này không có trong ProcessStepNodeProps, có thể bỏ
                isActive={activeStepId === step.id}
                onClick={() => handleStepClick(step.id)}
                alignment={index % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="mt-12 sm:mt-16 text-center p-6 sm:p-8 bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl max-w-xl mx-auto ring-1 ring-[#6e00ff]/40"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 70 }}
        >
          <Target size={32} className="mx-auto mb-3 text-[#c084fc] animate-subtle-float" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6e00ff] to-[#ff007a] mb-3 font-display">
            {pageText.ctaTitle}
          </h2>
          <p className="text-gray-300/80 mb-5 text-xs sm:text-sm leading-relaxed">
            {pageText.ctaDescription}
          </p>
          <motion.div
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              to="/signup"
              className="inline-flex items-center group bg-gradient-to-r from-[#6e00ff] to-[#c056f0] hover:from-[#7a1aff] hover:to-[#d06cf0] text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-[#c056f0]/40 transition-all duration-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#c056f0] focus:ring-opacity-50"
            >
              {pageText.ctaButton}
              <RouteIcon className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
            <p className="text-[0.7rem] text-gray-500/80 mt-4">
              {pageText.ctaLoginPrompt}{' '}
              <Link to="/signin" className="text-[#c084fc] hover:underline">
                {pageText.ctaLoginLink}
              </Link>.
            </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ProcessPage;
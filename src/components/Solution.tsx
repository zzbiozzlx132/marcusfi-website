import React from 'react';
import { Shield, Book, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Solution: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "How I help you build a solid financial foundation from scratch",
      description: "I don't teach you to get rich quick. I share what I've been through, the costly mistakes I've made, and the practical lessons learned so you can confidently manage your personal finances sustainably.",
      solutions: [
        {
          icon: Shield,
          title: "Real Experience",
          description: "Learn from real-world experiences and avoid costly mistakes others have made."
        },
        {
          icon: Book,
          title: "Clear Roadmap",
          description: "Get a structured approach with practical tools and actionable steps."
        },
        {
          icon: Target,
          title: "Beyond Theory",
          description: "Understand not just what to do, but how to do it and why it matters."
        }
      ]
    },
    vi: {
      title: "Cách tôi giúp bạn xây dựng nền tảng tài chính vững chắc từ đầu",
      description: "Tôi không dạy bạn làm giàu nhanh chóng. Tôi chia sẻ những gì tôi đã trải qua, những sai lầm tốn kém và những bài học thực tế để bạn có thể tự tin quản lý tài chính cá nhân một cách bền vững.",
      solutions: [
        {
          icon: Shield,
          title: "Kinh Nghiệm Thực Tế",
          description: "Học hỏi từ trải nghiệm thực tế và tránh những sai lầm tốn kém mà người khác đã mắc phải."
        },
        {
          icon: Book,
          title: "Lộ Trình Rõ Ràng",
          description: "Nhận được phương pháp có cấu trúc với công cụ thực tế và các bước hành động cụ thể."
        },
        {
          icon: Target,
          title: "Vượt Qua Lý Thuyết",
          description: "Hiểu không chỉ cần làm gì, mà còn làm như thế nào và tại sao điều đó quan trọng."
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#f8f0ff]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t.title}
          </h2>
          
          <p className="text-lg text-gray-600 mb-12">
            {t.description}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {t.solutions.map((solution, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className={`w-12 h-12 ${
                  index === 0 ? 'bg-[#6e00ff]/10' :
                  index === 1 ? 'bg-[#ff007a]/10' :
                  'bg-[#ff00ff]/10'
                } rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <solution.icon className={`h-6 w-6 ${
                    index === 0 ? 'text-[#6e00ff]' :
                    index === 1 ? 'text-[#ff007a]' :
                    'text-[#ff00ff]'
                  }`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{solution.title}</h3>
                <p className="text-gray-600">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
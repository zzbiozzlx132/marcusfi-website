import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Problem: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Are you feeling...?",
      problems: [
        {
          title: "Confused about money management?",
          description: "Struggling to find a starting point in managing your finances effectively."
        },
        {
          title: "Overwhelmed by advice?",
          description: "Heard lots of financial advice but unsure how to apply it sensibly to your situation."
        },
        {
          title: "Afraid of mistakes?",
          description: "Worried about making financial decisions that could impact your future negatively."
        },
        {
          title: "Limited knowledge?",
          description: "Want to start saving and investing but lack the fundamental knowledge to begin."
        }
      ],
      footer: "The Financial Journey of Young People: Concerns Shared by Many"
    },
    vi: {
      title: "Bạn có đang cảm thấy...?",
      problems: [
        {
          title: "Bối rối về quản lý tiền?",
          description: "Khó khăn trong việc tìm điểm bắt đầu để quản lý tài chính hiệu quả."
        },
        {
          title: "Quá tải với lời khuyên?",
          description: "Nghe nhiều lời khuyên tài chính nhưng không chắc làm thế nào để áp dụng phù hợp với hoàn cảnh của bạn."
        },
        {
          title: "Sợ mắc sai lầm?",
          description: "Lo lắng về việc đưa ra quyết định tài chính có thể ảnh hưởng tiêu cực đến tương lai."
        },
        {
          title: "Kiến thức còn hạn chế?",
          description: "Muốn bắt đầu tiết kiệm và đầu tư nhưng thiếu kiến thức cơ bản để bắt đầu."
        }
      ],
      footer: "Hành Trình Tài Chính của Người Trẻ: Những Mối Quan Tâm Chung"
    }
  };

  const t = content[language];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t.title}
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {t.problems.map((problem, index) => (
              <div key={index} className="bg-gradient-to-br from-[#f8f0ff] to-white p-6 rounded-xl shadow-sm">
                <h3 className={`text-xl font-semibold mb-3 ${
                  index === 0 ? 'text-[#6e00ff]' :
                  index === 1 ? 'text-[#ff007a]' :
                  index === 2 ? 'text-[#ff00ff]' :
                  'text-[#6e00ff]'
                }`}>
                  {problem.title}
                </h3>
                <p className="text-gray-600">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
          
          <p className="text-center text-lg text-gray-600 mt-12">
            {t.footer}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Problem;
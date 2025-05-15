import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext'; // Đảm bảo đường dẫn này chính xác

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  company: string;
  rating: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, position, company, rating }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow h-full flex flex-col"> {/* Thêm h-full flex flex-col để các card có chiều cao bằng nhau */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <p className="text-gray-600 italic mb-6 flex-grow">{quote}</p> {/* Thêm flex-grow để quote chiếm không gian */}
      <div>
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-gray-500 text-sm">{position}, {company}</p>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      mainTitle: "What Our Clients Say",
      mainDescription: "Discover why businesses trust marcusfi with their financial growth and technology integration needs.",
      testimonialList: [
        {
          quote: "marcusfi's financial technology solutions have transformed how we manage our investment portfolio. Their expertise and innovative approach have significantly increased our returns.",
          author: "Sarah Johnson",
          position: "CFO",
          company: "Innovate Tech Inc.",
          rating: 5
        },
        {
          quote: "Working with the team at marcusfi has been a game-changer for our financial strategy. Their market analysis and investment recommendations are always on point.",
          author: "Michael Chen",
          position: "CEO",
          company: "Growth Ventures",
          rating: 5
        },
        {
          quote: "The personalized financial planning services from marcusfi have helped us navigate complex market conditions with confidence. Highly recommended!",
          author: "Jessica Williams",
          position: "Director of Finance",
          company: "Summit Enterprises",
          rating: 4
        }
      ]
    },
    vi: {
      mainTitle: "Khách Hàng Nói Gì Về Chúng Tôi",
      mainDescription: "Khám phá lý do tại sao các doanh nghiệp tin tưởng marcusfi cho nhu cầu tăng trưởng tài chính và tích hợp công nghệ của họ.",
      testimonialList: [
        {
          quote: "Các giải pháp công nghệ tài chính của marcusfi đã thay đổi cách chúng tôi quản lý danh mục đầu tư. Chuyên môn và phương pháp tiếp cận đổi mới của họ đã gia tăng đáng kể lợi nhuận cho chúng tôi.",
          author: "Sarah Johnson", // Tên riêng có thể giữ nguyên hoặc Việt hóa tùy ý
          position: "Giám đốc Tài chính", // CFO
          company: "Innovate Tech Inc.", // Tên công ty thường giữ nguyên
          rating: 5
        },
        {
          quote: "Làm việc với đội ngũ tại marcusfi thực sự là một bước ngoặt cho chiến lược tài chính của chúng tôi. Các phân tích thị trường và khuyến nghị đầu tư của họ luôn rất chính xác.",
          author: "Michael Chen",
          position: "Giám đốc Điều hành", // CEO
          company: "Growth Ventures",
          rating: 5
        },
        {
          quote: "Dịch vụ hoạch định tài chính cá nhân hóa từ marcusfi đã giúp chúng tôi tự tin vượt qua các điều kiện thị trường phức tạp. Rất khuyến khích!",
          author: "Jessica Williams",
          position: "Giám đốc Tài chính", // Director of Finance
          company: "Summit Enterprises",
          rating: 4
        }
      ]
    }
  };

  const t = content[language] || content.en; // Fallback về tiếng Anh

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.mainTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.mainDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Thay đổi md:grid-cols-3 thành lg:grid-cols-3 và thêm md:grid-cols-2 để responsive tốt hơn */}
          {t.testimonialList.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              position={testimonial.position}
              company={testimonial.company}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
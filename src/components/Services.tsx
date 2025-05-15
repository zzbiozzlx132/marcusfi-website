import React from 'react';
import { Briefcase, TrendingUp, BarChart2, LineChart, Users, Settings } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Services: React.FC = () => {
  const services = [
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Investment Management",
      description: "Comprehensive portfolio management services tailored to your financial goals and risk tolerance."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Wealth Growth Strategies",
      description: "Strategic approaches to growing wealth through diverse investment vehicles and opportunities."
    },
    {
      icon: <BarChart2 className="h-8 w-8" />,
      title: "Financial Analytics",
      description: "Advanced data analysis to identify market trends and optimize investment decisions."
    },
    {
      icon: <LineChart className="h-8 w-8" />,
      title: "Market Intelligence",
      description: "Real-time market insights and forecasting to stay ahead of financial trends."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Personalized Planning",
      description: "Customized financial planning services to help you achieve your short and long-term objectives."
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Tech Integration",
      description: "Seamless integration of financial technologies to streamline your investment process."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Empower Your Business with Intelligent Financial Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our comprehensive suite of services combines financial expertise, investment knowledge, marketing strategies, and cutting-edge technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
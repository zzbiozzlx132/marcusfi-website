import React from 'react';
import { TrendingUp, BarChart, LineChart, Landmark, PieChart, RefreshCw } from 'lucide-react';

const FeatureCard: React.FC<{ 
  icon: React.ReactNode;
  title: string; 
  description: string;
  color: string;
}> = ({ icon, title, description, color }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      title: "Strategic Investment",
      description: "Data-driven investment strategies tailored to your financial goals and risk tolerance.",
      color: "bg-blue-600"
    },
    {
      icon: <BarChart className="h-6 w-6 text-white" />,
      title: "Cutting-Edge Technology",
      description: "Utilizing the latest financial technology to optimize returns and minimize risks.",
      color: "bg-amber-500"
    },
    {
      icon: <LineChart className="h-6 w-6 text-white" />,
      title: "Market Analysis",
      description: "Comprehensive market research and analysis to identify lucrative opportunities.",
      color: "bg-emerald-500"
    },
    {
      icon: <Landmark className="h-6 w-6 text-white" />,
      title: "Financial Planning",
      description: "Personalized financial planning services to secure your future and achieve wealth goals.",
      color: "bg-indigo-500"
    },
    {
      icon: <PieChart className="h-6 w-6 text-white" />,
      title: "Performance Tracking",
      description: "Real-time monitoring and reporting of investment performance with actionable insights.",
      color: "bg-rose-500"
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-white" />,
      title: "Adaptive Strategies",
      description: "Flexible investment approaches that adapt to changing market conditions and opportunities.",
      color: "bg-purple-500"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose marcusfi?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We combine financial expertise with technological innovation to deliver exceptional results for our clients.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
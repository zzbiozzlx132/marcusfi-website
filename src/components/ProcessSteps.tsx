import React from 'react';
import { ClipboardList, LineChart, PieChart, BookOpen } from 'lucide-react';

interface StepProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  stepNumber: number;
}

const ProcessStep: React.FC<StepProps> = ({ icon, iconBg, title, description, stepNumber }) => {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <div className="flex items-center mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div className="ml-4 h-0.5 w-16 bg-gray-200 hidden md:block"></div>
      </div>
      <div className="mt-2">
        <div className="font-bold text-blue-600 mb-1">Step {stepNumber}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const ProcessSteps: React.FC = () => {
  const steps = [
    {
      icon: <ClipboardList className="h-8 w-8 text-white" />,
      iconBg: "bg-blue-600",
      title: "Financial Assessment",
      description: "We analyze your current financial position, assets, and goals to create a tailored strategy.",
      stepNumber: 1
    },
    {
      icon: <LineChart className="h-8 w-8 text-white" />,
      iconBg: "bg-amber-500",
      title: "Strategy Development",
      description: "Our experts develop comprehensive investment and financial growth strategies aligned with your objectives.",
      stepNumber: 2
    },
    {
      icon: <PieChart className="h-8 w-8 text-white" />,
      iconBg: "bg-emerald-500",
      title: "Implementation & Analysis",
      description: "We execute the plan and continuously analyze performance, making data-driven adjustments.",
      stepNumber: 3
    },
    {
      icon: <BookOpen className="h-8 w-8 text-white" />,
      iconBg: "bg-indigo-500",
      title: "Optimization & Growth",
      description: "Regular refinement of strategies to maximize returns and adapt to changing market conditions.",
      stepNumber: 4
    }
  ];

  return (
    <section id="process" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How We Revolutionize Your Finances with Technology
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our proven process combines financial expertise with cutting-edge technology to maximize your investment potential.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {steps.map((step, index) => (
            <ProcessStep
              key={index}
              icon={step.icon}
              iconBg={step.iconBg}
              title={step.title}
              description={step.description}
              stepNumber={step.stepNumber}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Ready to revolutionize your finances? Let's build something meaningful together.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
            Schedule a Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
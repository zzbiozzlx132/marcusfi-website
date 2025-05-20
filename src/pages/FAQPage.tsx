import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What is MarcusFI and how does it work?",
      answer: "MarcusFI is a comprehensive financial education platform that combines expert knowledge, practical tools, and community support to help individuals achieve financial freedom. We provide step-by-step guidance, personalized recommendations, and resources to help you make informed financial decisions."
    },
    {
      question: "How much does it cost to use MarcusFI?",
      answer: "We offer both free and premium features. Our basic membership is free and includes access to educational content, basic tools, and community forums. Premium membership includes advanced features, personalized coaching, and exclusive resources. Visit our pricing page for detailed information."
    },
    {
      question: "Is my financial information secure with MarcusFI?",
      answer: "Yes, we take security seriously. We use bank-level encryption to protect your data, regular security audits, and never share your personal information with third parties without your explicit consent. Our platform is compliant with all relevant financial regulations and data protection laws."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your premium subscription at any time. There are no long-term contracts or cancellation fees. Your premium access will continue until the end of your current billing period."
    },
    {
      question: "How do I get started with MarcusFI?",
      answer: "Getting started is easy! Simply create a free account, complete our financial assessment questionnaire, and you'll receive personalized recommendations for your journey. Our step-by-step process guides you through setting up your profile and beginning your financial freedom journey."
    },
    {
      question: "What kind of support does MarcusFI offer?",
      answer: "We offer multiple levels of support including community forums, email support, live chat, and for premium members, one-on-one coaching sessions. Our support team includes certified financial advisors and experienced professionals ready to help you succeed."
    },
    {
      question: "How is MarcusFI different from other financial platforms?",
      answer: "MarcusFI stands out through our comprehensive approach combining education, practical tools, and community support. We focus on long-term success rather than quick fixes, and our platform adapts to your unique financial situation and goals."
    },
    {
      question: "Can I access MarcusFI on mobile devices?",
      answer: "Yes, MarcusFI is fully responsive and works on all devices. We also offer dedicated mobile apps for iOS and Android, allowing you to track your progress and access resources on the go."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked <span className="bg-gradient-to-r from-[#6e00ff] to-[#ff007a] text-transparent bg-clip-text">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about MarcusFI and your journey to financial freedom.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full text-left p-6 rounded-xl transition-all duration-300 ${
                  openIndex === index
                    ? 'bg-white shadow-lg'
                    : 'bg-white/50 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-[#6e00ff]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                {openIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-gray-600"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Still have questions?{' '}
            <a href="/contact" className="text-[#6e00ff] hover:text-[#ff007a] font-medium">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
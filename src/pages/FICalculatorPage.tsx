// src/pages/FICalculatorPage.tsx
import React from 'react';

const FICalculatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-28 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Financial Independence Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your journey to financial freedom. (Content coming soon!)
          </p>
        </div>
        <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-xl text-center">
          <p className="text-gray-700">
            This tool will help you estimate the savings needed and the time it will take to reach financial independence based on the 4% rule, considering your income, expenses, and inflation.
          </p>
          <p className="mt-4 font-semibold text-purple-600">
            Feature under development. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FICalculatorPage;
import React from 'react';
import { ArrowRight } from 'lucide-react';

const Solutions: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transforming Ideas Into Intelligent Financial Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our innovative approach combines financial expertise with technological advancements to create tailored solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Financial Intelligence That Adapts to Your Business, Not the Other Way Around.
              </h3>
              <p className="mb-6">
                Our solutions leverage cutting-edge financial technology to provide adaptive investment strategies that grow with your business.
              </p>
              <button className="flex items-center text-white bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors py-2 px-4 rounded-lg">
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">AI-Powered Analysis</h4>
              <p className="text-gray-600">Utilize advanced algorithms to identify market trends and investment opportunities.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                  <path d="M12 2v8"></path>
                  <path d="m4.93 10.93 1.41 1.41"></path>
                  <path d="M2 18h2"></path>
                  <path d="M20 18h2"></path>
                  <path d="m19.07 10.93-1.41 1.41"></path>
                  <path d="M22 22H2"></path>
                  <path d="m16 6-4 4-4-4"></path>
                  <path d="M16 18a4 4 0 0 0-8 0"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Automated Investing</h4>
              <p className="text-gray-600">Smart automated investment tools that execute strategies based on real-time market data.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Risk Management</h4>
              <p className="text-gray-600">Advanced risk assessment tools to protect your investments during market volatility.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-xl text-gray-700 mb-8">From concept to execution, we bring your financial vision to life.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
            See How We Can Help
          </button>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
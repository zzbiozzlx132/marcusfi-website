import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Target, Award } from 'lucide-react';

const AboutUsPage: React.FC = () => {
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
            About <span className="bg-gradient-to-r from-[#6e00ff] to-[#ff007a] text-transparent bg-clip-text">MarcusFI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to democratize financial freedom through education, technology, and community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600">
              Founded in 2023, MarcusFI emerged from a simple observation: while financial information is abundant,
              true financial education and guidance remain inaccessible to many. We set out to change that by
              creating a platform that combines expert knowledge with practical tools and a supportive community.
            </p>
            <p className="text-gray-600">
              Our approach focuses on making financial concepts accessible and actionable, helping individuals
              build sustainable wealth through informed decision-making and disciplined execution.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Users className="h-10 w-10 text-[#6e00ff] mb-4" />
              <h3 className="text-xl font-semibold mb-2">10K+</h3>
              <p className="text-gray-600">Active Members</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Target className="h-10 w-10 text-[#ff007a] mb-4" />
              <h3 className="text-xl font-semibold mb-2">95%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Building2 className="h-10 w-10 text-[#6e00ff] mb-4" />
              <h3 className="text-xl font-semibold mb-2">50+</h3>
              <p className="text-gray-600">Partner Companies</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Award className="h-10 w-10 text-[#ff007a] mb-4" />
              <h3 className="text-xl font-semibold mb-2">15+</h3>
              <p className="text-gray-600">Industry Awards</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#6e00ff]/10 to-[#ff007a]/10 p-6 rounded-xl mb-4">
                <h3 className="text-xl font-semibold mb-2">Transparency</h3>
                <p className="text-gray-600">
                  We believe in complete openness about our methods, results, and pricing.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#6e00ff]/10 to-[#ff007a]/10 p-6 rounded-xl mb-4">
                <h3 className="text-xl font-semibold mb-2">Education</h3>
                <p className="text-gray-600">
                  Knowledge is power. We empower through comprehensive financial education.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#6e00ff]/10 to-[#ff007a]/10 p-6 rounded-xl mb-4">
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600">
                  Success is better shared. We foster a supportive community of like-minded individuals.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUsPage;
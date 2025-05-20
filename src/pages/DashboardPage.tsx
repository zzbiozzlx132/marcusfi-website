import React from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Wallet, ArrowUpRight, ArrowDownRight, DollarSign, PiggyBank } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  const stats = [
    {
      title: "Total Balance",
      value: "$24,563.00",
      change: "+2.5%",
      isPositive: true,
      icon: Wallet
    },
    {
      title: "Monthly Savings",
      value: "$3,245.00",
      change: "+15.3%",
      isPositive: true,
      icon: PiggyBank
    },
    {
      title: "Monthly Expenses",
      value: "$2,145.00",
      change: "-4.3%",
      isPositive: false,
      icon: DollarSign
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your financial health
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <stat.icon className="w-6 h-6 text-purple-600" />
              </div>
              <span className={`flex items-center text-sm ${
                stat.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
                {stat.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 ml-1" />
                )}
              </span>
            </div>
            <h2 className="text-gray-600 text-sm font-medium">
              {stat.title}
            </h2>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Financial Overview
          </h2>
          <div className="flex items-center space-x-2">
            <LineChart className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Last 30 days</span>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart placeholder - Integration pending
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
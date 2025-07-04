import React from "react";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";

const StatsCards = ({ statsCards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {statsCards.map((card, index) => (
        <div
          key={index}
          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                {card.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-3 group-hover:scale-105 transition-transform duration-300">
                {card.value}
              </p>
              <div className="flex items-center">
                {card.trend === "up" ? (
                  <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                    <HiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">
                      {card.change}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center bg-red-100 px-2 py-1 rounded-full">
                    <HiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm font-medium text-red-600">
                      {card.change}
                    </span>
                  </div>
                )}
                <span className="text-xs text-gray-500 ml-2">
                  từ tháng trước
                </span>
              </div>
            </div>
            <div
              className={`${card.bgColor} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}
            >
              <div className={`${card.textColor} text-2xl`}>{card.icon}</div>
            </div>
          </div>

          {/* Progress bar animation */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className={`h-full ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

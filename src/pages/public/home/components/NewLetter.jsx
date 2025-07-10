import React from "react";

function NewLetter() {
  return (
    <div className="bg-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Đăng ký nhận tin khuyến mãi
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Được thông báo đầu tiên về các chương trình ưu đãi, sản phẩm mới và
          các tin tức công nghệ
        </p>
        <div className="max-w-md mx-auto flex">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="flex-1 px-6 py-4 rounded-l-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-r-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold">
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewLetter;

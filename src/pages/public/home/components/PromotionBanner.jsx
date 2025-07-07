import React from "react";

function PromotionBanner() {
  return (
    <div className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full transform -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full transform translate-x-48 translate-y-48"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/10 rounded-full transform -translate-x-16 -translate-y-16"></div>
        </div>

        <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:py-24 lg:px-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
              Back to School 2024
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100 leading-relaxed">
              Ưu đãi cực khủng cho học sinh, sinh viên. Giảm giá lên đến 30% cho
              tất cả laptop. Sắm ngay laptop mới, tựu trường thành công!
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-2">🎓</div>
                <h3 className="font-semibold text-white mb-2">
                  Ưu đãi sinh viên
                </h3>
                <p className="text-indigo-100 text-sm">
                  Giảm thêm 5% với thẻ sinh viên
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-2">🚚</div>
                <h3 className="font-semibold text-white mb-2">
                  Miễn phí vận chuyển
                </h3>
                <p className="text-indigo-100 text-sm">
                  Giao hàng tận nơi toàn quốc
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-semibold text-white mb-2">
                  Bảo hành mở rộng
                </h3>
                <p className="text-indigo-100 text-sm">
                  Bảo hành 2 năm chính hãng
                </p>
              </div>
            </div>

            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4">
              <button className="bg-white text-indigo-600 font-bold py-4 px-8 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Xem ngay ưu đãi
              </button>
              <button className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-2xl hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105">
                Tư vấn miễn phí
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionBanner;

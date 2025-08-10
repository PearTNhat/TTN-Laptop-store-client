function ActionButtons({ handleBuyNow, handleAddToCart, isOutOfStock }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
      <button
        onClick={handleBuyNow}
        disabled={isOutOfStock}
        className="group relative bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        <div className="relative flex items-center justify-center gap-3">
          <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">
            🚀
          </span>
          <span className="text-xl uppercase tracking-wide">Mua ngay</span>
        </div>
      </button>

      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className="group relative bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-white/30"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        <div className="relative flex items-center justify-center gap-3">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
            🛒
          </span>
          <span className="text-xl uppercase tracking-wide">Thêm vào giỏ</span>
        </div>
      </button>
    </div>
  );
}

export default ActionButtons;

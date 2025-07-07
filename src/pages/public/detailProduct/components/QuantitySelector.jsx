import QuantityInput from "~/components/QuantityInput";

function QuantitySelector({ quantity, setQuantity }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
          <p className="font-bold text-gray-800 text-lg">Số lượng:</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-green-600 font-semibold text-sm">
            Còn hàng: 24 sản phẩm
          </span>
        </div>
      </div>

      <div className="mb-4 flex justify-center">
        <div className="w-48">
          <QuantityInput quantity={quantity} setQuantity={setQuantity} />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-yellow-800 text-sm font-medium flex items-center gap-2">
          <span>⚠️</span>
          <span>Chỉ còn lại ít sản phẩm, hãy đặt hàng ngay!</span>
        </p>
      </div>
    </div>
  );
}

export default QuantitySelector;

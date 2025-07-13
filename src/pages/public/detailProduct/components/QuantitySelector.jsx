import QuantityInput from "~/components/QuantityInput";

function QuantitySelector({ colorProduct, quantity, setQuantity }) {
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
    </div>
  );
}

export default QuantitySelector;

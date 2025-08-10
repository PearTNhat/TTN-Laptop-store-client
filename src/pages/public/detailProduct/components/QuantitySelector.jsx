import QuantityInput from "~/components/QuantityInput";

function QuantitySelector({ quantity, setQuantity, max }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
          <p className="font-bold text-gray-800 text-lg">Số lượng:</p>
        </div>
      </div>

      <div className="mb-4 flex justify-center">
        <div className="w-48">
          <QuantityInput
            quantity={quantity}
            setQuantity={setQuantity}
            max={max}
          />
        </div>
      </div>
    </div>
  );
}

export default QuantitySelector;

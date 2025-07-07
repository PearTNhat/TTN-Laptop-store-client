import { FaPlus, FaMinus } from "react-icons/fa";

function QuantityInput({ quantity, setQuantity, max = 99, className = "" }) {
  const handleIncrement = () => {
    // Đảm bảo quantity là một số trước khi cộng
    const currentQuantity = Number(quantity) || 0;
    if (currentQuantity < max) {
      setQuantity(currentQuantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // Nếu input rỗng, tạm thời cho phép để người dùng nhập tiếp
    if (value === "") {
      setQuantity("");
      return;
    }

    const numValue = parseInt(value, 10);

    if (!isNaN(numValue)) {
      if (numValue < 1) {
        setQuantity(1);
      } else if (numValue > max) {
        setQuantity(max);
      } else {
        setQuantity(numValue);
      }
    }
  };

  const handleBlur = () => {
    // Nếu người dùng rời khỏi input mà nó đang rỗng hoặc nhỏ hơn 1, reset về 1
    if (quantity === "" || quantity < 1) {
      setQuantity(1);
    }
  };

  return (
    <div
      className={`h-full flex items-center bg-white border-2 border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className="h-full bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 hover:from-red-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group"
        aria-label="Giảm số lượng"
      >
        <FaMinus
          size={14}
          className="group-hover:scale-110 transition-transform duration-300"
        />
      </button>

      {/* ===== FIX: ĐÃ LOẠI BỎ 'px-4' Ở DÒNG DƯỚI ===== */}
      <div className="relative group min-w-[80px] max-w-[120px] cursor-pointer">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={quantity}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full text-center text-xl font-bold text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 py-3 cursor-pointer"
        />
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 group-focus-within:scale-x-100 transition-transform duration-300 ease-in-out"></div>
      </div>
      {/* ============================================== */}

      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group"
        aria-label="Tăng số lượng"
      >
        <FaPlus
          size={14}
          className="group-hover:scale-110 transition-transform duration-300"
        />
      </button>
    </div>
  );
}

export default QuantityInput;

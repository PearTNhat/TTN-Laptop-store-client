import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // Import CSS của slider

// Định nghĩa các hằng số để dễ dàng thay đổi sau này
const MIN_PRICE = 0;
const MAX_PRICE = 50000000; // Giá laptop tối đa, ví dụ 50 triệu
const STEP = 500000; // Bước nhảy, ví dụ 500k

// Hàm định dạng số cho đẹp, ví dụ: 5000000 -> 5.000.000
const formatCurrency = (value) => new Intl.NumberFormat("vi-VN").format(value);

const PriceFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const debounceTimeout = useRef(null);

  // State để quản lý giá trị min/max trên UI
  const [price, setPrice] = useState({
    min: Number(searchParams.get("minPrice")) || MIN_PRICE,
    max: Number(searchParams.get("maxPrice")) || MAX_PRICE,
  });

  // Effect này đảm bảo UI (slider, input) luôn đồng bộ với URL
  // Khi người dùng bấm nút back/forward, URL thay đổi, UI sẽ cập nhật theo
  useEffect(() => {
    const minFromURL = Number(searchParams.get("minPrice")) || MIN_PRICE;
    const maxFromURL = Number(searchParams.get("maxPrice")) || MAX_PRICE;
    if (minFromURL !== price.min || maxFromURL !== price.max) {
      setPrice({ min: minFromURL, max: maxFromURL });
    }
  }, [searchParams]);

  // Hàm cập nhật URL search params (có debounce)
  const updateURLParams = (newMin, newMax) => {
    const newSearchParams = new URLSearchParams(searchParams);

    // Chỉ set param nếu giá trị khác với mặc định
    if (newMin > MIN_PRICE) newSearchParams.set("minPrice", newMin);
    else newSearchParams.delete("minPrice");

    if (newMax < MAX_PRICE) newSearchParams.set("maxPrice", newMax);
    else newSearchParams.delete("maxPrice");

    newSearchParams.set("page", "0"); // Reset trang khi đổi giá
    setSearchParams(newSearchParams);
  };

  // Xử lý khi người dùng kéo thanh trượt
  const handleSliderChange = (value) => {
    const [min, max] = value;
    // Cập nhật UI ngay lập tức
    setPrice({ min, max });
    // Cập nhật URL ngay lập tức vì event này chỉ xảy ra khi người dùng nhả chuột
    updateURLParams(min, max);
  };

  // Xử lý khi người dùng nhập vào ô input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Bỏ hết các ký tự không phải số
    const numericValue = Number(value.replace(/[^0-9]/g, ""));

    // Cập nhật state của UI
    const newPrice = { ...price, [name]: numericValue };
    setPrice(newPrice);

    // Dùng debounce để tránh gọi API liên tục
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      updateURLParams(newPrice.min, newPrice.max);
    }, 800); // Chờ 800ms
  };

  return (
    <div className="space-y-6">
      {/* Hiển thị khoảng giá đã chọn với design đẹp */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Giá từ</label>
            <input
              type="text"
              name="min"
              value={formatCurrency(price.min)}
              onChange={handleInputChange}
              className="w-full p-3 text-center text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="0"
            />
          </div>
          <div className="text-gray-400 font-bold pt-5">~</div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Giá đến</label>
            <input
              type="text"
              name="max"
              value={formatCurrency(price.max)}
              onChange={handleInputChange}
              className="w-full p-3 text-center text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="50,000,000"
            />
          </div>
        </div>
      </div>
      {/* Thanh trượt Slider với style đẹp hơn */}
      <div className="px-2">
        <Slider
          range
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={STEP}
          value={[price.min, price.max]}
          onChange={handleSliderChange}
          trackStyle={{
            backgroundColor: "#3b82f6",
            height: "6px",
            borderRadius: "3px",
          }}
          railStyle={{
            backgroundColor: "#e5e7eb",
            height: "6px",
            borderRadius: "3px",
          }}
          handleStyle={[
            {
              borderColor: "#3b82f6",
              backgroundColor: "#fff",
              borderWidth: 3,
              width: "20px",
              height: "20px",
              marginTop: "-7px",
              boxShadow: "0 2px 6px rgba(59, 130, 246, 0.3)",
            },
            {
              borderColor: "#3b82f6",
              backgroundColor: "#fff",
              borderWidth: 3,
              width: "20px",
              height: "20px",
              marginTop: "-7px",
              boxShadow: "0 2px 6px rgba(59, 130, 246, 0.3)",
            },
          ]}
        />
      </div>

      {/* Input để nhập giá chính xác với design đẹp */}

      {/* Quick price ranges */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">
          Khoảng giá phổ biến
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "< 15 triệu", min: 0, max: 15000000 },
            { label: "15-25 triệu", min: 15000000, max: 25000000 },
            { label: "25-35 triệu", min: 25000000, max: 35000000 },
            { label: "> 35 triệu", min: 35000000, max: MAX_PRICE },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => {
                setPrice({ min: range.min, max: range.max });
                updateURLParams(range.min, range.max);
              }}
              className={`text-xs py-2 px-3 rounded-lg border transition-all duration-200 ${
                price.min === range.min && price.max === range.max
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;

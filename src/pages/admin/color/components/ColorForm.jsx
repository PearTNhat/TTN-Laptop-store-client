import React, { useState, useEffect } from "react";
import { FiTag, FiDroplet } from "react-icons/fi";

const ColorForm = ({ color, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    hex: "#000000",
  });

  useEffect(() => {
    if (color) {
      setForm({
        id: color.id || "",
        name: color.name || "",
        hex: color.hex || "#000000",
      });
    }
  }, [color]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      hex: form.hex,
    };

    if (color) payload.id = form.id;

    onSubmit(payload);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preview màu với animation */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div
              className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl transition-all duration-300 transform hover:scale-110"
              style={{ backgroundColor: form.hex }}
            ></div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl border-4 border-gray-200 flex items-center justify-center shadow-xl">
              <FiDroplet className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {form.name || "Màu mới"}
            </h3>
            <p
              className="text-lg font-mono font-bold px-4 py-2 bg-gray-100 rounded-xl inline-block"
              style={{ color: form.hex }}
            >
              {form.hex}
            </p>
          </div>
        </div>

        {/* Tên màu */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <FiTag className="text-purple-500" />
              Tên màu sắc <span className="text-red-500">*</span>
            </div>
          </label>
          <div className="relative">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Nhập tên màu sắc..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 placeholder-gray-400"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Mã HEX */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <FiDroplet className="text-pink-500" />
              Mã màu HEX <span className="text-red-500">*</span>
            </div>
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                name="hex"
                value={form.hex}
                onChange={handleChange}
                required
                placeholder="#000000"
                pattern="^#[0-9A-Fa-f]{6}$"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 font-mono placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <input
                type="color"
                value={form.hex}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, hex: e.target.value }))
                }
                className="w-16 h-12 cursor-pointer rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-colors duration-200"
                title="Chọn màu từ bảng màu"
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-lg shadow-sm border">
                  Picker
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Nhập mã HEX (ví dụ: #FF5733) hoặc sử dụng color picker bên cạnh
          </p>
        </div>

        {/* Color Suggestions */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Màu gợi ý
          </label>
          <div className="grid grid-cols-8 gap-2">
            {[
              "#FF6B6B",
              "#4ECDC4",
              "#45B7D1",
              "#96CEB4",
              "#FECA57",
              "#FF9FF3",
              "#54A0FF",
              "#5F27CD",
              "#FF3838",
              "#00D2D3",
              "#FF9F43",
              "#10AC84",
              "#EE5A24",
              "#0652DD",
              "#9980FA",
              "#EA2027",
            ].map((suggestedColor) => (
              <button
                key={suggestedColor}
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, hex: suggestedColor }))
                }
                className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                style={{ backgroundColor: suggestedColor }}
                title={suggestedColor}
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {color ? "Cập nhật màu sắc" : "Tạo màu sắc mới"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ColorForm;

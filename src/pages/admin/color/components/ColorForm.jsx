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
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-2xl p-8 space-y-8">
      <h2 className="text-xl font-bold text-gray-800 tracking-tight">
        {color ? "Cập nhật màu sắc" : "Thêm màu sắc mới"}
      </h2>

      {/* Preview màu */}
      <div className="flex flex-col items-center">
        <div 
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4"
          style={{ backgroundColor: form.hex }}
        ></div>
        <div className="text-lg font-medium" style={{ color: form.hex }}>
          {form.name || "Màu mới"}
        </div>
      </div>

      {/* Tên màu */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FiTag className="text-indigo-500" />
          Tên màu
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Nhập tên màu"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-[15px]"
        />
      </div>

      {/* Mã HEX */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FiDroplet className="text-indigo-500" />
          Mã màu (HEX)
        </label>
        <div className="flex gap-3">
          <input
            name="hex"
            value={form.hex}
            onChange={handleChange}
            required
            placeholder="#000000"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-[15px]"
          />
          <input
            type="color"
            value={form.hex}
            onChange={(e) => setForm(prev => ({ ...prev, hex: e.target.value }))}
            className="w-16 h-11 cursor-pointer rounded-lg border border-gray-300"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-medium"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition text-sm font-semibold"
        >
          {color ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </form>
  );
};

export default ColorForm;
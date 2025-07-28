import React, { useState, useEffect } from "react";

const BrandForm = ({ brand, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    createdDate: "",
  });

  useEffect(() => {
    if (brand) {
      setForm({ ...brand });
    }
  }, [brand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, createdDate: form.createdDate || new Date().toISOString().split("T")[0] });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100 space-y-6">
      {/* Tên thương hiệu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tên thương hiệu</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
          placeholder="Nhập tên thương hiệu"
        />
      </div>

      {/* Mô tả */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
          placeholder="Giới thiệu ngắn gọn"
        />
      </div>

      {/* Ảnh/logo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh / Logo</label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Link ảnh hoặc logo"
        />
      </div>

      {/* Ngày tạo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
        <input
          name="createdDate"
          type="date"
          value={form.createdDate}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Button actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all text-sm font-medium"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
        >
          {brand ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </form>
  );
};

export default BrandForm;

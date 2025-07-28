import React, { useState, useEffect } from "react";

const SeriesForm = ({ series, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    brandName: "",
    createdDate: "",
    productCount: "",
  });

  useEffect(() => {
    if (series) {
      setForm({ ...series, productCount: series.productCount || "" });
    }
  }, [series]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      createdDate: form.createdDate || new Date().toISOString().split("T")[0],
      productCount: form.productCount || 0,
    });
  };

  return (
  <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100 space-y-6">
    {/* Tên dòng sản phẩm */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Tên dòng sản phẩm</label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        placeholder="Nhập tên dòng"
      />
    </div>

    {/* Mô tả */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
      <textarea
        name="description"
        value={form.description || ""}
        onChange={handleChange}
        rows={4}
        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
        placeholder="Thông tin mô tả"
      />
    </div>

    {/* Thương hiệu */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
      <input
        name="brandName"
        value={form.brandName}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        placeholder="Tên thương hiệu liên quan"
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
        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
    </div>

    {/* Số sản phẩm */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Số sản phẩm</label>
      <input
        name="productCount"
        type="number"
        value={form.productCount}
        onChange={handleChange}
        min="0"
        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        placeholder="Tổng số sản phẩm thuộc dòng"
      />
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-medium"
      >
        Hủy
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition text-sm font-semibold"
      >
        {series ? "Cập nhật" : "Thêm mới"}
      </button>
    </div>
  </form>
  );
};

export default SeriesForm;
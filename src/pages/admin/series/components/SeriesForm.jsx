import React, { useState, useEffect } from "react";
import { FiTag, FiAlignLeft, FiLayers } from "react-icons/fi";

const SeriesForm = ({ series, onSubmit, onCancel, brands = [] }) => {
  const [form, setForm] = useState({ 
    name: "",
    description: "",
    brandId: "",
  });

  // Populate form if editing
  useEffect(() => {
    if (series) {
      setForm({
        id: series.id || "",
        name: series.name || "",
        description: series.description || "",
        brandId: series.brandId || "",
      });
    }
  }, [series]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isEditing = !!series; // nếu có series là đang sửa

    const payload = {
      name: form.name,
      description: form.description,
    };

    if (isEditing) {
      payload.id = form.id;
      payload.brandId = form.brandId;  // sửa thì cần id
    } else {
      payload.brandId = form.brandId; // tạo thì cần brandId
    }

    console.log("🚀 Dữ liệu gửi đi:", payload);
    onSubmit(payload);
  };


  
  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-2xl p-8 space-y-8">
      <h2 className="text-xl font-bold text-gray-800 tracking-tight">
        {series ? "Cập nhật dòng sản phẩm" : "Thêm dòng sản phẩm mới"}
      </h2>

      {/* Tên dòng sản phẩm */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FiTag className="text-indigo-500" />
          Tên dòng sản phẩm
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Nhập tên dòng"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-[15px]"
        />
      </div>

      {/* Mô tả */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <FiAlignLeft className="text-indigo-500" />
          Mô tả
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Thông tin mô tả"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none text-[15px]"
        />
      </div>

      {/* Thương hiệu */}
      {!series && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FiLayers className="text-indigo-500" />
            Thương hiệu
          </label>
          <select
            name="brandId"
            value={form.brandId || ""}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-[15px]"
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      )}

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
          {series ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </form>
  );
};

export default SeriesForm;
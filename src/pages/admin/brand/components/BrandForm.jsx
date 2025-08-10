import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiGetImgString } from "~/apis/fileApi";

const BrandForm = ({ brand, onSubmit, onCancel }) => {
  const { accessToken } = useSelector((state) => state.user);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    bgColor: "#ff0000",
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);

    try {
      const res = await apiGetImgString({ accessToken, formData });

      console.log("📦 Kết quả upload ảnh:", res);
      if (res?.code === 200 && typeof res.data === "string") {
        setForm((prev) => ({ ...prev, image: res.data }));
      } else {
        alert("Upload ảnh thất bại!");
      }
    } catch (err) {
      alert("Lỗi khi upload ảnh.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isUploading) {
      alert("Đang upload ảnh, vui lòng đợi...");
      return;
    }

    if (!form.image) {
      alert("Vui lòng chọn ảnh trước khi tạo thương hiệu.");
      return;
    }

    onSubmit({
      ...form,
      createdDate: form.createdDate || new Date().toISOString().split("T")[0],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100 space-y-6"
    >
      {/* Tên thương hiệu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên thương hiệu
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Nhập tên thương hiệu"
        />
      </div>

      {/* Mô tả */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
          placeholder="Giới thiệu ngắn gọn"
        />
      </div>

      {/* Màu thương hiệu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Màu thương hiệu
        </label>
        <input
          type="color"
          name="bgColor"
          value={form.bgColor}
          onChange={handleChange}
          className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
      </div>

      {/* Upload ảnh */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ảnh / Logo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="mt-2 rounded-xl border w-32 h-32 object-cover"
          />
        )}
      </div>
      {/* Nút hành động */}
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

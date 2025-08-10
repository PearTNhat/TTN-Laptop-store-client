import React, { useState, useEffect } from "react";
import { apiGetImgString } from "~/apis/fileApi"; 
import { useSelector } from "react-redux";

const CategoryForm = ({ category, onSubmit, onCancel }) => {
  const { accessToken } = useSelector((state) => state.user);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "", 
  });

  useEffect(() => {
    if (category) {
      setForm({ ...category });
    }
  }, [category]);

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
      const res = await apiGetImgString({ accessToken,formData });

      console.log("Kết quả upload ảnh:", res);

      if (res?.code === 200 && typeof res.data === "string") {
        setForm((prev) => ({ ...prev, imageUrl: res.data }));
      } else {
        alert("Upload ảnh thất bại!");
      }
    } catch (err) {
      alert("Lỗi khi upload ảnh.");
    }finally {
      setIsUploading(false); // 👉 Kết thúc upload
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu submit:", form);

    if (isUploading) {
      alert("Đang upload ảnh, vui lòng đợi...");
      return;
    }

    if (!form.imageUrl) {
      alert("Vui lòng chọn ảnh trước khi tạo danh mục.");
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
      {/* Tên danh mục */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên danh mục
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Nhập tên danh mục"
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
          placeholder="Thông tin mô tả"
        />
      </div>

      {/* Upload ảnh */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ảnh danh mục
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            className="mt-2 rounded-xl border w-32 h-32 object-cover"
          />
        )}
      </div>

      {/* Action buttons */}
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
          {category ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;

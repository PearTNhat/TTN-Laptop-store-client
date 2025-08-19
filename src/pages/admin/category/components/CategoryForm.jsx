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
      const res = await apiGetImgString({ accessToken, formData });

      console.log("Kết quả upload ảnh:", res);

      if (res?.code === 200 && typeof res.data === "string") {
        setForm((prev) => ({ ...prev, imageUrl: res.data }));
      } else {
        alert("Upload ảnh thất bại!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Lỗi khi upload ảnh.");
    } finally {
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
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên danh mục */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Tên danh mục <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Nhập tên danh mục..."
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

        {/* Mô tả */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Mô tả danh mục
          </label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none placeholder-gray-400"
            placeholder="Nhập mô tả chi tiết về danh mục..."
          />
          <p className="text-xs text-gray-500">
            Mô tả sẽ giúp người dùng hiểu rõ hơn về danh mục này
          </p>
        </div>

        {/* Upload ảnh */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Ảnh đại diện <span className="text-red-500">*</span>
          </label>

          {/* File Upload Area */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div
              className={`border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200 ${
                isUploading ? "bg-gray-50" : "hover:bg-blue-50"
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                  <p className="text-sm text-gray-600">Đang tải ảnh lên...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold text-blue-600">
                      Nhấp để tải ảnh
                    </span>{" "}
                    hoặc kéo thả vào đây
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF tối đa 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {form.imageUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Xem trước:
              </p>
              <div className="relative inline-block">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, imageUrl: "" }))}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Xóa ảnh"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
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
            disabled={isUploading || !form.imageUrl}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang xử lý...
              </span>
            ) : (
              <span>{category ? "Cập nhật danh mục" : "Tạo danh mục mới"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;

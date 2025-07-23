import { useState, useRef, useEffect, useCallback } from "react";
import Button from "../Button";
import { apiGetImgString } from "~/apis/fileApi";
import { showToastError } from "~/utils/alert";
import { useSelector } from "react-redux";
import { FaImages } from "react-icons/fa";
// --- Helper Components for UI States ---

const Spinner = () => (
  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
    <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
  </div>
);

const ErrorIcon = ({ message }) => (
  <div
    title={message}
    className="absolute inset-0 bg-red-500 bg-opacity-70 flex items-center justify-center rounded-lg text-white"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </div>
);

function CommentForm({
  onSubmit,
  onCancel,
  submitLabel,
  initialContent = "",
  userAvatar,
}) {
  const { accessToken } = useSelector((state) => state.user);
  const [content, setContent] = useState(initialContent);

  // State mới để quản lý ảnh và trạng thái upload
  // Mỗi item sẽ có dạng: { id, status: 'uploading'|'uploaded'|'error', previewUrl, serverUrl?, error? }
  const [uploadedImages, setUploadedImages] = useState([]);

  const fileInputRef = useRef(null);

  // Bọc hàm gọi API trong useCallback để tối ưu
  const getImageUrl = useCallback(
    async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiGetImgString({ accessToken, formData });
        if (response.code === 200) {
          return { success: true, url: response.data.url };
        } else {
          showToastError(response.message);
          return { success: false, error: response.message };
        }
      } catch (error) {
        const errorMessage =
          error.message || "An unknown error occurred during upload.";
        showToastError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [accessToken]
  );

  // Dọn dẹp các URL preview khi component unmount
  useEffect(() => {
    return () => {
      uploadedImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [uploadedImages]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(
      0,
      3 - uploadedImages.length
    );
    if (files.length === 0) return;

    const imageUploads = files.map((file) => {
      const id = `${file.name}-${Date.now()}`;
      const previewUrl = URL.createObjectURL(file);

      // Bắt đầu quá trình upload
      (async () => {
        const result = await getImageUrl(file);
        setUploadedImages((prev) =>
          prev.map((img) => {
            if (img.id === id) {
              if (result.success) {
                return { ...img, status: "uploaded", serverUrl: result.url };
              } else {
                return { ...img, status: "error", error: result.error };
              }
            }
            return img;
          })
        );
      })();

      // Trả về object ban đầu với trạng thái 'uploading' để hiển thị ngay
      return {
        id,
        status: "uploading",
        previewUrl,
        serverUrl: null,
        error: null,
      };
    });

    setUploadedImages((prev) => [...prev, ...imageUploads]);

    // Reset input để có thể chọn lại file cùng tên
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (idToRemove) => {
    const imageToRemove = uploadedImages.find((img) => img.id === idToRemove);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }
    setUploadedImages((prev) => prev.filter((img) => img.id !== idToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Chỉ lấy những ảnh đã upload thành công
    const successfulImages = uploadedImages
      .filter((img) => img.status === "uploaded")
      .map((img) => img.serverUrl);

    if (!content.trim() && successfulImages.length === 0) return;

    // Truyền mảng các URL đã upload thành công đi
    onSubmit({ content, images: successfulImages });

    // Reset form
    setContent("");
    setUploadedImages([]);
  };

  // Vô hiệu hóa nút submit nếu không có nội dung VÀ không có ảnh nào được upload thành công
  // Hoặc nếu có bất kỳ ảnh nào đang trong quá trình upload.
  const isAnyImageUploading = uploadedImages.some(
    (img) => img.status === "uploading"
  );
  const successfullyUploadedCount = uploadedImages.filter(
    (img) => img.status === "uploaded"
  ).length;
  const isSubmitDisabled =
    isAnyImageUploading || (!content.trim() && successfullyUploadedCount === 0);

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-start space-x-3">
        {userAvatar && (
          <img
            src={userAvatar}
            alt="user avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
          />
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-3 pl-13">
          {uploadedImages.map((image) => (
            <div key={image.id} className="relative">
              <img
                src={image.previewUrl}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              />
              {image.status === "uploading" && <Spinner />}
              {image.status === "error" && <ErrorIcon message={image.error} />}

              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors"
                aria-label="Xoá ảnh"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-3 pl-13">
        <label
          htmlFor="image-upload-form"
          className={`cursor-pointer inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors ${
            uploadedImages.length >= 3 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaImages />
          <span className="text-sm font-medium">Thêm ảnh (tối đa 3)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
            id="image-upload-form"
            disabled={uploadedImages.length >= 3}
          />
        </label>

        <div className="flex items-center gap-3">
          {onCancel && (
            <Button type="button" outline onClick={onCancel} className="!py-2">
              Hủy
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            className="!py-2 !px-4"
            disabled={isSubmitDisabled}
          >
            {isAnyImageUploading ? "Đang tải ảnh..." : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default CommentForm;

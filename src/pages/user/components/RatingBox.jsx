import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiPostRating } from "~/apis/userApi";
import { apiGetImgString } from "~/apis/fileApi";

const RatingBox = ({ orderId, productDetailId }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewImage, setReviewImage] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const { accessToken } = useSelector((state) => state.user);

  // Placeholder: Kiểm tra trạng thái đánh giá
  useEffect(() => {
    const checkReviewStatus = async () => {
      try {
        // TODO: Tích hợp API kiểm tra trạng thái đánh giá nếu có
        console.log("Checking review status for:", { orderId, productDetailId });
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái đánh giá:", error.message);
      }
    };
    checkReviewStatus();
  }, [accessToken, orderId, productDetailId]);

  // Xử lý chọn ảnh và hiển thị preview
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected files:", files.length);
    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewImages]);
    await handleImageUpload(files);
  };

  // Upload ảnh và lấy link
  const handleImageUpload = async (files) => {
    setIsUploading(true);
    try {
      const uploadedImageUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiGetImgString({ accessToken, formData });
        console.log("Uploaded image URL:", response);
        const imageUrl = response?.data; // Lấy URL từ response.data
        if (imageUrl && typeof imageUrl === "string") {
          uploadedImageUrls.push(imageUrl);
        } else {
          console.error("Invalid image URL in response:", response);
        }
      }
      console.log("Valid uploaded URLs:", uploadedImageUrls);
      setReviewImage((prev) => {
        const newImages = [...prev, ...uploadedImageUrls];
        console.log("Updated reviewImage:", newImages);
        return newImages;
      });
      if (uploadedImageUrls.length === 0 && files.length > 0) {
        alert("Không thể lấy URL ảnh. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error.message);
      alert("Không thể upload ảnh. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  // Gửi đánh giá
  const handleSubmit = async () => {
    console.log("RatingBox props:", { orderId, productDetailId });
    console.log("Current reviewImage:", reviewImage);
    console.log("Payload trước khi gửi:", {
      accessToken: accessToken ? "Có token" : "Không có token",
      content: comment,
      reviewImage,
      productDetailId,
      orderId,
      rating: selectedRating,
    });
    if (!selectedRating) {
      alert("Vui lòng chọn số sao!");
      return;
    }
    if (!productDetailId) {
      alert("Lỗi: productDetailId không hợp lệ! Vui lòng liên hệ hỗ trợ.");
      return;
    }
    if (previewImages.length > 0 && reviewImage.length === 0 && isUploading) {
      alert("Vui lòng chờ ảnh upload hoàn tất!");
      return;
    }
    if (previewImages.length > 0 && reviewImage.length === 0) {
      alert("Upload ảnh thất bại. Bạn có muốn gửi đánh giá mà không có ảnh?");
      // Có thể cho phép tiếp tục hoặc dừng
    }
    try {
      const response = await apiPostRating({
        accessToken,
        content: comment,
        reviewImage,
        productDetailId,
        orderId,
        rating: selectedRating,
      });
      console.log("API response:", response);
      if (response.code === 200) {
        alert("Đánh giá đã được gửi thành công!");
        setComment("");
        setSelectedRating(0);
        setReviewImage([]);
        setPreviewImages([]);
        setIsReviewed(true);
      } else if (response.code === 500 && response.message.includes("duplicate key value violates unique constraint")) {
        alert("Bạn đã gửi đánh giá cho sản phẩm này rồi. Mỗi sản phẩm chỉ được đánh giá một lần.");
        setIsReviewed(true);
      } else {
        alert("Gửi đánh giá thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error.message);
      alert(`Có lỗi xảy ra khi gửi đánh giá: ${error.message}`);
    }
  };

  if (isReviewed) {
    return (
      <div className="mt-3 bg-gray-50 p-3 rounded-md text-gray-600 text-sm">
        Bạn đã gửi đánh giá cho sản phẩm này.
      </div>
    );
  }

  return (
    <div className="mt-3 bg-gray-50 p-3 rounded-md">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setSelectedRating(star)}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              star <= (hoverRating || selectedRating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927a1 1 0 011.902 0l1.222 3.774h3.947c.969 0 1.371 1.24.588 1.81l-3.191 2.35 1.222 3.774a1 1 0 01-1.54 1.118L10 13.347l-3.191 2.35a1 1 0 01-1.54-1.118l1.222-3.774-3.191-2.35c-.783-.57-.38-1.81.588-1.81h3.947l1.222-3.774z" />
          </svg>
        ))}
      </div>

      <textarea
        placeholder="Viết bình luận..."
        className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="mt-2">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={isUploading}
        />
      </div>

      {previewImages.length > 0 && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {previewImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Preview ${index + 1}`}
              className="w-20 h-20 object-cover rounded-md border border-gray-200"
            />
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        disabled={isUploading}
      >
        {isUploading ? "Đang upload..." : "Gửi đánh giá"}
      </button>
    </div>
  );
};

export default RatingBox;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiPostRating, apiCheckRating } from "~/apis/userApi";
import { apiGetImgString } from "~/apis/fileApi";

const RatingBox = ({ orderId, productId, productDetailId, orderStatus }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewImage, setReviewImage] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [canRate, setCanRate] = useState(true);
  const { accessToken } = useSelector((state) => state.user);

  // ✅ Kiểm tra trạng thái đánh giá + trạng thái đơn hàng
  useEffect(() => {
    const checkReviewStatus = async () => {
      console.log("sss: ", orderId, orderStatus, productDetailId)
      try {
        if (orderStatus !== "Hoàn thành") {
          setCanRate(false);
          return;
        }
        const res = await apiCheckRating({ orderId, accessToken });
        if (res.code === 200 && res.data) {
          setIsReviewed(true);
          setCanRate(false);
        } else {
          setIsReviewed(false);
          setCanRate(true);
        }
      } catch (error) {
        console.error("❌ Lỗi khi kiểm tra trạng thái đánh giá:", error.message);
      }
    };
    if (orderId && accessToken) {
      checkReviewStatus();
    }
  }, [accessToken, orderId, orderStatus]);

  // Xử lý chọn ảnh và hiển thị preview
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
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
        const imageUrl = response?.data;
        if (imageUrl && typeof imageUrl === "string") {
          uploadedImageUrls.push(imageUrl);
        } else {
          console.error("Invalid image URL in response:", response);
        }
      }
      setReviewImage((prev) => [...prev, ...uploadedImageUrls]);
    } catch (error) {
      console.error("❌ Lỗi khi upload ảnh:", error.message);
      alert("Không thể upload ảnh. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  // Gửi đánh giá
  const handleSubmit = async () => {
    if (!selectedRating) {
      alert("Vui lòng chọn số sao!");
      return;
    }
    if (!productDetailId) {
      alert("Lỗi: productDetailId không hợp lệ!");
      return;
    }
    if (previewImages.length > 0 && reviewImage.length === 0 && isUploading) {
      alert("Vui lòng chờ ảnh upload hoàn tất!");
      return;
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
      if (response.code === 200) {
        alert("Đánh giá thành công!");
        setComment("");
        setSelectedRating(0);
        setReviewImage([]);
        setPreviewImages([]);
        setIsReviewed(true);
        setCanRate(false);
      } else {
        alert(response.message || "Gửi đánh giá thất bại.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi đánh giá:", error.message);
      alert(`Có lỗi xảy ra: ${error.message}`);
    }
  };

  // ⛔ Không cho đánh giá nếu đã review hoặc chưa hoàn thành
  if (!canRate) {
    return (
      <div className="mt-3 bg-gray-50 p-3 rounded-md text-gray-600 text-sm">
        {isReviewed
          ? "Bạn đã gửi đánh giá cho sản phẩm này."
          : "Chỉ có thể đánh giá khi đơn hàng ở trạng thái Hoàn thành."}
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
              className="w-20 h-20 object-cover rounded-md border"
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

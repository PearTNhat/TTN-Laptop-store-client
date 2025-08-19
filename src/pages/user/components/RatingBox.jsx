import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiPostRating, apiCheckRating } from "~/apis/userApi";
import { apiGetImgString } from "~/apis/fileApi";
import { apiGetReviewByOrder } from "~/apis/usersmanagementApi";
import { Upload } from "lucide-react"; 

const RatingBox = ({ orderId, productDetailId, orderStatus }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewImage, setReviewImage] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [canRate, setCanRate] = useState(true);
  const { accessToken } = useSelector((state) => state.user);

  // Kiểm tra trạng thái đánh giá + orderStatus
  useEffect(() => {
    const checkReviewStatus = async () => {
      console.log("status: ",orderStatus)
      try {
        if (orderStatus !== "COMPLETED") {
          setCanRate(false);
          return;
        }
        const res = await apiCheckRating({ orderId, accessToken });
        if (res.code === 200 && res.data) {
          setIsReviewed(true);
          setCanRate(false);
          // lấy dữ liệu review đã có
          fetchReview(orderId);
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

  // ✅ Lấy review đã có
  const fetchReview = async (orderId) => {
    try {
      const review = await apiGetReviewByOrder({ orderId, accessToken });
      if (review) {
        setSelectedRating(review.rating);
        setComment(review.content || "");
        setReviewImage(review.reviewImages || []);
        setPreviewImages(review.reviewImages || []);
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy review:", error.message);
    }
  };

  // Chọn ảnh + preview
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewImages]);
    await handleImageUpload(files);
  };

  // Upload ảnh
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

  // Gửi đánh giá mới
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
        setIsReviewed(true);
        setCanRate(false);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="mt-3 bg-gray-50 p-3 rounded-md">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onMouseEnter={() => canRate && setHoverRating(star)}
            onMouseLeave={() => canRate && setHoverRating(0)}
            onClick={() => canRate && setSelectedRating(star)}
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
        disabled={!canRate}
      />

      <div className="mt-2">
        <input
          id={`file-upload-${orderId}`}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={!canRate || isUploading}
          className="hidden" // ẩn input gốc
        />
        <label
          htmlFor={`file-upload-${orderId}`}
          className={`flex items-center gap-2 px-3 py-2 w-fit rounded-md cursor-pointer transition
            ${!canRate || isUploading 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-300"}`}
        >
          <Upload className="w-4 h-4" />
          <span>{isUploading ? "Đang upload..." : "Chọn ảnh đánh giá"}</span>
        </label>
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

      {canRate ? (
        <button
          onClick={handleSubmit}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          disabled={isUploading}
        >
          {isUploading ? "Đang upload..." : "Gửi đánh giá"}
        </button>
      ) : (
        <div className="mt-3 text-sm text-gray-500">
          {isReviewed
            ? "✅ Bạn đã đánh giá sản phẩm này."
            : "⛔ Chỉ có thể đánh giá khi đơn hàng ở trạng thái Hoàn thành."}
        </div>
      )}
    </div>
  );
};

export default RatingBox;

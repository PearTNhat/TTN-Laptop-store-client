import React, { useState } from "react";

const RatingBox = () => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    alert(`✅ Đánh giá: ${selectedRating} sao\n💬 Bình luận: ${comment}`);
    setComment("");
    setSelectedRating(0);
  };

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

      <button
        onClick={handleSubmit}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Gửi đánh giá
      </button>
    </div>
  );
};

export default RatingBox;
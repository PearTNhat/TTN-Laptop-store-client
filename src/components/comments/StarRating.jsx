// src/components/comments/StarRating.js
import { useState } from "react";

function StarRating({ rating, onRatingChange, size = "text-3xl" }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className={`transition-colors duration-200 ${size} ${
              ratingValue <= (hover || rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => onRatingChange(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Đánh giá ${ratingValue} sao`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;

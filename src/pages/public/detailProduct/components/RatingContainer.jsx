import { DefaultUser } from "~/assets/images";
import { convertNumberToStar, formatDateSencond } from "~/utils/helper";

function RatingContainer({ ratings = [], totalRating = 0 }) {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-lg">Chưa có đánh giá nào</p>
          <p className="text-sm mt-2">
            Hãy là người đầu tiên đánh giá sản phẩm này!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        ⭐ Đánh giá từ khách hàng ({totalRating})
      </h3>

      <div className="space-y-6">
        {ratings?.map((rating, index) => {
          const stars = convertNumberToStar(rating.rating);

          return (
            <div
              key={rating.id || index}
              className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={rating.userAvatar || DefaultUser}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>

                {/* Rating Content */}
                <div className="flex-1 space-y-3">
                  {/* User Info and Rating */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-800">
                        {rating.username || "Người dùng ẩn danh"}
                      </h4>
                      <div className="flex items-center text-yellow-500 text-xl">
                        {stars.map((star, index) => (
                          <span
                            key={index}
                            className="drop-shadow-sm hover:scale-110 transition-transform duration-200"
                          >
                            {star}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDateSencond(rating.reviewDate)}
                    </span>
                  </div>

                  {/* Rating Content */}
                  {rating.content && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {rating.content}
                      </p>
                    </div>
                  )}

                  {/* Rating Images */}
                  {rating.reviewImages && rating.reviewImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {rating.reviewImages.map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                        >
                          <img
                            src={image}
                            alt={`Review image ${imgIndex + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Product Detail Info */}
                  {rating.productDetailId && (
                    <div className="text-xs text-gray-400 mt-2">
                      ID sản phẩm: {rating.productDetailId}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RatingContainer;

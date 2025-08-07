import React from "react";
import { FaUser, FaStar, FaCrown, FaGem } from "react-icons/fa";

const RankSelectionForm = ({
  ranks,
  selectedRanks,
  rankLoading,
  onToggleRankSelection,
  type,
}) => {
  const getRankIcon = (priority) => {
    switch (priority) {
      case 1:
        return <FaUser className="text-gray-600" />;
      case 2:
        return <FaStar className="text-blue-600" />;
      case 3:
        return <FaCrown className="text-yellow-600" />;
      case 4:
        return <FaGem className="text-purple-600" />;
      default:
        return <FaUser className="text-gray-600" />;
    }
  };

  const getRankColor = (priority) => {
    switch (priority) {
      case 1:
        return "border-gray-300 bg-gray-50";
      case 2:
        return "border-blue-300 bg-blue-50";
      case 3:
        return "border-yellow-300 bg-yellow-50";
      case 4:
        return "border-purple-300 bg-purple-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (rankLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải danh sách hạng...</p>
      </div>
    );
  }

  if (!ranks || ranks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FaUser className="mx-auto text-4xl mb-4 text-gray-400" />
        <p>Không có hạng nào được tìm thấy</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Chọn các hạng khách hàng áp dụng khuyến mãi
          {type === "USER_PROMOTION" && (
            <span className="block text-xs text-orange-600 mt-1">
              💡 Khi chọn hạng, bạn không thể chọn người dùng cụ thể
            </span>
          )}
        </p>
        <div className="text-sm text-gray-500">
          Đã chọn: {selectedRanks.length}/{ranks.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {ranks.map((rank) => {
          const isSelected = selectedRanks.some((r) => r.id === rank.id);

          return (
            <div
              key={rank.id}
              className={`
                relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                ${getRankColor(rank.priority)}
                ${
                  isSelected
                    ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg"
                    : "hover:shadow-md hover:border-blue-300"
                }
              `}
              onClick={() => onToggleRankSelection(rank.id)}
            >
              {/* Selection indicator */}
              <div
                className={`
                absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${
                  isSelected
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300 bg-white"
                }
              `}
              >
                {isSelected && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 rounded-lg bg-white shadow-sm">
                  {getRankIcon(rank.priority)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {rank.name}
                    </h4>
                    <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 font-medium">
                      Mức {rank.priority}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {rank.description}
                  </p>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Chi tiêu tối thiểu:</span>
                      <span className="font-medium text-gray-700">
                        {formatPrice(rank.minSpending)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Đơn hàng tối thiểu:</span>
                      <span className="font-medium text-gray-700">
                        {rank.minOrder} đơn
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRanks.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Hạng đã chọn:</h5>
          <div className="flex flex-wrap gap-2">
            {selectedRanks.map((rank) => (
              <span
                key={rank.id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {getRankIcon(rank.priority)}
                {rank.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleRankSelection(rank.id);
                  }}
                  className="ml-1 hover:bg-blue-200 rounded-full p-1 transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RankSelectionForm;

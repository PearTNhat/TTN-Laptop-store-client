import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaBox,
  FaCalendarAlt,
  FaEnvelope,
  FaDollarSign,
} from "react-icons/fa";
import Pagination from "~/components/pagination/Pagination";
import { formatPrice } from "~/utils/helper";

const PromotionDetailList = ({ detailData, type }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const itemsPerPage = 5; // Số item trên mỗi trang

  // Tính toán dữ liệu phân trang
  useEffect(() => {
    if (!detailData || !Array.isArray(detailData)) {
      setPaginatedData([]);
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedData(detailData.slice(startIndex, endIndex));
  }, [detailData, currentPage]);

  const totalPages = Math.ceil((detailData?.length || 0) / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!detailData || detailData.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          {type === "user" ? (
            <FaUser className="text-gray-400 text-xl" />
          ) : (
            <FaBox className="text-gray-400 text-xl" />
          )}
        </div>
        <p className="text-gray-500 font-medium mb-2">
          Không có dữ liệu chi tiết
        </p>
        <p className="text-gray-400 text-sm">
          {type === "user"
            ? "Chưa có người dùng nào được áp dụng"
            : "Chưa có sản phẩm nào được áp dụng"}
        </p>
      </div>
    );
  }

  const isUserType =
    type === "user" ||
    (detailData[0]?.userId && !detailData[0]?.productDetailId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        {isUserType ? (
          <FaUser className="text-blue-600" />
        ) : (
          <FaBox className="text-green-600" />
        )}
        <h3 className="text-lg font-semibold text-gray-900">
          {isUserType
            ? "Danh sách người dùng áp dụng"
            : "Danh sách sản phẩm áp dụng"}
        </h3>
        <span className="text-sm text-gray-600">
          ({detailData.length} {isUserType ? "người dùng" : "sản phẩm"})
        </span>
      </div>

      {/* Danh sách items */}
      <div className="space-y-3">
        {paginatedData.map((item, index) => (
          <div
            key={item.userId || item.productDetailId || index}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            {isUserType ? (
              // Hiển thị thông tin user
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {item.firstName} {item.lastName}
                      </h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                        ID: {item.userId}
                      </span>
                    </div>
                    {item.email && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FaEnvelope className="text-xs flex-shrink-0" />
                        <span className="truncate">{item.email}</span>
                      </div>
                    )}
                  </div>
                </div>
                {item.notice && (
                  <div className="text-sm text-gray-600 sm:max-w-xs">
                    <span className="font-medium">Ghi chú:</span> {item.notice}
                  </div>
                )}
              </div>
            ) : (
              // Hiển thị thông tin product
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                      <FaBox className="text-green-600" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {item.title || "Không có tiêu đề"}
                      </h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                        ID: {item.productDetailId}
                      </span>
                    </div>
                    {item.originalPrice && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FaDollarSign className="text-xs flex-shrink-0" />
                        <span>{formatPrice(item.originalPrice)}</span>
                      </div>
                    )}
                  </div>
                </div>
                {item.notice && (
                  <div className="text-sm text-gray-600 sm:max-w-xs">
                    <span className="font-medium">Ghi chú:</span> {item.notice}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 border-t pt-4">
          <Pagination
            currentPage={currentPage}
            totalPageCount={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default PromotionDetailList;

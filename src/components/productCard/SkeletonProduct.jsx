import React from "react";

const SkeletonLoader = () => {
  return (
    // Khung ngoài cùng phải giống với ProductCard (padding, shadow, border, etc.)
    <div className="border border-gray-200 bg-white rounded-lg shadow-sm p-4 w-full">
      {/* Thêm animate-pulse để có hiệu ứng đập-thở */}
      <div className="animate-pulse flex flex-col space-y-4">
        {/* Placeholder cho ảnh sản phẩm */}
        <div className="bg-slate-200 h-48 rounded-md"></div>

        <div className="space-y-3">
          {/* Placeholder cho tên sản phẩm */}
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>

          {/* Placeholder cho dòng mô tả ngắn */}
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>

          {/* Placeholder cho giá tiền */}
          <div className="h-6 bg-slate-200 rounded w-1/3 mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;

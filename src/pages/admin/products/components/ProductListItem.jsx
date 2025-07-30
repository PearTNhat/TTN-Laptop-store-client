import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle,
  Cpu,
  HardDrive,
  MemoryStick,
  ScreenShare,
} from "lucide-react";
import { formatPrice } from "~/utils/helper";

// Helper để định dạng tiền tệ

const ProductDetailModal = ({ product }) => {
  // State để quản lý phiên bản (productDetail) nào đang được chọn
  const [activeDetailId, setActiveDetailId] = useState(
    product.productDetails[0]?.id
  );

  // Lấy ra thông tin chi tiết của phiên bản đang active
  const activeDetail = useMemo(
    () => product.productDetails.find((d) => d.id === activeDetailId),
    [activeDetailId, product.productDetails]
  );

  // State để quản lý ảnh chính đang hiển thị
  const [mainImage, setMainImage] = useState(activeDetail?.thumbnail);

  // Effect để cập nhật ảnh chính khi người dùng chọn phiên bản khác
  useEffect(() => {
    setMainImage(activeDetail?.thumbnail);
  }, [activeDetail]);

  if (!activeDetail) {
    return (
      <div className="p-8 text-center text-red-500">
        Sản phẩm này không có thông tin chi tiết.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 max-h-[85vh] overflow-y-auto">
      <div className="w-full md:w-2/5">
        <img
          src={mainImage}
          alt={activeDetail.title}
          className="w-full h-auto object-contain rounded-lg border mb-4"
        />
        <div className="grid grid-cols-5 gap-2">
          {/* Hiển thị thumbnail và các ảnh khác của phiên bản đang chọn */}
          {[activeDetail.thumbnail, ...activeDetail.images]
            .slice(0, 5)
            .map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-full h-auto object-cover rounded-md cursor-pointer border-2 ${
                  mainImage === img ? "border-blue-500" : "border-transparent"
                } hover:border-blue-400`}
                onClick={() => setMainImage(img)}
              />
            ))}
        </div>
      </div>

      {/* Cột phải: Thông tin và lựa chọn phiên bản */}
      <div className="w-full md:w-3/5">
        <h2 className="text-2xl font-bold text-gray-800">
          {activeDetail.title}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Thương hiệu: {product.brand.name}
        </p>

        <div className="text-3xl font-bold text-red-600 mb-6">
          {formatPrice(activeDetail.originalPrice)}
        </div>

        {/* Phần chọn phiên bản */}
        <div>
          <h3 className="text-base font-semibold text-gray-700 flex items-center mb-3">
            <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
            Phiên bản:
            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-md text-xs font-medium">
              {activeDetail.config.ram} | {activeDetail.config.hardDrive}
            </span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.productDetails.map((detail) => (
              <div
                key={detail.id}
                className={`relative p-2 border rounded-lg cursor-pointer transition-all ${
                  // Giảm padding, border mỏng hơn
                  detail.id === activeDetailId
                    ? "border-blue-500 bg-blue-50/50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-blue-400"
                }`}
                onClick={() => setActiveDetailId(detail.id)}
              >
                {detail.id === activeDetailId && (
                  <CheckCircle
                    className="absolute -top-2 -right-2 text-white bg-blue-500 rounded-full"
                    size={18} // Icon nhỏ hơn
                    fill="currentColor"
                  />
                )}
                <img
                  src={detail.thumbnail}
                  alt={detail.title}
                  className="w-24 h-auto object-contain mx-auto mb-2" // Ảnh nhỏ hơn
                />
                <p className="text-center font-medium text-xs">
                  {detail.config.ramValue} | {detail.config.hardDriveValue}
                </p>
                <div className="flex items-center justify-center text-xs text-gray-500 mt-1">
                  <span
                    className="w-3 h-3 rounded-full mr-1 border"
                    style={{ backgroundColor: detail.color.hex }}
                  ></span>
                  {detail.color.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phần cấu hình chi tiết */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Cấu hình chi tiết</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-center">
              <Cpu size={16} className="mr-2 text-gray-500" />
              {activeDetail.config.cpu}
            </li>
            <li className="flex items-center">
              <MemoryStick size={16} className="mr-2 text-gray-500" />
              {activeDetail.config.ram}
            </li>
            <li className="flex items-center">
              <HardDrive size={16} className="mr-2 text-gray-500" />
              {activeDetail.config.hardDrive}
            </li>
            <li className="flex items-center">
              <ScreenShare size={16} className="mr-2 text-gray-500" />
              {activeDetail.config.displaySize}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

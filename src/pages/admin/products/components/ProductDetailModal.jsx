import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle,
  Cpu,
  HardDrive,
  MemoryStick,
  ScreenShare,
} from "lucide-react";
import { calculatePercent, formatNumber } from "~/utils/helper";
import ConfigItem from "./ConfigItem";
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
  const [configsArr, setConfigsArr] = useState([]);
  // State để quản lý ảnh chính đang hiển thị
  const [mainImage, setMainImage] = useState(activeDetail?.thumbnail);
  useEffect(() => {
    let configsArr = Object.entries(activeDetail?.config || {}).filter(
      ([key, value]) =>
        key !== "ramValue" &&
        key !== "hardDriveValue" &&
        key !== "id" &&
        key !== "productDetailId" &&
        Boolean(value)
    );
    setConfigsArr(configsArr);
  }, [activeDetail]);
  useEffect(() => {
    setMainImage(activeDetail?.images[0]);
  }, [activeDetail]);
  if (!activeDetail) {
    return (
      <div className="p-8 text-center text-red-500">
        Sản phẩm này không có thông tin chi tiết.
      </div>
    );
  }
  return (
    <div className="overflow-y-auto">
      {/* Cột trái: Hình ảnh sản phẩm */}
      <div className="flex flex-col md:flex-row gap-8 p-4">
        <div className="w-full md:w-2/5">
          <img
            src={mainImage}
            alt={activeDetail.title}
            className="w-full h-auto object-contain rounded-lg border mb-4"
          />
          <div className="grid grid-cols-5 gap-2">
            {/* Hiển thị thumbnail và các ảnh khác của phiên bản đang chọn */}
            {activeDetail.images.slice(0, 5).map((img, index) => (
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
            Thương hiệu: {product.brand.name} | SKU: {activeDetail.slug}
          </p>
          {activeDetail.originalPrice > activeDetail.discountedPrice ? (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-gray-600 text-sm">Tiết kiệm:</span>
              <span className="text-blue-600 font-bold text-lg">
                {formatNumber(
                  activeDetail.originalPrice - activeDetail.discountedPrice
                )}{" "}
                ₫
              </span>
              <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                -
                {calculatePercent(
                  activeDetail.originalPrice,
                  activeDetail.discountedPrice
                )}
                %
              </span>
            </div>
          ) : (
            <span className="text-blue-600 font-bold text-lg">
              {formatNumber(activeDetail.originalPrice)} ₫
            </span>
          )}

          {/* Phần chọn phiên bản */}
          <div className="">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-3">
              <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
              Phiên bản:
              <span className="ml-2 px-3 py-1 bg-gray-100 rounded-md text-sm font-medium">
                {activeDetail.config.ramValue} | {activeDetail.config.hardDrive}
              </span>
            </h3>
            <div className="flex flex-wrap gap-3 ">
              {product.productDetails.map((detail) => (
                <div
                  key={detail.id}
                  className={`relative w-[150px] p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    detail.id === activeDetailId
                      ? "border-blue-500 bg-blue-50/50 shadow-md"
                      : "border-gray-200 bg-white hover:border-blue-400"
                  }`}
                  onClick={() => setActiveDetailId(detail.id)}
                >
                  {detail.id === activeDetailId && (
                    <CheckCircle
                      className="absolute top-1 right-1 text-white bg-blue-500 rounded-full"
                      size={20}
                      fill="currentColor"
                    />
                  )}
                  <img
                    src={detail.thumbnail}
                    alt={detail.title}
                    className="h-auto object-contain mx-auto mb-2"
                  />
                  <p className="text-center font-medium text-sm">
                    {detail.config.ramValue} | {detail.config.hardDrive}
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
          <div className="bg-slate-50 rounded-lg p-6 mb-6 mt-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Cấu hình chi tiết
            </h3>
            <ul className="divide-y divide-slate-200">
              {/* Vòng lặp tự động render cấu hình */}
              {configsArr.map(([label, value]) => (
                <ConfigItem key={label} label={label} value={value} />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Mô tả sản phẩm
          </h3>
          <div
            className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

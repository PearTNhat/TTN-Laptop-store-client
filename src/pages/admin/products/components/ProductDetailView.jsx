import React from "react";
import {
  Cpu,
  HardDrive,
  MemoryStick,
  ScreenShare,
  Weight,
  MapPin,
  Package,
  Calendar,
  ShieldCheck,
  Palette,
} from "lucide-react";

const DetailItem = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start text-sm py-2">
      <Icon className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
      <div className="flex-grow">
        <p className="font-medium text-gray-500">{label}</p>
        <p className="text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const ProductDetailView = ({ product }) => {
  const detail = product.productDetails[0];
  if (!detail) return null;

  return (
    <div className="bg-slate-50/70 p-4 sm:p-6 border-t border-gray-200 animate-slide-down">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cột 1: Thông số kỹ thuật */}
        <div className="lg:col-span-1">
          <h4 className="font-bold text-base mb-2 text-gray-700">
            Thông số kỹ thuật
          </h4>
          <div className="divide-y divide-gray-200">
            <DetailItem icon={Cpu} label="CPU" value={detail.config.cpu} />
            <DetailItem
              icon={MemoryStick}
              label="RAM"
              value={detail.config.ram}
            />
            <DetailItem
              icon={HardDrive}
              label="Ổ cứng"
              value={detail.config.hardDrive}
            />
            <DetailItem
              icon={ScreenShare}
              label="Màn hình"
              value={detail.config.displaySize}
            />
            <DetailItem
              icon={Weight}
              label="Cân nặng"
              value={detail.config.weight}
            />
          </div>
        </div>

        {/* Cột 2: Thông tin chung */}
        <div className="lg:col-span-1">
          <h4 className="font-bold text-base mb-2 text-gray-700">
            Thông tin chung
          </h4>
          <div className="divide-y divide-gray-200">
            <DetailItem
              icon={Package}
              label="Dòng sản phẩm"
              value={product.series.name}
            />
            <DetailItem
              icon={MapPin}
              label="Xuất xứ"
              value={detail.config.madeIn}
            />
            <DetailItem
              icon={Palette}
              label="Màu sắc"
              value={detail.color.name}
            />
            <DetailItem
              icon={ShieldCheck}
              label="Bảo hành"
              value={detail.warrantyProd}
            />
            <DetailItem
              icon={Calendar}
              label="Ngày tạo"
              value={product.series.createdDate}
            />
          </div>
        </div>

        {/* Cột 3 & 4: Hình ảnh & Mô tả */}
        <div className="lg:col-span-2">
          <h4 className="font-bold text-base mb-2 text-gray-700">
            Hình ảnh & Mô tả
          </h4>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-shrink-0 w-full sm:w-1/3">
              <img
                src={detail.thumbnail}
                alt="Thumbnail"
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mt-2 sm:mt-0">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;

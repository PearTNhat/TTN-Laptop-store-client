import React, { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { formatPrice } from "~/utils/helper";

const ProductDetailDeleteModal = ({
  isOpen,
  onClose,
  product,
  onDeleteDetail,
}) => {
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    if (!selectedDetailId) return;

    setIsDeleting(true);
    try {
      await onDeleteDetail(selectedDetailId);
      onClose();
    } catch (error) {
      console.error("Error deleting product detail:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeDetails =
    product.productDetails?.filter((detail) => detail.active !== false) || [];
  const inactiveDetails =
    product.productDetails?.filter((detail) => detail.active === false) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Xóa biến thể sản phẩm
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Chọn biến thể cần xóa cho sản phẩm:{" "}
              <span className="font-medium">{product.title}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Active Product Details */}
          {activeDetails.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Biến thể đang hoạt động ({activeDetails.length})
              </h4>
              <div className="grid gap-3">
                {activeDetails.map((detail) => (
                  <div
                    key={detail.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedDetailId === detail.id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-red-300 hover:bg-red-25"
                    }`}
                    onClick={() => setSelectedDetailId(detail.id)}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={detail.thumbnail}
                        alt={detail.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">
                          {detail.title}
                        </h5>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <span
                              className="w-3 h-3 rounded-full mr-1 border"
                              style={{ backgroundColor: detail.color?.hex }}
                            ></span>
                            {detail.color?.name}
                          </span>
                          <span>
                            {detail.config?.ram} | {detail.config?.hardDrive}
                          </span>
                          <span className="font-medium text-red-600">
                            {formatPrice(detail.originalPrice)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>
                            Tồn kho:{" "}
                            <span className="font-medium">
                              {detail.quantity}
                            </span>
                          </span>
                          <span>
                            Đã bán:{" "}
                            <span className="font-medium">
                              {detail.soldQuantity || 0}
                            </span>
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full font-medium ${
                              detail.quantity === 0
                                ? "bg-red-100 text-red-700"
                                : detail.quantity <= 10
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {detail.quantity === 0
                              ? "Hết hàng"
                              : detail.quantity <= 10
                              ? "Sắp hết"
                              : "Còn hàng"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {selectedDetailId === detail.id && (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inactive Product Details (Đã xóa) */}
          {inactiveDetails.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-500 mb-3 flex items-center">
                <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                Biến thể đã xóa ({inactiveDetails.length})
              </h4>
              <div className="grid gap-3">
                {inactiveDetails.map((detail) => (
                  <div
                    key={detail.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-60"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={detail.thumbnail}
                        alt={detail.title}
                        className="w-16 h-16 object-cover rounded-md grayscale"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-600 line-through">
                          {detail.title}
                        </h5>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <span
                              className="w-3 h-3 rounded-full mr-1 border grayscale"
                              style={{ backgroundColor: detail.color?.hex }}
                            ></span>
                            {detail.color?.name}
                          </span>
                          <span>
                            {detail.config?.ram} | {detail.config?.hardDrive}
                          </span>
                          <span className="font-medium line-through">
                            {formatPrice(detail.originalPrice)}
                          </span>
                        </div>
                        <div className="text-xs text-red-500 mt-1 font-medium">
                          ✗ Đã xóa
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeDetails.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle size={48} className="mx-auto mb-4 text-gray-400" />
              <p>Không có biến thể nào để xóa.</p>
              <p className="text-sm mt-1">
                Tất cả biến thể đã bị xóa hoặc không tồn tại.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeDetails.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              {selectedDetailId ? (
                <span className="flex items-center text-red-600">
                  <AlertTriangle size={16} className="mr-1" />
                  Hành động này không thể hoàn tác
                </span>
              ) : (
                "Vui lòng chọn biến thể cần xóa"
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={!selectedDetailId || isDeleting}
                className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${
                  selectedDetailId && !isDeleting
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <Trash2 size={16} />
                {isDeleting ? "Đang xóa..." : "Xóa biến thể"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailDeleteModal;

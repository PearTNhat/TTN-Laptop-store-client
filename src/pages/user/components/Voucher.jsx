import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

const Voucher = () => {
  const [copiedId, setCopiedId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [vouchers, setVouchers] = useState([
    {
      id: "FREESHIP50K",
      title: "Miễn phí vận chuyển 50K",
      discount: "50.000đ",
      minOrder: "Đơn từ 300.000đ",
      expiry: "2025-08-30",
      description: "Áp dụng cho tất cả sản phẩm",
      brand: "ShopTech",
    },
    {
      id: "SALE20",
      title: "Giảm 20% tối đa 200K",
      discount: "20%",
      minOrder: "Đơn từ 500.000đ",
      expiry: "2025-09-15",
      description: "Không áp dụng với sản phẩm đang khuyến mãi",
      brand: "FashionZone",
    },
    {
      id: "WELCOME100",
      title: "Ưu đãi khách hàng mới 100K",
      discount: "100.000đ",
      minOrder: "Đơn từ 600.000đ",
      expiry: "2025-07-15",
      description: "Dành riêng cho tài khoản mới tạo",
      brand: "BeautyMart",
    },
  ]);

  const today = new Date();
  const availableVouchers = vouchers.filter(
    (v) => new Date(v.expiry) > today
  );

  const isExpiringSoon = (expiry) => {
    const expiryDate = new Date(expiry);
    const daysLeft = (expiryDate - today) / (1000 * 60 * 60 * 24);
    return daysLeft <= 7;
  };

  const copyToClipboard = (voucherId) => {
    navigator.clipboard.writeText(voucherId);
    setCopiedId(voucherId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteVoucher = () => {
    setVouchers((prev) => prev.filter((v) => v.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">
        🎁 Voucher khả dụng
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Tổng số voucher: {availableVouchers.length}
      </p>

      {availableVouchers.length > 0 ? (
        availableVouchers.map((voucher) => (
          <div
            key={voucher.id}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-700">
                  {voucher.title}
                </h3>
                <p className="text-sm text-gray-500">{voucher.description}</p>
              </div>
              {isExpiringSoon(voucher.expiry) && (
                <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded font-bold">
                  ⏰ Sắp hết hạn
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-gray-700 text-sm">
              <div className="flex items-center">
                <span className="w-32 text-gray-500 font-medium">🔖 Mã:</span>
                {voucher.id}
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-500 font-medium">
                  💰 Giảm giá:
                </span>
                {voucher.discount}
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-500 font-medium">
                  🛒 Điều kiện:
                </span>
                {voucher.minOrder}
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-500 font-medium">📅 HSD:</span>
                {voucher.expiry}
              </div>
              <div className="flex items-center">
                <span className="w-32 text-gray-500 font-medium">
                  🏪 Thương hiệu:
                </span>
                {voucher.brand}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-4 flex justify-end gap-3">
              <button
                onClick={() => copyToClipboard(voucher.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg"
              >
                {copiedId === voucher.id ? "✅ Đã sao chép!" : "📋 Sao chép mã"}
              </button>
              <button
                onClick={() => setConfirmDeleteId(voucher.id)}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 text-sm font-semibold rounded-md"
              >
                Xóa voucher
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-6">
          Không có voucher khả dụng 😢
        </div>
      )}

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold text-gray-800 mb-3">
              Xác nhận xóa voucher
            </Dialog.Title>
            <p className="text-sm text-gray-600 mb-4">
              Bạn có chắc muốn xóa mã{" "}
              <span className="font-bold text-red-500">
                {confirmDeleteId}
              </span>{" "}
              không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={deleteVoucher}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Xóa voucher
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Voucher;
import React, { useState } from "react";

const Voucher = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [copiedId, setCopiedId] = useState(null);

  // Dữ liệu voucher mẫu
  const vouchers = {
    available: [
      {
        id: "FREESHIP50K",
        title: "Miễn phí vận chuyển 50K",
        discount: "50.000đ",
        minOrder: "Đơn từ 300.000đ",
        expiry: "30/06/2024",
        description: "Áp dụng cho tất cả sản phẩm",
        brand: "ShopTech",
      },
      {
        id: "SALE20",
        title: "Giảm 20% tối đa 200K",
        discount: "20%",
        minOrder: "Đơn từ 500.000đ",
        expiry: "15/07/2024",
        description: "Không áp dụng với sản phẩm giảm giá",
        brand: "ShopTech",
      },
    ],
    used: [
      {
        id: "SALE10",
        title: "Giảm 10% tối đa 100K",
        discount: "10%",
        minOrder: "Đơn từ 200.000đ",
        expiry: "Đã sử dụng 12/05/2024",
        description: "Áp dụng toàn bộ gian hàng",
        brand: "ShopTech",
      },
    ],
    expired: [
      {
        id: "FREESHIP30K",
        title: "Miễn phí vận chuyển 30K",
        discount: "30.000đ",
        minOrder: "Đơn từ 150.000đ",
        expiry: "Hết hạn 01/04/2024",
        description: "Áp dụng cho đơn hàng đầu tiên",
        brand: "ShopTech",
      },
    ],
  };

  const copyToClipboard = (voucherId) => {
    navigator.clipboard.writeText(voucherId);
    setCopiedId(voucherId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteVoucher = (voucherId) => {
    const updated = vouchers.available.filter(v => v.id !== voucherId);
    vouchers.available = updated;
    setActiveTab("available"); // để cập nhật lại UI
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
          Kho Voucher Của Tôi
        </h2>
      </div>

      {/* Tab điều hướng */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === "available"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("available")}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Có thể dùng ({vouchers.available.length})
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === "used"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("used")}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Đã dùng ({vouchers.used.length})
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === "expired"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("expired")}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Hết hạn ({vouchers.expired.length})
        </button>
      </div>

      {/* Danh sách voucher */}
      <div className="space-y-4">
        {vouchers[activeTab].map((voucher, index) => (
          <div
            key={index}
            className={`relative rounded-xl overflow-hidden flex flex-col sm:flex-row border ${
              activeTab === "available"
                ? "border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100"
                : activeTab === "used"
                ? "border-green-200 bg-gradient-to-r from-green-50 to-green-100"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            {/* Phần mã giảm giá */}
            <div
              className={`w-full sm:w-1/3 p-5 flex flex-col items-center justify-center ${
                activeTab === "available"
                  ? "bg-blue-600 text-white"
                  : activeTab === "used"
                  ? "bg-green-600 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              <span className="text-sm font-medium mb-1">MÃ GIẢM GIÁ</span>
              <span className="text-2xl font-bold mb-2">{voucher.discount}</span>
              <button
                onClick={() => copyToClipboard(voucher.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                  activeTab === "available"
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-gray-200 text-gray-600 cursor-not-allowed"
                } ${copiedId === voucher.id ? "bg-green-100 text-green-800" : ""}`}
                disabled={activeTab !== "available"}
              >
                {copiedId === voucher.id ? (
                  <>
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Đã sao chép
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    {activeTab === "available" ? "Sao chép mã" : voucher.id}
                  </>
                )}
              </button>
            </div>

            {/* Thông tin voucher */}
            <div className="w-full sm:w-2/3 p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900">{voucher.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    activeTab === "available"
                      ? "bg-blue-100 text-blue-800"
                      : activeTab === "used"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {voucher.brand}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{voucher.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {voucher.minOrder}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {voucher.expiry}
                </div>
              </div>
              {activeTab === "available" && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => deleteVoucher(voucher.id)}
                    className="text-red-600 text-sm font-medium px-3 py-1 hover:text-red-800 hover:bg-red-100 rounded transition-all"
                  >
                    🗑 Xóa voucher
                  </button>
                </div>
              )}
            </div>

            {/* Ribbon cho voucher đã dùng/hết hạn */}
            {activeTab !== "available" && (
              <div
                className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white ${
                  activeTab === "used" ? "bg-green-600" : "bg-gray-500"
                }`}
              >
                {activeTab === "used" ? "ĐÃ DÙNG" : "HẾT HẠN"}
              </div>
            )}
          </div>
        ))}

        {vouchers[activeTab].length === 0 && (
          <div className="text-center py-10">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Không có voucher {activeTab === "available" ? "khả dụng" : activeTab === "used" ? "đã sử dụng" : "hết hạn"}
            </h3>
            <p className="mt-1 text-gray-500">
              {activeTab === "available"
                ? "Hãy tham gia các chương trình khuyến mãi để nhận voucher mới!"
                : "Các voucher bạn đã sử dụng hoặc hết hạn sẽ hiển thị tại đây"}
            </p>
            {activeTab === "available" && (
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Khám phá voucher mới
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Voucher;
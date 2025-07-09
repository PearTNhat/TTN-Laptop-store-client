import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

const MyOrders = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: "#DH-235667",
      date: "15/06/2023",
      status: "Hoàn thành",
      statusColor: "bg-green-100 text-green-800",
      items: [
        { name: "iPhone 14 Pro Max", price: "29.990.000đ", quantity: 1 },
        { name: "AirPods Pro 2", price: "5.990.000đ", quantity: 1 },
      ],
      total: "35.980.000đ",
      shipping: "Giao hàng tiêu chuẩn",
    },
    {
      id: "#DH-198523",
      date: "02/05/2023",
      status: "Đang giao hàng",
      statusColor: "bg-blue-100 text-blue-800",
      items: [
        { name: "MacBook Air M2", price: "32.990.000đ", quantity: 1 },
        { name: "USB-C Hub", price: "1.250.000đ", quantity: 2 },
      ],
      total: "35.490.000đ",
      shipping: "Giao hàng nhanh",
    },
    {
      id: "#DH-167842",
      date: "22/04/2023",
      status: "Đã hủy",
      statusColor: "bg-red-100 text-red-800",
      items: [
        { name: "iPad Pro 11\"", price: "21.990.000đ", quantity: 1 },
      ],
      total: "21.990.000đ",
      shipping: "Giao hàng tiêu chuẩn",
    },
  ];

  const handleDetail = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };

  const handleBuyAgain = (order) => {
    const cartItems = order.items.map(item => ({
      name: item.name,
      quantity: item.quantity
    }));
    console.log("Thêm vào giỏ hàng:", cartItems);
    alert("Đã thêm sản phẩm vào giỏ hàng!");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
        📦 Đơn hàng của tôi
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-xl hover:shadow-md">
            {/* Header */}
            <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-b">
              <div>
                <span className="text-sm text-gray-500">Mã đơn hàng:</span>
                <span className="ml-2 font-medium">{order.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Ngày đặt:</span>
                <span className="font-medium">{order.date}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="px-5 py-4 flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.price} × {item.quantity}</p>
                  </div>
                  <div className="text-right font-medium text-gray-800">
                    {/* tính lại giá đúng */}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND"
                    }).format(parseInt(item.price.replace(/\./g, "")) * item.quantity).replace("₫", "đ")}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-5 py-4 flex justify-between items-center border-t">
              <div>
                <span className="text-sm text-gray-500">Vận chuyển:</span>
                <span className="ml-2 font-medium">{order.shipping}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDetail(order)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                >
                  Xem chi tiết
                </button>
                {order.status === "Hoàn thành" && (
                  <button
                    onClick={() => handleBuyAgain(order)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Mua lại
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal xem chi tiết */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full">
            <Dialog.Title className="text-lg font-bold mb-4 text-gray-800">
              📋 Đơn hàng {selectedOrder?.id}
            </Dialog.Title>

            {/* Thông tin chung */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div><span className="text-gray-500">Ngày đặt:</span> <span className="font-medium">{selectedOrder?.date}</span></div>
              <div><span className="text-gray-500">Trạng thái:</span> <span className={`font-medium px-2 py-1 rounded ${selectedOrder?.statusColor}`}>{selectedOrder?.status}</span></div>
              <div><span className="text-gray-500">Vận chuyển:</span> <span className="font-medium">{selectedOrder?.shipping}</span></div>
              <div><span className="text-gray-500">Tổng cộng:</span> <span className="font-bold text-blue-600">{selectedOrder?.total}</span></div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="space-y-4">
              {selectedOrder?.items.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4 flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Giá: {item.price} | SL: {item.quantity}</p>
                  </div>
                  <div className="text-right font-medium text-gray-800">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(parseInt(item.price.replace(/\./g, "")) * item.quantity).replace("₫", "đ")}
                  </div>
                </div>
              ))}
            </div>

            {/* Nút đóng */}
            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                Đóng
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MyOrders;
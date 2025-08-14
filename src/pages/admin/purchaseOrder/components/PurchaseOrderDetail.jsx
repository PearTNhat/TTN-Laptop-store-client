// src/pages/PurchaseOrderManagement/components/PurchaseOrderDetail.jsx

import { Hash } from "lucide-react";

const PurchaseOrderDetail = ({ details }) => {
  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (!details || details.length === 0) {
    return (
      <p className="text-center text-gray-500 py-4">
        Không có chi tiết sản phẩm.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Sản phẩm
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Số lượng
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Đơn giá
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Thành tiền
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {details.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex items-center mt-1 text-xs text-black">
                  <Hash className="h-3 w-3 mr-1 " />
                  <span className="font-mono">{item.id}</span>
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img
                      className="h-12 w-12 rounded-md object-contain"
                      src={item.image}
                      alt={item.title}
                    />
                  </div>

                  <div className="ml-4">
                    {/* Tên sản phẩm */}
                    <div className="text-sm font-medium text-gray-900">
                      {item.title}
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Hash className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="font-mono">{item.productDetailId}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-700">
                {item.quantity}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm text-gray-800">
                {formatCurrency(item.unitCost)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                {formatCurrency(item.unitCost * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrderDetail;

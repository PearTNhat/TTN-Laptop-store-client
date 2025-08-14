// src/pages/DeliveryNoteManagement/components/DeliveryNoteDetail.jsx
import React from "react";
import { Package2, Hash } from "lucide-react";

const DeliveryNoteDetail = ({ details }) => {
  if (!details || details.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package2 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
        <p>Không có chi tiết sản phẩm</p>
      </div>
    );
  }
  console.log("details:", details);
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Package2 className="h-5 w-5 text-green-600" />
        Chi tiết sản phẩm xuất kho
      </h4>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản phẩm
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial Number
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {details.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img
                        src={item.thumbnail}
                        alt={item.productTitle}
                        className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.productTitle}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {item.quantity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {item.serialNumber ? (
                      <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {item.serialNumber}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">
                        Không có serial
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DeliveryNoteDetail;

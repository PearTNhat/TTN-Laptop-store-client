import React from "react";
import { Edit, Trash2, Layers } from "lucide-react";

// --- Các hàm tiện ích đã được chuyển vào đây để component tự quản lý việc hiển thị ---
const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price
  );

const getStockStatus = (quantity) => {
  if (quantity === 0)
    return { text: "Hết hàng", className: "bg-red-100 text-red-700" };
  if (quantity <= 10)
    return { text: "Sắp hết", className: "bg-yellow-100 text-yellow-700" };
  return { text: "Còn hàng", className: "bg-green-100 text-green-700" };
};

const ProductTable = ({
  products,
  onShowDetails,
  onDelete,
  onEdit,
  onDeleteDetail,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">
              Sản phẩm
            </th>
            <th scope="col" className="px-6 py-3">
              Thương hiệu
            </th>
            <th scope="col" className="px-6 py-3">
              Giá bán
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Tồn kho
            </th>
            <th scope="col" className="px-6 py-3">
              Trạng thái
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const displayDetail = product.productDetails[0];
            if (!displayDetail) return null;
            const stock = getStockStatus(displayDetail.quantity);
            return (
              <tr
                key={product.id}
                className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onShowDetails(product)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={displayDetail.thumbnail}
                      alt={displayDetail.title}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                    <div>
                      <div className="font-bold">{displayDetail.title}</div>
                      <div className="text-xs text-gray-500">
                        ID: {product.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{product.brand.name}</td>
                <td className="px-6 py-4 font-semibold text-indigo-600">
                  {formatPrice(displayDetail.originalPrice)}
                </td>
                <td className="px-6 py-4 text-center font-semibold">
                  {displayDetail.quantity}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${stock.className}`}
                  >
                    {stock.text}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(product); // Gọi hàm onEdit từ props
                      }}
                      className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDetail(product); // Mở modal xóa biến thể
                      }}
                      className="p-2 text-gray-500 hover:text-orange-600 rounded-full hover:bg-gray-100"
                      title="Xóa biến thể"
                    >
                      <Layers size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(product.id, displayDetail.title); // Gọi hàm onDelete từ props
                      }}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;

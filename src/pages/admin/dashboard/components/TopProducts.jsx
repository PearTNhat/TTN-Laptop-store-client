import { FaChartLine, FaBox } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
import { apiTopProducts } from "~/apis/dashboardApi";
import { showToastError } from "~/utils/alert";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const TopProducts = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const fetchTopProducts = async () => {
    try {
      const response = await apiTopProducts({ accessToken });
      if (response.code === 200) {
        setProducts(response.data);
      } else {
        throw new Error(response);
      }
    } catch (error) {
      showToastError(error.message);
    }
  };
  useEffect(() => {
    fetchTopProducts();
  }, [accessToken]);
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <FaChartLine className="mr-3 text-green-600" />
          Sản phẩm bán chạy
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={product.productDetailId}
              className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
            >
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-sm">
                    {index + 1}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 shadow-sm">
                  <img
                    src={product.productThumbnail}
                    alt={product.productTitle}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {product.productTitle}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    ID: {product.productDetailId}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center">
                    <FaBox className="mr-1" />
                    {product.totalSold} đã bán
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.revenue)}
                </p>
                <div className="flex items-center justify-end">
                  <HiTrendingUp className="w-3 h-3 text-green-500 mr-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;

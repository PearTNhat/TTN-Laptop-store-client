import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaImage,
} from "react-icons/fa";

function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");
  const productsPerPage = 12;

  const products = [
    {
      id: 1,
      name: 'MacBook Pro 14" M3',
      brand: "Apple",
      series: "MacBook Pro",
      price: 45000000,
      stock: 25,
      status: "Còn hàng",
      image: "/images/macbook-pro.jpg",
      createdDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Dell XPS 13 Plus",
      brand: "Dell",
      series: "XPS",
      price: 32000000,
      stock: 15,
      status: "Còn hàng",
      image: "/images/dell-xps.jpg",
      createdDate: "2024-01-14",
    },
    {
      id: 3,
      name: "Asus ROG Strix G15",
      brand: "Asus",
      series: "ROG Strix",
      price: 28000000,
      stock: 0,
      status: "Hết hàng",
      image: "/images/asus-rog.jpg",
      createdDate: "2024-01-13",
    },
    {
      id: 4,
      name: "HP Pavilion 15",
      brand: "HP",
      series: "Pavilion",
      price: 18000000,
      stock: 8,
      status: "Ít hàng",
      image: "/images/hp-pavilion.jpg",
      createdDate: "2024-01-12",
    },
    {
      id: 5,
      name: "Lenovo ThinkPad X1",
      brand: "Lenovo",
      series: "ThinkPad",
      price: 25000000,
      stock: 12,
      status: "Còn hàng",
      image: "/images/thinkpad.jpg",
      createdDate: "2024-01-11",
    },
    {
      id: 6,
      name: "MacBook Air M3",
      brand: "Apple",
      series: "MacBook Air",
      price: 28000000,
      stock: 20,
      status: "Còn hàng",
      image: "/images/macbook-air.jpg",
      createdDate: "2024-01-10",
    },
  ];

  const brands = ["Apple", "Dell", "Asus", "Lenovo", "HP"];
  const series = [
    "MacBook Pro",
    "MacBook Air",
    "XPS",
    "ROG Strix",
    "ThinkPad",
    "Pavilion",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Còn hàng":
        return "bg-green-100 text-green-800";
      case "Hết hàng":
        return "bg-red-100 text-red-800";
      case "Ít hàng":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.series.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesSeries = !selectedSeries || product.series === selectedSeries;

    return matchesSearch && matchesBrand && matchesSeries;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý sản phẩm
        </h1>
        <p className="text-gray-600">
          Quản lý toàn bộ sản phẩm laptop trong cửa hàng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.length}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <FaImage className="text-xl text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Còn hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter((p) => p.status === "Còn hàng").length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <FaImage className="text-xl text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Hết hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter((p) => p.status === "Hết hàng").length}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <FaImage className="text-xl text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Tổng tồn kho</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.reduce((sum, product) => sum + product.stock, 0)}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <FaImage className="text-xl text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả dòng sản phẩm</option>
              {series.map((serie) => (
                <option key={serie} value={serie}>
                  {serie}
                </option>
              ))}
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <FaPlus />
              Thêm sản phẩm
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-6">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-w-16 aspect-h-12 bg-gray-200">
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <FaImage className="text-4xl text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {product.name}
                </h3>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  {product.brand} • {product.series}
                </p>
                <p className="text-xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Tồn kho: {product.stock}</span>
                <span>{product.createdDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                  <FaEye />
                  Xem
                </button>
                <button className="bg-yellow-50 text-yellow-600 px-3 py-2 rounded-lg hover:bg-yellow-100 transition-colors">
                  <FaEdit />
                </button>
                <button className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors">
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Trước
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Sau
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">{indexOfFirstProduct + 1}</span> đến{" "}
              <span className="font-medium">
                {Math.min(indexOfLastProduct, filteredProducts.length)}
              </span>{" "}
              trong{" "}
              <span className="font-medium">{filteredProducts.length}</span> kết
              quả
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Trước
              </button>
              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(
                      Math.ceil(filteredProducts.length / productsPerPage),
                      currentPage + 1
                    )
                  )
                }
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Sau
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;

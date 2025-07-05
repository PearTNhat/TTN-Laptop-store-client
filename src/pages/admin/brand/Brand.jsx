import React, { useState } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaImage } from "react-icons/fa";

function Brand() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const brandsPerPage = 10;

  const brands = [
    {
      id: 1,
      name: "Apple",
      description: "Công ty công nghệ từ Mỹ",
      logo: "/images/apple-logo.png",
      products: 45,
      status: "Hoạt động",
      createdDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Dell",
      description: "Thương hiệu laptop và máy tính",
      logo: "/images/dell-logo.png",
      products: 32,
      status: "Hoạt động",
      createdDate: "2024-01-14",
    },
    {
      id: 3,
      name: "Asus",
      description: "Thương hiệu gaming và công nghệ",
      logo: "/images/asus-logo.png",
      products: 28,
      status: "Hoạt động",
      createdDate: "2024-01-13",
    },
    {
      id: 4,
      name: "HP",
      description: "Hewlett-Packard",
      logo: "/images/hp-logo.png",
      products: 25,
      status: "Tạm ngừng",
      createdDate: "2024-01-12",
    },
    {
      id: 5,
      name: "Lenovo",
      description: "Thương hiệu laptop kinh doanh",
      logo: "/images/lenovo-logo.png",
      products: 22,
      status: "Hoạt động",
      createdDate: "2024-01-11",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoạt động":
        return "bg-green-100 text-green-800";
      case "Tạm ngừng":
        return "bg-red-100 text-red-800";
      case "Chờ duyệt":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = filteredBrands.slice(
    indexOfFirstBrand,
    indexOfLastBrand
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý thương hiệu
        </h1>
        <p className="text-gray-600">
          Quản lý thông tin các thương hiệu sản phẩm
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">
                Tổng thương hiệu
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {brands.length}
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
              <p className="text-sm font-medium text-gray-600">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {brands.filter((b) => b.status === "Hoạt động").length}
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
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {brands.reduce((sum, brand) => sum + brand.products, 0)}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <FaImage className="text-xl text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm thương hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FaPlus />
            Thêm thương hiệu
          </button>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {currentBrands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <FaImage className="text-gray-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {brand.products} sản phẩm
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    brand.status
                  )}`}
                >
                  {brand.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{brand.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Ngày tạo: {brand.createdDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                  <FaEdit />
                  Chỉnh sửa
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
              <span className="font-medium">{indexOfFirstBrand + 1}</span> đến{" "}
              <span className="font-medium">
                {Math.min(indexOfLastBrand, filteredBrands.length)}
              </span>{" "}
              trong <span className="font-medium">{filteredBrands.length}</span>{" "}
              kết quả
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
                      Math.ceil(filteredBrands.length / brandsPerPage),
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

export default Brand;

import React, { useState } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaLaptop } from "react-icons/fa";

function Series() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const seriesPerPage = 10;

  const series = [
    {
      id: 1,
      name: "MacBook Pro",
      brand: "Apple",
      description: "Dòng laptop cao cấp cho chuyên gia",
      products: 15,
      status: "Hoạt động",
      createdDate: "2024-01-15",
    },
    {
      id: 2,
      name: "XPS",
      brand: "Dell",
      description: "Dòng laptop mỏng nhẹ cao cấp",
      products: 12,
      status: "Hoạt động",
      createdDate: "2024-01-14",
    },
    {
      id: 3,
      name: "ROG Strix",
      brand: "Asus",
      description: "Dòng laptop gaming hiệu năng cao",
      products: 8,
      status: "Hoạt động",
      createdDate: "2024-01-13",
    },
    {
      id: 4,
      name: "ThinkPad",
      brand: "Lenovo",
      description: "Dòng laptop doanh nghiệp",
      products: 10,
      status: "Hoạt động",
      createdDate: "2024-01-12",
    },
    {
      id: 5,
      name: "Pavilion",
      brand: "HP",
      description: "Dòng laptop phổ thông",
      products: 7,
      status: "Tạm ngừng",
      createdDate: "2024-01-11",
    },
    {
      id: 6,
      name: "MacBook Air",
      brand: "Apple",
      description: "Dòng laptop mỏng nhẹ",
      products: 9,
      status: "Hoạt động",
      createdDate: "2024-01-10",
    },
  ];

  const brands = ["Apple", "Dell", "Asus", "Lenovo", "HP"];

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

  const getBrandColor = (brand) => {
    const colors = {
      Apple: "bg-gray-100 text-gray-800",
      Dell: "bg-blue-100 text-blue-800",
      Asus: "bg-red-100 text-red-800",
      Lenovo: "bg-orange-100 text-orange-800",
      HP: "bg-purple-100 text-purple-800",
    };
    return colors[brand] || "bg-gray-100 text-gray-800";
  };

  const filteredSeries = series.filter(
    (serie) =>
      serie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serie.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serie.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastSeries = currentPage * seriesPerPage;
  const indexOfFirstSeries = indexOfLastSeries - seriesPerPage;
  const currentSeries = filteredSeries.slice(
    indexOfFirstSeries,
    indexOfLastSeries
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý dòng sản phẩm
        </h1>
        <p className="text-gray-600">
          Quản lý các dòng sản phẩm theo thương hiệu
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Tổng dòng SP</p>
              <p className="text-2xl font-bold text-gray-900">
                {series.length}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <FaLaptop className="text-xl text-blue-600" />
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
                {series.filter((s) => s.status === "Hoạt động").length}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <FaLaptop className="text-xl text-green-600" />
            </div>
          </div>
        </div>
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
            <div className="bg-purple-50 p-3 rounded-lg">
              <FaLaptop className="text-xl text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {series.reduce((sum, serie) => sum + serie.products, 0)}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <FaLaptop className="text-xl text-yellow-600" />
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
              placeholder="Tìm kiếm dòng sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Tất cả thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <FaPlus />
              Thêm dòng SP
            </button>
          </div>
        </div>
      </div>

      {/* Series Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dòng sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thương hiệu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSeries.map((serie) => (
                <tr key={serie.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FaLaptop className="text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {serie.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {serie.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBrandColor(
                        serie.brand
                      )}`}
                    >
                      {serie.brand}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {serie.products} sản phẩm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        serie.status
                      )}`}
                    >
                      {serie.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {serie.createdDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                <span className="font-medium">{indexOfFirstSeries + 1}</span>{" "}
                đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastSeries, filteredSeries.length)}
                </span>{" "}
                trong{" "}
                <span className="font-medium">{filteredSeries.length}</span> kết
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
                        Math.ceil(filteredSeries.length / seriesPerPage),
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
    </div>
  );
}

export default Series;

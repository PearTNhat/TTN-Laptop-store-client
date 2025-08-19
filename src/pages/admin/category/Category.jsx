import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Pagination from "~/components/pagination/Pagination";

import CategoryTableRow from "./components/CategoryTableRow";
import CategoryForm from "./components/CategoryForm";

import { useSelector } from "react-redux";

import {
  apiGetCategories,
  apiCreateCategory,
  apiDeleteCategory,
  apiUpdateCategory,
} from "~/apis/categoryApi";

function Category() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { accessToken } = useSelector((state) => state.user);

  const categoriesPerPage = 5;

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await apiGetCategories();
        console.log("Kết quả từ API getcate:", res);
        const list = Array.isArray(res?.data) ? res.data : [];
        const formatted = list.map((item) => ({
          ...item,
        }));
        setCategories(formatted);
        setTimeout(() => setIsLoading(false), 600);
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu danh mục");
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAdd = async (newCategory) => {
    console.log("Dữ liệu gửi thêm: ", newCategory);

    try {
      const res = await apiCreateCategory({ body: newCategory, accessToken });

      if (res.success && res.data) {
        setCategories((prev) => [...prev, res.data]);
        toast.success(res.message || "Thêm danh mục thành công!");
        setShowDialog(false);
      } else {
        toast.error(res.message || "Thêm danh mục thất bại!");
      }
    } catch (error) {
      toast.error("Thêm danh mục thất bại!");
    }
  };

  const handleUpdate = async (updated) => {
    console.log("Dữ liệu gửi sửa:", updated);
    try {
      const res = await apiUpdateCategory({
        id: updated.id,
        body: updated,
        accessToken,
      });
      if (res?.success) {
        console.log("jsjsj", updated);
        setCategories(
          categories.map((c) => (c.id === updated.id ? updated : c))
        );
        toast.success("Cập nhật danh mục thành công!");
        setShowDialog(false);
      }
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const res = await apiDeleteCategory({
        id: categoryToDelete.id,
        accessToken,
      });
      if (res?.success) {
        setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
        toast.success(`Đã xóa "${categoryToDelete.name}"`);
      }
    } catch {
      console.log("🛑 Lỗi khi update/delete:", err.response?.data);
      toast.error("Xóa danh mục thất bại!");
    }
    setShowDeleteDialog(false);
  };

  const filteredCategories = categories.filter((category) =>
    (category.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Modern Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14-7H5m14 14H5"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Quản lý Danh mục
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Theo dõi & kiểm soát các danh mục sản phẩm trong hệ thống
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {categories.length}
                  </div>
                  <div className="text-sm text-gray-500">Tổng danh mục</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setShowDialog(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FaPlus className="text-lg" />
                  <span className="font-semibold">Thêm danh mục</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Tìm kiếm danh mục theo tên..."
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Mobile Add Button */}
            <button
              onClick={() => {
                setSelectedCategory(null);
                setShowDialog(true);
              }}
              className="lg:hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaPlus />
              Thêm danh mục
            </button>
          </div>
        </div>

        {/* Modern Categories Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14-7H5m14 14H5"
                />
              </svg>
              Danh sách danh mục ({filteredCategories.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Thông tin danh mục
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500 text-lg font-medium">
                          Đang tải danh mục...
                        </p>
                        <p className="text-gray-400 text-sm">
                          Vui lòng chờ một chút
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : currentCategories.length > 0 ? (
                  currentCategories.map((category) => (
                    <CategoryTableRow
                      key={category.id}
                      category={category}
                      onEdit={(c) => {
                        setSelectedCategory(c);
                        setShowDialog(true);
                      }}
                      onDelete={(c) => {
                        setCategoryToDelete(c);
                        setShowDeleteDialog(true);
                      }}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 11H5m14-7H5m14 14H5"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          Chưa có danh mục nào
                        </h3>
                        <p className="text-gray-500 mb-6">
                          {searchTerm
                            ? `Không tìm thấy danh mục nào với từ khóa "${searchTerm}"`
                            : "Tạo danh mục đầu tiên để bắt đầu phân loại sản phẩm"}
                        </p>
                        {!searchTerm && (
                          <button
                            onClick={() => {
                              setSelectedCategory(null);
                              setShowDialog(true);
                            }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            <FaPlus />
                            Tạo danh mục đầu tiên
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPageCount={totalPages}
              onPageChange={setCurrentPage}
              siblingCount={1}
              showFirstLast
            />
          </div>
        )}
      </div>

      {/* Modern Delete Confirmation Modal */}
      <Transition appear show={showDeleteDialog} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowDeleteDialog(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                  <Dialog.Title className="text-xl font-bold text-gray-900 text-center mb-4">
                    Xác nhận xóa danh mục
                  </Dialog.Title>
                  <p className="text-gray-600 text-center mb-8 leading-relaxed">
                    Bạn có chắc chắn muốn xóa danh mục{" "}
                    <span className="font-semibold text-gray-900">
                      "{categoryToDelete?.name}"
                    </span>{" "}
                    không?{" "}
                    <span className="text-red-600 font-medium">
                      Hành động này không thể hoàn tác.
                    </span>
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setShowDeleteDialog(false)}
                      className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      Xóa danh mục
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modern Form Modal */}
      <Transition appear show={showDialog} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowDialog(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      </div>
                      <Dialog.Title className="text-xl font-bold text-white">
                        {selectedCategory
                          ? "Chỉnh sửa danh mục"
                          : "Thêm danh mục mới"}
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className="p-8">
                    <CategoryForm
                      category={selectedCategory}
                      onSubmit={selectedCategory ? handleUpdate : handleAdd}
                      onCancel={() => setShowDialog(false)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default Category;

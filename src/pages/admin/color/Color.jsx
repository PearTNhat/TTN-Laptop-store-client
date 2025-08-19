import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Pagination from "~/components/pagination/Pagination";
import { useSelector } from "react-redux";

import ColorTableRow from "./components/ColorTableRow";
import ColorForm from "./components/ColorForm";

import {
  apiGetColors,
  apiCreateColor,
  apiUpdateColor,
  apiDeleteColor,
} from "~/apis/colorApi";

function Color() {
  const [colors, setColors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorToDelete, setColorToDelete] = useState(null);
  const { accessToken } = useSelector((state) => state.user);

  const colorsPerPage = 5;

  useEffect(() => {
    const fetchColors = async () => {
      setIsLoading(true);
      try {
        const res = await apiGetColors({ accessToken });
        setColors(Array.isArray(res?.data) ? res.data : []);
      } catch (error) {
        console.error("❌ Lỗi khi gọi getColors:", error);
        toast.error("Không thể tải danh sách màu sắc");
      } finally {
        setIsLoading(false);
      }
    };

    fetchColors();
  }, [accessToken]);

  const handleAdd = async (newColor) => {
    try {
      const res = await apiCreateColor({ body: newColor, accessToken });
      if (res.success) {
        setColors([res.data, ...colors]);
        toast.success("Thêm màu sắc thành công!");
        setShowDialog(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Thêm thất bại!");
    }
  };

  const handleUpdate = async (updatedColor) => {
    console.log("màu update: ", updatedColor);

    try {
      const body = {
        name: updatedColor.name,
        hex: updatedColor.hex,
      };

      const res = await apiUpdateColor({
        id: updatedColor.id,
        body,
        accessToken,
      });

      if (res.success) {
        setColors(
          colors.map((c) =>
            c.id === updatedColor.id ? { ...c, ...updatedColor } : c
          )
        );
        toast.success("Cập nhật màu sắc thành công!");
        setShowDialog(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };

  const confirmDelete = async () => {
    if (colorToDelete) {
      try {
        const res = await apiDeleteColor({
          id: colorToDelete.id,
          accessToken,
        });

        if (res.success) {
          setColors(colors.filter((c) => c.id !== colorToDelete.id));
          toast.success(`Đã xóa "${colorToDelete.name}"`);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("Xóa thất bại!");
      }
    }
    setShowDeleteDialog(false);
  };

  const filteredColors = colors.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.hex || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * colorsPerPage;
  const indexOfFirst = indexOfLast - colorsPerPage;
  const currentColors = filteredColors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredColors.length / colorsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="p-6">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Modern Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
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
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Quản lý Màu sắc
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Theo dõi & quản lý bảng màu sản phẩm trong hệ thống
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {colors.length}
                  </div>
                  <div className="text-sm text-gray-500">Tổng màu sắc</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <button
                  onClick={() => {
                    setSelectedColor(null);
                    setShowDialog(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FaPlus className="text-lg" />
                  <span className="font-semibold">Thêm màu mới</span>
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
                  placeholder="Tìm kiếm màu sắc theo tên hoặc mã HEX..."
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Mobile Add Button */}
            <button
              onClick={() => {
                setSelectedColor(null);
                setShowDialog(true);
              }}
              className="lg:hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaPlus />
              Thêm màu mới
            </button>
          </div>
        </div>

        {/* Modern Colors Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Table Header */}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z"
                        />
                      </svg>
                      Thông tin màu sắc
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-pink-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      Mã HEX
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
                    <td colSpan="3" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                        <p className="text-gray-500 text-lg font-medium">
                          Đang tải màu sắc...
                        </p>
                        <p className="text-gray-400 text-sm">
                          Vui lòng chờ một chút
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : currentColors.length > 0 ? (
                  currentColors.map((c) => (
                    <ColorTableRow
                      key={`color-${c.id}`}
                      color={c}
                      onEdit={(color) => {
                        setSelectedColor(color);
                        setShowDialog(true);
                      }}
                      onDelete={(color) => {
                        setColorToDelete(color);
                        setShowDeleteDialog(true);
                      }}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-purple-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          Chưa có màu sắc nào
                        </h3>
                        <p className="text-gray-500 mb-6">
                          {searchTerm
                            ? `Không tìm thấy màu sắc nào với từ khóa "${searchTerm}"`
                            : "Tạo màu sắc đầu tiên để bắt đầu quản lý bảng màu"}
                        </p>
                        {!searchTerm && (
                          <button
                            onClick={() => {
                              setSelectedColor(null);
                              setShowDialog(true);
                            }}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            <FaPlus />
                            Tạo màu sắc đầu tiên
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
                  <Dialog.Title className="text-xl font-bold text-gray-900 text-center mb-6">
                    Xác nhận xóa màu sắc
                  </Dialog.Title>
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                      <div
                        className="w-24 h-24 rounded-2xl shadow-xl border-4 border-white"
                        style={{
                          backgroundColor: colorToDelete?.hex || "#000000",
                        }}
                      ></div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-600 text-center leading-relaxed">
                      Bạn có chắc chắn muốn xóa màu{" "}
                      <span className="font-bold text-gray-900">
                        "{colorToDelete?.name || ""}"
                      </span>{" "}
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {colorToDelete?.hex || ""}
                      </span>
                      ?{" "}
                      <span className="text-red-600 font-medium">
                        Hành động này không thể hoàn tác.
                      </span>
                    </p>
                  </div>
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
                      Xóa màu sắc
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
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
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
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
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
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z"
                          />
                        </svg>
                      </div>
                      <Dialog.Title className="text-xl font-bold text-white">
                        {selectedColor
                          ? "Chỉnh sửa màu sắc"
                          : "Thêm màu sắc mới"}
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className="p-8">
                    <ColorForm
                      color={selectedColor}
                      onSubmit={selectedColor ? handleUpdate : handleAdd}
                      onCancel={() => setShowDialog(false)}
                    />
                    {console.log("selectedColor tại render: ", selectedColor)}
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

export default Color;

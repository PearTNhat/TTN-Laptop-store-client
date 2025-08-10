import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Pagination from "~/components/pagination/Pagination";
import { useSelector } from "react-redux";

import ColorStat from "./components/ColorStat";
import ColorTableRow from "./components/ColorTableRow";
import ColorForm from "./components/ColorForm";

import { apiGetColors, apiCreateColor, apiUpdateColor, apiDeleteColor } from "~/apis/colorApi";

function Color() {
  const [colors, setColors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorToDelete, setColorToDelete] = useState(null);
  const { accessToken } = useSelector(state => state.user);

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
    console.log("zô đây: ", newColor)
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
        hex: updatedColor.hex
      };

      const res = await apiUpdateColor({ 
        id: updatedColor.id, 
        body, 
        accessToken 
      });
      
      if (res.success) {
        setColors(colors.map(c => 
          c.id === updatedColor.id ? { ...c, ...updatedColor } : c
        ));
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
          accessToken 
        });
        
        if (res.success) {
          setColors(colors.filter(c => c.id !== colorToDelete.id));
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

  const filteredColors = colors.filter(c =>
    (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.hex || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * colorsPerPage;
  const indexOfFirst = indexOfLast - colorsPerPage;
  const currentColors = filteredColors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredColors.length / colorsPerPage);

  return (
    <div className="p-6 bg-white min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý Màu sắc</h1>
      <p className="text-gray-600 mb-6">Theo dõi & quản lý các màu sắc sản phẩm</p>

      <ColorStat total={colors.length} />

      <div className="flex items-center justify-between bg-white border p-4 rounded-xl shadow-sm mb-6">
        <div className="relative w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm kiếm màu sắc"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            setSelectedColor(null);
            setShowDialog(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Thêm màu mới
        </button>
      </div>

      <div className="border rounded-xl shadow-sm overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Màu sắc
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã HEX
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="3" className="px-6 py-4">
                  <Skeleton count={5} height={40} />
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
                <td colSpan="3" className="text-center text-gray-500 py-4">
                  Không có màu sắc nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPageCount={totalPages}
          onPageChange={setCurrentPage}
          siblingCount={1}
          showFirstLast
        />
      )}

      {/* Dialog - Xóa */}
      <Transition appear show={showDeleteDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteDialog(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
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
                <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
                  <Dialog.Title className="text-lg font-semibold mb-4">
                    Xác nhận xóa màu sắc
                  </Dialog.Title>
                  <div className="flex flex-col items-center mb-4">
                    <div 
                      className="w-20 h-20 rounded-full mb-3 border-4 border-white shadow-lg"
                      style={{ backgroundColor: colorToDelete?.hex || '#000000' }}
                    ></div>
                    <p className="text-center text-gray-600">
                      Bạn có chắc chắn muốn xóa màu 
                      <span className="font-bold" style={{ color: colorToDelete?.hex || '#000000' }}>
                        {" "}{colorToDelete?.name || ""}
                      </span>?
                    </p>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDeleteDialog(false)}
                      className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Dialog - Thêm / Sửa */}
      <Transition appear show={showDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDialog(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
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
                <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl transition-all">
                  <ColorForm
                    color={selectedColor}
                    onSubmit={selectedColor ? handleUpdate : handleAdd}
                    onCancel={() => setShowDialog(false)}
                  />
                  {console.log("selectedColor tại render: ", selectedColor)}
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
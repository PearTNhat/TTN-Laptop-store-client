import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Pagination from "~/components/pagination/Pagination";
import BrandStats from "./components/BrandStats";
import BrandTableRow from "./components/BrandTableRow";
import BrandForm from "./components/BrandForm";
import { useSelector } from "react-redux";

import {apiGetBrands, apiCreateBrand, apiUpdateBrand, apiDeleteBrand } from "~/apis/brandApi"

// Import icons
import { 
  FiLayers, 
  FiSearch, 
  FiPlus, 
  FiTag, 
  FiCalendar, 
  FiSettings, 
  FiInbox, 
  FiX 
} from "react-icons/fi";

function Brand() {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);

  const {accessToken}= useSelector(state => state.user)

  const brandsPerPage = 4;

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        const res = await apiGetBrands();
        console.log("Kết quả từ API getBrand:", res);
        if (res && res.code === 200 && Array.isArray(res.data)) {
          setBrands(res.data);
        } else {
          toast.error("Không thể lấy dữ liệu thương hiệu");
        }
      } catch (error) {
        console.error("Lỗi khi gọi getBrand:", error);
        toast.error("Lỗi khi tải dữ liệu thương hiệu");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrands();
  }, []);


  const handleAdd = async (newBrand) => {
    console.log("Dữ liệu gửi thêm: ", newBrand);
    try {
      console.log("Token: ", accessToken) 
      const res = await apiCreateBrand({ body: newBrand, accessToken });

      if (res.success && res.data) {
        setBrands((prev) => [...prev, res.data]);
        toast.success(res.message||"Thêm thương hiệu thành công!");
        setShowDialog(false);
      } else {
        toast.error(res.message || "Thêm thương hiệu thất bại!");
      }
    } catch (err) {
      toast.error("Lỗi khi gọi API tạo thương hiệu.");
    }
  };

  const handleUpdate = async (updatedData) => {
    console.log("Dữ liệu gửi sửa:", updatedData); 
    try {
      const res = await apiUpdateBrand({
        id: updatedData.id,
        body: updatedData,
        accessToken,
      });

      if (res?.success) {
        toast.success("✅ Cập nhật thương hiệu thành công!");
        setBrands(brands.map((brand) => (brand.id === updatedData.id ? updatedData : brand)));
        setShowDialog(false);
      } else {
        toast.error("❌ " + res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật thương hiệu!");
    }
  };


  const confirmDelete = async () => {
    if (!brandToDelete) return;
    try {
      const res = await apiDeleteBrand({ id: brandToDelete.id, accessToken });

      if (res?.success) {
        setBrands(brands.filter((b) => b.id !== brandToDelete.id));
        toast.success(`Đã xóa "${brandToDelete.name}"`);
      } else {
        if (res.message.includes("Conflict")) {
          toast.error(`Không thể xóa thương hiệu "${brandToDelete.name}" vì đang được sử dụng.`);
        } else {
          toast.error(res.message || "Xóa không thành công");
        }
      }
    } catch{
      console.log("🛑 Lỗi khi update/delete:", err.response?.data);
      toast.error("Xóa danh mục thất bại!");
    }
    setShowDeleteDialog(false);
  };
  const filteredBrands = brands.filter((brand) =>
    (brand.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );


  const indexOfLast = currentPage * brandsPerPage;
  const indexOfFirst = indexOfLast - brandsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBrands.length / brandsPerPage);

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        toastClassName="!rounded-lg !shadow-md !border !border-gray-100"
        progressClassName="!bg-blue-500"
      />

      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FiLayers className="text-blue-600" />
          Quản lý Thương hiệu
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl">
          Theo dõi & quản lý toàn bộ thương hiệu sản phẩm trong hệ thống. Tạo mới, chỉnh sửa hoặc xóa thương hiệu khi cần thiết.
        </p>
        {/* <BrandStats total={brands.length} /> */}
      </div>

      {/* Stats card */}
      <div>
        {/* Card tổng thương hiệu */}
        <BrandStats total={brands.length} />
      </div>

      {/* Search and action bar */}
      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm kiếm thương hiệu..."
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        
        <button
          onClick={() => {
            setSelectedBrand(null);
            setShowDialog(true);
          }}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
        >
          <FiPlus className="text-lg" />
          <span>Thêm thương hiệu</span>
        </button>
      </div>

      {/* Table section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <FiTag /> Thương hiệu
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end gap-1">
                    <FiSettings /> Hành động
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4">
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ) : currentBrands.length > 0 ? (
                currentBrands.map((brand) => (
                  <BrandTableRow
                    key={brand.id}
                    brand={brand}
                    onEdit={(b) => {
                      setSelectedBrand(b);
                      setShowDialog(true);
                    }}
                    onDelete={(b) => {
                      setBrandToDelete(b);
                      setShowDeleteDialog(true);
                    }}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <FiInbox className="text-4xl mb-3" />
                      <p className="text-lg">Không tìm thấy thương hiệu nào</p>
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          <FiX /> Xóa bộ lọc tìm kiếm
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
      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPageCount={totalPages}
          onPageChange={setCurrentPage}
          siblingCount={1}
          showFirstLast
        />
      )}

      {/* Delete Dialog */}
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
                    Xác nhận xóa thương hiệu
                  </Dialog.Title>
                  <p className="text-sm text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa thương hiệu "{brandToDelete?.name}" không? Hành động này không thể hoàn tác.
                  </p>
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

      {/* Add/Edit Dialog */}
      <Transition appear show={showDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDialog(false)}>
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
                <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-bold mb-4">
                    {selectedBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
                  </Dialog.Title>
                  <BrandForm
                    brand={selectedBrand}
                    onSubmit={selectedBrand ? handleUpdate : handleAdd}
                    onCancel={() => setShowDialog(false)}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default Brand;
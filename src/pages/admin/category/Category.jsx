import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Pagination from "~/components/pagination/Pagination";

import CategoryStats from "./components/CategoryStats";
import CategoryTableRow from "./components/CategoryTableRow";
import CategoryForm from "./components/CategoryForm";

import { useSelector } from "react-redux";

import { apiGetCategories, apiCreateCategory, apiDeleteCategory, apiUpdateCategory } from "~/apis/categoryApi";


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
        const res= await apiGetCategories();
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
        console.log("jsjsj", updated)
        setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
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
      const res = await apiDeleteCategory({ id: categoryToDelete.id, accessToken });
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
    <div className="p-6 bg-white min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý Danh mục</h1>
      <p className="text-gray-600 mb-6">Theo dõi & kiểm soát các danh mục sản phẩm</p>

      <CategoryStats total={categories.length} />

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
            placeholder="Tìm kiếm danh mục..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setShowDialog(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Thêm danh mục
        </button>
      </div>

      <div className="border rounded-xl shadow-sm overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
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
                <td colSpan="3" className="text-center text-gray-500 py-4">
                  Không có danh mục nào
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
                    Xác nhận xóa danh mục
                  </Dialog.Title>
                  <p className="text-sm text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa danh mục "{categoryToDelete?.name}" không? Hành động này không thể hoàn tác.
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
                    {selectedCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                  </Dialog.Title>
                  <CategoryForm
                    category={selectedCategory}
                    onSubmit={selectedCategory ? handleUpdate : handleAdd}
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

export default Category;

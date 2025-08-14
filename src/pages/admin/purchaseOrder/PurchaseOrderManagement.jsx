// src/pages/PurchaseOrderManagement/PurchaseOrderManagement.jsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { PlusCircle, Search } from "lucide-react";

// --- Các component và API của bạn ---
import { showToastError, showToastSuccess } from "~/utils/alert";
import PurchaseOrderList from "./components/PurchaseOrderList";
import LoadingSpinner from "~/components/loading/LoadingSpinner";
import Pagination from "~/components/pagination/Pagination";

import StatusFilterDropdown from "./components/StatusFilterDropdown";
import Swal from "sweetalert2";
import PurchaseOrderFormDialog from "./components/PurchaseOrderFormDialog";
import {
  apiDeletePurchaseOrder,
  apiGetPurchaseOrderDetail,
  apiGetPurchaseOrders,
} from "~/apis/purchaseOrderApi";

// Giả sử bạn có file này và export STATUS
// import { STATUS } from "./constants";

const PurchaseOrderManagement = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [purchaseOrders, setPurchaseOrders] = useState([]); // **SỬA: Tên state đã đúng**
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  // **THÊM: State cho phân trang**
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );

  // **THÊM: Logic debounce cho ô tìm kiếm**
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchParams((prev) => {
        if (searchTerm.trim()) {
          prev.set("q", searchTerm.trim());
          prev.set("page", "1"); // Quay về trang 1 khi tìm kiếm
        } else {
          prev.delete("q");
        }
        return prev;
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setSearchParams]);

  // **SỬA LẠI HOÀN TOÀN: useEffect để fetch dữ liệu đơn hàng**
  const fetchPurchaseOrders = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentParams.page || "1",
        size: currentParams.size || "10",
        keyword: currentParams.q || "",
        statusEnum: currentParams.status || "",
      };
      const responseData = await apiGetPurchaseOrders({
        accessToken,
        ...params,
      });

      if (responseData.code !== 200) {
        // Giả sử code thành công là 200
        throw new Error(responseData.message || "Lỗi khi tải đơn nhập hàng");
      }
      const { data } = responseData;
      // Set state đúng
      setPurchaseOrders(data.content);
      setPagination({
        currentPage: data.pageNumber + 1,
        totalPages: data.totalPages,
      });
    } catch (err) {
      showToastError(err.message);
      // setPurchaseOrders([]); // Set về mảng rỗng nếu lỗi
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPurchaseOrders();
  }, [accessToken, currentParams]); // **SỬA: Thêm dependency để fetch lại khi params thay đổi**
  // **THÊM: Hàm xử lý chuyển trang*

  const handleFetchDetails = useCallback(
    async (orderId) => {
      const order = purchaseOrders.find((po) => po.id === orderId);
      if (!order || order.details) {
        return;
      }
      setPurchaseOrders((prevOrders) =>
        prevOrders.map((po) =>
          po.id === orderId ? { ...po, isLoadingDetails: true } : po
        )
      );
      try {
        const response = await apiGetPurchaseOrderDetail({
          accessToken,
          id: orderId,
        });
        if (response.code !== 200) {
          throw new Error(response.message || "Lỗi khi tải chi tiết đơn hàng");
        }
        // 5. Cập nhật state với 'details' đã được fetch, và tắt loading
        const updatedOrderWithDetails = {
          ...order,
          details: response.data.details,
          isLoadingDetails: false,
        };
        setPurchaseOrders((prevOrders) =>
          prevOrders.map((po) =>
            po.id === orderId ? updatedOrderWithDetails : po
          )
        );
        return updatedOrderWithDetails;
      } catch (error) {
        showToastError(error.message);
        setPurchaseOrders((prevOrders) =>
          prevOrders.map((po) =>
            po.id === orderId ? { ...po, isLoadingDetails: false } : po
          )
        );
      }
    },
    [accessToken, purchaseOrders]
  );
  const handlePageChange = (page) => {
    setSearchParams({ ...currentParams, page });
  };
  // **THÊM: Hàm xử lý tạo đơn hàng thành công để reload list**
  const handleCreateSuccess = () => {
    showToastSuccess("Tạo đơn hàng thành công!");
    fetchPurchaseOrders(); // Tải lại toàn bộ danh sách
    setIsFormModalOpen(false); // Đóng modal
    setEditingOrder(null); // Reset editing order
  };

  const handleUpdateSuccess = (updatedOrder) => {
    showToastSuccess("Cập nhật đơn hàng thành công!");
    setPurchaseOrders((prev) =>
      prev.map((order) =>
        order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
      )
    );
    setIsFormModalOpen(false); // Đóng modal
    setEditingOrder(null); // Reset editing order
  };
  const handleDeleteOrder = async (orderId, orderCode) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: `Bạn sẽ xóa vĩnh viễn đơn hàng "${orderCode}"!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Đồng ý, xóa!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const res = await apiDeletePurchaseOrder({ accessToken, id: orderId });
        if (res.code !== 200) {
          throw new Error(res.message || "Lỗi khi xóa đơn hàng.");
        } else {
          showToastSuccess(`Đã xóa đơn hàng ${orderCode}`);
          // Xóa item khỏi danh sách trên UI
          setPurchaseOrders((prev) =>
            prev.filter((order) => order.id !== orderId)
          );
        }
      } catch (error) {
        showToastError(error.message || "Lỗi khi xóa đơn hàng.");
      }
    }
  };
  const handleOpenCreateModal = () => {
    setEditingOrder(null); // Đảm bảo không có dữ liệu cũ -> chế độ Create
    setIsFormModalOpen(true);
  };
  const handleOpenEditModal = async (order) => {
    try {
      setIsFormModalOpen(true); // Mở modal trước khi fetch details
      const orderWithDetails = await handleFetchDetails(order.id);
      setEditingOrder({ ...order, ...orderWithDetails.details }); // Fallback về order gốc nếu không fetch được details
    } catch (error) {
      console.error("Error fetching order details:", error);
      setEditingOrder(order); // Fallback về order gốc nếu có lỗi
    }
  };
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (purchaseOrders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Chưa có đơn nhập hàng nào
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-4">
            Tạo đơn nhập hàng đầu tiên để bắt đầu quản lý việc nhập hàng từ nhà
            cung cấp
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Tạo đơn nhập hàng đầu tiên
          </button>
        </div>
      );
    }
    return (
      <>
        <PurchaseOrderList
          purchaseOrders={purchaseOrders}
          onFetchDetails={handleFetchDetails}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteOrder}
        />
        <Pagination
          currentPage={pagination.currentPage}
          totalPageCount={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </>
    );
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">
                  📦 Quản lý nhập hàng từ nhà cung cấp
                </h1>
                <p className="text-cyan-100 text-lg">
                  Theo dõi và xác nhận các đơn hàng nhập từ nhà cung cấp
                </p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="bg-white text-teal-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                Tạo đơn nhập hàng mới
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn, tên nhân viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <StatusFilterDropdown />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">{renderContent()}</div>
        </div>
      </div>

      <PurchaseOrderFormDialog
        isOpen={isFormModalOpen}
        setIsOpen={setIsFormModalOpen}
        editingOrder={editingOrder}
        onCreateSuccess={handleCreateSuccess}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </>
  );
};

export default PurchaseOrderManagement;

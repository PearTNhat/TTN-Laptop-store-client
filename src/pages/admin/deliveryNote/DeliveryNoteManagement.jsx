// src/pages/DeliveryNoteManagement/DeliveryNoteManagement.jsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { PlusCircle, Search } from "lucide-react";

import {
  apiGetDeliveryNotes,
  apiGetDeliveryNoteDetail,
  apiDeleteDeliveryNote,
} from "~/apis/deliveryNoteApi";
import { showToastError, showToastSuccess } from "~/utils/alert";
import DeliveryNoteList from "./components/DeliveryNoteList";
import DeliveryNoteFormDialog from "./components/DeliveryNoteFormDialog";
import StatusFilterDropdown from "./components/StatusFilterDropdown";
import LoadingSpinner from "~/components/loading/LoadingSpinner";
import Pagination from "~/components/pagination/Pagination";

const DeliveryNoteManagement = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );

  const fetchDeliveryNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentParams.page || 1,
        size: currentParams.size || 10,
        keyword: currentParams.q || null,
        status: currentParams.status || null,
      };
      const response = await apiGetDeliveryNotes({ accessToken, ...params });
      if (response.code !== 200)
        throw new Error(response.message || "Lỗi khi tải phiếu giao hàng");
      setDeliveryNotes(response.data.content || []);
      setPagination({
        currentPage: response.data.pageNumber + 1,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      showToastError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, currentParams]);

  useEffect(() => {
    fetchDeliveryNotes();
  }, [fetchDeliveryNotes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (searchTerm.trim()) {
          newParams.set("q", searchTerm.trim());
        } else {
          newParams.delete("q");
        }
        newParams.set("page", "1");
        return newParams;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, setSearchParams]);

  const handlePageChange = (page) =>
    setSearchParams((prev) => ({ ...Object.fromEntries(prev), page }));

  const handleOpenCreateModal = () => {
    setIsFormModalOpen(true);
  };

  const handleFetchDetails = useCallback(
    async (noteId) => {
      const note = deliveryNotes.find((dn) => dn.id === noteId);
      if (!note || note.deliveryNoteDetails) return note;
      setDeliveryNotes((prev) =>
        prev.map((dn) =>
          dn.id === noteId ? { ...dn, isLoadingDetails: true } : dn
        )
      );
      try {
        const response = await apiGetDeliveryNoteDetail({
          accessToken,
          id: noteId,
        });
        if (response.code !== 200) throw new Error(response.message);
        const updatedNote = {
          ...note,
          deliveryNoteDetails: response.data.deliveryNoteDetails,
          isLoadingDetails: false,
        };
        setDeliveryNotes((prev) =>
          prev.map((dn) => (dn.id === noteId ? updatedNote : dn))
        );
        return updatedNote;
      } catch (error) {
        showToastError(error.message);
        setDeliveryNotes((prev) =>
          prev.map((dn) =>
            dn.id === noteId ? { ...dn, isLoadingDetails: false } : dn
          )
        );
        return note;
      }
    },
    [accessToken, deliveryNotes]
  );

  const handleSuccess = () => {
    fetchDeliveryNotes();
  };

  const handleDeleteNote = async (noteId, noteCode) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa phiếu giao "${noteCode}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        const response = await apiDeleteDeliveryNote({
          accessToken,
          id: noteId,
        });
        if (response.code === 200) {
          showToastSuccess(`Đã xóa phiếu giao ${noteCode}`);
          fetchDeliveryNotes();
        } else {
          showToastError(response.message || "Không thể xóa phiếu giao");
        }
      } catch (error) {
        showToastError(error.message || "Lỗi khi xóa phiếu giao");
      }
    }
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (!deliveryNotes || deliveryNotes.length === 0)
      return (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
          <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Chưa có phiếu giao hàng nào
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            Tạo phiếu giao đầu tiên để bắt đầu quản lý việc giao hàng cho khách
            hàng
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Tạo phiếu giao đầu tiên
          </button>
        </div>
      );
    return (
      <>
        <DeliveryNoteList
          deliveryNotes={deliveryNotes}
          onFetchDetails={handleFetchDetails}
          onDelete={handleDeleteNote}
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">
                  📦 Quản lý Phiếu Giao Hàng
                </h1>
                <p className="text-green-100 text-lg">
                  Theo dõi và quản lý các phiếu giao hàng một cách hiệu quả
                </p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                Tạo phiếu giao mới
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
                  placeholder="Tìm kiếm theo mã đơn hàng, mã phiếu giao..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <StatusFilterDropdown />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">{renderContent()}</div>
        </div>
      </div>

      <DeliveryNoteFormDialog
        isOpen={isFormModalOpen}
        setIsOpen={setIsFormModalOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default DeliveryNoteManagement;

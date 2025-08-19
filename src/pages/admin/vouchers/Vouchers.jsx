import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaEye,
  FaGift,
  FaPercent,
  FaDollarSign,
  FaCalendarAlt,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  apiGetPromotions,
  apiCreatePromotion,
  apiDeletePromotion,
  apiGetPromotionDetail,
} from "~/apis/promotionApi";
import { useSearchParams } from "react-router-dom";
import { PromotionDetailModal, PromotionFormModal } from "./components";
import { showToastError, showToastSuccess } from "~/utils/alert";
import Pagination from "~/components/pagination/Pagination";
import { formatPrice } from "~/utils/helper";
import {
  getPromotionStatus,
  getPromotionTypeColor,
  getPromotionTypeIcon,
} from "./utils/helper";

const promotionTypes = [
  { value: "all", label: "Tất cả loại" },
  { value: "USER_PROMOTION", label: "Khuyến mãi người dùng" },
  { value: "PRODUCT_DISCOUNT", label: "Giảm giá sản phẩm" },
  { value: "GIFT", label: "Quà tặng" },
  { value: "SHOP_DISCOUNT", label: "Giảm giá cửa hàng" },
];

function Vouchers() {
  const { accessToken } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );

  // Modal states
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    promotion: null,
  });
  const [formModal, setFormModal] = useState({
    isOpen: false,
    promotion: null,
  });
  const [formLoading, setFormLoading] = useState(false);

  // Load promotions from API
  const loadPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentParams.page,
        size: 10,
        code: currentParams?.q?.trim(),
        promotionType: currentParams.promotionType,
        status: currentParams.status,
      };

      const response = await apiGetPromotions({ accessToken, params });

      if (response.code === 200) {
        setPromotions(response.data.content || []);
        setPagination({
          currentPage: response.data.pageNumber + 1,
          totalPages: response.data.totalPages,
        });
      } else {
        setPromotions([]);
        showToastError(response.message || "Không thể tải khuyến mãi");
      }
    } catch (error) {
      setPromotions([]);
      showToastError(
        error.message || "Có lỗi xảy ra khi tải danh sách khuyến mãi"
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, currentParams]);

  useEffect(() => {
    loadPromotions();
  }, [currentParams, loadPromotions]);

  // Handle search
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

  // Handle type filter
  const handleTypeFilter = (type) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (type === "all") {
        newParams.delete("promotionType");
      } else {
        newParams.set("page", "1");
        newParams.set("promotionType", type);
      }
      return newParams;
    });
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", page.toString());
      return newParams;
    });
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      const response = await apiCreatePromotion({
        accessToken,
        promotionData: formData,
      });

      if (response.code === 200) {
        setFormModal({ isOpen: false, promotion: null });
        loadPromotions();
        showToastSuccess("Khuyến mãi đã được tạo thành công");
      } else {
        if (response.message.includes("unique_code")) {
          Swal.fire("Lỗi", "Mã khuyến mãi đã tồn tại", "error");
        } else {
          Swal.fire("Lỗi", response.message || "Có lỗi xảy ra", "error");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Lỗi", "Có lỗi xảy ra khi xử lý yêu cầu", "error");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete promotion
  const handleDelete = async (promotion) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa khuyến mãi "${promotion.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const response = await apiDeletePromotion({
          accessToken,
          promotionId: promotion.id,
        });

        if (response.code === 200) {
          showToastSuccess("Khuyến mãi đã được xóa thành công.");
          loadPromotions();
        } else {
          showToastError(response.message || "Không thể xóa khuyến mãi");
        }
      } catch (error) {
        showToastError(error.message || "Có lỗi xảy ra khi xóa khuyến mãi");
      }
    }
  };
  const fetchPromotionDetail = async (promotionId) => {
    try {
      const response = await apiGetPromotionDetail({
        accessToken,
        promotionId,
        params: {},
      });

      if (response.code === 200) {
        setDetailModal((prev) => ({
          ...prev,
          promotion: {
            ...prev.promotion,
            detailData: response.data.content,
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching promotion detail:", error);
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getPromotionTypeText = (type) => {
    const typeObj = promotionTypes.find((t) => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const formatDiscount = (promotion) => {
    if (promotion.discountUnit === "PERCENT") {
      return `${promotion.discountValue}%`;
    } else {
      return formatPrice(promotion.discountValue);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6">
        {/* Modern Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FaGift className="text-white text-xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Quản lý khuyến mãi
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Tạo và quản lý các chương trình khuyến mãi, voucher giảm
                      giá
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-6">
                <button
                  onClick={() =>
                    setFormModal({ isOpen: true, promotion: null })
                  }
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FaPlus className="text-lg" />
                  <span className="font-semibold">Tạo voucher mới</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Modern Filter and Search Section */}
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
                  placeholder="Tìm kiếm voucher theo tên, mã..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={currentParams.promotionType || "all"}
                  onChange={(e) => handleTypeFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  {promotionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Mobile Create Button */}
              <button
                onClick={() => setFormModal({ isOpen: true, promotion: null })}
                className="lg:hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaPlus />
                Tạo voucher
              </button>
            </div>
          </div>
        </div>

        {/* Modern Vouchers Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaGift className="text-purple-500" />
                      Thông tin voucher
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaPercent className="text-green-500" />
                      Loại & Giá trị
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-blue-500" />
                      Sử dụng
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-orange-500" />
                      Thời gian
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                        <p className="text-gray-500 text-lg font-medium">
                          Đang tải voucher...
                        </p>
                        <p className="text-gray-400 text-sm">
                          Vui lòng chờ một chút
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : promotions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                          <FaGift className="text-purple-500 text-3xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          Chưa có voucher nào
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Tạo voucher đầu tiên để bắt đầu chương trình khuyến
                          mãi
                        </p>
                        <button
                          onClick={() =>
                            setFormModal({ isOpen: true, promotion: null })
                          }
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <FaPlus />
                          Tạo voucher đầu tiên
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  promotions.map((promotion) => {
                    const status = getPromotionStatus(promotion);
                    return (
                      <tr
                        key={promotion.id}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-gray-900">
                                {promotion.name}
                              </h3>
                            </div>
                            <div className="bg-gray-100 rounded px-2 py-1 inline-block mb-1">
                              <span className="font-mono text-xs font-bold text-gray-800">
                                {promotion.code}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {promotion.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getPromotionTypeColor(
                                promotion.promotionType
                              )}`}
                            >
                              {getPromotionTypeIcon(promotion.promotionType)}
                              {getPromotionTypeText(promotion.promotionType)}
                            </span>
                            <div className="flex items-center gap-1 text-sm font-semibold text-blue-600">
                              {promotion.discountUnit === "PERCENT" ? (
                                <FaPercent className="text-xs" />
                              ) : (
                                <FaDollarSign className="text-xs" />
                              )}
                              {formatDiscount(promotion)}
                            </div>
                            <p className="text-xs text-gray-600">
                              Tối thiểu: {formatPrice(promotion.minOrderValue)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1 text-center">
                            <p className="text-sm text-center font-medium text-gray-900">
                              {promotion.usageCount || 0}
                              {promotion?.usageLimit
                                ? `/${promotion.usageLimit}`
                                : promotion.usageLimit}
                            </p>
                            {promotion.usageLimit > 0 && (
                              <div className="w-full   bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-blue-600 h-1.5 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      (promotion.usageCount /
                                        promotion.usageLimit) *
                                        100,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <FaCalendarAlt />
                              <span>{formatDate(promotion.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <FaCalendarAlt />
                              <span>{formatDate(promotion.endDate)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}
                          >
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                setDetailModal({ isOpen: true, promotion });
                                await fetchPromotionDetail(promotion.id);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(promotion);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPageCount={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Modals */}
        <PromotionDetailModal
          isOpen={detailModal.isOpen}
          onClose={() => setDetailModal({ isOpen: false, promotion: null })}
          promotion={detailModal.promotion}
        />

        <PromotionFormModal
          isOpen={formModal.isOpen}
          onClose={() => setFormModal({ isOpen: false, promotion: null })}
          onSubmit={handleFormSubmit}
          isLoading={formLoading}
        />
      </div>
    </div>
  );
}

export default Vouchers;

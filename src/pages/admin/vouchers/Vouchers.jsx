import React, { useState, useEffect, useCallback } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaGift,
  FaUsers,
  FaBox,
  FaTag,
  FaPercent,
  FaDollarSign,
  FaCalendarAlt,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  apiGetPromotions,
  apiCreatePromotion,
  apiUpdatePromotion,
  apiDeletePromotion,
} from "~/apis/promotionApi";
import { PromotionDetailModal, PromotionFormModal } from "./components";

function Vouchers() {
  const { accessToken } = useSelector((state) => state.user);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

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

  const promotionsPerPage = 10;

  const promotionTypes = [
    { value: "", label: "Tất cả loại" },
    { value: "USER_PROMOTION", label: "Khuyến mãi người dùng" },
    { value: "PRODUCT_DISCOUNT", label: "Giảm giá sản phẩm" },
    { value: "GIFT", label: "Quà tặng" },
    { value: "SHOP_DISCOUNT", label: "Giảm giá cửa hàng" },
  ];

  // Load promotions from API
  const loadPromotions = useCallback(
    async (page = 0, search = "", type = "") => {
      setLoading(true);
      try {
        const params = {
          page,
          size: promotionsPerPage,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (type) {
          params.promotionType = type;
        }

        const response = await apiGetPromotions({ accessToken, params });

        if (response.success) {
          setPromotions(response.data.content || []);
          setTotalPages(response.data.totalPages || 0);
          setTotalElements(response.data.totalElements || 0);
        } else {
          setPromotions([]);
          Swal.fire(
            "Lỗi",
            response.message || "Không thể tải danh sách khuyến mãi",
            "error"
          );
        }
      } catch (error) {
        console.error("Error loading promotions:", error);
        setPromotions([]);
        Swal.fire("Lỗi", "Có lỗi xảy ra khi tải danh sách khuyến mãi", "error");
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    loadPromotions(currentPage, searchTerm, selectedType);
  }, [currentPage, searchTerm, selectedType, loadPromotions]);

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  // Handle type filter
  const handleTypeFilter = (type) => {
    setSelectedType(type);
    setCurrentPage(0);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      let response;
      if (formModal.promotion) {
        // Update existing promotion
        response = await apiUpdatePromotion({
          accessToken,
          promotionId: formModal.promotion.id,
          promotionData: formData,
        });
      } else {
        // Create new promotion
        response = await apiCreatePromotion({
          accessToken,
          promotionData: formData,
        });
      }

      if (response.success) {
        Swal.fire(
          "Thành công",
          formModal.promotion
            ? "Cập nhật khuyến mãi thành công"
            : "Tạo khuyến mãi thành công",
          "success"
        );
        setFormModal({ isOpen: false, promotion: null });
        loadPromotions(currentPage, searchTerm, selectedType);
      } else {
        Swal.fire("Lỗi", response.message || "Có lỗi xảy ra", "error");
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

        if (response.success) {
          Swal.fire("Đã xóa!", "Khuyến mãi đã được xóa thành công.", "success");
          loadPromotions(currentPage, searchTerm, selectedType);
        } else {
          Swal.fire(
            "Lỗi",
            response.message || "Không thể xóa khuyến mãi",
            "error"
          );
        }
      } catch (error) {
        console.error("Error deleting promotion:", error);
        Swal.fire("Lỗi", "Có lỗi xảy ra khi xóa khuyến mãi", "error");
      }
    }
  };

  // Utility functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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

  const getPromotionTypeIcon = (type) => {
    switch (type) {
      case "USER_PROMOTION":
        return <FaUsers className="text-blue-600" />;
      case "PRODUCT_DISCOUNT":
        return <FaBox className="text-green-600" />;
      case "GIFT":
        return <FaGift className="text-purple-600" />;
      case "SHOP_DISCOUNT":
        return <FaTag className="text-orange-600" />;
      default:
        return <FaGift className="text-gray-600" />;
    }
  };

  const getPromotionTypeColor = (type) => {
    switch (type) {
      case "USER_PROMOTION":
        return "bg-blue-100 text-blue-800";
      case "PRODUCT_DISCOUNT":
        return "bg-green-100 text-green-800";
      case "GIFT":
        return "bg-purple-100 text-purple-800";
      case "SHOP_DISCOUNT":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDiscount = (promotion) => {
    if (promotion.discountUnit === "PERCENT") {
      return `${promotion.discountValue}%`;
    } else {
      return formatPrice(promotion.discountValue);
    }
  };

  const getPromotionStatus = (promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (now < startDate) {
      return { text: "Chưa bắt đầu", color: "bg-blue-100 text-blue-800" };
    } else if (now > endDate) {
      return { text: "Đã hết hạn", color: "bg-red-100 text-red-800" };
    } else {
      return { text: "Đang hoạt động", color: "bg-green-100 text-green-800" };
    }
  };

  // Statistics
  const activePromotions = promotions.filter((p) => {
    const now = new Date();
    const startDate = new Date(p.startDate);
    const endDate = new Date(p.endDate);
    return now >= startDate && now <= endDate;
  }).length;

  const totalUsage = promotions.reduce(
    (sum, p) => sum + (p.usageCount || 0),
    0
  );
  const expiredPromotions = promotions.filter(
    (p) => new Date() > new Date(p.endDate)
  ).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý khuyến mãi
        </h1>
        <p className="text-gray-600">
          Quản lý các mã giảm giá và chương trình khuyến mãi
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">
                Tổng khuyến mãi
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalElements}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <FaGift className="text-xl text-blue-600" />
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
                {activePromotions}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <FaGift className="text-xl text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Lượt sử dụng</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsage}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <FaGift className="text-xl text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Đã hết hạn</p>
              <p className="text-2xl font-bold text-gray-900">
                {expiredPromotions}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <FaGift className="text-xl text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khuyến mãi..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => handleTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {promotionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setFormModal({ isOpen: true, promotion: null })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaPlus />
              Tạo khuyến mãi
            </button>
          </div>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin khuyến mãi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại & Giá trị
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sử dụng
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Không có khuyến mãi nào
                  </td>
                </tr>
              ) : (
                promotions.map((promotion) => {
                  const status = getPromotionStatus(promotion);
                  return (
                    <tr
                      key={promotion.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        setDetailModal({ isOpen: true, promotion })
                      }
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
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">
                            {promotion.usageCount || 0}/
                            {promotion.usageLimit === 0
                              ? "∞"
                              : promotion.usageLimit}
                          </p>
                          {promotion.usageLimit > 0 && (
                            <div className="w-20 bg-gray-200 rounded-full h-1.5">
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailModal({ isOpen: true, promotion });
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormModal({ isOpen: true, promotion });
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
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
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">
                    {currentPage * promotionsPerPage + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(
                      (currentPage + 1) * promotionsPerPage,
                      totalElements
                    )}
                  </span>{" "}
                  trong <span className="font-medium">{totalElements}</span> kết
                  quả
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage - 2 + i;
                  if (pageNum < 0 || pageNum >= totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages - 1, currentPage + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
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
        promotion={formModal.promotion}
        isLoading={formLoading}
      />
    </div>
  );
}

export default Vouchers;

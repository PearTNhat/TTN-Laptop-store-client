import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import {
  Award,
  Gift,
  DollarSign,
  ShoppingCart,
  Calendar,
  Percent,
  User,
  Hash,
} from "lucide-react";

const RankDetailDialog = ({ isOpen, setIsOpen, rank }) => {
  if (!rank) return null;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Chi tiết Rank Level
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về rank level và promotion đi kèm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Thông tin rank */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Thông tin Rank
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Tên Rank
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {rank.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Độ ưu tiên
                </label>
                <Badge
                  variant="outline"
                  className="text-blue-600 border-blue-300"
                >
                  {rank.priority}
                </Badge>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  Mô tả
                </label>
                <p className="text-gray-800">
                  {rank.description || "Không có mô tả"}
                </p>
              </div>
            </div>
          </div>

          {/* Điều kiện rank */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              Điều kiện đạt Rank
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Chi tiêu tối thiểu
                  </label>
                  <p className="text-lg font-semibold text-green-700">
                    {rank.minSpending > 0
                      ? formatCurrency(rank.minSpending)
                      : "Không yêu cầu"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Số đơn hàng tối thiểu
                  </label>
                  <p className="text-lg font-semibold text-green-700">
                    {rank.minOrder > 0
                      ? `${rank.minOrder} đơn`
                      : "Không yêu cầu"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin promotion */}
          {rank.promotion && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Promotion đi kèm
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Tên Promotion
                    </label>
                    <p className="text-lg font-semibold text-purple-900">
                      {rank.promotion.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      Mã Code
                    </label>
                    <p className="text-lg font-mono font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded">
                      {rank.promotion.code}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Mô tả
                  </label>
                  <p className="text-gray-800">
                    {rank.promotion.description || "Không có mô tả"}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center justify-center mb-2">
                      {rank.promotion.discountUnit === "PERCENT" ? (
                        <Percent className="h-6 w-6 text-purple-600" />
                      ) : (
                        <DollarSign className="h-6 w-6 text-purple-600" />
                      )}
                    </div>
                    <label className="text-xs font-medium text-gray-600">
                      Giá trị giảm
                    </label>
                    <p className="text-lg font-bold text-purple-700">
                      {rank.promotion.discountUnit === "PERCENT"
                        ? `${rank.promotion.discountValue}%`
                        : formatCurrency(rank.promotion.discountValue)}
                    </p>
                  </div>

                  <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center justify-center mb-2">
                      <ShoppingCart className="h-6 w-6 text-purple-600" />
                    </div>
                    <label className="text-xs font-medium text-gray-600">
                      Đơn hàng tối thiểu
                    </label>
                    <p className="text-lg font-bold text-purple-700">
                      {rank.promotion.minOrderValue > 0
                        ? formatCurrency(rank.promotion.minOrderValue)
                        : "Không yêu cầu"}
                    </p>
                  </div>

                  <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                    <label className="text-xs font-medium text-gray-600">
                      Giảm tối đa
                    </label>
                    <p className="text-lg font-bold text-purple-700">
                      {rank.promotion.maxDiscountValue > 0
                        ? formatCurrency(rank.promotion.maxDiscountValue)
                        : "Không giới hạn"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Số lần sử dụng
                    </label>
                    <p className="text-gray-800">
                      <span className="font-semibold">
                        {rank.promotion.usageCount}
                      </span>
                      {" / "}
                      <span className="text-gray-500">
                        {rank.promotion.usageLimit > 0
                          ? rank.promotion.usageLimit
                          : "Không giới hạn"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Loại promotion
                    </label>
                    <Badge
                      variant="outline"
                      className="text-purple-600 border-purple-300"
                    >
                      {rank.promotion.promotionType}
                    </Badge>
                  </div>
                </div>

                {rank.promotion.startDate && rank.promotion.endDate && (
                  <div className="p-3 bg-white rounded-lg border border-purple-200">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1 mb-2">
                      <Calendar className="h-4 w-4" />
                      Thời gian hiệu lực
                    </label>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Từ: </span>
                        <span className="font-medium">
                          {formatDate(rank.promotion.startDate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Đến: </span>
                        <span className="font-medium">
                          {formatDate(rank.promotion.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {rank.promotion.userId && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>
                      Được tạo bởi:{" "}
                      <span className="font-medium">
                        {rank.promotion.username}
                      </span>
                    </span>
                  </div>
                )}

                {rank.promotion.createdAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Ngày tạo: {formatDateTime(rank.promotion.createdAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RankDetailDialog;

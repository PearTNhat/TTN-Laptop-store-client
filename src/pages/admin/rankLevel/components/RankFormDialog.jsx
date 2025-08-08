import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Plus, Save, Award } from "lucide-react";
import { apiGetPromotions } from "~/apis/promotionApi";
import { apiCreateRank, apiUpdateRank } from "~/apis/rankApi";
import { showToastSuccess, showToastError } from "~/utils/alert";

const RankFormDialog = ({ isOpen, setIsOpen, editingRank, onSuccess }) => {
  const { accessToken } = useSelector((state) => state.user);
  const [promotions, setPromotions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minSpending: 0,
    minOrder: 0,
    priority: 0,
    active: true,
    promotionId: "",
  });

  const isEditing = !!editingRank;

  // Load promotions từ API
  const loadPromotions = async () => {
    setLoadingPromotions(true);
    try {
      const response = await apiGetPromotions({
        accessToken,
        params: {
          page: 1,
          size: 100,
          code: "",
          promotionType: "GIFT",
          status: "ACTIVE",
        },
      });
      if (response.code === 200) {
        setPromotions(response.data?.content || []);
      }
    } catch (error) {
      console.error("Error loading promotions:", error);
      showToastError("Lỗi khi tải danh sách promotions");
    } finally {
      setLoadingPromotions(false);
    }
  };

  // Effect để load promotions khi dialog mở
  useEffect(() => {
    if (isOpen) {
      loadPromotions();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect để set data khi editing
  useEffect(() => {
    if (isOpen && editingRank) {
      setFormData({
        name: editingRank.name || "",
        description: editingRank.description || "",
        minSpending: editingRank.minSpending || 0,
        minOrder: editingRank.minOrder || 0,
        priority: editingRank.priority || 0,
        active: editingRank.active !== undefined ? editingRank.active : true,
        promotionId: editingRank.promotion?.id?.toString() || "",
      });
    } else if (isOpen && !editingRank) {
      resetForm();
    }
  }, [isOpen, editingRank]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      minSpending: 0,
      minOrder: 0,
      priority: 0,
      active: true,
      promotionId: "",
    });
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToastError("Vui lòng nhập tên rank");
      return;
    }

    if (!formData.promotionId) {
      showToastError("Vui lòng chọn promotion");
      return;
    }

    setIsSubmitting(true);
    try {
      const rankData = {
        ...formData,
        promotionId: parseInt(formData.promotionId),
      };

      let response;
      if (isEditing) {
        response = await apiUpdateRank({
          accessToken,
          rankId: editingRank.id,
          rankData,
        });
      } else {
        response = await apiCreateRank({ accessToken, rankData });
      }

      if (response.code === 200) {
        showToastSuccess(
          isEditing ? "Cập nhật rank thành công!" : "Tạo rank thành công!"
        );
        setIsOpen(false);
        resetForm();
        onSuccess();
      } else {
        if (response.message.includes("uq_rank_active_priority")) {
          showToastError(
            "Độ ưu tiên của rank đang hoạt động không được trùng lặp"
          );
        } else if (response.message.includes("already exists")) {
          showToastError("Promotion id đã được sử dụng ở rank khác");
        } else {
          showToastError(
            response.message ||
              (isEditing ? "Lỗi khi cập nhật rank" : "Lỗi khi tạo rank")
          );
        }
      }
    } catch (error) {
      showToastError(error.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý đóng dialog
  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
      resetForm();
    }
  };

  // Format currency để hiển thị trong select
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            {isEditing ? "Chỉnh sửa Rank Level" : "Tạo Rank Level Mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin rank level và promotion đi kèm"
              : "Tạo rank level mới với các thông tin cơ bản và promotion đi kèm"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên Rank <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Thành viên Vàng"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Độ ưu tiên</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="1, 2, 3..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              placeholder="Mô tả về rank level này..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSpending">Chi tiêu tối thiểu (VNĐ)</Label>
              <Input
                id="minSpending"
                type="number"
                value={formData.minSpending}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minSpending: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minOrder">Số đơn hàng tối thiểu</Label>
              <Input
                id="minOrder"
                type="number"
                value={formData.minOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minOrder: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promotionId">
              Promotion <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.promotionId}
              onValueChange={(value) =>
                setFormData({ ...formData, promotionId: value })
              }
              disabled={loadingPromotions}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingPromotions
                      ? "Đang tải promotions..."
                      : "Chọn promotion..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {promotions.map((promotion) => (
                  <SelectItem
                    key={promotion.id}
                    value={promotion.id.toString()}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{promotion.name}</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {promotion.promotionType}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {promotion.code} |
                        {promotion.discountUnit === "PERCENT"
                          ? ` ${promotion.discountValue}%`
                          : ` ${formatCurrency(promotion.discountValue)}`}
                        {promotion.minOrderValue > 0 &&
                          ` | Tối thiểu ${formatCurrency(
                            promotion.minOrderValue
                          )}`}
                        {promotion.maxDiscountValue > 0 &&
                          ` | Tối đa ${formatCurrency(
                            promotion.maxDiscountValue
                          )}`}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, active: checked })
              }
            />
            <Label htmlFor="active">Kích hoạt</Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || loadingPromotions}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {isEditing ? "Đang cập nhật..." : "Đang tạo..."}
              </>
            ) : (
              <>
                {isEditing ? (
                  <Save className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {isEditing ? "Cập nhật" : "Tạo Rank"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RankFormDialog;

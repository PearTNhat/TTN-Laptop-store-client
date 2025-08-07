import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Plus, Award } from "lucide-react";
import { apiListRank, apiDeleteRank } from "~/apis/rankApi";
import {
  showToastSuccess,
  showToastError,
  showToastConfirm,
} from "~/utils/alert";
import RankTable from "./components/RankTable";
import RankFormDialog from "./components/RankFormDialog";
import RankDetailDialog from "./components/RankDetailDialog";

function RankLevelMangement() {
  const { accessToken } = useSelector((state) => state.user);
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingRank, setEditingRank] = useState(null);
  const [viewingRank, setViewingRank] = useState(null);

  // Load danh sách ranks
  const loadRanks = async () => {
    setLoading(true);
    try {
      const response = await apiListRank({ accessToken });
      if (response.code === 200) {
        setRanks(response.data || []);
      } else {
        showToastError(response.message || "Lỗi khi tải danh sách rank");
      }
    } catch (error) {
      showToastError(error.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRanks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Xử lý tạo rank mới
  const handleCreateRank = () => {
    setEditingRank(null);
    setIsFormDialogOpen(true);
  };

  // Xử lý xem chi tiết rank
  const handleViewRank = (rank) => {
    setViewingRank(rank);
    setIsDetailDialogOpen(true);
  };

  // Xử lý chỉnh sửa rank
  const handleEditRank = (rank) => {
    setEditingRank(rank);
    setIsFormDialogOpen(true);
  };

  // Xử lý xóa rank
  const handleDeleteRank = async (id, name) => {
    const confirmed = await showToastConfirm(
      `Bạn có chắc muốn xóa rank "${name}"?`
    );

    if (confirmed) {
      try {
        const response = await apiDeleteRank({ accessToken, id });
        if (response.code === 200) {
          showToastSuccess("Xóa rank thành công!");
          loadRanks();
        } else {
          showToastError(response.message || "Lỗi khi xóa rank");
        }
      } catch (error) {
        showToastError(error.message || "Có lỗi xảy ra");
      }
    }
  };

  // Xử lý sau khi form submit thành công
  const handleFormSuccess = () => {
    loadRanks();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl text-gray-900">
                Quản lý Rank Level
              </CardTitle>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleCreateRank}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm Rank
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <RankTable
              ranks={ranks}
              onView={handleViewRank}
              onEdit={handleEditRank}
              onDelete={handleDeleteRank}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          )}
        </CardContent>
      </Card>

      {/* Form Dialog cho tạo/sửa */}
      <RankFormDialog
        isOpen={isFormDialogOpen}
        setIsOpen={setIsFormDialogOpen}
        editingRank={editingRank}
        onSuccess={handleFormSuccess}
      />

      {/* Detail Dialog cho xem chi tiết */}
      <RankDetailDialog
        isOpen={isDetailDialogOpen}
        setIsOpen={setIsDetailDialogOpen}
        rank={viewingRank}
      />
    </div>
  );
}

export default RankLevelMangement;

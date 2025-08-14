import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Award,
  Gift,
  DollarSign,
  ShoppingCart,
  Calendar,
  Percent,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

const RankTable = ({
  ranks,
  onView,
  onEdit,
  onDelete,
  formatCurrency,
  formatDate,
}) => {
  if (!ranks || ranks.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chưa có rank nào
        </h3>
        <p className="text-gray-500 mb-4">
          Tạo rank level đầu tiên cho hệ thống
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Rank</TableHead>
            <TableHead className="font-semibold">Điều kiện</TableHead>
            <TableHead className="font-semibold">Promotion</TableHead>
            <TableHead className="font-semibold">Ưu tiên</TableHead>
            <TableHead className="text-center font-semibold">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ranks.map((rank) => (
            <TableRow
              key={rank.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onView(rank)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{rank.name}</span>
                  <span className="text-sm text-gray-500 line-clamp-2">
                    {rank.description}
                  </span>
                </div>
              </TableCell>

              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="space-y-1 text-sm">
                  {rank.minSpending > 0 && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      <span>Chi tiêu: {formatCurrency(rank.minSpending)}</span>
                    </div>
                  )}
                  {rank.minOrder > 0 && (
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3 text-blue-600" />
                      <span>Đơn hàng: {rank.minOrder}</span>
                    </div>
                  )}
                  {rank.minSpending === 0 && rank.minOrder === 0 && (
                    <span className="text-gray-400 text-xs">
                      Không có điều kiện
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell onClick={(e) => e.stopPropagation()}>
                {rank.promotion ? (
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-1">
                      <Gift className="h-3 w-3 text-purple-600" />
                      <span className="font-medium text-sm line-clamp-1">
                        {rank.promotion.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 font-mono">
                      {rank.promotion.code}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {rank.promotion.discountUnit === "PERCENT" ? (
                        <div className="flex items-center gap-1">
                          <Percent className="h-3 w-3" />
                          <span>{rank.promotion.discountValue}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>
                            {formatCurrency(rank.promotion.discountValue)}
                          </span>
                        </div>
                      )}
                      {rank.promotion.minOrderValue > 0 && (
                        <span>
                          | Tối thiểu{" "}
                          {formatCurrency(rank.promotion.minOrderValue)}
                        </span>
                      )}
                    </div>
                    {rank.promotion.startDate && rank.promotion.endDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDate(rank.promotion.startDate)} -{" "}
                          {formatDate(rank.promotion.endDate)}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">
                    Không có promotion
                  </span>
                )}
              </TableCell>

              <TableCell onClick={(e) => e.stopPropagation()}>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {rank.priority}
                </span>
              </TableCell>

              <TableCell
                className="text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(rank);
                    }}
                    className="text-blue-600 hover:bg-blue-100"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(rank);
                    }}
                    className="text-green-600 hover:bg-green-100"
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(rank.id, rank.name);
                    }}
                    className="text-red-600 hover:bg-red-100"
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RankTable;

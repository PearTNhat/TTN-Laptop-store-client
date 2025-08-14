// src/pages/PurchaseOrderManagement/components/StatusFilterDropdown.jsx

import React from "react";
import { useSearchParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { ListFilter, ChevronDown } from "lucide-react";

const STATUS_OPTIONS = [
  {
    value: "PENDING",
    label: "Chờ xử lý",
    color: "text-yellow-600 bg-yellow-100",
  },
  {
    value: "COMPLETED",
    label: "Hoàn thành",
    color: "text-green-600 bg-green-100",
  },
  {
    value: "PARTIALLY_RECEIVED",
    label: "Nhận một phần",
    color: "text-blue-600 bg-blue-100",
  },
  { value: "CANCELLED", label: "Đã hủy", color: "text-red-600 bg-red-100" },
];

const StatusFilterDropdown = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "";

  const handleStatusChange = (status) => {
    setSearchParams((prev) => {
      if (status) {
        prev.set("status", status);
        prev.set("page", "1");
      } else {
        prev.delete("status");
      }
      return prev;
    });
  };

  const currentStatusOption = STATUS_OPTIONS.find(
    (s) => s.value === currentStatus
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 min-w-[180px] justify-between bg-white hover:bg-gray-50 border-gray-300"
        >
          <div className="flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">
              {currentStatusOption ? (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${currentStatusOption.color}`}
                >
                  {currentStatusOption.label}
                </span>
              ) : (
                "Tất cả trạng thái"
              )}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuRadioGroup
          value={currentStatus}
          onValueChange={handleStatusChange}
        >
          <DropdownMenuRadioItem value="" className="cursor-pointer">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              Tất cả trạng thái
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuSeparator />
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    option.color.split(" ")[0] === "text-yellow-600"
                      ? "bg-yellow-400"
                      : option.color.split(" ")[0] === "text-green-600"
                      ? "bg-green-400"
                      : option.color.split(" ")[0] === "text-blue-600"
                      ? "bg-blue-400"
                      : "bg-red-400"
                  }`}
                ></div>
                {option.label}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusFilterDropdown;

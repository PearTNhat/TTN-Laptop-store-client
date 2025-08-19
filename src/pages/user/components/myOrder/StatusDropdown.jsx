import { useState } from "react";
import { statusDisplayMap, statusIcons, statusBadges } from "./OrderStatus";
import { List } from "lucide-react"; // icon riêng cho "Tất cả"

const StatusDropdown = ({ filterStatus, setFilterStatus }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Trạng thái từ API
  const apiStatusList = [
    "PENDING",
    "AWAITING",
    "PROCESSING",
    "DELIVERED",
    "COMPLETED",
    "CANCELED",
  ];

  // Thêm option "ALL" riêng ở frontend
  const allOption = {
    code: "ALL",
    label: "Tất cả trạng thái",
    icon: <List className="w-4 h-4" />,
    badge: "bg-blue-100 text-blue-700 font-medium",
  };

  // Merge lại thành 1 list chung
  const dropdownOptions = [
    allOption,
    ...apiStatusList.map((code) => ({
      code,
      label: statusDisplayMap[code],
      icon: statusIcons[code],
      badge: statusBadges[code],
    })),
  ];

  return (
    <div className="relative inline-block text-left">
      {/* Nút chính */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-md transition ${
          filterStatus
            ? statusBadges[filterStatus]
            : allOption.badge // dùng style của "Tất cả" khi filterStatus rỗng
        }`}
      >
        {filterStatus ? statusIcons[filterStatus] : allOption.icon}
        <span>
          {filterStatus ? statusDisplayMap[filterStatus] : allOption.label}
        </span>

        <svg
          className={`w-4 h-4 ml-2 transform transition ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Menu */}
      {isOpen && (
        <div className="absolute mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-2">
            {dropdownOptions.map((opt) => (
              <div
                key={opt.code}
                onClick={() => {
                  setFilterStatus(opt.code === "ALL" ? "" : opt.code);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:opacity-80 rounded-lg ${opt.badge}`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;

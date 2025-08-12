// src/components/users/UserTableRow.js
import React from "react";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaLock,
  FaLockOpen,
  FaUser,
  FaUserTie,
  FaUserCog,
  FaShieldAlt,
} from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { getStatusColor, getRoleColor } from "../utils/styleHelpers";

const UserTableRow = ({ user, onView, onEdit, onDelete }) => {
  // --- Chuẩn hóa dữ liệu từ API ---
  const fullName = `${user.lastName || ""} ${user.firstName || ""}`.trim();
  const email = user.email || "Chưa cập nhật";
  const phoneNumber = user.phoneNumber || "Chưa cập nhật";
  const role = user.roles?.[0]?.id;
  
  

  const displayRole = role;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Cột thông tin người dùng */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-11 w-11 flex-shrink-0">
            {user.avatar ? (
              <img
                className="h-11 w-11 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                src={user.avatar}
                alt="Avatar"
              />
            ) : (
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-sm">
                {role === "ADMIN" ? (
                  <FaShieldAlt className="text-white text-lg" />
                ) : role === "MANAGER" ? (
                  <FaUserTie className="text-white text-lg" />
                ) : role === "MODERATOR" ? (
                  <FaUserCog className="text-white text-lg" />
                ) : (
                  <FaUser className="text-white text-lg" />
                )}
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{fullName}</div>
            <div className="text-gray-500 text-sm">{email}</div>  
          </div>
        </div>
      </td>

      {/* Cột vai trò */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2.5 py-1 font-semibold leading-tight rounded-full text-xs ${getRoleColor(
            role
          )}`}
        >
          {displayRole}
        </span>
      </td>

      {/* Cột hành động */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center gap-2">
          {/* View */}
          <button
            onClick={() => onView(user)}
            className="group relative inline-flex items-center justify-center w-9 h-9 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 hover:from-blue-600 hover:to-cyan-600"
            title="Xem chi tiết"
          >
            <FaEye className="text-sm" />
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Xem chi tiết
            </span>
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(user)}
            className="group relative inline-flex items-center justify-center w-9 h-9 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 hover:from-emerald-600 hover:to-teal-600"
            title="Chỉnh sửa"
          >
            <FaEdit className="text-sm" />
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Chỉnh sửa
            </span>
          </button>
          {/* Delete */}
          <button
            onClick={() => onDelete(user)}
            className="group relative inline-flex items-center justify-center w-9 h-9 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 hover:from-red-600 hover:to-pink-600"
            title="Xóa người dùng"
          >
            <FaTrash className="text-sm" />
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Xóa
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
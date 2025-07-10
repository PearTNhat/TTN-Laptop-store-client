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

const UserTableRow = ({ user, onView, onEdit, onBlock, onDelete }) => (
  <tr className="hover:bg-gray-50 transition-colors">
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
              {user.role === "Admin" ? (
                <FaShieldAlt className="text-white text-lg" />
              ) : user.role === "Manager" ? (
                <FaUserTie className="text-white text-lg" />
              ) : user.role === "Moderator" ? (
                <FaUserCog className="text-white text-lg" />
              ) : (
                <FaUser className="text-white text-lg" />
              )}
            </div>
          )}
        </div>
        <div className="ml-4">
          <div className="font-medium text-gray-900">
            {user.last_name} {user.first_name}
          </div>
          <div className="text-gray-500">{user.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`px-2.5 py-1 font-semibold leading-tight rounded-full text-xs ${getRoleColor(
          user.role
        )}`}
      >
        {user.role}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`px-2.5 py-1 font-semibold leading-tight rounded-full text-xs ${getStatusColor(
          user.blocked
        )}`}
      >
        {user.blocked ? "Tạm khóa" : "Hoạt động"}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
      {user.joinDate}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <div className="flex items-center justify-center gap-2">
        {/* View Button */}
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

        {/* Edit Button */}
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

        {/* Block/Unblock Button */}
        <button
          onClick={() => onBlock(user)}
          className={`group relative inline-flex items-center justify-center w-9 h-9 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 ${
            user.blocked
              ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          }`}
          title={user.blocked ? "Mở khóa" : "Khóa tài khoản"}
        >
          {user.blocked ? (
            <FaLockOpen className="text-sm" />
          ) : (
            <FaLock className="text-sm" />
          )}
          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {user.blocked ? "Mở khóa" : "Khóa tài khoản"}
          </span>
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(user)}
          className="group relative inline-flex items-center justify-center w-9 h-9 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 hover:from-red-600 hover:to-rose-600"
          title="Xóa người dùng"
        >
          <FaTrash className="text-sm" />
          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Xóa người dùng
          </span>
        </button>
      </div>
    </td>
  </tr>
);

export default UserTableRow;

// src/components/users/modals/ViewUserModal.js
import React from "react";
import { FaTimes, FaUser } from "react-icons/fa";
import { getStatusColor, getRoleColor } from "../utils/styleHelpers";

const ViewUserModal = ({ user, onClose }) => (
  <div className="p-6">
    <div className="flex justify-between items-start mb-4">
      <h2 className="text-2xl font-bold text-gray-800">Chi tiết người dùng</h2>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <FaTimes size={20} />
      </button>
    </div>
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {user.avatar ? (
          <img
            className="h-20 w-20 rounded-full object-cover"
            src={user.avatar}
            alt="Avatar"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
            <FaUser size={40} className="text-gray-500" />
          </div>
        )}
        <div>
          <p className="text-xl font-semibold text-gray-900">
            {user.last_name} {user.first_name}
          </p>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <strong className="text-gray-600">Số điện thoại:</strong>{" "}
          <p className="text-gray-800">{user.phone_number}</p>
        </div>
        <div>
          <strong className="text-gray-600">Ngày sinh:</strong>{" "}
          <p className="text-gray-800">{user.dob}</p>
        </div>
        <div>
          <strong className="text-gray-600">Giới tính:</strong>{" "}
          <p className="text-gray-800">{user.gender}</p>
        </div>
        <div>
          <strong className="text-gray-600">Ngày tham gia:</strong>{" "}
          <p className="text-gray-800">{user.joinDate}</p>
        </div>
        <div>
          <strong className="text-gray-600">Vai trò:</strong>{" "}
          <span
            className={`px-2 py-0.5 font-semibold leading-tight rounded-full text-xs ${getRoleColor(
              user.role
            )}`}
          >
            {user.role}
          </span>
        </div>
        <div>
          <strong className="text-gray-600">Trạng thái:</strong>{" "}
          <span
            className={`px-2 py-0.5 font-semibold leading-tight rounded-full text-xs ${getStatusColor(
              user.blocked
            )}`}
          >
            {user.blocked ? "Tạm khóa" : "Hoạt động"}
          </span>
        </div>
      </div>
    </div>
    <div className="mt-6 flex justify-end">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
      >
        Đóng
      </button>
    </div>
  </div>
);

export default ViewUserModal;

// src/components/users/UserTable.js
import React from "react";
import {
  FaUsers,
  FaUserShield,
  FaCircle,
  FaCalendarAlt,
  FaCogs,
} from "react-icons/fa";
import UserTableRow from "./UserTableRow";

const UserTable = ({ users, isLoading, onView, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <FaUsers className="text-blue-500" />
                Người dùng
              </div>
            </th>
            <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <FaUserShield className="text-purple-500" />
                Vai trò
              </div>
            </th>
            <th className="px-6 py-4 text-center font-semibold text-gray-700 uppercase tracking-wider">
              <div className="flex items-center justify-center gap-2">
                <FaCogs className="text-gray-600" />
                Thao tác
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan="3" className="px-6 py-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="text-gray-500">Đang tải...</span>
                </div>
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-6 py-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <FaUsers className="text-gray-400 text-3xl" />
                  <span className="text-gray-500">Không có người dùng nào</span>
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default UserTable;

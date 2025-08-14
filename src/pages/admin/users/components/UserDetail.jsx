// src/components/users/modals/UserDetail.js

import React from "react";
import {
  HiOutlineX,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineStar,
  HiOutlineCalendar,
  HiOutlineIdentification,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { getStatusColor, getRoleColor } from "../utils/styleHelpers";

const UserDetail = ({ user, onClose }) => {
  const fullName = `${user.lastName || ""} ${user.firstName || ""}`.trim();
  const roleId = user.roles?.[0]?.id || "CUSTOMER";
  const phoneNumber= user.phoneNumber
 
  const displayRole = roleId;
  const defaultAddress =
    user.address?.find((addr) => addr.default) || user.address?.[0];

  return (
    <div className="p-6 max-w-2xl bg-white rounded-xl shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
          <HiOutlineIdentification size={24} className="text-blue-500" />
          Chi tiết người dùng
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Đóng"
        >
          <HiOutlineX size={26} />
        </button>
      </div>

      {/* Avatar + Basic Info */}
      <div className="flex items-center space-x-5 mb-6">
        {user.avatar ? (
          <img
            className="h-24 w-24 rounded-full object-cover border-4 border-blue-300 shadow-md"
            src={user.avatar}
            alt="Avatar"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <HiOutlineUser size={48} className="text-white" />
          </div>
        )}
        <div className="space-y-1">
          <p className="text-xl font-bold text-gray-900">{fullName}</p>
          <p className="text-gray-600 flex items-center gap-1">
            <HiOutlineMail size={16} /> {user.email || "Chưa cập nhật email"}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <HiOutlinePhone size={14} /> {user.phoneNumber || "Chưa cập nhật SĐT"}
          </p>
        </div>
      </div>

      {/* Detailed Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <InfoRow
          icon={<HiOutlineCalendar size={18} className="text-blue-500" />}
          label="Ngày sinh"
          value={user.dob}
        />
        <InfoRow
          icon={<HiOutlineUser size={18} className="text-pink-500" />}
          label="Giới tính"
          value={user.gender}
        />
        <InfoRow
          icon={<HiOutlineShieldCheck size={18} className="text-green-500" />}
          label="Vai trò"
          value={
            <span
              className={`px-2 py-1 font-semibold text-xs rounded-full ${getRoleColor(
                roleId
              )}`}
            >
              {displayRole}
            </span>
          }
        />
        <InfoRow
          icon={<HiOutlinePhone size={18} className="text-yellow-500" />}
          label="Số điện thoại"
          value={user.phoneNumber || "Chưa cập nhật"}
        />


        {/* Address */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineLocationMarker size={20} className="text-red-500" />
            <strong className="text-gray-700 text-base">Địa chỉ:</strong>
          </div>

          {defaultAddress ? (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm space-y-3">
              {/* Địa chỉ chính */}
              <div className="flex items-start gap-3">
                <HiOutlineLocationMarker className="text-red-500 mt-1" size={18} />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{defaultAddress.address}</p>
                  {defaultAddress.default && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                      Mặc định
                    </span>
                  )}
                </div>
              </div>

              {/* Người nhận & SĐT cùng dòng */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700 pl-6">
                {defaultAddress.recipient && (
                  <div className="flex items-center gap-2">
                    <HiOutlineUser size={16} className="text-blue-500" />
                    <span className="font-semibold">Người nhận:</span>
                    <span>{defaultAddress.recipient}</span>
                  </div>
                )}
                {defaultAddress.phone && (
                  <div className="flex items-center gap-2">
                    <HiOutlinePhone size={16} className="text-green-500" />
                    <span className="font-semibold">SĐT người nhận:</span>
                    <span>{defaultAddress.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-1">Chưa có địa chỉ</p>
          )}
        </div>
      </div> 
      {/* Close Button */}
      <div className="w-full mt-8 flex justify-center">
        <button
          onClick={onClose}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
        >
          Đóng
        </button>
      </div>
    </div> // đóng thẻ chính
  );
};



// Helper component
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <div className="text-blue-500 flex-shrink-0">{icon}</div>
    <div className="flex items-center flex-wrap w-full gap-1">
      <strong className="text-gray-600 min-w-[90px]">{label}:</strong>
      <span className="text-gray-800 break-words">{value || "Chưa cập nhật"}</span>
    </div>
  </div>
);

export default UserDetail;
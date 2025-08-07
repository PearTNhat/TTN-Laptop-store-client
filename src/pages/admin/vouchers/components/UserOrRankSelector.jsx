import React from "react";
import { FaUser, FaCrown, FaExchangeAlt } from "react-icons/fa";

const UserOrRankSelector = ({
  selectedUsers,
  selectedRanks,
  onClearUsers,
  onClearRanks,
}) => {
  const hasUsers = selectedUsers.length > 0;
  const hasRanks = selectedRanks.length > 0;

  if (!hasUsers && !hasRanks) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaUser className="text-blue-600 text-xl" />
            </div>
            <div className="text-blue-400">
              <FaExchangeAlt className="text-2xl" />
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaCrown className="text-yellow-600 text-xl" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Chọn đối tượng áp dụng
          </h3>
          <p className="text-blue-600 text-sm">
            Bạn có thể chọn <strong>người dùng cụ thể</strong> hoặc{" "}
            <strong>hạng khách hàng</strong>
          </p>
          <p className="text-blue-500 text-xs mt-2">
            💡 Chỉ có thể chọn 1 trong 2 loại
          </p>
        </div>
      </div>
    );
  }

  if (hasUsers) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <FaUser className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800">
                Đã chọn người dùng cụ thể
              </h4>
              <p className="text-blue-600 text-sm">
                {selectedUsers.length} người dùng được chọn
              </p>
            </div>
          </div>
          <button
            onClick={onClearUsers}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
          >
            Chuyển sang hạng khách hàng
          </button>
        </div>
      </div>
    );
  }

  if (hasRanks) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <FaCrown className="text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800">
                Đã chọn hạng khách hàng
              </h4>
              <p className="text-yellow-600 text-sm">
                {selectedRanks.length} hạng được chọn
              </p>
            </div>
          </div>
          <button
            onClick={onClearRanks}
            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-yellow-100 transition-colors"
          >
            Chuyển sang người dùng cụ thể
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default UserOrRankSelector;

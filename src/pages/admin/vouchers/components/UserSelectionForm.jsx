import React from "react";
import { FaSearch, FaUser } from "react-icons/fa";

const UserSelectionForm = ({
  users,
  selectedUsers,
  userSearch,
  userLoading,
  onUserSearch,
  onToggleUserSelection,
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
        <FaUser />
        Chọn khách hàng áp dụng
      </h3>

      {/* Search input */}
      <div className="relative mb-4">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={userSearch}
          onChange={onUserSearch}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Tìm kiếm khách hàng theo tên hoặc email..."
        />
      </div>

      {/* Users list */}
      <div className="border border-gray-300 rounded-lg max-h-[400px] overflow-y-auto bg-white">
        {userLoading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Đang tải danh sách khách hàng...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaUser className="mx-auto mb-3 text-3xl text-gray-300" />
            Không có khách hàng nào
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-4 hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.some((u) => u.id === user.id)}
                  onChange={() => onToggleUserSelection(user.id)}
                  className="mr-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                <div className="flex items-center flex-1">
                  {/* User avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200 flex items-center justify-center border border-gray-200">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                        <FaUser className="text-blue-600 text-lg" />
                      </div>
                    )}
                  </div>

                  {/* User info */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">ID: {user.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected count */}
      {selectedUsers.length > 0 && (
        <div className="mt-3 text-sm text-blue-700 bg-blue-100 rounded-md p-2">
          ✅ Đã chọn: {selectedUsers.length} khách hàng
        </div>
      )}
    </div>
  );
};

export default UserSelectionForm;

import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaStickyNote } from "react-icons/fa";

const CustomerInfo = ({ selectedShippingInfo, userInfo, setUserInfo }) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing && selectedShippingInfo?.phone) {
      setUserInfo((prev) => ({ ...prev, phone: selectedShippingInfo.phone }));
    }
  }, [selectedShippingInfo, isEditing, setUserInfo]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaStickyNote className="text-orange-600" />
          Ghi chú đơn hàng
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isEditing
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isEditing ? <FaSave /> : <FaEdit />}
          {isEditing ? "Lưu" : "Chỉnh sửa"}
        </button>
      </div>

      {isEditing ? (
        <textarea
          value={userInfo.note || ""}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, note: e.target.value }))
          }
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] resize-none"
          placeholder="Nhập ghi chú cho đơn hàng (tùy chọn)..."
        />
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg border min-h-[120px] flex items-center">
          <p className="text-gray-700 italic">
            {userInfo.note || "Chưa có ghi chú nào được thêm."}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerInfo;

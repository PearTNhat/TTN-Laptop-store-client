import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaCheckCircle,
  FaRegCircle,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaPlus,
  FaTrash,
  FaPencilAlt, // Thêm icon bút chì
} from "react-icons/fa";
import { useSelector } from "react-redux";

const ShippingAddress = ({ setSelectedShippingInfo }) => {
  // --- State quản lý UI ---
  const { addresses } = useSelector((state) => state.address);
  const [localAddresses, setLocalAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [viewMode, setViewMode] = useState("LIST"); // 'LIST', 'ADD', 'EDIT'
  const [editingAddressId, setEditingAddressId] = useState(null); // ID của địa chỉ đang sửa

  // --- State cho các input của form ---
  const [name, setName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddressName, setNewAddressName] = useState("");
  console.log("Addresses from Redux:", addresses);
  // --- HOOKS QUẢN LÝ LOGIC ---
  useEffect(() => {
    if (!addresses || addresses.length === 0) {
      setLocalAddresses([]);
      return;
    }
    const sortedAddresses = [...addresses].sort(
      (a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0)
    );
    setLocalAddresses(sortedAddresses);

    if (viewMode === "LIST") {
      const defaultAddress =
        sortedAddresses.find((addr) => addr.default) || sortedAddresses[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.addressId);
        setSelectedShippingInfo(defaultAddress);
      }
    }
  }, [addresses, setSelectedShippingInfo]);

  useEffect(() => {
    if (selectedAddressId) {
      const selected = localAddresses.find(
        (addr) => addr.addressId === selectedAddressId
      );
      if (selected) {
        setSelectedShippingInfo(selected);
      }
    }
  }, [selectedAddressId, localAddresses, setSelectedShippingInfo]);

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
  const handleDeleteAddress = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    setLocalAddresses((prev) => prev.filter((addr) => addr.addressId !== id));
  };

  const handleSetDefault = (id) => {
    const updated = localAddresses
      .map((addr) => ({ ...addr, default: addr.addressId === id }))
      .sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0));
    setLocalAddresses(updated);
    setSelectedAddressId(id);
  };

  // Mở form để thêm địa chỉ mới
  const handleAddNewClick = () => {
    setViewMode("ADD");
  };

  // Mở form để sửa địa chỉ
  const handleEditClick = (address) => {
    setViewMode("EDIT");
    setEditingAddressId(address.addressId);
    setName(address.recipient);
    setNewPhone(address.phone);
    setNewAddressName(address.addressName);
  };

  // Hủy và quay lại danh sách
  const handleCancelForm = () => {
    setViewMode("LIST");
    setEditingAddressId(null);
    setName("");
    setNewPhone("");
    setNewAddressName("");
  };

  // Xử lý LƯU hoặc CẬP NHẬT địa chỉ
  const handleSaveOrUpdateAddress = () => {
    if (!name || !newPhone || !newAddressName) {
      alert(
        "Vui lòng điền đầy đủ thông tin: Họ tên, Số điện thoại và Địa chỉ."
      );
      return;
    }

    if (viewMode === "EDIT") {
      // Logic cập nhật
      const updatedAddresses = localAddresses.map((addr) =>
        addr.addressId === editingAddressId
          ? {
              ...addr,
              recipient: name,
              phone: newPhone,
              addressName: newAddressName,
            }
          : addr
      );
      setLocalAddresses(updatedAddresses);
    } else {
      // Logic thêm mới (viewMode === 'ADD')
      const newAddress = {
        addressId: `new_${Date.now()}`,
        addressName: newAddressName,
        recipient: name,
        phone: newPhone,
        default: localAddresses.length === 0, // Tự động set default nếu là địa chỉ đầu tiên
      };
      setLocalAddresses((prev) => [newAddress, ...prev]);
      setSelectedAddressId(newAddress.addressId);
    }

    handleCancelForm(); // Reset form và quay lại danh sách
  };

  // --- RENDER COMPONENT ---

  // Hiển thị Form (cho cả Thêm mới và Chỉnh sửa)
  const renderForm = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-700">
        {viewMode === "EDIT" ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Họ và tên người nhận"
        />
        <input
          type="tel"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Số điện thoại"
        />
      </div>

      <input
        type="text"
        value={newAddressName}
        onChange={(e) => setNewAddressName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Địa chỉ đầy đủ (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành)"
      />

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={handleCancelForm}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={handleSaveOrUpdateAddress}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {viewMode === "EDIT" ? "Cập nhật" : "Lưu địa chỉ"}
        </button>
      </div>
    </div>
  );

  // Hiển thị danh sách địa chỉ
  const renderAddressList = () => (
    <>
      <div className="space-y-4">
        {localAddresses.map((addr) => (
          <div
            key={addr.addressId}
            className={`relative p-4 border-2 rounded-xl transition-all ${
              addr.addressId === selectedAddressId
                ? "bg-blue-50 border-blue-300 shadow-md"
                : "bg-gray-50 border-gray-200 hover:bg-white hover:shadow-sm"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Thông tin địa chỉ */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <FaUser className="text-gray-500" />
                  <span className="font-semibold text-gray-800">
                    {addr.recipient}
                  </span>
                  {addr.default && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Mặc định
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-500" />
                  <span className="text-gray-700">{addr.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gray-500 mt-1" />
                  <span className="text-gray-700">{addr.addressName}</span>
                </div>
              </div>

              {/* Các nút hành động */}
              {!isDeleteMode && (
                <div className="flex flex-row lg:flex-col gap-2 items-center justify-end">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedAddressId(addr.addressId)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all w-full lg:w-auto ${
                        addr.addressId === selectedAddressId
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {addr.addressId === selectedAddressId ? (
                        <FaCheckCircle />
                      ) : (
                        <FaRegCircle />
                      )}
                      <span>
                        {addr.addressId === selectedAddressId
                          ? "Đang chọn"
                          : "Chọn"}
                      </span>
                    </button>
                    <button
                      onClick={() => handleEditClick(addr)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-all w-full lg:w-auto"
                    >
                      <FaPencilAlt />
                    </button>
                  </div>
                  {!addr.default && (
                    <button
                      onClick={() => handleSetDefault(addr.addressId)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all w-full lg:w-auto"
                    >
                      <FaHome />
                      <span>Đặt mặc định</span>
                    </button>
                  )}
                </div>
              )}

              {/* Nút xóa trong chế độ xóa */}
              {isDeleteMode && (
                <button
                  onClick={() => handleDeleteAddress(addr.addressId)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-white rounded-full p-2 shadow-md"
                >
                  <FaTrash size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddNewClick}
        className="mt-6 flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
      >
        <FaPlus />
        Thêm địa chỉ mới
      </button>
    </>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-600" />
          Địa chỉ giao hàng
        </h2>
        {viewMode === "LIST" && localAddresses.length > 0 && (
          <button
            onClick={() => setIsDeleteMode(!isDeleteMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isDeleteMode
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
          >
            <FaTrash className="inline mr-2" />
            {isDeleteMode ? "Hủy" : "Xóa"}
          </button>
        )}
      </div>

      {viewMode === "LIST" ? renderAddressList() : renderForm()}
    </div>
  );
};

export default ShippingAddress;

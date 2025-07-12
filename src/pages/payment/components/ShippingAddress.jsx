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
} from "react-icons/fa";

const ShippingAddress = ({ addresses, setSelectedShippingInfo }) => {
  // State quản lý UI
  const [localAddresses, setLocalAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);

  // State cho form và API
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State cho các input của form
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [street, setStreet] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [name, setName] = useState("");

  // --- HOOKS QUẢN LÝ LOGIC ---
  useEffect(() => {
    const sortedAddresses = [...addresses].sort(
      (a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0)
    );
    setLocalAddresses(sortedAddresses);
    const defaultAddress =
      sortedAddresses.find((addr) => addr.default) || sortedAddresses[0];
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.addressId);
      setSelectedShippingInfo(defaultAddress);
    }
  }, [addresses, setSelectedShippingInfo]);

  useEffect(() => {
    const selected = localAddresses.find(
      (addr) => addr.addressId === selectedAddressId
    );
    if (selected) {
      setSelectedShippingInfo(selected);
    }
  }, [selectedAddressId, localAddresses, setSelectedShippingInfo]);

  // --- API mới cập nhật - esgoo.net ---
  // Lấy danh sách Tỉnh/Thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
        const data = await response.json();
        if (data.error === 0) {
          setProvinces(data.data || []);
        } else {
          throw new Error("Không thể tải danh sách tỉnh thành");
        }
      } catch (error) {
        setError("Không thể tải danh sách Tỉnh/Thành. Vui lòng thử lại.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  // Lấy danh sách Quận/Huyện
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setSelectedDistrict("");
      return;
    }
    const fetchDistricts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`
        );
        const data = await response.json();
        if (data.error === 0) {
          setDistricts(data.data || []);
        } else {
          throw new Error("Không thể tải danh sách quận huyện");
        }
      } catch (error) {
        setError("Không thể tải danh sách Quận/Huyện.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  // Lấy danh sách Phường/Xã
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard("");
      return;
    }
    const fetchWards = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`
        );
        const data = await response.json();
        if (data.error === 0) {
          setWards(data.data || []);
        } else {
          throw new Error("Không thể tải danh sách phường xã");
        }
      } catch (error) {
        setError("Không thể tải danh sách Phường/Xã.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWards();
  }, [selectedDistrict]);

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

  const resetNewAddressForm = () => {
    setUseNewAddress(false);
    setName("");
    setNewPhone("");
    setStreet("");
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setError(null);
  };

  const handleSaveAddress = () => {
    if (
      !name ||
      !newPhone ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !street
    ) {
      alert("Vui lòng điền đầy đủ tất cả các thông tin.");
      return;
    }

    const provinceName =
      provinces.find((p) => p.id == selectedProvince)?.name || "";
    const districtName =
      districts.find((d) => d.id == selectedDistrict)?.name || "";
    const wardName = wards.find((w) => w.id == selectedWard)?.name || "";
    const fullAddress = `${street}, ${wardName}, ${districtName}, ${provinceName}`;

    const newAddress = {
      addressId: `new_${Date.now()}`,
      addressName: fullAddress,
      recipient: name,
      phone: newPhone,
      default: false,
    };

    setLocalAddresses((prev) => [newAddress, ...prev]);
    setSelectedAddressId(newAddress.addressId);
    resetNewAddressForm();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-600" />
          Địa chỉ giao hàng
        </h2>
        {!useNewAddress && (
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

      {!useNewAddress ? (
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
                {isDeleteMode && (
                  <button
                    onClick={() => handleDeleteAddress(addr.addressId)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-md"
                  >
                    <FaTrash size={16} />
                  </button>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
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
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-500" />
                      <span className="text-gray-700">{addr.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="text-gray-500 mt-1" />
                      <span className="text-gray-700">{addr.addressName}</span>
                    </div>
                  </div>

                  {!isDeleteMode && (
                    <div className="flex flex-col gap-2 lg:items-end">
                      <button
                        onClick={() => setSelectedAddressId(addr.addressId)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
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
                        {addr.addressId === selectedAddressId
                          ? "Đã chọn"
                          : "Chọn"}
                      </button>

                      {!addr.default && (
                        <button
                          onClick={() => handleSetDefault(addr.addressId)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all"
                        >
                          <FaHome />
                          Đặt mặc định
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setUseNewAddress(true)}
            className="mt-4 flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            <FaPlus />
            Thêm địa chỉ mới
          </button>
        </>
      ) : (
        <div className="space-y-4 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex justify-center items-center z-10 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Đang tải dữ liệu...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedProvince}
            >
              <option value="">Chọn Quận/Huyện</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedDistrict}
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Số nhà, tên đường..."
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={resetNewAddressForm}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveAddress}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Lưu địa chỉ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddress;

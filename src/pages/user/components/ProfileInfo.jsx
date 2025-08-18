import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import {
  PencilSquareIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { apiFetchMyInfo, apiUpdateUserInfo } from "~/apis/userApi";
import { showToastSuccess, showToastError } from "~/utils/alert";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "~/stores/slice/userSlice";

const ProfileInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState({
    id: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    // address: { address: "" },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetchMyInfo({ accessToken });
        if (response.code === 200 && response.data) {
          const data = response.data;
          setProfile({
            id: data.id,
            fullName: `${data.lastName || ""} ${data.firstName || ""}`.trim(),
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            dob: data.dob || "",
            gender: data.gender || "",
            // address:
            //   Array.isArray(data.address) && data.address.length > 0
            //     ? data.address[0]
            //     : { address: "" },
          });
        } else {
          throw new Error(response.message || "Lỗi khi lấy thông tin cá nhân.");
        }
      } catch (error) {
        console.error("Fetch profile failed:", error);
        showToastError(error.message || "Không thể tải thông tin cá nhân.");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "address") {
      setProfile({
        ...profile,
        address: { ...profile.address, address: value },
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let dobFormatted = null;
      if (profile.dob) {
        const dateObj = new Date(profile.dob);
        if (isNaN(dateObj.getTime())) {
          throw new Error("Ngày sinh không hợp lệ");
        }
        const dd = String(dateObj.getDate()).padStart(2, "0");
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
        const yyyy = dateObj.getFullYear();
        dobFormatted = `${dd}/${mm}/${yyyy}`;
      }

      // Chỉ gửi các trường cần cập nhật, không bao gồm email
      const body = {
        firstName: profile.fullName.split(" ").pop() || "",
        lastName: profile.fullName.split(" ").slice(0, -1).join(" ") || "",
        phoneNumber: profile.phoneNumber,
        gender: profile.gender || null,
        dob: dobFormatted,
        addressRequests: profile.address?.address?.trim()
          ? [{ address: profile.address.address }]
          : [],
      };

      const response = await apiUpdateUserInfo({ body, accessToken });
      if (response.success) {
        // Khi nhận response, vẫn giữ nguyên email hiện có
        const updated = response.data;
        dispatch(userActions.setUserData({ userData: updated }));
        setProfile((prev) => ({
          ...prev, // Giữ nguyên các giá trị khác bao gồm email
          fullName: `${updated.lastName || ""} ${
            updated.firstName || ""
          }`.trim(),
          phoneNumber: updated.phoneNumber || "",
          dob: updated.dob || "",
          gender: updated.gender || "",
          address:
            Array.isArray(updated.address) && updated.address.length > 0
              ? updated.address[0]
              : { address: "" },
        }));
        showToastSuccess("Cập nhật thông tin thành công!");
        setIsOpen(false);
      } else {
        throw new Error(response.message || "Cập nhật thất bại.");
      }
    } catch (error) {
      console.error("Save profile failed:", error);
      showToastError(error.message || "Cập nhật thông tin thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="w-full sm:w-1/3 text-gray-500 text-sm font-medium flex items-center">
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </div>
      <div className="w-full sm:w-2/3">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-gray-900 font-medium">{value}</p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-4">Đang tải thông tin...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
          Thông tin cá nhân
        </h2>
      </div>

      <div className="space-y-6">
        <InfoRow icon={UserIcon} label="Họ tên" value={profile.fullName} />
        <InfoRow icon={EnvelopeIcon} label="Email" value={profile.email} />
        <InfoRow
          icon={PhoneIcon}
          label="Số điện thoại"
          value={profile.phoneNumber}
        />
        <InfoRow icon={CalendarIcon} label="Ngày sinh" value={profile.dob} />
        <InfoRow icon={UserIcon} label="Giới tính" value={profile.gender} />
        {/* <InfoRow
            icon={MapPinIcon}
            label="Địa chỉ"
            value={profile.address?.address || ""} 
          /> */}

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition duration-200 flex items-center"
          >
            <PencilSquareIcon className="w-4 h-4 mr-2" />
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">
              Chỉnh sửa thông tin
            </Dialog.Title>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="dob"
                  value={profile.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={profile.address?.address || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-all duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-4 py-3 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
                    isSaving ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSaving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ProfileInfo;

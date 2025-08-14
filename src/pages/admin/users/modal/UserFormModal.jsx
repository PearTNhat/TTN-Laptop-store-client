import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { FaTimes, FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import { apiChangeUserRole, apiGetRoles } from "~/apis/userApi";
import { useSelector } from "react-redux";

export default function ChangeUserRoleModal({ onClose, user, onSuccess }) {
  const { accessToken } = useSelector((state) => state.user);
  const [roleOptions, setRoleOptions] = useState([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await apiGetRoles({ accessToken });
        const data = res.data;

        const formatted = data.map((r) => ({
          value: r.id,
          label: r.id,
        }));
        setRoleOptions(formatted);

        if (user?.roles?.[0]?.id) {
          setValue("role", {
            value: user.roles[0].id,
            label: user.roles[0].id,
          });
        }
      } catch (err) {
        toast.error("Không thể tải danh sách vai trò");
      }
    };
    fetchRoles();
  }, [accessToken, user, setValue]);

  const onSubmit = async (formData) => {
    try {
      const res = await apiChangeUserRole({
        userId: user.id,
        roleId: formData.role.value,
        accessToken,
      });

      if (res?.code === 200) {
        toast.success("Đổi vai trò thành công!");
        onSuccess?.(user.id, formData.role.value, roleOptions);
        onClose();
      } else {
        toast.error(res?.message || "Đổi vai trò thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi gọi API đổi vai trò");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <FaTimes size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <FaUserShield size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Đổi vai trò người dùng</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={roleOptions}
                  isDisabled={isSubmitting}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
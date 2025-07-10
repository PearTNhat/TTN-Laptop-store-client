// src/components/users/modals/UserFormModal.js
import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaVenusMars,
  FaUserShield,
} from "react-icons/fa";
import SelectField from "~/components/SelectField";
import InputField from "~/components/InputField";

// Role options for multi-select
const roleOptions = [
  { value: "User", label: "User", color: "#10B981" },
  { value: "Moderator", label: "Moderator", color: "#F59E0B" },
  { value: "Admin", label: "Admin", color: "#EF4444" },
  { value: "Manager", label: "Manager", color: "#8B5CF6" },
  { value: "Support", label: "Support", color: "#06B6D4" },
];

// Custom styles for react-select
const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "2px solid #3B82F6" : "1px solid #D1D5DB",
    borderRadius: "8px",
    padding: "4px 8px",
    minHeight: "48px",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.1)" : "none",
    "&:hover": {
      borderColor: "#3B82F6",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? state.data.color
      : state.isFocused
      ? `${state.data.color}20`
      : "white",
    color: state.isSelected ? "white" : state.data.color,
    fontWeight: state.isSelected ? "600" : "500",
    "&:hover": {
      backgroundColor: `${state.data.color}30`,
      color: state.data.color,
    },
  }),
  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: `${state.data.color}20`,
    borderRadius: "6px",
    border: `1px solid ${state.data.color}40`,
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    color: state.data.color,
    fontWeight: "600",
    fontSize: "12px",
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    color: state.data.color,
    borderRadius: "0 4px 4px 0",
    "&:hover": {
      backgroundColor: state.data.color,
      color: "white",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9CA3AF",
    fontSize: "14px",
  }),
};

const UserFormModal = ({ onClose, onSave, user }) => {
  // Setup react-hook-form
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      id: user?.id || null,
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      dob: user?.dob || "",
      gender: user?.gender || "Nam",
      roles: user?.roles
        ? user.roles.map((role) => ({
            value: role,
            label: role,
            color:
              roleOptions.find((opt) => opt.value === role)?.color || "#6B7280",
          }))
        : user?.role
        ? [
            {
              value: user.role,
              label: user.role,
              color:
                roleOptions.find((opt) => opt.value === user.role)?.color ||
                "#6B7280",
            },
          ]
        : [],
    },
    mode: "onChange",
  });

  // Form validation rules
  const validationRules = {
    first_name: {
      required: "Tên là bắt buộc",
      minLength: { value: 2, message: "Tên phải có ít nhất 2 ký tự" },
    },
    last_name: {
      required: "Họ là bắt buộc",
      minLength: { value: 2, message: "Họ phải có ít nhất 2 ký tự" },
    },
    email: {
      required: "Email là bắt buộc",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Email không hợp lệ",
      },
    },
    phone_number: {
      pattern: {
        value: /^[0-9]{10,11}$/,
        message: "Số điện thoại phải có 10-11 số",
      },
    },
    roles: {
      required: "Phải chọn ít nhất một vai trò",
    },
  };

  // Handle form submission
  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      roles: data.roles.map((role) => role.value),
    };
    onSave(formattedData);
  };

  const isEditMode = !!user;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
            <FaUser className="text-white text-lg" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="last_name"
            control={control}
            rules={validationRules.last_name}
            render={({ field, fieldState: { error } }) => (
              <InputField
                label="Họ"
                icon={FaUser}
                error={error}
                {...field}
                placeholder="Nhập họ"
              />
            )}
          />
          <Controller
            name="first_name"
            control={control}
            rules={validationRules.first_name}
            render={({ field, fieldState: { error } }) => (
              <InputField
                label="Tên"
                icon={FaUser}
                error={error}
                {...field}
                placeholder="Nhập tên"
              />
            )}
          />
        </div>

        {/* Email */}
        <Controller
          name="email"
          control={control}
          rules={validationRules.email}
          render={({ field, fieldState: { error } }) => (
            <InputField
              label="Email"
              type="email"
              icon={FaEnvelope}
              error={error}
              {...field}
              placeholder="Nhập email"
            />
          )}
        />

        {/* Phone */}
        <Controller
          name="phone_number"
          control={control}
          rules={validationRules.phone_number}
          render={({ field, fieldState: { error } }) => (
            <InputField
              label="Số điện thoại"
              icon={FaPhone}
              error={error}
              {...field}
              placeholder="Nhập số điện thoại"
            />
          )}
        />
        {/* Roles Multi-Select */}
        <div>
          <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
            <FaUserShield className="text-gray-500" />
            Vai trò
          </label>
          <Controller
            name="roles"
            control={control}
            rules={validationRules.roles}
            render={({ field, fieldState: { error } }) => (
              <div>
                <Select
                  {...field}
                  isMulti
                  options={roleOptions}
                  styles={selectStyles}
                  placeholder="Chọn vai trò..."
                  noOptionsMessage={() => "Không có tùy chọn"}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>
        {/* DOB and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="dob"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputField
                label="Ngày sinh"
                type="date"
                icon={FaCalendarAlt}
                error={error}
                {...field}
              />
            )}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <SelectField
                label="Giới tính"
                icon={FaVenusMars}
                error={error}
                {...field}
                options={["Nam", "Nữ", "Khác"]}
              />
            )}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Đang lưu..."
            : isEditMode
            ? "Lưu thay đổi"
            : "Thêm người dùng"}
        </button>
      </div>
    </form>
  );
};

export default UserFormModal;

import React, { useState, useEffect, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaTimes,
  FaSave,
  FaPercent,
  FaDollarSign,
  FaSearch,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { promotionSchema } from "../schema/promotion.schema";
import { apiGetAllProductDetails } from "~/apis/productApi";
import { showToastError } from "~/utils/alert";
import { formatPrice } from "~/utils/helper";
import SelectedItemsDisplay from "./SelectedItemsDisplay";
import { apiGetAllUsers } from "~/apis/userApi";
import { useDebounce } from "~/hooks/useDebounce";

const promotionTypes = [
  { value: "USER_PROMOTION", label: "Khuyến mãi người dùng" },
  { value: "PRODUCT_DISCOUNT", label: "Giảm giá sản phẩm" },
  { value: "GIFT", label: "Quà tặng" },
  { value: "SHOP_DISCOUNT", label: "Giảm giá cửa hàng" },
];
const PromotionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  promotion = null,
  isLoading = false,
}) => {
  const { accessToken } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productLoading, setProductLoading] = useState(false);

  // User-related states
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userLoading, setUserLoading] = useState(false);

  // Debounced search values
  const debouncedProductSearch = useDebounce(productSearch, 300);
  const debouncedUserSearch = useDebounce(userSearch, 300);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      discountValue: 0,
      discountUnit: "PERCENT",
      promotionType: "USER_PROMOTION",
      minOrderValue: 0,
      maxDiscountValue: 0,
      usageLimit: 0,
      startDate: "",
      endDate: "",
      productDetailIds: [],
      userIds: [],
    },
  });

  const watchPromotionType = watch("promotionType");
  const watchDiscountUnit = watch("discountUnit");

  useEffect(() => {
    if (promotion) {
      reset({
        name: promotion.name || "",
        code: promotion.code || "",
        description: promotion.description || "",
        discountValue: promotion.discountValue || 0,
        discountUnit: promotion.discountUnit || "PERCENT",
        promotionType: promotion.promotionType || "USER_PROMOTION",
        minOrderValue: promotion.minOrderValue || 0,
        maxDiscountValue: promotion.maxDiscountValue || 0,
        usageLimit: promotion.usageLimit || 0,
        startDate: promotion.startDate
          ? new Date(promotion.startDate).toISOString().slice(0, 16)
          : "",
        endDate: promotion.endDate
          ? new Date(promotion.endDate).toISOString().slice(0, 16)
          : "",
        productDetailIds: promotion.productDetailIds || [],
      });
      setSelectedProducts(promotion.productDetailIds || []);
      setSelectedUsers(promotion.userIds || []);
    } else {
      reset();
      setSelectedProducts([]);
      setSelectedUsers([]);
    }
  }, [promotion, reset]);

  const loadProducts = useCallback(
    async (search = "") => {
      if (watchPromotionType !== "PRODUCT_DISCOUNT") return;

      setProductLoading(true);
      try {
        const response = await apiGetAllProductDetails({
          accessToken,
          params: {
            page: 0,
            size: 20,
            title: search.trim(),
          },
        });

        if (response.code === 200) {
          setProducts(response.data.content || []);
        } else {
          throw new Error(response.message || "Failed to load products");
        }
      } catch (error) {
        showToastError(
          error.message || "Không thể tải sản phẩm. Vui lòng thử lại."
        );
        setProducts([]);
      } finally {
        setProductLoading(false);
      }
    },
    [accessToken, watchPromotionType]
  );

  const loadUsers = useCallback(
    async (search = "") => {
      if (watchPromotionType !== "USER_PROMOTION") return;

      setUserLoading(true);
      try {
        const response = await apiGetAllUsers({
          accessToken,
          params: {
            page: 0,
            size: 20,
            search: search.trim(),
          },
        });

        if (response.code === 200) {
          console.log(response.data);
          setUsers(response.data.content || []);
        } else {
          throw new Error(response.message || "Failed to load users");
        }
      } catch (error) {
        showToastError(
          error.message || "Không thể tải người dùng. Vui lòng thử lại."
        );
        setUsers([]);
      } finally {
        setUserLoading(false);
      }
    },
    [accessToken, watchPromotionType]
  );

  // Load products when promotion type changes
  useEffect(() => {
    if (watchPromotionType === "PRODUCT_DISCOUNT") {
      loadProducts();
    } else {
      setProducts([]);
      setSelectedProducts([]);
      setValue("productDetailIds", []);
    }
  }, [watchPromotionType, setValue, loadProducts]);

  // Load users when promotion type changes
  useEffect(() => {
    if (watchPromotionType === "USER_PROMOTION") {
      loadUsers();
    } else {
      setUsers([]);
      setSelectedUsers([]);
      setValue("userIds", []);
    }
  }, [watchPromotionType, setValue, loadUsers]);

  // Debounced product search
  useEffect(() => {
    if (
      watchPromotionType === "PRODUCT_DISCOUNT" &&
      debouncedProductSearch !== undefined
    ) {
      loadProducts(debouncedProductSearch);
    }
  }, [debouncedProductSearch, watchPromotionType, loadProducts]);

  // Debounced user search
  useEffect(() => {
    if (
      watchPromotionType === "USER_PROMOTION" &&
      debouncedUserSearch !== undefined
    ) {
      loadUsers(debouncedUserSearch);
    }
  }, [debouncedUserSearch, watchPromotionType, loadUsers]);

  // Search handlers
  const handleProductSearch = (e) => {
    setProductSearch(e.target.value);
  };

  const handleUserSearch = (e) => {
    setUserSearch(e.target.value);
  };

  // Selection handlers
  const toggleProductSelection = (productId) => {
    const isSelected = selectedProducts.some((p) => p.id === productId);
    let newSelected;

    if (isSelected) {
      newSelected = selectedProducts.filter((p) => p.id !== productId);
    } else {
      const productToAdd = products.find((p) => p.id === productId);
      if (productToAdd) {
        newSelected = [...selectedProducts, productToAdd];
      } else {
        return; // Product not found, do nothing
      }
    }

    setSelectedProducts(newSelected);
    setValue(
      "productDetailIds",
      newSelected.map((p) => p.id)
    );
  };
  const toggleUserSelection = (userId) => {
    const isSelected = selectedUsers.some((u) => u.id === userId);
    let newSelected;

    if (isSelected) {
      newSelected = selectedUsers.filter((u) => u.id !== userId);
    } else {
      const userToAdd = users.find((u) => u.id === userId);
      if (userToAdd) {
        newSelected = [...selectedUsers, userToAdd];
      } else {
        return; // User not found, do nothing
      }
    }

    setSelectedUsers(newSelected);
    setValue(
      "userIds",
      newSelected.map((u) => u.id)
    );
  };

  const handleFormSubmit = (data) => {
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      productDetailIds:
        watchPromotionType === "PRODUCT_DISCOUNT"
          ? selectedProducts.map((p) => p.id)
          : [],
      userIds:
        watchPromotionType === "USER_PROMOTION"
          ? selectedUsers.map((u) => u.id)
          : [],
    };
    onSubmit(formattedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-[90%] w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {promotion ? "Chỉnh sửa khuyến mãi" : "Tạo khuyến mãi mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên khuyến mãi *
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên khuyến mãi"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã khuyến mãi *
              </label>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="Nhập mã khuyến mãi"
                  />
                )}
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả *
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mô tả khuyến mãi"
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Promotion Type */}

          {/* Discount Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn vị giảm giá *
              </label>
              <Controller
                name="discountUnit"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="PERCENT">Phần trăm (%)</option>
                    <option value="AMOUNT">Số tiền (VNĐ)</option>
                  </select>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá trị giảm *
              </label>
              <div className="relative">
                <Controller
                  name="discountValue"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="0"
                      step={watchDiscountUnit === "PERCENT" ? "1" : "1000"}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {watchDiscountUnit === "PERCENT" ? (
                    <FaPercent className="text-gray-400" />
                  ) : (
                    <FaDollarSign className="text-gray-400" />
                  )}
                </div>
              </div>
              {errors.discountValue && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discountValue.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giảm tối đa (VNĐ) *
              </label>
              <Controller
                name="maxDiscountValue"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              {errors.maxDiscountValue && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maxDiscountValue.message}
                </p>
              )}
            </div>
          </div>

          {/* Order and Usage Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá trị đơn hàng tối thiểu (VNĐ) *
              </label>
              <Controller
                name="minOrderValue"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              {errors.minOrderValue && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.minOrderValue.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới hạn sử dụng *
              </label>
              <Controller
                name="usageLimit"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0 = Không giới hạn"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              {errors.usageLimit && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.usageLimit.message}
                </p>
              )}
            </div>
          </div>

          {/* Date Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu *
              </label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc *
              </label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại khuyến mãi *
            </label>
            <Controller
              name="promotionType"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {promotionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Product Selection for PRODUCT_DISCOUNT */}
          {watchPromotionType === "PRODUCT_DISCOUNT" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn sản phẩm áp dụng
              </label>
              <div className="relative mb-4">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={handleProductSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tìm kiếm sản phẩm..."
                />
              </div>

              <div className="flex flex-wrap gap-2 border border-gray-300 rounded-lg max-h-[400px] overflow-y-auto">
                {productLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Đang tải sản phẩm...
                  </div>
                ) : products.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Không có sản phẩm nào
                  </div>
                ) : (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center p-3 border-b border-gray-200 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.some(
                          (p) => p.id === product.id
                        )}
                        onChange={() => toggleProductSelection(product.id)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div
                        key={product.id}
                        className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {product.thumbnail ? (
                              <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <FaBox className="text-green-600 text-sm" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>ID: {product.id}</span>
                              {product.hex && (
                                <div className="flex items-center space-x-1">
                                  <span>•</span>
                                  <div
                                    className="w-3 h-3 rounded-full border border-gray-300"
                                    style={{ backgroundColor: product.hex }}
                                  ></div>
                                </div>
                              )}
                            </div>
                            {product.title && (
                              <p className="text-xs text-gray-400 truncate">
                                {product.title}
                              </p>
                            )}
                            <div className="flex items-center space-x-2 text-xs">
                              {product.discountPrice &&
                              product.discountPrice !==
                                product.originalPrice ? (
                                <>
                                  <span className="text-red-600 font-medium">
                                    {formatPrice(product.discountPrice)}
                                  </span>
                                  <span className="text-gray-400 line-through">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-900 font-medium">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedProducts.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Đã chọn: {selectedProducts.length} sản phẩm
                  </p>
                </div>
              )}
            </div>
          )}

          {/* User Selection for USER_PROMOTION */}
          {watchPromotionType === "USER_PROMOTION" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn khách hàng áp dụng
              </label>
              <div className="relative mb-4">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={handleUserSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tìm kiếm khách hàng theo tên hoặc email..."
                />
              </div>

              <div className="border border-gray-300 rounded-lg max-h-[400px] overflow-y-auto">
                {userLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Đang tải danh sách khách hàng...
                  </div>
                ) : users.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Không có khách hàng nào
                  </div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-3 border-b border-gray-200 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.some((u) => u.id === user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center flex-1">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {user.fullName?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {user.fullName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedUsers.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Đã chọn: {selectedUsers.length} khách hàng
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Selected Items Display */}
          {(selectedProducts.length > 0 || selectedUsers.length > 0) && (
            <div className="mb-6">
              <SelectedItemsDisplay
                type={watchPromotionType}
                selectedProducts={selectedProducts}
                selectedUsers={selectedUsers}
                onRemoveProduct={(productId) =>
                  toggleProductSelection(productId)
                }
                onRemoveUser={(userId) => toggleUserSelection(userId)}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                "Đang xử lý..."
              ) : (
                <>
                  <FaSave />
                  {promotion ? "Cập nhật" : "Tạo mới"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionFormModal;

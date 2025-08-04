import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaTimes,
  FaPlus,
  FaSave,
  FaPercent,
  FaDollarSign,
  FaSearch,
} from "react-icons/fa";
import { apiGetProductsForPromotion } from "~/apis/promotionApi";
import { useSelector } from "react-redux";

// Validation schema
const promotionSchema = z.object({
  name: z.string().min(1, "Tên khuyến mãi không được để trống"),
  code: z.string().min(1, "Mã khuyến mãi không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  discountValue: z.number().min(0, "Giá trị giảm phải lớn hơn 0"),
  discountUnit: z.enum(["PERCENT", "AMOUNT"]),
  promotionType: z.enum([
    "USER_PROMOTION",
    "PRODUCT_DISCOUNT",
    "GIFT",
    "SHOP_DISCOUNT",
  ]),
  minOrderValue: z
    .number()
    .min(0, "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0"),
  maxDiscountValue: z
    .number()
    .min(0, "Giá trị giảm tối đa phải lớn hơn hoặc bằng 0"),
  usageLimit: z.number().min(0, "Giới hạn sử dụng phải lớn hơn hoặc bằng 0"),
  startDate: z.string().min(1, "Ngày bắt đầu không được để trống"),
  endDate: z.string().min(1, "Ngày kết thúc không được để trống"),
  productDetailIds: z.array(z.number()).optional(),
});

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
    } else {
      reset();
      setSelectedProducts([]);
    }
  }, [promotion, reset]);

  const loadProducts = useCallback(
    async (search = "") => {
      if (watchPromotionType !== "PRODUCT_DISCOUNT") return;

      setProductLoading(true);
      try {
        const response = await apiGetProductsForPromotion({
          accessToken,
          params: {
            page: 0,
            size: 20,
            search: search.trim(),
          },
        });

        if (response.success) {
          setProducts(response.data.content || []);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      } finally {
        setProductLoading(false);
      }
    },
    [accessToken, watchPromotionType]
  );

  useEffect(() => {
    if (watchPromotionType === "PRODUCT_DISCOUNT") {
      loadProducts();
    } else {
      setProducts([]);
      setSelectedProducts([]);
      setValue("productDetailIds", []);
    }
  }, [watchPromotionType, setValue, loadProducts]);

  const handleProductSearch = (e) => {
    const value = e.target.value;
    setProductSearch(value);
    if (watchPromotionType === "PRODUCT_DISCOUNT") {
      const timeoutId = setTimeout(() => {
        loadProducts(value);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  };

  const toggleProductSelection = (productDetailId) => {
    const newSelected = selectedProducts.includes(productDetailId)
      ? selectedProducts.filter((id) => id !== productDetailId)
      : [...selectedProducts, productDetailId];

    setSelectedProducts(newSelected);
    setValue("productDetailIds", newSelected);
  };

  const handleFormSubmit = (data) => {
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      productDetailIds:
        watchPromotionType === "PRODUCT_DISCOUNT" ? selectedProducts : [],
    };
    onSubmit(formattedData);
  };

  if (!isOpen) return null;

  const promotionTypes = [
    { value: "USER_PROMOTION", label: "Khuyến mãi người dùng" },
    { value: "PRODUCT_DISCOUNT", label: "Giảm giá sản phẩm" },
    { value: "GIFT", label: "Quà tặng" },
    { value: "SHOP_DISCOUNT", label: "Giảm giá cửa hàng" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

              <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
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
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {product.id}
                        </p>
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

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaTimes, FaSave } from "react-icons/fa";
import { useSelector } from "react-redux";
import { promotionSchema } from "../schema/promotion.schema";
import { apiGetAllProductDetails } from "~/apis/productApi";
import { showToastError } from "~/utils/alert";
import SelectedItemsDisplay from "./SelectedItemsDisplay";
import BasicInfoForm from "./BasicInfoForm";
import DiscountSettingsForm from "./DiscountSettingsForm";
import DateTimeForm from "./DateTimeForm";
import ProductSelectionForm from "./ProductSelectionForm";
import UserSelectionForm from "./UserSelectionForm";
import RankSelectionForm from "./RankSelectionForm";
import { apiGetAllUsers } from "~/apis/userApi";
import { useDebounce } from "~/hooks/useDebounce";
import { apiListRank } from "~/apis/rankApi";

const PromotionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
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

  // Rank-related states
  const [ranks, setRanks] = useState([]);
  const [selectedRanks, setSelectedRanks] = useState([]);
  const [rankLoading, setRankLoading] = useState(false);

  // Debounced search values
  const debouncedProductSearch = useDebounce(productSearch, 300);
  const debouncedUserSearch = useDebounce(userSearch, 300);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
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
      maxDiscountValue: null,
      usageLimit: null,
      startDate: "",
      endDate: "",
      productDetailIds: [],
      userIds: [],
      rankLevelIds: [],
    },
  });

  const watchPromotionType = watch("promotionType");
  const watchDiscountUnit = watch("discountUnit");

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
      if (watchPromotionType !== "USER_PROMOTION" || selectedRanks.length > 0) {
        return;
      }
      console.log("_______", watchPromotionType, selectedRanks);

      setUserLoading(true);
      try {
        const response = await apiGetAllUsers({
          accessToken,
          params: {
            page: 0,
            size: 20,
            search: search.trim() || undefined,
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
    [accessToken, watchPromotionType, selectedRanks.length]
  );

  const loadRanks = useCallback(async () => {
    if (
      watchPromotionType !== "USER_PROMOTION" &&
      watchPromotionType !== "GIFT"
    )
      return;

    setRankLoading(true);
    try {
      const response = await apiListRank({ accessToken });

      if (response.code === 200) {
        setRanks(response.data || []);
      } else {
        throw new Error(response.message || "Failed to load ranks");
      }
    } catch (error) {
      showToastError(
        error.message || "Không thể tải danh sách hạng. Vui lòng thử lại."
      );
      setRanks([]);
    } finally {
      setRankLoading(false);
    }
  }, [accessToken, watchPromotionType]);

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
    if (watchPromotionType === "USER_PROMOTION" && selectedRanks.length === 0) {
      loadUsers();
    } else {
      setUsers([]);
      setSelectedUsers([]);
      setValue("userIds", []);
    }
  }, [watchPromotionType, selectedRanks.length, setValue, loadUsers]);

  // Load ranks when promotion type changes
  useEffect(() => {
    if (
      watchPromotionType === "USER_PROMOTION" ||
      watchPromotionType === "GIFT"
    ) {
      loadRanks();
    } else {
      setRanks([]);
      setSelectedRanks([]);
      setValue("rankLevelIds", []);
    }
  }, [watchPromotionType, setValue, loadRanks]);

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
        newSelected = selectedProducts;
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
        newSelected = selectedUsers;
      }
    }

    setSelectedUsers(newSelected);
    setValue(
      "userIds",
      newSelected.map((u) => u.id)
    );
  };

  const toggleRankSelection = (rankId) => {
    const isSelected = selectedRanks.some((r) => r.id === rankId);
    let newSelected;

    if (isSelected) {
      newSelected = selectedRanks.filter((r) => r.id !== rankId);
    } else {
      const rankToAdd = ranks.find((r) => r.id === rankId);
      if (rankToAdd) {
        newSelected = [...selectedRanks, rankToAdd];
      } else {
        newSelected = selectedRanks;
      }
    }

    setSelectedRanks(newSelected);
    setValue(
      "rankLevelIds",
      newSelected.map((r) => r.id)
    );

    // Clear user selection when rank is selected
    if (watchPromotionType === "USER_PROMOTION") {
      setSelectedUsers([]);
      setValue("userIds", []);
    }
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
        watchPromotionType === "USER_PROMOTION" && selectedRanks.length === 0
          ? selectedUsers.map((u) => u.id)
          : [],
      rankLevelIds:
        watchPromotionType === "USER_PROMOTION" || watchPromotionType === "GIFT"
          ? selectedRanks.map((r) => r.id)
          : [],
    };
    console.log("Submitting promotion data:", formattedData);
    onSubmit(formattedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              ✨ Tạo khuyến mãi mới
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-8"
        >
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              📝 Thông tin cơ bản
            </h3>
            <BasicInfoForm control={control} errors={errors} />
          </div>

          {/* Discount Settings */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              💰 Cài đặt giảm giá
            </h3>
            <DiscountSettingsForm
              control={control}
              errors={errors}
              watchDiscountUnit={watchDiscountUnit}
            />
          </div>

          {/* Date Time Settings */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              ⏰ Thời gian áp dụng
            </h3>
            <DateTimeForm control={control} errors={errors} />
          </div>

          {/* Product Selection */}
          {watchPromotionType === "PRODUCT_DISCOUNT" && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                📦 Chọn sản phẩm
              </h3>
              <ProductSelectionForm
                products={products}
                selectedProducts={selectedProducts}
                productSearch={productSearch}
                productLoading={productLoading}
                onProductSearch={handleProductSearch}
                onToggleProductSelection={toggleProductSelection}
              />
            </div>
          )}

          {/* User/Rank Selection for USER_PROMOTION */}
          {watchPromotionType === "USER_PROMOTION" && (
            <div>
              <UserSelectionForm
                users={users}
                selectedUsers={selectedUsers}
                userSearch={userSearch}
                userLoading={userLoading}
                onToggleUserSelection={toggleUserSelection}
                onUserSearch={(e) => setUserSearch(e.target.value)}
              />
            </div>
          )}

          {/* Rank Selection for GIFT */}
          {watchPromotionType === "GIFT" && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                🏆 Chọn hạng khách hàng
              </h3>
              <RankSelectionForm
                ranks={ranks}
                selectedRanks={selectedRanks}
                rankLoading={rankLoading}
                onToggleRankSelection={toggleRankSelection}
                type={watchPromotionType}
              />
            </div>
          )}

          {/* Selected Items Display */}
          {(selectedProducts.length > 0 ||
            selectedUsers.length > 0 ||
            selectedRanks.length > 0) && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                ✅ Đã chọn
              </h3>
              <SelectedItemsDisplay
                type={watchPromotionType}
                selectedProducts={selectedProducts}
                selectedUsers={selectedUsers}
                selectedRanks={selectedRanks}
                onRemoveProduct={toggleProductSelection}
                onRemoveUser={toggleUserSelection}
                onRemoveRank={toggleRankSelection}
                onClearAll={() => {
                  if (watchPromotionType === "PRODUCT_DISCOUNT") {
                    setSelectedProducts([]);
                    setValue("productDetailIds", []);
                  } else if (watchPromotionType === "USER_PROMOTION") {
                    setSelectedUsers([]);
                    setSelectedRanks([]);
                    setValue("userIds", []);
                    setValue("rankLevelIds", []);
                  } else if (watchPromotionType === "GIFT") {
                    setSelectedRanks([]);
                    setValue("rankLevelIds", []);
                  }
                }}
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 font-medium"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Tạo mới
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionFormModal;

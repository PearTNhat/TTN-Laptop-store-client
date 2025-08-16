import React, { useEffect, useState } from "react";
import { apiGetProductPromotionById } from "~/apis/promotionApi";
import VoucherCard from "~/components/voucher/VoucherCard";
import { calculateFinalPrice } from "~/utils/promotion";

const PromotionSection = ({
  productDetailId,
  originalPrice,
  onApplyPromotion,
  selectedPromotionCode,
}) => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productDetailId) return;

    const fetchPromotions = async () => {
      setIsLoading(true);
      try {
        // Giả sử API này lấy tất cả promotion hợp lệ cho một product detail id
        const response = await apiGetProductPromotionById({
          pId: productDetailId,
          type: "ACTIVE", // Hoặc "expired" nếu bạn muốn lấy các khuyến mãi đã hết hạn
        });
        if (response.code === 200) {
          setPromotions(response.data || []);
          const { appliedPromotion } = calculateFinalPrice(
            originalPrice,
            response.data
          );
          if (appliedPromotion) {
            onApplyPromotion(appliedPromotion);
          } else {
            onApplyPromotion(null);
          }
        } else {
          // Không cần show lỗi nếu không có KM, chỉ log ra
          setPromotions([]);
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setPromotions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, [productDetailId, originalPrice]);

  const handleApply = (promotion) => {
    // Nếu click vào voucher đang active, tức là muốn bỏ chọn
    if (promotion.code === selectedPromotionCode) {
      onApplyPromotion(null);
    } else {
      onApplyPromotion(promotion);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
        Đang tải khuyến mãi...
      </div>
    );
  }

  if (promotions.length === 0) {
    return null; // Không hiển thị gì nếu không có voucher
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4">
        <h2 className="font-bold text-2xl flex items-center gap-3">
          <span className="text-2xl">🎁</span>
          Khuyến mãi & Ưu đãi
        </h2>
      </div>
      <div className="p-6 space-y-4">
        {promotions.map((promo) => (
          <VoucherCard
            key={promo.code}
            promotion={promo} // Đảm bảo VoucherCard nhận đúng prop
            isActive={promo.code === selectedPromotionCode}
            handleApplyDiscount={() => handleApply(promo)}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionSection;

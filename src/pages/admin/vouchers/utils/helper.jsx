import { FaBox, FaGift, FaTag, FaUsers } from "react-icons/fa";
import { formatPrice } from "~/utils/helper";

const getPromotionStatus = (promotion) => {
  const now = new Date();
  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);

  if (now < startDate) {
    return { text: "Chưa bắt đầu", color: "bg-blue-100 text-blue-800" };
  } else if (now > endDate) {
    return { text: "Đã hết hạn", color: "bg-red-100 text-red-800" };
  } else {
    return { text: "Đang hoạt động", color: "bg-green-100 text-green-800" };
  }
};

const getPromotionTypeIcon = (type) => {
  switch (type) {
    case "USER_PROMOTION":
      return <FaUsers className="text-blue-600" />;
    case "PRODUCT_DISCOUNT":
      return <FaBox className="text-green-600" />;
    case "GIFT":
      return <FaGift className="text-purple-600" />;
    case "SHOP_DISCOUNT":
      return <FaTag className="text-orange-600" />;
    default:
      return <FaGift className="text-gray-600" />;
  }
};
const getPromotionTypeText = (type) => {
  switch (type) {
    case "USER_PROMOTION":
      return "Khuyến mãi người dùng";
    case "PRODUCT_DISCOUNT":
      return "Giảm giá sản phẩm";
    case "GIFT":
      return "Quà tặng";
    case "SHOP_DISCOUNT":
      return "Giảm giá cửa hàng";
    default:
      return type;
  }
};

const getPromotionTypeColor = (type) => {
  switch (type) {
    case "USER_PROMOTION":
      return "bg-blue-100 text-blue-800";
    case "PRODUCT_DISCOUNT":
      return "bg-green-100 text-green-800";
    case "GIFT":
      return "bg-purple-100 text-purple-800";
    case "SHOP_DISCOUNT":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDiscount = (promotion) => {
  if (promotion.discountUnit === "PERCENT") {
    return `${promotion.discountValue}%`;
  } else {
    return formatPrice(promotion.discountValue);
  }
};
export {
  getPromotionStatus,
  getPromotionTypeIcon,
  getPromotionTypeColor,
  getPromotionTypeText,
  formatDiscount,
};

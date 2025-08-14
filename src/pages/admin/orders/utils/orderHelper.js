// Get payment method style
const getPaymentMethodStyle = (method) => {
    switch (method) {
        case "CREDIT_CARD":
        case "credit_card":
            return {
                text: "Thẻ tín dụng",
                className: "bg-blue-100 text-blue-800 border border-blue-200",
                icon: "💳",
            };
        case "BANK_TRANSFER":
        case "bank_transfer":
            return {
                text: "Chuyển khoản",
                className: "bg-green-100 text-green-800 border border-green-200",
                icon: "🏦",
            };
        case "COD":
        case "cash":
            return {
                text: "Tiền mặt",
                className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
                icon: "💵",
            };
        case "MOMO":
        case "momo":
            return {
                text: "MoMo",
                className: "bg-pink-100 text-pink-800 border border-pink-200",
                icon: "📱",
            };
        case "VNPAY":
        case "vnpay":
            return {
                text: "VNPay",
                className: "bg-orange-100 text-orange-800 border border-orange-200",
                icon: "🔥",
            };
        case "ZALOPAY":
        case "zalopay":
            return {
                text: "ZaloPay",
                className: "bg-cyan-100 text-cyan-800 border border-cyan-200",
                icon: "⚡",
            };
        default:
            return {
                text: method || "Không xác định",
                className: "bg-gray-100 text-gray-800 border border-gray-200",
                icon: "💰",
            };
    }
};
export { getPaymentMethodStyle };
import React from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { FaRegStarHalfStroke } from 'react-icons/fa6';

// Các import kiểu (ProductDetail, Promotion) đã được loại bỏ vì chúng không tồn tại trong JavaScript.

const formatNumber = (number) => {
    let numberParse = Number(number);
    if (!numberParse || numberParse === 0) {
        return 0;
    }
    return numberParse.toLocaleString("de-DE");
};
const covertMoneyToNumber = (money) => {
    if (!money) return 0;
    const cleanedStr = money.replace(/\./g, ""); // Loại bỏ dấu chấm
    return Number(cleanedStr);
}
const convertNumberToStar = (number) => {
    if (!number) {
        // Trả về 5 ngôi sao rỗng nếu không có số điểm
        return new Array(5).fill(React.createElement(FaRegStar));
    }
    number = Number(number);
    const stars = [];

    // Thêm các ngôi sao đầy
    for (let i = 1; i <= number; i++) {
        stars.push(React.createElement(FaStar));
    }

    // Thêm ngôi sao nửa nếu là số lẻ
    if (number !== 0 && number % Math.floor(number) !== 0) {
        stars.push(React.createElement(FaRegStarHalfStroke));
        number++;
    }

    // Thêm các ngôi sao rỗng cho phần còn lại
    for (let i = 5; i > number; i--) {
        stars.push(React.createElement(FaRegStar));
    }
    return stars;
};

const calculatePercent = (price, priceDiscount) => {
    if (price === 0 || !price || priceDiscount === 0 || !priceDiscount) {
        return 0;
    }
    // toFixed trả về string, nên cần Number() để chuyển lại thành số
    return Number((((price - priceDiscount) / price) * 100).toFixed(2));
};
const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};
function capitalizeFirstCharacter(str) {
    if (!str) return str; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Hàm tiện ích để tạo slug ---
const generateSlug = (text) => {
    if (!text) return "";
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
};
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
export { formatNumber, convertNumberToStar, calculatePercent, formatPrice, formatDate, covertMoneyToNumber, capitalizeFirstCharacter, generateSlug };
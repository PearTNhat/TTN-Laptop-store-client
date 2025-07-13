// src/data/fakeData.js

export const fakeUserData = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '0987654321',
    email: 'john.doe@example.com',
    addresses: [
        {
            addressId: 'addr1',
            addressName: '123 Main St, Ward 1, District 1, Ho Chi Minh City',
            recipient: 'John Doe',
            phone: '0987654321',
            default: true,
        },
        {
            addressId: 'addr2',
            addressName: '456 Work Ave, Ward 5, Binh Thanh District, Ho Chi Minh City',
            recipient: 'John Doe',
            phone: '0123456789',
            default: false,
        },
    ],
};

export const fakeOrder = {
    totalAmount: 1150000,
    items: [
        {
            productDetailId: 'pd1',
            imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Product+A',
            productName: 'Áo Sơ Mi Cao Cấp',
            quantity: 1,
            colorName: 'Trắng',
            sizeName: 'L',
            discountPrice: 500000,
            originalPrice: 600000,
        },
        {
            productDetailId: 'pd2',
            imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Product+B',
            productName: 'Quần Jeans Rách Gối',
            quantity: 1,
            colorName: 'Xanh Đen',
            sizeName: '32',
            discountPrice: 650000,
            originalPrice: 700000,
        },
    ],
};

export const fakeVouchers = [
    {
        userPromotionId: 'user_promo_1',
        promotion: {
            promoCode: 'GIAM10',
            discountType: 'PERCENTATE',
            discountValue: 10,
            maxValue: 50000,
            minOrderValue: 200000,
            description: 'Giảm 10% cho đơn từ 200k, tối đa 50k',
        },
    },
    {
        userPromotionId: 'user_promo_2',
        promotion: {
            promoCode: 'FREESHIP',
            discountType: 'VALUE',
            discountValue: 30000,
            maxValue: 30000,
            minOrderValue: 100000,
            description: 'Giảm 30k phí ship',
        },
    },
];
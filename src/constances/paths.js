const publicPaths = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    RESET_PASSWORD: '/reset-password',
    PRODUCT_DETAIL: '/product/:id',
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDER_SUCCESS: '/order-success',
    ORDER_HISTORY: '/order-history',
    CONTACT: '/contact',
    ABOUT: '/about',
}

const adminPaths = {
    DASHBOARD: '',
    USERS: 'users',
    BRAND: 'brand',
    SERIES: 'series',
    PRODUCTS: 'products',
    ORDERS: 'orders',
    ORDER_CONFIRMS: 'orders/confirms',
    ORDER_MANAGEMENT: 'orders/management',
    VOUCHERS: 'vouchers',
}
export { publicPaths, adminPaths };
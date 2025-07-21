import GoogleCallback from "~/pages/public/auth/GoogleCallback";

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
    PROFILE: '/profile',
    GOOGLECALLBACK: "/login/callback",
    //
    USER_HOME: '/user',
    USER_PROFILE: '/user/profile',
    USER_CHANGEPASSWORD: '/user/change_password',
    USER_ORDER: '/user/order',
    USER_VOURCHER: '/user/voucher',
}

const adminPaths = {
    DASHBOARD: '',
    USERS: 'users',
    BRAND: 'brand',
    SERIES: 'series',
    PRODUCTS: 'products',
    ORDERS: 'orders',
    VOUCHERS: 'vouchers',
}
export { publicPaths, adminPaths };
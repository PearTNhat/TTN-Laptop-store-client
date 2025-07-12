const publicPaths = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    RESET_PASSWORD: '/reset-password',
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDER_SUCCESS: '/order-success',
    ORDER_HISTORY: '/order-history',
    CONTACT: '/contact',
    ABOUT: '/about',
}
const productPaths = {
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/:pId',
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
const demoPaths = {
    CART_DEMO: '/demo/cart',
    TEST_CART: '    ',
}
export { publicPaths, adminPaths, productPaths, demoPaths };
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
const orderPaths = {
    CHECKOUT: '/checkout',
    ORDER: '/orders',
}
const adminPaths = {
    DASHBOARD: '',
    USERS: 'users',
    BRAND: 'brand',
    SERIES: 'series',
    CATEGORY: 'category',
    COLOR: 'color',
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
export { publicPaths, adminPaths, productPaths, demoPaths, orderPaths };
/**
 * API 配置
 */

// API 基础地址 - 开发环境使用本地，生产环境替换为实际地址
export const API_BASE_URL = 'http://localhost:3000/api';

// 当前店铺 ID - 后续可从域名或配置中动态获取
export const SHOP_ID = 'default-shop';

// 存储 Key
export const STORAGE_KEYS = {
    TOKEN: 'water_mall_token',
    USER_INFO: 'water_mall_user',
    CART: 'water_mall_cart',
};

// 订单状态映射
export const ORDER_STATUS = {
    PENDING: { text: '待支付', color: '#ff9800' },
    PAID: { text: '已支付', color: '#4caf50' },
    DISPATCHED: { text: '派送中', color: '#2196f3' },
    DELIVERING: { text: '配送中', color: '#2196f3' },
    COMPLETED: { text: '已完成', color: '#9e9e9e' },
    CANCELLED: { text: '已取消', color: '#f44336' },
};

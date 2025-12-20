
export const PERMISSIONS = {
    // Dashboard
    DASHBOARD: { code: 'DASHBOARD', label: '查看看板' },

    // User Management
    USER_READ: { code: 'USER_READ', label: '查看会员' },
    USER_WRITE: { code: 'USER_WRITE', label: '编辑会员(充值/积分/券)' },

    // Order Management
    ORDER_READ: { code: 'ORDER_READ', label: '查看订单' },
    ORDER_WRITE: { code: 'ORDER_WRITE', label: '处理订单(发货/退款)' },

    // Product Management
    PRODUCT_READ: { code: 'PRODUCT_READ', label: '查看商品' },
    PRODUCT_WRITE: { code: 'PRODUCT_WRITE', label: '编辑商品' },

    // Settings
    SETTINGS_ALL: { code: 'SETTINGS_ALL', label: '系统设置(店铺/积分/配送)' },

    // Admin Management (Roles & Accounts)
    ADMIN_READ: { code: 'ADMIN_READ', label: '查看管理员' },
    ADMIN_WRITE: { code: 'ADMIN_WRITE', label: '编辑管理员/权限' },
};

export const PERMISSION_LIST = Object.values(PERMISSIONS);

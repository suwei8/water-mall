/**
 * 请求封装
 */
import { API_BASE_URL, STORAGE_KEYS, SHOP_ID } from '@/config';

interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    header?: Record<string, string>;
    needAuth?: boolean;
}

interface ApiResponse<T = any> {
    data: T;
    statusCode: number;
}

/**
 * 封装 uni.request
 */
export function request<T = any>(options: RequestOptions): Promise<T> {
    return new Promise((resolve, reject) => {
        const token = uni.getStorageSync(STORAGE_KEYS.TOKEN);

        const header: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.header,
        };

        if (options.needAuth && token) {
            header['Authorization'] = `Bearer ${token}`;
        }

        uni.request({
            url: `${API_BASE_URL}${options.url}`,
            method: options.method || 'GET',
            data: options.data,
            header,
            success: (res: any) => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    resolve(res.data as T);
                } else if (res.statusCode === 401) {
                    // Token 过期，跳转登录
                    uni.removeStorageSync(STORAGE_KEYS.TOKEN);
                    uni.removeStorageSync(STORAGE_KEYS.USER_INFO);
                    uni.showToast({ title: '请先登录', icon: 'none' });
                    setTimeout(() => {
                        uni.navigateTo({ url: '/pages/mine/index' });
                    }, 1500);
                    reject(new Error('Unauthorized'));
                } else {
                    const errMsg = res.data?.message || '请求失败';
                    uni.showToast({ title: errMsg, icon: 'none' });
                    reject(new Error(errMsg));
                }
            },
            fail: (err) => {
                uni.showToast({ title: '网络错误', icon: 'none' });
                reject(err);
            },
        });
    });
}

/**
 * Shop API - 公开接口
 */
export const shopApi = {
    // 获取店铺信息
    getInfo: () => request({ url: `/shop/${SHOP_ID}/info` }),

    // 获取分类
    getCategories: () => request({ url: `/shop/${SHOP_ID}/categories` }),

    // 获取商品列表
    getProducts: (params?: { categoryId?: string; page?: number; size?: number }) => {
        const query = new URLSearchParams();
        if (params?.categoryId) query.append('categoryId', params.categoryId);
        if (params?.page) query.append('page', String(params.page));
        if (params?.size) query.append('size', String(params.size));
        const queryStr = query.toString();
        return request({ url: `/shop/${SHOP_ID}/products${queryStr ? '?' + queryStr : ''}` });
    },

    // 获取商品详情
    getProductDetail: (productId: string) =>
        request({ url: `/shop/${SHOP_ID}/products/${productId}` }),
};

/**
 * Cart API - 需要登录
 */
export const cartApi = {
    validate: (items: any[]) =>
        request({ url: '/cart/validate', method: 'POST', data: { items }, needAuth: true }),

    calculate: (items: any[]) =>
        request({ url: '/cart/calculate', method: 'POST', data: { items }, needAuth: true }),
};

/**
 * Address API - 需要登录
 */
export const addressApi = {
    list: () => request({ url: '/address', needAuth: true }),

    get: (id: string) => request({ url: `/address/${id}`, needAuth: true }),

    create: (data: any) =>
        request({ url: '/address', method: 'POST', data, needAuth: true }),

    update: (id: string, data: any) =>
        request({ url: `/address/${id}`, method: 'PUT', data, needAuth: true }),

    delete: (id: string) =>
        request({ url: `/address/${id}`, method: 'DELETE', needAuth: true }),

    setDefault: (id: string) =>
        request({ url: `/address/${id}/default`, method: 'POST', needAuth: true }),
};

/**
 * Order API - 需要登录
 */
export const orderApi = {
    create: (data: any) =>
        request({ url: '/user-orders', method: 'POST', data, needAuth: true }),

    list: (params?: { status?: string; page?: number; size?: number }) => {
        const query = new URLSearchParams();
        if (params?.status) query.append('status', params.status);
        if (params?.page) query.append('page', String(params.page));
        if (params?.size) query.append('size', String(params.size));
        const queryStr = query.toString();
        return request({ url: `/user-orders${queryStr ? '?' + queryStr : ''}`, needAuth: true });
    },

    detail: (id: string) => request({ url: `/user-orders/${id}`, needAuth: true }),

    cancel: (id: string) =>
        request({ url: `/user-orders/${id}/cancel`, method: 'POST', needAuth: true }),
};

/**
 * Auth API
 */
export const authApi = {
    login: (username: string, password: string) =>
        request({ url: '/auth/login', method: 'POST', data: { username, password } }),
};

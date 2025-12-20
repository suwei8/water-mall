import { request } from '@umijs/max';

// 用户管理 API
export async function getUsers(params: {
    current?: number;
    pageSize?: number;
    search?: string;
}) {
    return request<API.UserList>('/api/users', {
        method: 'GET',
        params,
    });
}

export async function getUser(id: string) {
    return request<API.UserDetail>(`/api/users/${id}`, {
        method: 'GET',
    });
}

export async function getUserOrders(id: string, params: {
    current?: number;
    pageSize?: number;
}) {
    return request<API.OrderList>(`/api/users/${id}/orders`, {
        method: 'GET',
        params,
    });
}

// 优惠券管理 API
export async function getCoupons(params: {
    current?: number;
    pageSize?: number;
}) {
    return request<API.CouponList>('/api/coupons', {
        method: 'GET',
        params,
    });
}

export async function createCoupon(data: API.CouponCreate) {
    return request<API.Coupon>('/api/coupons', {
        method: 'POST',
        data,
    });
}

export async function updateCoupon(id: string, data: API.CouponCreate) {
    return request<API.Coupon>(`/api/coupons/${id}`, {
        method: 'PUT',
        data,
    });
}

export async function deleteCoupon(id: string) {
    return request(`/api/coupons/${id}`, {
        method: 'DELETE',
    });
}

// 统计 API
export async function getStatsOverview() {
    return request<API.StatsOverview>('/api/stats/overview', {
        method: 'GET',
    });
}

export async function getSalesTrend(params: { period?: string }) {
    return request<API.SalesTrend>('/api/stats/sales', {
        method: 'GET',
        params,
    });
}

// 店铺设置 API
export async function getShopSettings() {
    return request<API.ShopSettings>('/api/shop', {
        method: 'GET',
    });
}

export async function updateShopSettings(data: API.ShopSettings) {
    return request<API.ShopSettings>('/api/shop', {
        method: 'PUT',
        data,
    });
}

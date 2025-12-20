import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { STORAGE_KEYS } from '@/config';

export interface UserInfo {
    id: string;
    name: string;
    mobile: string;
    balance: number;
    points: number;
}

export const useUserStore = defineStore('user', () => {
    const token = ref<string>('');
    const userInfo = ref<UserInfo | null>(null);

    // 从本地存储加载
    const loadUser = () => {
        try {
            token.value = uni.getStorageSync(STORAGE_KEYS.TOKEN) || '';
            const userStr = uni.getStorageSync(STORAGE_KEYS.USER_INFO);
            if (userStr) {
                userInfo.value = JSON.parse(userStr);
            }
        } catch (e) {
            token.value = '';
            userInfo.value = null;
        }
    };

    // 设置登录信息
    const setLogin = (newToken: string, user?: UserInfo) => {
        token.value = newToken;
        uni.setStorageSync(STORAGE_KEYS.TOKEN, newToken);

        if (user) {
            userInfo.value = user;
            uni.setStorageSync(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
        }
    };

    // 登出
    const logout = () => {
        token.value = '';
        userInfo.value = null;
        uni.removeStorageSync(STORAGE_KEYS.TOKEN);
        uni.removeStorageSync(STORAGE_KEYS.USER_INFO);
    };

    // 是否已登录
    const isLoggedIn = computed(() => !!token.value);

    // 初始化加载
    loadUser();

    return {
        token,
        userInfo,
        isLoggedIn,
        setLogin,
        logout,
        loadUser,
    };
});

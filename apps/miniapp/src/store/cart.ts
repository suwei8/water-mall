import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { STORAGE_KEYS } from '@/config';

export interface CartItem {
    productId: string;
    name: string;
    image: string;
    skuKey: string;
    skuName: string;
    price: number;
    quantity: number;
}

export const useCartStore = defineStore('cart', () => {
    // 购物车商品列表
    const items = ref<CartItem[]>([]);

    // 从本地存储加载
    const loadCart = () => {
        try {
            const stored = uni.getStorageSync(STORAGE_KEYS.CART);
            if (stored) {
                items.value = JSON.parse(stored);
            }
        } catch (e) {
            items.value = [];
        }
    };

    // 保存到本地存储
    const saveCart = () => {
        try {
            uni.setStorageSync(STORAGE_KEYS.CART, JSON.stringify(items.value));
        } catch (e) {
            console.error('Failed to save cart', e);
        }
    };

    // 添加商品
    const addItem = (item: CartItem) => {
        const existing = items.value.find(
            i => i.productId === item.productId && i.skuKey === item.skuKey
        );

        if (existing) {
            existing.quantity += item.quantity;
        } else {
            items.value.push({ ...item });
        }
        saveCart();
    };

    // 更新数量
    const updateQuantity = (productId: string, skuKey: string, quantity: number) => {
        const item = items.value.find(
            i => i.productId === productId && i.skuKey === skuKey
        );
        if (item) {
            if (quantity <= 0) {
                removeItem(productId, skuKey);
            } else {
                item.quantity = quantity;
                saveCart();
            }
        }
    };

    // 移除商品
    const removeItem = (productId: string, skuKey: string) => {
        const index = items.value.findIndex(
            i => i.productId === productId && i.skuKey === skuKey
        );
        if (index > -1) {
            items.value.splice(index, 1);
            saveCart();
        }
    };

    // 清空购物车
    const clearCart = () => {
        items.value = [];
        saveCart();
    };

    // 计算属性
    const totalCount = computed(() =>
        items.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    const totalAmount = computed(() =>
        items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );

    const isEmpty = computed(() => items.value.length === 0);

    // 初始化加载
    loadCart();

    return {
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        loadCart,
        totalCount,
        totalAmount,
        isEmpty,
    };
});

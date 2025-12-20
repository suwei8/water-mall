<template>
  <view class="container">
    <!-- 购物车列表 -->
    <view class="cart-list" v-if="!cartStore.isEmpty">
      <view 
        v-for="item in cartStore.items" 
        :key="`${item.productId}-${item.skuKey}`" 
        class="cart-item"
      >
        <image class="item-image" :src="item.image" mode="aspectFill" />
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-sku">{{ item.skuName }}</text>
          <view class="item-bottom">
            <text class="item-price">¥{{ item.price }}</text>
            <view class="quantity-control">
              <view class="qty-btn" @click="decreaseQty(item)">-</view>
              <text class="qty-num">{{ item.quantity }}</text>
              <view class="qty-btn" @click="increaseQty(item)">+</view>
            </view>
          </view>
        </view>
        <view class="delete-btn" @click="removeItem(item)">
          <text>×</text>
        </view>
      </view>
    </view>

    <!-- 空购物车 -->
    <view class="empty" v-else>
      <text class="empty-icon">🛒</text>
      <text class="empty-text">购物车是空的</text>
      <view class="go-shopping" @click="goShopping">
        去逛逛
      </view>
    </view>

    <!-- 底部结算栏 -->
    <view class="checkout-bar" v-if="!cartStore.isEmpty">
      <view class="total-info">
        <text class="total-label">合计：</text>
        <text class="total-amount">¥{{ cartStore.totalAmount.toFixed(2) }}</text>
      </view>
      <view class="checkout-btn" @click="goCheckout">
        去结算({{ cartStore.totalCount }})
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useCartStore, type CartItem } from '@/store';
import { useUserStore } from '@/store';

const cartStore = useCartStore();
const userStore = useUserStore();

const increaseQty = (item: CartItem) => {
  cartStore.updateQuantity(item.productId, item.skuKey, item.quantity + 1);
};

const decreaseQty = (item: CartItem) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.productId, item.skuKey, item.quantity - 1);
  } else {
    removeItem(item);
  }
};

const removeItem = (item: CartItem) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该商品吗？',
    success: (res) => {
      if (res.confirm) {
        cartStore.removeItem(item.productId, item.skuKey);
      }
    },
  });
};

const goShopping = () => {
  uni.switchTab({ url: '/pages/index/index' });
};

const goCheckout = () => {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    uni.switchTab({ url: '/pages/mine/index' });
    return;
  }
  uni.navigateTo({ url: '/pages/order/confirm' });
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.cart-list {
  padding: 20rpx;
}

.cart-item {
  display: flex;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  position: relative;
}

.item-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20rpx;
  padding-right: 40rpx;
}

.item-name {
  font-size: 28rpx;
  color: #333;
}

.item-sku {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}

.item-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.quantity-control {
  display: flex;
  align-items: center;
}

.qty-btn {
  width: 50rpx;
  height: 50rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #666;
}

.qty-num {
  min-width: 60rpx;
  text-align: center;
  font-size: 28rpx;
}

.delete-btn {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn text {
  font-size: 36rpx;
  color: #999;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.empty-icon {
  font-size: 100rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}

.go-shopping {
  margin-top: 40rpx;
  padding: 20rpx 60rpx;
  background-color: #1890ff;
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.checkout-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.total-info {
  display: flex;
  align-items: center;
}

.total-label {
  font-size: 28rpx;
  color: #666;
}

.total-amount {
  font-size: 36rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.checkout-btn {
  padding: 20rpx 60rpx;
  background-color: #ff4d4f;
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
}
</style>

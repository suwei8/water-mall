<template>
  <view class="container">
    <!-- 地址选择 -->
    <view class="address-section" @click="goSelectAddress">
      <view v-if="selectedAddress" class="address-content">
        <view class="address-header">
          <text class="address-name">{{ selectedAddress.name }}</text>
          <text class="address-phone">{{ selectedAddress.phone }}</text>
        </view>
        <text class="address-detail">
          {{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}
        </text>
      </view>
      <view v-else class="no-address">
        <text>请选择收货地址</text>
      </view>
      <text class="arrow">›</text>
    </view>

    <!-- 商品列表 -->
    <view class="goods-section">
      <text class="section-title">商品清单</text>
      <view class="goods-list">
        <view v-for="item in cartStore.items" :key="`${item.productId}-${item.skuKey}`" class="goods-item">
          <image class="goods-image" :src="item.image" mode="aspectFill" />
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-sku">{{ item.skuName }}</text>
            <view class="goods-bottom">
              <text class="goods-price">¥{{ item.price }}</text>
              <text class="goods-qty">×{{ item.quantity }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 备注 -->
    <view class="remark-section">
      <text class="remark-label">订单备注</text>
      <input class="remark-input" v-model="remark" placeholder="选填，请输入备注信息" />
    </view>

    <!-- 底部结算 -->
    <view class="checkout-bar">
      <view class="total">
        <text class="total-label">合计：</text>
        <text class="total-amount">¥{{ cartStore.totalAmount.toFixed(2) }}</text>
      </view>
      <view class="submit-btn" @click="submitOrder">
        提交订单
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCartStore, useUserStore } from '@/store';
import { orderApi, addressApi } from '@/utils/request';

interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

const cartStore = useCartStore();
const userStore = useUserStore();

const selectedAddress = ref<Address | null>(null);
const remark = ref('');
const submitting = ref(false);

const loadDefaultAddress = async () => {
  try {
    const res = await addressApi.list();
    if (res.list && res.list.length > 0) {
      // 优先选择默认地址
      const defaultAddr = res.list.find((a: Address) => a.isDefault);
      selectedAddress.value = defaultAddr || res.list[0];
    }
  } catch (e) {
    console.error('Failed to load address', e);
  }
};

const goSelectAddress = () => {
  uni.navigateTo({ url: '/pages/address/list?select=1' });
};

const submitOrder = async () => {
  if (!selectedAddress.value) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' });
    return;
  }

  if (cartStore.isEmpty) {
    uni.showToast({ title: '购物车为空', icon: 'none' });
    return;
  }

  if (submitting.value) return;
  submitting.value = true;

  uni.showLoading({ title: '提交中...' });

  try {
    const orderItems = cartStore.items.map(item => ({
      productId: item.productId,
      skuKey: item.skuKey,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      image: item.image,
    }));

    const res = await orderApi.create({
      items: orderItems,
      address: {
        name: selectedAddress.value.name,
        phone: selectedAddress.value.phone,
        province: selectedAddress.value.province,
        city: selectedAddress.value.city,
        district: selectedAddress.value.district,
        detail: selectedAddress.value.detail,
      },
      remark: remark.value,
    });

    cartStore.clearCart();

    uni.showToast({ title: '下单成功', icon: 'success' });
    
    setTimeout(() => {
      uni.redirectTo({ url: `/pages/order/list` });
    }, 1500);

  } catch (e: any) {
    uni.showToast({ title: e.message || '下单失败', icon: 'none' });
  } finally {
    uni.hideLoading();
    submitting.value = false;
  }
};

onMounted(() => {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    uni.switchTab({ url: '/pages/mine/index' });
    return;
  }
  loadDefaultAddress();
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.address-section {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.address-content {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.address-name {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  margin-right: 20rpx;
}

.address-phone {
  font-size: 28rpx;
  color: #666;
}

.address-detail {
  font-size: 26rpx;
  color: #666;
}

.no-address {
  flex: 1;
  color: #999;
  font-size: 28rpx;
}

.arrow {
  font-size: 32rpx;
  color: #999;
}

.goods-section {
  background-color: #fff;
  padding: 30rpx;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.goods-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.goods-item:last-child {
  border-bottom: none;
}

.goods-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
}

.goods-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goods-name {
  font-size: 28rpx;
  color: #333;
}

.goods-sku {
  font-size: 24rpx;
  color: #999;
}

.goods-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.goods-price {
  font-size: 28rpx;
  color: #ff4d4f;
}

.goods-qty {
  font-size: 26rpx;
  color: #999;
}

.remark-section {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
}

.remark-label {
  font-size: 28rpx;
  color: #333;
  margin-right: 20rpx;
}

.remark-input {
  flex: 1;
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

.total {
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

.submit-btn {
  padding: 20rpx 60rpx;
  background-color: #ff4d4f;
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
}
</style>

<template>
  <view class="container">
    <view v-if="orders.length" class="order-list">
      <view v-for="order in orders" :key="order.id" class="order-card">
        <view class="order-header">
          <text class="order-id">订单号：{{ order.id.slice(0, 8) }}...</text>
          <text class="order-status" :style="{ color: getStatusColor(order.status) }">
            {{ getStatusText(order.status) }}
          </text>
        </view>
        
        <view class="order-goods">
          <view v-for="(item, idx) in (order.items as any[])" :key="idx" class="goods-item">
            <image class="goods-image" :src="item.image" mode="aspectFill" />
            <view class="goods-info">
              <text class="goods-name">{{ item.name }}</text>
              <text class="goods-price">¥{{ item.price }} × {{ item.quantity }}</text>
            </view>
          </view>
        </view>

        <view class="order-footer">
          <text class="order-total">合计：¥{{ order.payAmount }}</text>
          <view v-if="order.status === 'PENDING'" class="order-actions">
            <view class="btn-cancel" @click="cancelOrder(order.id)">取消</view>
            <view class="btn-pay" @click="payOrder(order.id)">去支付</view>
          </view>
        </view>
      </view>
    </view>

    <view v-else-if="!loading" class="empty">
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无订单</text>
    </view>

    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { orderApi } from '@/utils/request';
import { ORDER_STATUS } from '@/config';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  payAmount: number;
  items: any[];
  createdAt: string;
}

const orders = ref<Order[]>([]);
const loading = ref(true);

const loadOrders = async () => {
  loading.value = true;
  try {
    const res = await orderApi.list({ page: 1, size: 20 });
    orders.value = res.list || [];
  } catch (e) {
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

const getStatusText = (status: string) => {
  return (ORDER_STATUS as any)[status]?.text || status;
};

const getStatusColor = (status: string) => {
  return (ORDER_STATUS as any)[status]?.color || '#666';
};

const cancelOrder = async (orderId: string) => {
  uni.showModal({
    title: '确认取消',
    content: '确定要取消该订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await orderApi.cancel(orderId);
          uni.showToast({ title: '已取消', icon: 'success' });
          loadOrders();
        } catch (e) {
          uni.showToast({ title: '取消失败', icon: 'none' });
        }
      }
    },
  });
};

const payOrder = (orderId: string) => {
  // TODO: 实现微信支付
  uni.showToast({ title: '支付功能开发中', icon: 'none' });
};

onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.order-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.order-id {
  font-size: 26rpx;
  color: #999;
}

.order-status {
  font-size: 26rpx;
  font-weight: bold;
}

.order-goods {
  padding: 20rpx 0;
}

.goods-item {
  display: flex;
  margin-bottom: 16rpx;
}

.goods-item:last-child {
  margin-bottom: 0;
}

.goods-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
}

.goods-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.goods-name {
  font-size: 26rpx;
  color: #333;
}

.goods-price {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

.order-total {
  font-size: 28rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.order-actions {
  display: flex;
  gap: 20rpx;
}

.btn-cancel, .btn-pay {
  padding: 12rpx 30rpx;
  font-size: 26rpx;
  border-radius: 30rpx;
}

.btn-cancel {
  border: 1rpx solid #ddd;
  color: #666;
}

.btn-pay {
  background-color: #ff4d4f;
  color: #fff;
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

.loading {
  text-align: center;
  padding: 40rpx;
  color: #999;
}
</style>

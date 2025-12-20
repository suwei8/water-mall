<template>
  <view class="container">
    <view v-if="addresses.length" class="address-list">
      <view 
        v-for="addr in addresses" 
        :key="addr.id" 
        class="address-item"
        @click="handleSelect(addr)"
      >
        <view class="address-main">
          <view class="address-header">
            <text class="address-name">{{ addr.name }}</text>
            <text class="address-phone">{{ addr.phone }}</text>
            <text v-if="addr.isDefault" class="default-tag">默认</text>
          </view>
          <text class="address-detail">
            {{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}
          </text>
        </view>
        <view class="address-actions">
          <view class="action-btn" @click.stop="editAddress(addr)">编辑</view>
          <view class="action-btn" @click.stop="setDefault(addr)" v-if="!addr.isDefault">设为默认</view>
          <view class="action-btn delete" @click.stop="deleteAddress(addr)">删除</view>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-icon">📍</text>
      <text class="empty-text">暂无收货地址</text>
    </view>

    <view class="add-btn" @click="addAddress">
      + 添加新地址
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { addressApi } from '@/utils/request';

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

const addresses = ref<Address[]>([]);
const isSelectMode = ref(false);

const loadAddresses = async () => {
  try {
    const res = await addressApi.list();
    addresses.value = res.list || [];
  } catch (e) {
    addresses.value = [];
  }
};

const handleSelect = (addr: Address) => {
  if (isSelectMode.value) {
    // 返回上一页并传递选中的地址
    const pages = getCurrentPages();
    if (pages.length > 1) {
      const prevPage = pages[pages.length - 2] as any;
      if (prevPage.setSelectedAddress) {
        prevPage.setSelectedAddress(addr);
      }
    }
    uni.navigateBack();
  }
};

const addAddress = () => {
  uni.navigateTo({ url: '/pages/address/edit' });
};

const editAddress = (addr: Address) => {
  uni.navigateTo({ url: `/pages/address/edit?id=${addr.id}` });
};

const setDefault = async (addr: Address) => {
  try {
    await addressApi.setDefault(addr.id);
    uni.showToast({ title: '设置成功', icon: 'success' });
    loadAddresses();
  } catch (e) {
    uni.showToast({ title: '设置失败', icon: 'none' });
  }
};

const deleteAddress = (addr: Address) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await addressApi.delete(addr.id);
          uni.showToast({ title: '已删除', icon: 'success' });
          loadAddresses();
        } catch (e) {
          uni.showToast({ title: '删除失败', icon: 'none' });
        }
      }
    },
  });
};

onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  isSelectMode.value = currentPage.options?.select === '1';
  loadAddresses();
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.address-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
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
  margin-right: 16rpx;
}

.default-tag {
  font-size: 22rpx;
  color: #1890ff;
  background-color: #e6f7ff;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.address-detail {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.address-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
  gap: 30rpx;
}

.action-btn {
  font-size: 26rpx;
  color: #1890ff;
}

.action-btn.delete {
  color: #ff4d4f;
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

.add-btn {
  position: fixed;
  bottom: 30rpx;
  left: 30rpx;
  right: 30rpx;
  padding: 30rpx;
  background-color: #1890ff;
  color: #fff;
  text-align: center;
  border-radius: 16rpx;
  font-size: 30rpx;
}
</style>

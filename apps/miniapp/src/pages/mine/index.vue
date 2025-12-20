<template>
  <view class="container">
    <!-- 已登录 -->
    <view v-if="userStore.isLoggedIn">
      <!-- 用户信息 -->
      <view class="user-header">
        <image class="avatar" src="https://img.yzcdn.cn/vant/cat.jpeg" mode="aspectFill" />
        <view class="user-info">
          <text class="user-name">{{ userStore.userInfo?.name || '用户' }}</text>
          <text class="user-mobile">{{ userStore.userInfo?.mobile }}</text>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-group">
        <view class="menu-item" @click="goToOrders">
          <text class="menu-icon">📦</text>
          <text class="menu-text">我的订单</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goToAddress">
          <text class="menu-icon">📍</text>
          <text class="menu-text">地址管理</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>

      <!-- 登出按钮 -->
      <view class="logout-btn" @click="handleLogout">
        退出登录
      </view>
    </view>

    <!-- 未登录 -->
    <view v-else class="login-section">
      <view class="login-header">
        <image class="login-avatar" src="https://img.yzcdn.cn/vant/user-inactive.png" mode="aspectFill" />
        <text class="login-tip">登录后查看您的订单</text>
      </view>

      <!-- 登录表单 -->
      <view class="login-form">
        <input 
          class="login-input" 
          v-model="mobile" 
          type="number" 
          placeholder="请输入手机号" 
          maxlength="11"
        />
        <input 
          class="login-input" 
          v-model="password" 
          type="password" 
          placeholder="请输入密码"
        />
        <view class="login-btn" @click="handleLogin">
          登录
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/store';
import { authApi } from '@/utils/request';

const userStore = useUserStore();

const mobile = ref('');
const password = ref('');

const handleLogin = async () => {
  if (!mobile.value || mobile.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  if (!password.value) {
    uni.showToast({ title: '请输入密码', icon: 'none' });
    return;
  }

  uni.showLoading({ title: '登录中...' });

  try {
    const res = await authApi.login(mobile.value, password.value);
    
    if (res.access_token) {
      userStore.setLogin(res.access_token, {
        id: 'user-id',
        name: '用户',
        mobile: mobile.value,
        balance: 0,
        points: 0,
      });
      
      uni.showToast({ title: '登录成功', icon: 'success' });
    }
  } catch (e: any) {
    uni.showToast({ title: e.message || '登录失败', icon: 'none' });
  } finally {
    uni.hideLoading();
  }
};

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
        uni.showToast({ title: '已退出', icon: 'success' });
      }
    },
  });
};

const goToOrders = () => {
  uni.navigateTo({ url: '/pages/order/list' });
};

const goToAddress = () => {
  uni.navigateTo({ url: '/pages/address/list' });
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.user-header {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  padding: 60rpx 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid #fff;
}

.user-info {
  margin-left: 30rpx;
}

.user-name {
  font-size: 36rpx;
  color: #fff;
  font-weight: bold;
}

.user-mobile {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10rpx;
}

.menu-group {
  background-color: #fff;
  margin-top: 20rpx;
  border-radius: 16rpx;
  margin: 20rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.menu-arrow {
  font-size: 32rpx;
  color: #999;
}

.logout-btn {
  margin: 60rpx 30rpx;
  padding: 24rpx;
  background-color: #fff;
  text-align: center;
  color: #ff4d4f;
  font-size: 30rpx;
  border-radius: 16rpx;
}

.login-section {
  padding: 60rpx 30rpx;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}

.login-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
}

.login-tip {
  font-size: 28rpx;
  color: #999;
  margin-top: 30rpx;
}

.login-form {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.login-input {
  width: 100%;
  height: 90rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
}

.login-btn {
  width: 100%;
  padding: 24rpx;
  background-color: #1890ff;
  color: #fff;
  text-align: center;
  border-radius: 12rpx;
  font-size: 32rpx;
  margin-top: 20rpx;
}
</style>

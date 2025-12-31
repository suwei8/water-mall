<template>
  <view class="container">
    <!-- Logged In State -->
    <view v-if="userStore.isLoggedIn" class="user-content">
      <!-- Header with Wave -->
      <view class="header-section">
        <view class="user-card">
          <image class="avatar" src="https://img.yzcdn.cn/vant/cat.jpeg" mode="aspectFill" />
          <view class="user-info">
            <text class="user-name">{{ userStore.userInfo?.name || '尊贵的用户' }}</text>
            <text class="user-vip">金牌会员</text>
          </view>
          <view class="header-right" @click="goToSettings">
             <text class="setting-text">设置 ></text>
          </view>
        </view>
        <view class="water-wave"></view>
      </view>

      <!-- Assets Board -->
      <view class="assets-card">
         <view class="asset-item" @click="goToMyTickets">
            <text class="asset-value">12</text>
            <text class="asset-label">剩余水票</text>
         </view>
         <view class="divider"></view>
         <view class="asset-item" @click="goToMyDeposits">
            <text class="asset-value">50.0</text>
            <text class="asset-label">桶押金(元)</text>
         </view>
         <view class="divider"></view>
         <view class="asset-item">
            <text class="asset-value">1050</text>
            <text class="asset-label">当前积分</text>
         </view>
      </view>

      <!-- Menu Grid -->
      <view class="menu-grid">
         <view class="menu-item" @click="goToOrders">
            <text class="menu-icon" style="background: #E6F7FF; color: #00A0E9;">📦</text>
            <text class="menu-text">全部订单</text>
         </view>
         <view class="menu-item" @click="goToExchange">
            <text class="menu-icon" style="background: #FFF7E6; color: #FA8C16;">🎫</text>
            <text class="menu-text">水票兑换</text>
         </view>
         <view class="menu-item" @click="goToBucketReturn">
             <text class="menu-icon" style="background: #E6FFFB; color: #13C2C2;">🔄</text>
            <text class="menu-text">预约退桶</text>
         </view>
         <view class="menu-item" @click="goToAddress">
            <text class="menu-icon" style="background: #F9F0FF; color: #722ED1;">📍</text>
            <text class="menu-text">地址管理</text>
         </view>
         <view class="menu-item" @click="contactService">
            <text class="menu-icon" style="background: #FFF0F6; color: #EB2F96;">🎧</text>
            <text class="menu-text">联系客服</text>
         </view>
      </view>

      <!-- Banner -->
      <view class="promo-banner">
         <image class="banner-img" src="/static/banner-invite.png" mode="aspectFill" />
      </view>

      <view class="logout-btn" @click="handleLogout">
        退出登录
      </view>
    </view>

    <!-- Not Logged In -->
    <view v-else class="login-section">
      <view class="login-header">
        <view class="logo-circle">
           <text class="logo-text">水</text>
        </view>
        <text class="app-name">送水到家</text>
        <text class="app-slogan">好水·好生活</text>
      </view>

      <view class="login-form">
        <view class="input-group">
           <input 
            class="login-input" 
            v-model="mobile" 
            type="number" 
            placeholder="请输入手机号" 
            maxlength="11"
          />
        </view>
        <view class="input-group">
           <input 
            class="login-input" 
            v-model="password" 
            type="password" 
            placeholder="请输入密码"
          />
        </view>
        <view class="login-btn" @click="handleLogin">
          立即登录
        </view>
        <text class="login-tip">未注册手机号验证后自动创建账户</text>
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
        name: '用户' + mobile.value.slice(-4),
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
      }
    },
  });
};

const goToOrders = () => uni.navigateTo({ url: '/pages/order/list' });
const goToAddress = () => uni.navigateTo({ url: '/pages/address/list' });
const goToMyTickets = () => { /* uni.navigateTo({ url: '/pages/ticket/my' }) */ };
const goToMyDeposits = () => { /* uni.navigateTo({ url: '/pages/deposit/my' }) */ };
const goToExchange = () => { /* uni.navigateTo({ url: '/pages/ticket/exchange' }) */ };
const goToBucketReturn = () => { /* uni.navigateTo({ url: '/pages/service/return' }) */ };
const goToSettings = () => { /* uni.navigateTo({ url: '/pages/settings/index' }) */ };
const contactService = () => uni.makePhoneCall({ phoneNumber: '400-888-8888' });

</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F7F8FA;
}

/* Header */
.header-section {
  background: linear-gradient(135deg, #00C6FF 0%, $uni-color-primary 100%);
  padding: 60px 20px 80px; /* Extra padding bottom for overlap */
  position: relative;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.user-card {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  
  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.8);
    margin-right: 16px;
  }
  
  .user-info {
    flex: 1;
    .user-name {
      font-size: 20px;
      color: #fff;
      font-weight: bold;
      display: block;
      margin-bottom: 4px;
    }
    .user-vip {
      display: inline-block;
      background: rgba(0,0,0,0.2);
      color: #FFD700;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 10px;
    }
  }
  
  .header-right {
    .setting-text {
      color: rgba(255,255,255,0.8);
      font-size: 12px;
    }
  }
}

/* Assets Card */
.assets-card {
  background: #fff;
  margin: -50px 20px 20px;
  border-radius: $uni-radius-card;
  padding: 20px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);

  .asset-item {
    text-align: center;
    flex: 1;
    
    .asset-value {
      display: block;
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
    }
    .asset-label {
        font-size: 12px;
        color: #666;
    }
  }
  
  .divider {
    width: 1px;
    height: 30px;
    background: #eee;
  }
}

/* Menu Grid */
.menu-grid {
  background: #fff;
  margin: 0 20px 20px;
  border-radius: $uni-radius-card;
  padding: 20px 10px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px 10px;
  
  .menu-item {
    text-align: center;
    .menu-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        margin: 0 auto 8px;
    }
    .menu-text {
        font-size: 12px;
        color: #333;
    }
  }
}

.promo-banner {
    margin: 0 20px 20px;
    height: 80px;
    border-radius: $uni-radius-card;
    overflow: hidden;
    background: #E6F7FF; /* Placeholder color */
    
    .banner-img {
      width: 100%;
      height: 100%;
    }
}

.logout-btn {
  margin: 20px 40px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* Login */
.login-section {
    padding: 60px 30px;
}

.login-header {
    text-align: center;
    margin-bottom: 60px;
    
    .logo-circle {
        width: 80px;
        height: 80px;
        background: $uni-color-primary;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        box-shadow: 0 8px 20px rgba(0, 160, 233, 0.3);
        
        .logo-text {
            color: #fff;
            font-size: 36px;
            font-weight: bold;
        }
    }
    
    .app-name {
        display: block;
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 8px;
    }
    .app-slogan {
        font-size: 14px;
        color: #999;
        letter-spacing: 2px;
    }
}

.login-form {
    .input-group {
        background: #fff;
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }
    
    .login-btn {
        background: linear-gradient(90deg, #00C6FF 0%, $uni-color-primary 100%);
        color: #fff;
        height: 50px;
        border-radius: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        margin-top: 40px;
        box-shadow: 0 8px 20px rgba(0, 160, 233, 0.3);
    }
    
    .login-tip {
        display: block;
        text-align: center;
        color: #ccc;
        font-size: 12px;
        margin-top: 20px;
    }
}
</style>

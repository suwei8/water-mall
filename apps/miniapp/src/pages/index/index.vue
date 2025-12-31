<template>
  <view class="container">
    <!-- Header: Location & Search -->
    <view class="header-section">
      <view class="location-bar">
        <view class="location-info">
          <text class="location-icon">📍</text>
          <text class="location-text">深圳市南山区科技园...</text>
          <text class="arrow-icon">></text>
        </view>
        <view class="header-right">
           <text class="msg-icon">🔔</text>
        </view>
      </view>
      <!-- One Click Order Card (Hero) -->
      <view class="hero-card">
        <view class="hero-content">
          <view class="last-order-info">
             <view class="order-tag">上次购买</view>
             <text class="order-title">农夫山泉 19L 桶装水</text>
             <text class="order-desc">已安全服务 30 天</text>
          </view>
          <view class="quick-btn" @click="quickOrder">
             <text>一键订水</text>
          </view>
        </view>
         <image class="hero-bg" src="/static/water-bg.png" mode="aspectFill" />
      </view>
    </view>

    <!-- Status Cards -->
    <view class="status-grid">
      <view class="status-card" @click="goToTickets">
        <text class="status-value">12</text>
        <text class="status-label">剩余水票</text>
        <text class="status-action">去兑换 ></text>
      </view>
      <view class="status-card" @click="goToBuckets">
        <text class="status-value">2</text>
        <text class="status-label">待还空桶</text>
        <text class="status-action">预约回收 ></text>
      </view>
       <view class="status-card" @click="goToDispatch">
        <text class="status-icon">🚚</text>
        <text class="status-label">配送中</text>
        <text class="status-desc">预计15分钟送达</text>
      </view>
    </view>

    <!-- Main Content Area -->
    <view class="main-content">
      <view class="section-header">
        <text class="section-title">热销好水</text>
        <text class="section-more">全部 ></text>
      </view>

      <view class="water-list" v-if="products.length">
        <view 
          v-for="product in products" 
          :key="product.id" 
          class="water-item"
        >
          <image class="water-img" :src="product.image" mode="aspectFill" />
          <view class="water-info">
            <text class="water-name">{{ product.name }}</text>
            <text class="water-desc">深层地下水 | 19L</text>
            <view class="water-tags">
               <text class="tag">支持水票</text>
               <text class="tag">免押金</text>
            </view>
            <view class="water-bottom">
              <view class="price-box">
                <text class="price-symbol">¥</text>
                <text class="price-num">{{ product.price }}</text>
                <text class="ticket-price"> / 1张水票</text>
              </view>
              <view class="add-btn" @click.stop="quickAddCart(product)">
                <text>+</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
       <!-- Loading/Empty -->
       <view class="loading" v-if="loading">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { shopApi } from '@/utils/request';
import { useCartStore } from '@/store';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  sales: number;
}

const cartStore = useCartStore();
const loading = ref(true);
const products = ref<Product[]>([]);

// Mock Data Load (Replace with API)
const loadData = async () => {
    loading.value = true;
    try {
        const res = await shopApi.getProducts({ size: 10 });
        products.value = res.list || [];
    } catch (e) {
        console.error('Failed to load', e);
    } finally {
        loading.value = false;
    }
}

const quickOrder = () => {
    uni.showToast({ title: '正在为您下单...', icon: 'none' });
}

const goToTickets = () => {
    // Navigate to ticket page
}

const goToBuckets = () => {
    // Navigate to bucket page
}

const goToDispatch = () => {
    // Navigate to order page
}

const quickAddCart = (product: Product) => {
  cartStore.addItem({
    productId: product.id,
    name: product.name,
    image: product.image,
    skuKey: 'default',
    skuName: '默认规格',
    price: product.price,
    quantity: 1,
  });
  uni.showToast({ title: '已加入购物车', icon: 'success' });
};

onMounted(() => {
    loadData();
});
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F7F8FA;
}

.header-section {
  background: linear-gradient(180deg, $uni-color-primary 0%, #F7F8FA 100%);
  padding: 44px 20px 20px;
  color: #fff;
}

.location-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  .location-info {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    
    .location-icon { margin-right: 6px; }
    .arrow-icon { margin-left: 6px; color: rgba(255,255,255,0.8); }
  }
}

.hero-card {
  background: #fff;
  border-radius: $uni-radius-card;
  padding: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 160, 233, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .hero-content {
    position: relative;
    z-index: 2;
    flex: 1;
  }
  
  .order-tag {
    display: inline-block;
    background: rgba(0, 160, 233, 0.1);
    color: $uni-color-primary;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    margin-bottom: 6px;
  }
  .order-title {
    display: block;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
  }
  .order-desc {
    font-size: 12px;
    color: #999;
    display: block;
    margin-bottom: 16px;
  }
  
  .quick-btn {
    background: linear-gradient(90deg, #00C6FF 0%, $uni-color-primary 100%);
    color: #fff;
    padding: 8px 20px;
    border-radius: 20px;
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 10px rgba(0, 160, 233, 0.3);
  }

  .hero-bg {
    position: absolute;
    right: -20px;
    bottom: -20px;
    width: 120px;
    height: 120px;
    opacity: 0.1;
  }
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 20px;
  margin-top: -10px; /* Overlap slightly if needed, or just standard spacing */
}

.status-card {
  background: #fff;
  border-radius: $uni-radius-card;
  padding: 16px 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  
  .status-value {
    display: block;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
  }
  .status-icon {
    display: block;
    font-size: 20px;
    margin-bottom: 4px;
  }
  .status-label {
    display: block;
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
  }
  .status-action, .status-desc {
    display: block;
    font-size: 10px;
    color: $uni-color-primary;
  }
  .status-desc { color: $uni-color-warning; }
}

.main-content {
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  .section-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  .section-more {
    font-size: 12px;
    color: #999;
  }
}

.water-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.water-item {
  background: #fff;
  border-radius: $uni-radius-card;
  padding: 16px;
  display: flex;
  
  .water-img {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    background: #f5f5f5;
    margin-right: 16px;
  }
  
  .water-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .water-name {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
    }
    .water-desc {
      font-size: 12px;
      color: #999;
      margin-bottom: 8px;
    }
    .water-tags {
      display: flex;
      gap: 6px;
      margin-bottom: 8px;
      
      .tag {
        font-size: 10px;
        color: $uni-color-primary;
        background: rgba(0, 160, 233, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
      }
    }
    
    .water-bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      
      .price-box {
        .price-symbol { font-size: 12px; color: #FF4D4F; font-weight: bold; }
        .price-num { font-size: 20px; color: #FF4D4F; font-weight: bold; }
        .ticket-price { font-size: 11px; color: $uni-color-accent; margin-left: 4px; }
      }
      
      .add-btn {
        width: 28px;
        height: 28px;
        background: $uni-color-primary;
        border-radius: 50%;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}
</style>

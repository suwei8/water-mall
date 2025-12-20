<template>
  <view class="container">
    <!-- 商品图片 -->
    <swiper class="product-swiper" indicator-dots autoplay>
      <swiper-item v-for="(img, idx) in product?.images || []" :key="idx">
        <image class="swiper-image" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 商品信息 -->
    <view class="product-info" v-if="product">
      <view class="price-row">
        <text class="current-price">¥{{ currentPrice }}</text>
        <text class="sales">已售{{ product.sales }}件</text>
      </view>
      <text class="product-name">{{ product.name }}</text>
      <text class="product-desc">{{ product.description || '暂无描述' }}</text>
    </view>

    <!-- SKU 选择 -->
    <view class="sku-section" v-if="skuList.length">
      <text class="section-title">选择规格</text>
      <view class="sku-list">
        <view 
          v-for="(sku, idx) in skuList" 
          :key="idx" 
          class="sku-item"
          :class="{ active: selectedSkuIndex === idx }"
          @click="selectSku(idx)"
        >
          {{ sku.spec || sku.name || `规格${idx + 1}` }}
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="action-left">
        <view class="action-icon" @click="goHome">
          <text>🏠</text>
          <text class="icon-text">首页</text>
        </view>
        <view class="action-icon" @click="goCart">
          <text>🛒</text>
          <text class="icon-text">购物车</text>
          <view class="cart-badge" v-if="cartStore.totalCount > 0">
            {{ cartStore.totalCount > 99 ? '99+' : cartStore.totalCount }}
          </view>
        </view>
      </view>
      <view class="action-btns">
        <view class="btn add-cart" @click="addToCart">
          加入购物车
        </view>
        <view class="btn buy-now" @click="buyNow">
          立即购买
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { shopApi } from '@/utils/request';
import { useCartStore, useUserStore } from '@/store';

interface SKU {
  spec?: string;
  name?: string;
  price: number;
  stock?: number;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  images: string[];
  skus: string | SKU[];
  sales: number;
}

const cartStore = useCartStore();
const userStore = useUserStore();

const product = ref<Product | null>(null);
const skuList = ref<SKU[]>([]);
const selectedSkuIndex = ref(0);

const currentPrice = computed(() => {
  if (skuList.value.length === 0) return 0;
  return skuList.value[selectedSkuIndex.value]?.price || 0;
});

const selectedSku = computed(() => {
  return skuList.value[selectedSkuIndex.value];
});

const loadProduct = async () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  const id = currentPage.options?.id || currentPage.$page?.options?.id;

  if (!id) {
    uni.showToast({ title: '商品不存在', icon: 'none' });
    return;
  }

  try {
    const res = await shopApi.getProductDetail(id);
    product.value = res;

    // Parse SKUs
    if (typeof res.skus === 'string') {
      try {
        skuList.value = JSON.parse(res.skus);
      } catch {
        skuList.value = [];
      }
    } else if (Array.isArray(res.skus)) {
      skuList.value = res.skus;
    }
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' });
  }
};

const selectSku = (idx: number) => {
  selectedSkuIndex.value = idx;
};

const addToCart = () => {
  if (!product.value) return;

  const sku = selectedSku.value;
  cartStore.addItem({
    productId: product.value.id,
    name: product.value.name,
    image: product.value.images?.[0] || '',
    skuKey: sku?.spec || sku?.name || 'default',
    skuName: sku?.spec || sku?.name || '默认规格',
    price: sku?.price || 0,
    quantity: 1,
  });

  uni.showToast({ title: '已加入购物车', icon: 'success' });
};

const buyNow = () => {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    uni.switchTab({ url: '/pages/mine/index' });
    return;
  }
  
  addToCart();
  uni.switchTab({ url: '/pages/cart/index' });
};

const goHome = () => {
  uni.switchTab({ url: '/pages/index/index' });
};

const goCart = () => {
  uni.switchTab({ url: '/pages/cart/index' });
};

onMounted(() => {
  loadProduct();
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.product-swiper {
  width: 100%;
  height: 750rpx;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

.product-info {
  background-color: #fff;
  padding: 30rpx;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.current-price {
  font-size: 48rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.sales {
  font-size: 24rpx;
  color: #999;
}

.product-name {
  font-size: 32rpx;
  color: #333;
  margin-top: 20rpx;
  font-weight: bold;
}

.product-desc {
  font-size: 28rpx;
  color: #666;
  margin-top: 16rpx;
  line-height: 1.6;
}

.sku-section {
  background-color: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.sku-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.sku-item {
  padding: 16rpx 30rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
  border: 2rpx solid transparent;
}

.sku-item.active {
  background-color: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.action-left {
  display: flex;
  width: 200rpx;
}

.action-icon {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.action-icon text:first-child {
  font-size: 40rpx;
}

.icon-text {
  font-size: 20rpx;
  color: #666;
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 10rpx;
  min-width: 30rpx;
  height: 30rpx;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 20rpx;
  border-radius: 15rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6rpx;
}

.action-btns {
  flex: 1;
  display: flex;
  height: 80rpx;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #fff;
}

.add-cart {
  background-color: #ffa940;
  border-radius: 40rpx 0 0 40rpx;
}

.buy-now {
  background-color: #ff4d4f;
  border-radius: 0 40rpx 40rpx 0;
  margin-right: 20rpx;
}
</style>

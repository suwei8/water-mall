<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索商品</text>
      </view>
    </view>

    <!-- 分类入口 -->
    <scroll-view scroll-x class="category-scroll" v-if="categories.length">
      <view class="category-list">
        <view 
          v-for="cat in categories" 
          :key="cat.id" 
          class="category-item"
          :class="{ active: currentCategory === cat.id }"
          @click="selectCategory(cat.id)"
        >
          {{ cat.name }}
        </view>
      </view>
    </scroll-view>

    <!-- 商品列表 -->
    <view class="product-list" v-if="products.length">
      <view 
        v-for="product in products" 
        :key="product.id" 
        class="product-card"
        @click="goToDetail(product.id)"
      >
        <image class="product-image" :src="product.image" mode="aspectFill" />
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <view class="product-bottom">
            <text class="product-price">¥{{ product.price }}</text>
            <text class="product-sales">已售{{ product.sales }}</text>
          </view>
          <view class="add-cart-btn" @click.stop="quickAddCart(product)">
            <text>+</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty" v-else-if="!loading">
      <text>暂无商品</text>
    </view>

    <!-- 加载中 -->
    <view class="loading" v-if="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { shopApi } from '@/utils/request';
import { useCartStore } from '@/store';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  sales: number;
  categoryId?: string;
}

const cartStore = useCartStore();

const loading = ref(true);
const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const currentCategory = ref<string>('');

// 加载分类
const loadCategories = async () => {
  try {
    const res = await shopApi.getCategories();
    categories.value = res;
    // 添加"全部"选项
    categories.value.unshift({ id: '', name: '全部' });
  } catch (e) {
    console.error('Failed to load categories', e);
  }
};

// 加载商品
const loadProducts = async (categoryId?: string) => {
  loading.value = true;
  try {
    const res = await shopApi.getProducts({ 
      categoryId: categoryId || undefined,
      size: 50 
    });
    products.value = res.list || [];
  } catch (e) {
    console.error('Failed to load products', e);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

// 选择分类
const selectCategory = (categoryId: string) => {
  currentCategory.value = categoryId;
  loadProducts(categoryId);
};

// 跳转详情
const goToDetail = (productId: string) => {
  uni.navigateTo({
    url: `/pages/product/detail?id=${productId}`
  });
};

// 快速加购（默认第一个 SKU）
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
  
  uni.showToast({
    title: '已加入购物车',
    icon: 'success',
  });
};

onMounted(() => {
  loadCategories();
  loadProducts();
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  padding: 20rpx 30rpx;
  background-color: #fff;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 40rpx;
  padding: 16rpx 30rpx;
}

.search-icon {
  margin-right: 16rpx;
}

.search-placeholder {
  color: #999;
  font-size: 28rpx;
}

.category-scroll {
  background-color: #fff;
  white-space: nowrap;
  padding: 20rpx 0;
}

.category-list {
  display: inline-flex;
  padding: 0 20rpx;
}

.category-item {
  padding: 12rpx 30rpx;
  margin-right: 20rpx;
  font-size: 28rpx;
  color: #666;
  border-radius: 30rpx;
  background-color: #f5f5f5;
}

.category-item.active {
  color: #fff;
  background-color: #1890ff;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  gap: 20rpx;
}

.product-card {
  width: calc(50% - 10rpx);
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 300rpx;
}

.product-info {
  padding: 20rpx;
  position: relative;
}

.product-name {
  font-size: 28rpx;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 80rpx;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}

.product-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.product-sales {
  font-size: 24rpx;
  color: #999;
}

.add-cart-btn {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  width: 50rpx;
  height: 50rpx;
  background-color: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-cart-btn text {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
}

.empty, .loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx;
  color: #999;
}
</style>

<template>
  <view class="container">
    <!-- 左侧分类 -->
    <scroll-view scroll-y class="category-sidebar">
      <view 
        v-for="cat in categories" 
        :key="cat.id" 
        class="category-side-item"
        :class="{ active: currentCategory === cat.id }"
        @click="selectCategory(cat.id)"
      >
        {{ cat.name }}
      </view>
    </scroll-view>

    <!-- 右侧商品 -->
    <scroll-view scroll-y class="product-area">
      <view class="product-list">
        <view 
          v-for="product in products" 
          :key="product.id" 
          class="product-item"
          @click="goToDetail(product.id)"
        >
          <image class="product-image" :src="product.image" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <view class="product-bottom">
              <text class="product-price">¥{{ product.price }}</text>
              <view class="add-btn" @click.stop="quickAddCart(product)">
                <text>+</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="empty" v-if="!loading && !products.length">
        <text>该分类暂无商品</text>
      </view>
    </scroll-view>
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
}

const cartStore = useCartStore();

const loading = ref(true);
const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const currentCategory = ref<string>('');

const loadCategories = async () => {
  try {
    const res = await shopApi.getCategories();
    categories.value = res;
    if (res.length > 0) {
      currentCategory.value = res[0].id;
      loadProducts(res[0].id);
    }
  } catch (e) {
    console.error(e);
  }
};

const loadProducts = async (categoryId: string) => {
  loading.value = true;
  try {
    const res = await shopApi.getProducts({ categoryId, size: 50 });
    products.value = res.list || [];
  } catch (e) {
    products.value = [];
  } finally {
    loading.value = false;
  }
};

const selectCategory = (id: string) => {
  currentCategory.value = id;
  loadProducts(id);
};

const goToDetail = (id: string) => {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` });
};

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
  loadCategories();
});
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

.category-sidebar {
  width: 180rpx;
  background-color: #f8f8f8;
  height: 100%;
}

.category-side-item {
  padding: 30rpx 20rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  border-left: 6rpx solid transparent;
}

.category-side-item.active {
  background-color: #fff;
  color: #1890ff;
  border-left-color: #1890ff;
}

.product-area {
  flex: 1;
  height: 100%;
  padding: 20rpx;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-item {
  display: flex;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  padding: 20rpx;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20rpx;
}

.product-name {
  font-size: 28rpx;
  color: #333;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.add-btn {
  width: 50rpx;
  height: 50rpx;
  background-color: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn text {
  color: #fff;
  font-size: 32rpx;
}

.empty {
  text-align: center;
  padding: 100rpx;
  color: #999;
}
</style>

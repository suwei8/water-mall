<template>
  <view class="container">
    <!-- Left Sidebar -->
    <scroll-view scroll-y class="category-sidebar">
      <view 
        v-for="cat in categories" 
        :key="cat.id" 
        class="category-side-item"
        :class="{ active: currentCategory === cat.id }"
        @click="selectCategory(cat.id)"
      >
        <view class="active-line" v-if="currentCategory === cat.id"></view>
        <text>{{ cat.name }}</text>
      </view>
    </scroll-view>

    <!-- Right Product Content -->
    <scroll-view scroll-y class="product-area">
      <view class="product-list" v-if="products.length">
        <view 
          v-for="product in products" 
          :key="product.id" 
          class="product-item"
          @click="goToDetail(product.id)"
        >
          <image class="product-image" :src="product.image" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name">{{ product.name }}</text>
            <view class="product-tags">
               <text class="tag">支持水票</text>
            </view>
            <view class="product-bottom">
              <view class="price-box">
                  <text class="currency">¥</text>
                  <text class="price">{{ product.price }}</text>
              </view>
              <view class="add-btn" @click.stop="quickAddCart(product)">
                <text>+</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="empty" v-else-if="!loading">
        <image class="empty-img" src="/static/empty-water.png" mode="aspectFit" />
        <text>该分类暂无商品</text>
      </view>
      
       <view class="loading" v-if="loading">
        <text>加载中...</text>
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

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: #F7F8FA;
}

/* Sidebar */
.category-sidebar {
  width: 90px;
  background-color: #fff;
  height: 100%;
}

.category-side-item {
  padding: 16px 10px;
  text-align: center;
  font-size: 14px;
  color: #666;
  position: relative;
  background-color: #f7f8fa;
  
  &.active {
    background-color: #fff;
    color: #333;
    font-weight: bold;
    
    .active-line {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
        background-color: $uni-color-primary;
        border-radius: 0 4px 4px 0;
    }
  }
}

/* Right Content */
.product-area {
  flex: 1;
  height: 100%;
  padding: 12px;
  background-color: #fff;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
      border-bottom: none;
  }
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: #f5f5f5;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 12px;
  
  .product-name {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
  }
  
  .product-tags {
      .tag {
          font-size: 10px;
          color: $uni-color-primary;
          border: 1px solid $uni-color-primary;
          padding: 0 4px;
          border-radius: 4px;
      }
  }
  
  .product-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .price-box {
        color: #FF4D4F;
        font-weight: bold;
        .currency { font-size: 12px; }
        .price { font-size: 16px; }
    }
    
    .add-btn {
      width: 24px;
      height: 24px;
      background-color: $uni-color-primary;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
    }
  }
}

.empty, .loading {
  text-align: center;
  padding: 60px 0;
  color: #999;
  font-size: 14px;
  
  .empty-img {
      width: 120px;
      height: 120px;
      margin-bottom: 20px;
  }
}
</style>

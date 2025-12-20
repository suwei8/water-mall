<template>
  <view class="container">
    <view class="form-group">
      <text class="label">收货人</text>
      <input class="input" v-model="form.name" placeholder="请输入收货人姓名" />
    </view>

    <view class="form-group">
      <text class="label">手机号</text>
      <input class="input" v-model="form.phone" type="number" placeholder="请输入手机号" maxlength="11" />
    </view>

    <view class="form-group">
      <text class="label">所在地区</text>
      <picker mode="region" @change="onRegionChange" :value="[form.province, form.city, form.district]">
        <view class="picker-value" v-if="form.province">
          {{ form.province }} {{ form.city }} {{ form.district }}
        </view>
        <view class="picker-placeholder" v-else>
          请选择省/市/区
        </view>
      </picker>
    </view>

    <view class="form-group">
      <text class="label">详细地址</text>
      <textarea class="textarea" v-model="form.detail" placeholder="请输入详细地址" />
    </view>

    <view class="form-group switch-group">
      <text class="label">设为默认地址</text>
      <switch :checked="form.isDefault" @change="onDefaultChange" color="#1890ff" />
    </view>

    <view class="save-btn" @click="saveAddress">
      保存地址
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { addressApi } from '@/utils/request';

const addressId = ref<string>('');
const form = reactive({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
});

const onRegionChange = (e: any) => {
  const [province, city, district] = e.detail.value;
  form.province = province;
  form.city = city;
  form.district = district;
};

const onDefaultChange = (e: any) => {
  form.isDefault = e.detail.value;
};

const loadAddress = async (id: string) => {
  try {
    const res = await addressApi.get(id);
    if (res) {
      form.name = res.name;
      form.phone = res.phone;
      form.province = res.province;
      form.city = res.city;
      form.district = res.district;
      form.detail = res.detail;
      form.isDefault = res.isDefault;
    }
  } catch (e) {
    console.error('Failed to load address', e);
  }
};

const saveAddress = async () => {
  if (!form.name) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' });
    return;
  }
  if (!form.phone || form.phone.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  if (!form.detail) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' });
    return;
  }

  uni.showLoading({ title: '保存中...' });

  try {
    if (addressId.value) {
      await addressApi.update(addressId.value, form);
    } else {
      await addressApi.create(form);
    }
    
    uni.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (e: any) {
    uni.showToast({ title: e.message || '保存失败', icon: 'none' });
  } finally {
    uni.hideLoading();
  }
};

onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  const id = currentPage.options?.id;
  
  if (id) {
    addressId.value = id;
    uni.setNavigationBarTitle({ title: '编辑地址' });
    loadAddress(id);
  } else {
    uni.setNavigationBarTitle({ title: '新增地址' });
  }
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.form-group {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 2rpx;
  display: flex;
  align-items: flex-start;
}

.form-group:first-child {
  border-radius: 16rpx 16rpx 0 0;
}

.form-group:last-of-type {
  border-radius: 0 0 16rpx 16rpx;
  margin-bottom: 40rpx;
}

.switch-group {
  align-items: center;
  justify-content: space-between;
}

.label {
  width: 160rpx;
  font-size: 28rpx;
  color: #666;
  flex-shrink: 0;
}

.input {
  flex: 1;
  font-size: 28rpx;
}

.textarea {
  flex: 1;
  font-size: 28rpx;
  min-height: 120rpx;
}

.picker-value {
  font-size: 28rpx;
  color: #333;
}

.picker-placeholder {
  font-size: 28rpx;
  color: #999;
}

.save-btn {
  padding: 30rpx;
  background-color: #1890ff;
  color: #fff;
  text-align: center;
  border-radius: 16rpx;
  font-size: 32rpx;
  margin: 40rpx 0;
}
</style>

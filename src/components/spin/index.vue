<!--
 * @Author: Xujianchen
 * @Date: 2025-06-30 15:56:13
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-01 17:42:03
 * @Description: 加载
-->
<template>
  <div class="mask" :class="{ 'no-click': notClick }">
    <div class="spin">
      <van-loading type="spinner" :color="iconColor" size="30" />
      <span>{{ title }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '加载中...',
  },
  notClick: {
    type: Boolean,
    default: false,
  },
  iconColor: {
    type: String,
    default: '#c9c9c9',
  },
})
</script>

<style scoped lang="scss">
.mask {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 7005;
}

.no-click {
  pointer-events: all; // 拦截点击
}

.spin {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgb(0, 0, 0);
  border-radius: 12px;
  z-index: 7006;
  span {
    font-size: 14px;
    color: var(--base-white-color);
    margin-top: var(--base-space);
  }
}
</style>

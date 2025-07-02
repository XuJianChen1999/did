<!--
 * @Author: Xujianchen
 * @Date: 2025-06-23 09:54:23
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-02 21:24:23
 * @Description:
-->
<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName" mode="out-in">
      <component :is="Component" :key="$route.path" />
    </transition>
  </router-view>
</template>

<script setup>
const router = useRouter()

const transitionName = ref('fade')

watch(
  () => router.currentRoute.value,
  (to, from) => {
    if (!from.meta || !to.meta) return

    // 根据 meta.classLevel 判断动画方向
    if (to.meta.classLevel > from.meta.classLevel) {
      transitionName.value = 'slide-fade' // 向右滑动进入
    } else if (to.meta.classLevel < from.meta.classLevel) {
      transitionName.value = 'slide-fade-left' // 向左滑动进入
    } else {
      transitionName.value = 'fade' // 同级或无classLevel时使用淡入淡出
    }
  },
  { deep: true },
)
</script>

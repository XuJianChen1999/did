<template>
  <van-popup v-bind="$attrs" v-model:show="modelValue" safe-area-inset-bottom @close="close">
    <slot></slot>
  </van-popup>
</template>

<script setup>
const modelValue = defineModel({ type: Boolean, default: false })
const emits = defineEmits(['close'])

function close() {
  modelValue.value = false
  emits('close')
}
</script>

<template>
  <span
    class="indicator"
    :class="[{ processing: pulse }, 'indicator-status-bg--' + type]"
    :style="style"
  />
</template>

<script setup>
const props = defineProps({
  color: String,
  size: {
    type: [Number, String],
    default: 8,
  },
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'info'].includes(value),
  },
  pulse: {
    type: Boolean,
    default: true,
  },
})

const style = computed(() => {
  const p = props
  return {
    backgroundColor: p.color,
    width: p.size + 'px',
    height: p.size + 'px',
  }
})
</script>

<style lang="scss" scoped>
.indicator {
  display: inline-block;
  background-color: #000;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  vertical-align: middle;
  &-status-bg {
    &--primary {
      background-color: var(--primary-color);
    }
    &--success {
      background-color: #67c23a;
    }
    &--warning {
      background-color: #e6a23c;
    }
    &--danger {
      background-color: #f56c6c;
    }
    &--info {
      background-color: #909399;
    }
  }
}
.processing {
  position: relative;
  &:after {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: inherit;
    content: '';
    animation: statusProcessing 1.2s ease-in-out infinite;
  }
}

@keyframes statusProcessing {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  30% {
    opacity: 0.7;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
</style>

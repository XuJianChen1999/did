<!--
 * @Author: Xujianchen
 * @Date: 2025-07-04 13:14:43
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-04 14:46:50
 * @Description:
-->
<template>
  <popup :model-value="modelValue" round position="bottom" @close="close">
    <div class="bind flex">
      <div class="bind-header flex">
        <span>确认绑定</span>
        <close-icon class="close" />
      </div>
      <span class="bind-number">88888</span>
      <span class="bind-status">绑定中</span>
      <img src="@/assets/svg/connecting.svg" alt="" />
      <div class="bind-info flex">
        <img src="" alt="" />
        <span>aaaaaaaa</span>
        <span>0x123456...12B888</span>
      </div>
      <div class="bind-btn">确认</div>
    </div>
  </popup>
</template>

<script setup>
import popup from '@/components/popup'
import CloseIcon from '@/assets/svg/close'

const modelValue = defineModel({ type: Boolean, default: false })
const emits = defineEmits(['close'])

function close() {
  modelValue.value = false
  emits('close')
}
</script>

<style scoped lang="scss">
.bind {
  flex-direction: column;
  justify-content: center;
  padding: 0 var(--base-space);
  &-header {
    position: relative;
    width: 100%;
    color: #212121;
    font-weight: bold;
    font-weight: 600;
    font-size: 16px;
    padding-top: 26px;
    .close {
      position: absolute;
      top: 20px;
      right: 0;
    }
    span {
      display: block;
      width: 100%;
      text-align: center;
    }
  }
  &-number {
    color: #22252d;
    font-weight: 600;
    font-size: 28px;
    margin-top: 43px;
    margin-bottom: 17px;
  }
  &-status {
    color: #58667e;
    font-size: 12px;
    margin-bottom: 12px;
  }
  &-info {
    flex-direction: column;
    justify-content: center;
    width: 271px;
    height: 104px;
    padding: 12px 0;
    border-radius: 10px;
    background-color: #f5f6f8;
    margin-top: 24px;
    img {
      width: 38px;
      height: 38px;
      border-radius: 50%;
    }
    span:nth-child(2) {
      color: #22252d;
      font-weight: 600;
      font-size: 14px;
      margin-top: 6px;
      margin-bottom: 2px;
    }
    span:last-child {
      color: #6d7385;
      font-size: 10px;
    }
  }
  &-btn {
    width: 100%;
    height: 48px;
    line-height: 48px;
    color: var(--base-white-color);
    font-weight: 600;
    font-size: 16px;
    border-radius: var(--base-radius);
    margin-top: 40px;
    margin-bottom: 16px;
    text-align: center;
    background: linear-gradient(90deg, #3751ff 0%, #912eef 100%);
  }
}
</style>

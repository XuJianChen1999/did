<!--
 * @Author: Xujianchen
 * @Date: 2025-06-27 11:53:47
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-27 15:06:38
 * @Description: 支付成功
-->
<template>
  <div class="result">
    <div class="result-header flex">
      <pay-success />
      <span>交易成功</span>
      <span>1.2625 ETH</span>
    </div>
    <div class="result-info">
      <div class="result-info-item">
        <span>发送账户</span>
        <span>0x1234567890123456789012345678901234567890</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import PaySuccess from '@/assets/svg/pay-success'
</script>

<style scoped lang="scss">
.result {
  &-header {
    flex-direction: column;
    justify-content: center;
    margin-top: var(--base-space);
    margin-bottom: var(--base-space-lg);
    span:nth-child(2) {
      color: #58667eff;
      font-size: 16px;
      margin-bottom: 4px;
    }
    span:last-child {
      color: #22252dff;
      font-weight: 600;
      font-size: 20px;
    }
  }
}
</style>

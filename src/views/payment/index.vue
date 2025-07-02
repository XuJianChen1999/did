<template>
  <!-- 支付 -->
  <div v-if="!isSuccess" class="payment">
    <div class="payment-title">
      <arrow-left class="payment-title-icon" @click="goBack" />
      <div>确认交易</div>
    </div>
    <!-- <div class="payment-fee">ETH {{ params?.price }}</div> -->
    <!-- <div class="payment-address">
      <span>接收者钱包地址</span>
      <span>0xjjhyas76876sa9azxc76z78xczx475da2423</span>
    </div> -->
    <div class="payment-info">
      <div class="payment-info-item flex">
        <div class="payment-info-item-label">交易金额</div>
        <!-- <span>ETH {{ params?.price }}</span> -->
      </div>
      <!-- <div class="payment-info-item flex">
        <div class="payment-info-item-label flex">交易费用 <info-icon /></div>
        <span>ETH 0.000</span>
      </div> -->
      <div class="payment-info-item flex total">
        <div class="payment-info-item-label">总计</div>
        <!-- <span>ETH {{ params?.price }}</span> -->
      </div>
    </div>
    <div class="payment-btn" @click="confirmTransaction">确认交易</div>
  </div>
  <!-- 支付结果 -->
  <!-- <div v-else class="result">
    <div class="result-header flex">
      <pay-success />
      <span>交易成功</span>
      <span>1.2625 ETH</span>
    </div>
    <div class="result-info">
      <div class="result-info-item flex">
        <span>发送账户</span>
        <span>0x1234567890123456789012345678901234567890</span>
      </div>
      <div class="result-info-item flex">
        <span>接收网络</span>
        <span>0x1234567890123456789012345678901234567890</span>
      </div>
      <div class="result-info-item flex">
        <span>网络费</span>
        <span>0x1234567890123456789012345678901234567890</span>
      </div>
      <div class="result-info-item flex">
        <span>Hash</span>
        <span>0x1234567890123456789012345678901234567890</span>
      </div>
      <div class="result-info-item flex">
        <span>区块号</span>
        <span>0x1234567890123456789012345678901234567890</span>
      </div>
      <div class="result-info-item flex">
        <span>交易时间</span>
        <span>{{ params?.createTime }}</span>
      </div>
    </div>
  </div> -->
  <!-- 连接钱包 -->
  <wallet-connection-modal @select="selectWallet" v-model="isShowSelectWallet" />
</template>

<script setup>
import { getQueryParams } from '@/utils/url'
import { removeItem, setStorage } from '@/utils/storage'
import { loginByAddress } from '@/api/user'
import { usePayment } from '@/hooks/usePayment'
import { useWalletBalance } from '@/hooks/wallet/useWalletBalance'
import { useWallet } from '@/hooks/wallet/useWallet'
import { PaymentMap } from '@/const/payment'
import { STORAGE_WALLET_TOKEN } from '@/const'
import WalletConnectionModal from '@/components/wallet-connection-modal'
import ArrowLeft from '@/assets/svg/arrow-left'
import PaySuccess from '@/assets/svg/pay-success'

const { pay } = usePayment()
const { getBalance } = useWalletBalance()
const { publicKey } = useWallet()

const currentUrl = ref(window.location.href)
const params = ref({})
const isSuccess = ref(false)
const isShowSelectWallet = ref(false)

onMounted(async () => {
  window.FlutterChannel.postMessage('getPayData')

  window.receivePayMessage = function (message) {
    console.log(message)
  }

  // const query = getQueryParams(currentUrl.value)
  // params.value = JSON.parse(query.params)
  // console.log(params.value)

  window.addEventListener('hashchange', handleUrlChange)
  window.addEventListener('popstate', handleUrlChange)

  // if (!publicKey.value) {
  //   showToast('请先连接钱包')
  // }
})

onUnmounted(() => {
  removeItem(STORAGE_WALLET_TOKEN)
  window.removeEventListener('hashchange', handleUrlChange)
  window.removeEventListener('popstate', handleUrlChange)
})

function goBack() {
  window.FlutterChannel.postMessage('back_button_clicked')
}

function handleUrlChange() {
  currentUrl.value = window.location.href
  const query = getQueryParams(currentUrl.value)
  params.value = JSON.parse(query.params)
}

function selectWallet() {
  confirmTransaction()
}

async function confirmTransaction() {
  if (!publicKey.value) {
    isShowSelectWallet.value = true
    return
  }
  const res = await loginByAddress(params.value.address)
  console.log(res)
  await setStorage(STORAGE_WALLET_TOKEN, res.data.userinfo.token)
  // const balance = await getBalance(publicKey.value)
  // console.log(balance)
  await pay(PaymentMap.BUY_VIP, params.value)
}
</script>

<style scoped lang="scss">
#app {
  background-color: #fff;
}

// 支付
.payment {
  height: 100%;
  padding: 0 var(--base-space);
  background-color: var(--base-white-color);
  &-title {
    color: #212121ff;
    font-weight: 600;
    font-size: 16px;
    height: 72px;
    line-height: 72px;
    &-icon {
      position: absolute;
      top: calc(72px / 3);
      left: var(--base-space);
    }
    div {
      width: 100%;
      text-align: center;
    }
  }
  &-fee {
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: var(--base-radius);
    background-color: #f5f6f8ff;
    margin-top: 8px;
    margin-bottom: var(--base-space-lg);
    color: #22252dff;
    font-weight: 600;
    font-size: 20px;
  }
  &-address {
    display: flex;
    flex-direction: column;
    padding: 12px;
    border-radius: var(--base-radius);
    border: 1px solid #e3ebf1ff;
    font-size: 14px;
    margin-bottom: var(--base-space);
    span:first-child {
      color: #22252dff;
      margin-bottom: 4px;
    }
    span:last-child {
      color: #58667eff;
      font-weight: 500;
    }
  }
  &-info-item {
    justify-content: space-between;
    margin-bottom: var(--base-space);
    border-bottom: 1px solid #e3ebf1ff;
    height: 50px;
    &.total {
      margin-top: 32px;
    }
    &-label {
      color: #58667eff;
      font-size: 14px;
    }
    span {
      color: #22252dff;
      font-weight: 500;
      font-size: 14px;
    }
  }
  &-btn {
    height: 48px;
    line-height: 48px;
    text-align: center;
    border-radius: var(--base-radius);
    color: var(--base-white-color);
    font-weight: 600;
    font-size: 16px;
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--purple-color) 100%);
  }
}
// 支付结果
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
  &-info {
    margin: 0 var(--base-space);
    background-color: #f5f6f8ff;
    border-radius: var(--base-radius);
    padding: var(--base-space) 13px;
  }
  &-info-item {
    justify-content: space-between;
    margin-bottom: var(--base-space);
    &:last-child {
      margin-bottom: 0;
    }
    span:first-child {
      color: #58667eff;
      font-size: 12px;
    }
    span:last-child {
      display: block;
      width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #22252dff;
      font-weight: 500;
      font-size: 12px;
    }
  }
}
</style>

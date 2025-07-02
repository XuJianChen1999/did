<!--
 * @Author: Xujianchen
 * @Date: 2025-07-01 15:52:24
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-01 17:42:10
 * @Description: 靓号列表
-->
<template>
  <div class="number-list">
    <van-pull-refresh
      v-model="refreshing"
      loading-text="正在刷新"
      animation-duration="500"
      @refresh="refresh"
    >
      <div class="number-list-wrapper">
        <div v-for="item in numberList" :key="item.id" class="number-list-item flex">
          <img src="@/assets/images/goods-pic.png" />
          <div class="number-list-item-info flex">
            <div class="number-list-item-info-title">
              <span class="name"># {{ item.Id }}</span>
              <div class="flex price">
                <div class="flex">
                  <trading-eth />
                  <span>{{ item.UsdcPrice }}</span>
                </div>
                <van-tag
                  v-if="item.IsOnSell"
                  color="#3751FF"
                  style="margin-left: var(--base-space)"
                >
                  出售中
                </van-tag>
              </div>
            </div>
            <div
              :style="{
                background: item.IsOnSell
                  ? 'linear-gradient(90deg, var(--primary-color) 0%, var(--purple-color) 100%)'
                  : '#969799',
              }"
              class="number-list-item-info-btn flex"
              @click="buyNumber(item)"
            >
              {{ item.IsOnSell ? '购买' : '已出售' }}
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>

    <connection-wallet-modal v-model="isShowConnectionWallet" @click="payNumber" />
  </div>
</template>

<script setup>
import { getNumberList } from '@/api/order'
import { useWallet } from '@/hooks/wallet/useWallet'
import { useWalletPayment } from '@/hooks/wallet/useWalletPayment'
import showLoading from '@/app/loading'
import ConnectionWalletModal from '@/components/wallet-connection-modal'
import TradingEth from '@/assets/svg/trading-center-eth'

const { publicKey } = useWallet()
const { sendPayment } = useWalletPayment()

const refreshing = ref(false)
const isShowConnectionWallet = ref(false)
const currentItem = ref({})
const numberList = ref([])

onMounted(() => getAllNumberList())

function buyNumber(item) {
  if (!item.IsOnSell) return

  currentItem.value = item
  if (!publicKey.value) {
    isShowConnectionWallet.value = true
  }

  payNumber()
}

async function payNumber() {
  console.log(currentItem.value)
  const res = await sendPayment(currentItem.value.Owner, currentItem.value.UsdcPrice)
  console.log(res)
}

async function getAllNumberList() {
  const ins = showLoading('正在加载')
  if (refreshing.value) {
    refreshing.value = false
  }
  try {
    const res = await getNumberList()
    numberList.value = res.data.id_card_list
    ins.close()
  } catch (error) {
    ins.close()
  }
}

function refresh() {
  refreshing.value = true
  getAllNumberList()
}
</script>

<style scoped lang="scss">
.van-pull-refresh {
  height: 100%;
  overflow-y: scroll;
}

.number {
  margin-top: var(--base-space);
  padding: var(--base-space);

  // 列表
  &-list {
    margin: var(--base-space);
    height: 90vh;
    overflow-y: scroll;
  }
  &-list-wrapper {
    height: 430px;
    margin-bottom: var(--base-space);
    // overflow: hidden;
  }
  &-list-item {
    padding: var(--base-space) 0;
    border-bottom: 1px solid #35383f;
    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }
    &:first-child {
      padding-top: 0;
    }
    img {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      flex-shrink: 0;
      margin-right: 12px;
    }
  }
  &-list-item-info {
    width: 100%;
    justify-content: space-between;
  }
  &-list-item-info-title {
    display: flex;
    flex-direction: column;
    color: var(--base-white-color);
    font-size: 16px;
    margin-bottom: 6px;
    .name {
      margin-bottom: 10px;
      margin-top: 5px;
    }
    .price {
      justify-content: space-between;
      width: 110px;
    }
  }
  &-list-item-info-btn {
    padding: 7.5px var(--base-space);
    border-radius: var(--base-radius);
    font-size: 14px;
    color: var(--base-white-color);
    border-radius: 10px;
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--purple-color) 100%);
  }
}
</style>

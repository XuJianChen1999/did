<!--
 * @Author: Xujianchen
 * @Date: 2025-07-01 15:52:24
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-04 14:39:28
 * @Description: 靓号列表
-->
<template>
  <div class="number">
    <van-nav-bar title="靓号列表" fixed left-arrow placeholder :border="false" />

    <van-pull-refresh
      v-model="refreshing"
      loading-text="正在刷新"
      animation-duration="500"
      @refresh="refresh"
    >
      <div class="number-list">
        <div class="number-list-header flex">
          <span>靓号列表（18）</span>
          <img src="@/assets/svg/add-icon.svg" alt="" />
        </div>
        <div v-if="!numberList.length" class="number-list-box">
          <div v-for="(item, index) in 3" :key="index" class="number-list-item flex">
            <van-checkbox
              class="number-list-item-checkbox"
              :model-value="index === currentIndex"
              style="margin-right: 12px"
              @click="handleSelect(index)"
            />
            <van-collapse
              v-model="activeNames"
              accordion
              :border="false"
              :style="{
                border: `1px solid ${currentIndex === index ? 'var(--primary-color)' : '#E3EBF1'}`,
              }"
            >
              <van-collapse-item :name="'item.Id' + index">
                <template #title>
                  <span :style="{ color: currentIndex === index ? 'var(--primary-color)' : '' }"
                    >{{ 'item.Id' }}--{{ index }}</span
                  >
                </template>
                <div class="no-number flex">
                  <span>暂未绑定钱包</span>
                  <div @click="showModal = true">去绑定</div>
                </div>
              </van-collapse-item>
            </van-collapse>
          </div>
        </div>
        <div v-else class="number-empty flex">
          <span>暂无靓号</span>
          <div>去抽取</div>
        </div>
      </div>
    </van-pull-refresh>
    <connection-wallet-modal v-model="isShowConnectionWallet" @click="payNumber" />
    <bind-number-modal v-model="showModal" />
  </div>
</template>

<script setup>
import { getNumberList } from '@/api/order'
import { getUserDidList } from '@/api/user'
import { useWallet } from '@/hooks/wallet/useWallet'
import { useWalletPayment } from '@/hooks/wallet/useWalletPayment'
import showLoading from '@/app/loading'
import ConnectionWalletModal from '@/components/wallet-connection-modal'
import BindNumberModal from './components/bind-number-modal'

const { publicKey } = useWallet()
const { sendPayment } = useWalletPayment()

const refreshing = ref(false)
const isShowConnectionWallet = ref(false)
const showModal = ref(false)
const currentItem = ref({})
const numberList = ref([])
const activeNames = ref('1')
const currentIndex = ref(null)

onMounted(async () => {
  // const res = await getUserDidList()
  // console.log(res)
})

function buyNumber(item) {
  if (!item.IsOnSell) return

  currentItem.value = item
  if (!publicKey.value) {
    isShowConnectionWallet.value = true
  }

  payNumber()
}

function handleSelect(index) {
  currentIndex.value = index
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
    console.log(res.data.id_card_list)
    numberList.value = res.data.id_card_list
    ins.close()
  } catch (error) {
    console.error(error)
    ins.close()
  }
}

function refresh() {
  refreshing.value = true
  getAllNumberList()
}
</script>

<style scoped lang="scss">
@use './fix.scss';

.van-pull-refresh {
  height: 100%;
  overflow-y: scroll;
}

.number {
  padding: 0 var(--base-space);

  // 列表
  &-list {
    &-header {
      justify-content: space-between;
      color: #22252d;
      font-weight: 500;
      font-size: 14px;
      margin: 14px 0;
    }
    &-item {
      position: relative;
      justify-content: space-between;
      margin-bottom: 12px;
      &-checkbox {
        position: absolute;
        top: 18px;
      }
      .no-number {
        justify-content: space-between;
        span {
          color: #6d7385;
          font-size: 12px;
        }
        div {
          width: 56px;
          height: 24px;
          text-align: center;
          line-height: 24px;
          color: #22252d;
          font-size: 12px;
          border-radius: 30px;
          border: 1px solid #e3ebf1;
        }
      }
    }
  }

  &-empty {
    justify-content: space-between;
    height: 56px;
    line-height: 56px;
    padding: 0 12px;
    background-color: #f5f6f8;
    border-radius: var(--base-radius);
    span {
      color: #6d7385;
      font-size: 12px;
    }
    div {
      width: 56px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border-radius: 30px;
      border: 1px solid #e3ebf1;
      background-color: var(--primary-color);
      color: var(--base-white-color);
      font-size: 12px;
    }
  }
}
.active {
  color: var(--primary-color);
}
</style>

<!--
 * @Author: Xujianchen
 * @Date: 2025-07-01 15:52:24
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-03 18:05:14
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
        <div class="number-list-box">
          <div class="number-list-item flex">
            <van-checkbox style="margin-right: 12px"></van-checkbox>
            <van-collapse v-model="activeNames" :border="false">
              <van-collapse-item title="标题1" name="1">
                代码是写出来给人看的，附带能在机器上运行。
              </van-collapse-item>
              <van-collapse-item title="标题2" name="2">
                技术无非就是那些开发它的人的共同灵魂。
              </van-collapse-item>
              <van-collapse-item title="标题3" name="3">
                在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。
              </van-collapse-item>
            </van-collapse>
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

const { publicKey } = useWallet()
const { sendPayment } = useWalletPayment()

const refreshing = ref(false)
const isShowConnectionWallet = ref(false)
const currentItem = ref({})
const numberList = ref([])
const activeNames = ref(['1'])

// onMounted(() => getAllNumberList())

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
@use './fix.scss';
:deep(.van-nav-bar__content) {
  height: 72px !important;
  line-height: 72px !important;
  border-bottom: 1px solid #e3ebf1 !important;
}
:deep(.van-nav-bar__title) {
  color: #212121 !important;
}
:deep(.van-collapse) {
  background-color: #f5f6f8 !important;
  width: calc(100% - 30px);
  border-radius: var(--base-radius);
  border: none;
  // .van-collapse-item {
  //   border-bottom: 1px solid #e3ebf1;
  //   &:last-child {
  //     border-bottom: none;
  //     border-radius: 0 0 var(--base-space) var(--base-space);
  //   }
  //   &:first-child {
  //     border-radius: var(--base-space) var(--base-space) 0 0;
  //   }
  // }
}
:deep(.van-collapse-item__content) {
  background-color: #f5f6f8;
}
:deep(.van-cell) {
  background-color: #f5f6f8 !important;
}
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
      justify-content: space-between;
    }
  }
}
</style>

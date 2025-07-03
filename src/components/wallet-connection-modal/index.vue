<!--
 * @Author: Xujianchen
 * @Date: 2025-06-09 15:46:55
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-03 10:12:02
 * @Description: 钱包连接弹窗
-->
<template>
  <van-overlay :show="modelValue" @click="close">
    <div class="wallet-connection">
      <div class="wallet-connection-title flex">
        <span></span>
        <span>连接钱包</span>
        <van-icon name="cross" />
      </div>
      <div class="wallet-connection-list">
        <div
          v-for="item in walletsList"
          :key="item.adapter.name"
          class="wallet-connection-list-item flex"
          @click="select(item)"
        >
          <img :src="item.adapter.icon" />
          <span>{{ item.adapter.name }}</span>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script setup>
import { WalletReadyState } from '@solana/wallet-adapter-base'
import { useWallet } from '@/hooks/wallet/useWallet'

const modelValue = defineModel({ type: Boolean, default: false })
const props = defineProps({
  featured: { type: Number, default: 3 },
})
const emits = defineEmits(['close', 'select'])

const { wallets, publicKey, select: selectWallet } = useWallet()

const expandedWallets = ref(false)

const orderedWallets = computed(() => {
  const installed = []
  const notDetected = []
  const loadable = []

  wallets.value.forEach((wallet) => {
    if (wallet.readyState === WalletReadyState.NotDetected) {
      notDetected.push(wallet)
    } else if (wallet.readyState === WalletReadyState.Loadable) {
      loadable.push(wallet)
    } else if (wallet.readyState === WalletReadyState.Installed) {
      installed.push(wallet)
    }
  })

  return [...installed, ...loadable, ...notDetected]
})
const featuredWallets = computed(() => orderedWallets.value.slice(0, props.featured))
const walletsList = computed(() => (expandedWallets.value ? wallets.value : featuredWallets.value))

async function select(item) {
  await selectWallet(item.adapter.name)
  emits('select', { ...item, publicKey: publicKey.value })
  close()
}

function close() {
  modelValue.value = false
  emits('close')
}
</script>

<style scoped lang="scss">
.wallet-connection {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 120px);
  padding: var(--base-space-lg);
  border-radius: 15px;
  border: 1px solid #58667e66;
  background-color: var(--app-bg-color);

  &-title {
    justify-content: space-between;
    color: var(--base-white-color);
    margin-bottom: var(--base-space-lg);
  }

  &-list-item {
    margin-bottom: var(--base-space-lg);
    color: var(--base-white-color);
    &:last-child {
      margin-bottom: 0;
    }
    img {
      width: 28px;
      height: 28px;
      margin-right: 8px;
    }
  }
}
</style>

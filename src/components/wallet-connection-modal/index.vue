<!--
 * @Author: Xujianchen
 * @Date: 2025-06-09 15:46:55
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-04 15:19:59
 * @Description: 钱包连接弹窗
-->
<template>
  <popup :show="modelValue" :close-on-click-overlay="false" round @close="close">
    <div class="wallet-connection">
      <div class="wallet-connection-title flex">
        <span></span>
        <span>连接钱包</span>
        <van-icon name="cross" @click="close" />
      </div>
      <div class="wallet-connection-list">
        <div
          v-for="item in renderWalletList"
          :key="item.adapter.name"
          class="wallet-connection-list-item flex"
          @click="select(item)"
        >
          <img :src="item.adapter.icon" />
          <span>{{ item.adapter.name }}</span>
        </div>
      </div>
    </div>
  </popup>
</template>

<script setup>
import { WalletReadyState } from '@solana/wallet-adapter-base'
import { STORAGE_WALLET_NAME } from '@/const'
import { setStorage } from '@/utils/storage'
import { useWallet } from '@/hooks/wallet/useWallet'
import walletLogo from '@/assets/images/wallet-logo.jpg'
import popup from '@/components/popup'

const modelValue = defineModel({ type: Boolean, default: false })
const props = defineProps({
  featured: { type: Number, default: 3 },
})
const emits = defineEmits(['close', 'select', 'select-coin-nexus'])

const { wallets, publicKey, select: selectWallet } = useWallet()

const expandedWallets = ref(false)

const orderedWallets = computed(() => {
  const installed = []
  const notDetected = []
  const loadable = []
  console.log(wallets.value)
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
const renderWalletList = computed(() => {
  const tmp = walletsList.value.filter((item) => item.adapter.name !== 'Phantom')
  return [
    ...tmp,
    {
      adapter: {
        name: 'Coinexus',
        icon: walletLogo,
      },
    },
  ]
})

async function select(item) {
  console.log(item.adapter.name)
  if (item.adapter.name === 'Coinexus') {
    setStorage(STORAGE_WALLET_NAME, item.adapter.name)
    const channelName = item.adapter.name
    window?.[channelName]?.postMessage('connect')
    window.receiveMessage = function (data) {
      console.log('接受到了来自Coin Nexus的信息--', data)
      emits('select-coin-nexus', { ...item, publicKey: data.data.publicKey })
      close()
    }
    emits('select-coin-nexus', { ...item, publicKey: '1111' })
    close()
  } else {
    await selectWallet(item.adapter.name)
    emits('select', { ...item, publicKey: publicKey.value })
    close()
  }
}

function close() {
  modelValue.value = false
  emits('close')
}
</script>

<style scoped lang="scss">
.wallet-connection {
  width: calc(100vw - 120px);
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

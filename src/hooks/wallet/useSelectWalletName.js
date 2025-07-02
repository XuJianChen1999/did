/*
 * @Author: Xujianchen
 * @Date: 2025-02-10 20:08:38
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-12 09:56:41
 * @Description: 选择钱包并将其存储在本地存储中
 */
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile'
import { useLocalStorage } from '@vueuse/core'

export function useSelectWalletName(localStorageKey, isMobile) {
  const name = useLocalStorage(
    localStorageKey,
    isMobile.value ? SolanaMobileWalletAdapterWalletName : null,
  )
  const isUsingMwaAdapter = computed(() => name.value === SolanaMobileWalletAdapterWalletName)
  const isUsingMwaAdapterOnMobile = computed(() => isUsingMwaAdapter.value && isMobile.value)

  const select = (walletName) => {
    if (name.value !== walletName) {
      name.value = walletName
    }
  }

  const deselect = (force = true) => {
    console.log('点击了取消哦')
    if (force || isUsingMwaAdapter.value) {
      name.value = null
    }
  }

  return {
    name,
    isUsingMwaAdapter,
    isUsingMwaAdapterOnMobile,
    select,
    deselect,
  }
}

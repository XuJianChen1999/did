/*
 * @Author: Xujianchen
 * @Date: 2025-02-10 20:08:38
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-01 11:58:49
 * @Description: 当钱包名称更改时更新钱包实例，并从钱包实例中派生其他属性
 */
import { WalletReadyState } from '@solana/wallet-adapter-base'

export function useWalletState(wallets, name) {
  const wallet = shallowRef(null)
  const publicKey = ref(null)
  const connected = ref(false)
  const readyState = ref(WalletReadyState.Unsupported)
  const ready = computed(
    () =>
      readyState.value === WalletReadyState.Installed ||
      readyState.value === WalletReadyState.Loadable,
  )

  const refreshWalletState = () => {
    publicKey.value = wallet.value?.adapter.publicKey ?? null
    connected.value = wallet.value?.adapter.connected ?? false
    readyState.value = wallet.value?.readyState ?? WalletReadyState.Unsupported
  }

  // 如果名称发生变化或提供了不同的钱包，请设置活动钱包
  watchEffect(() => {
    wallet.value = name.value
      ? (wallets.value.find(({ adapter }) => adapter.name === name.value) ?? null)
      : null
    refreshWalletState()
  })

  return {
    wallet,
    publicKey,
    connected,
    readyState,
    ready,
    refreshWalletState,
  }
}

/*
 * @Author: Xujianchen
 * @Date: 2025-02-10 20:08:38
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-10 09:57:51
 * @Description: 处理钱包适配器事件
 */
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile'

export function useAdapterListeners(
  wallet,
  unloadingWindow,
  isUsingMwaAdapterOnMobile,
  deselect,
  refreshWalletState,
  handleError,
) {
  // 选择新钱包时断开旧钱包的连接。
  watch(wallet, (newWallet, oldWallet) => {
    const newAdapter = newWallet?.adapter
    const oldAdapter = oldWallet?.adapter
    if (!newAdapter || !oldAdapter) return
    if (newAdapter.name === oldAdapter.name) return
    if (oldAdapter.name === SolanaMobileWalletAdapterWalletName) return
    oldAdapter.disconnect()
  })

  // 在钱包适配器上添加连接、断开和错误监听器
  watchEffect((onInvalidate) => {
    const adapter = wallet.value?.adapter
    if (!adapter) return
    const handleAdapterConnect = () => {
      refreshWalletState()
    }
    const handleAdapterDisconnect = () => {
      if (unloadingWindow.value || isUsingMwaAdapterOnMobile.value) return
      deselect(true)
    }
    const handleAdapterError = (error) => {
      return handleError(error, adapter)
    }
    adapter.on('connect', handleAdapterConnect)
    adapter.on('disconnect', handleAdapterDisconnect)
    adapter.on('error', handleAdapterError)
    onInvalidate(() => {
      adapter.off('connect', handleAdapterConnect)
      adapter.off('disconnect', handleAdapterDisconnect)
      adapter.off('error', handleAdapterError)
    })
  })
}

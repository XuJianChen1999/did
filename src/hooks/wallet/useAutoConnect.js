/*
 * @Author: Xujianchen
 * @Date: 2025-02-10 20:08:38
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-13 18:27:05
 * @Description: 处理钱包的自动连接
 */
import { WALLET_CONNECT_SUCCESS, WALLET_CONNECT_ERROR } from '@/const'
import emitter from '@/app/event-bus'

export function useAutoConnect(
  initialAutoConnect,
  wallet,
  isUsingMwaAdapterOnMobile,
  connecting,
  connected,
  ready,
  deselect,
) {
  const autoConnect = ref(initialAutoConnect)
  const hasAttemptedToAutoConnect = ref(false)

  // 当适配器发生变化时，清除“autoConnect”跟踪标志
  watch(wallet, () => {
    hasAttemptedToAutoConnect.value = false
  })

  // 如果启用了自动连接，则在钱包适配器发生变化并准备就绪时尝试连接
  watchEffect(() => {
    if (
      hasAttemptedToAutoConnect.value ||
      !autoConnect.value ||
      !wallet.value ||
      !ready.value ||
      connected.value ||
      connecting.value
    ) {
      return
    }
    ;(async () => {
      if (!wallet.value) return
      connecting.value = true
      hasAttemptedToAutoConnect.value = true
      try {
        if (isUsingMwaAdapterOnMobile.value) {
          await wallet.value.adapter.autoConnect_DO_NOT_USE_OR_YOU_WILL_BE_FIRED()
        } else {
          await wallet.value.adapter.connect()
        }

        emitter.emit(WALLET_CONNECT_SUCCESS)
      } catch (error) {
        console.log('执行到这里说明点击了取消')
        console.error(error)
        deselect()
        emitter.emit(WALLET_CONNECT_ERROR)
        // 不会抛出错误，但仍会调用 handleError
      } finally {
        connecting.value = false
      }
    })()
  })

  return autoConnect
}

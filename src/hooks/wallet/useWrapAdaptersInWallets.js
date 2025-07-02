/*
 * @Author: Xujianchen
 * @Date: 2025-02-10 20:08:38
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-10 10:27:30
 * @Description: 动态地将适配器数组转换为钱包数组
 */

export function useWrapAdaptersInWallets(adapters) {
  const wallets = shallowRef([])

  watchEffect(() => {
    wallets.value = adapters.value.map((newAdapter) => ({
      adapter: newAdapter,
      readyState: newAdapter.readyState,
    }))
  })

  return wallets
}

/*
 * @Author: Xujianchen
 * @Date: 2025-02-10 20:08:38
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-10 10:23:53
 * @Description: 自动发现符合移动钱包标准的钱包适配器，并将其添加到已注册适配器列表中
 */
import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter,
  SolanaMobileWalletAdapterWalletName,
} from '@solana-mobile/wallet-adapter-mobile'

export function useMobileWalletAdapters(adapters, isMobile, uriForAppIdentity, cluster) {
  const mwaAdapter = computed(() => {
    if (!isMobile.value) return null
    const existingMobileWalletAdapter = adapters.value.find(
      (adapter) => adapter.name === SolanaMobileWalletAdapterWalletName,
    )
    if (existingMobileWalletAdapter) {
      return existingMobileWalletAdapter
    }
    return new SolanaMobileWalletAdapter({
      addressSelector: createDefaultAddressSelector(),
      appIdentity: { uri: uriForAppIdentity || undefined },
      authorizationResultCache: createDefaultAuthorizationResultCache(),
      cluster: cluster.value,
      onWalletNotFound: createDefaultWalletNotFoundHandler(),
    })
  })

  return computed(() => {
    if (mwaAdapter.value == null || adapters.value.indexOf(mwaAdapter.value) !== -1) {
      return adapters.value
    }
    return [mwaAdapter.value, ...adapters.value]
  })
}

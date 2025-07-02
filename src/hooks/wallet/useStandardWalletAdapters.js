/*
 * @Author: Xujianchen
 * @Date: 2025-02-10 20:08:38
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-10 10:25:15
 * @Description: 自动发现符合钱包标准的钱包适配器，并将其添加到已注册适配器列表中
 */
import {
  isWalletAdapterCompatibleWallet,
  StandardWalletAdapter,
} from '@solana/wallet-standard-wallet-adapter-base'
import { DEPRECATED_getWallets } from '@wallet-standard/app'

export function useStandardWalletAdapters(adapters) {
  const warnings = new Set()
  const { get, on } = DEPRECATED_getWallets()
  const swaAdapters = shallowRef(wrapWalletsInAdapters(get()))

  watchEffect((onInvalidate) => {
    const listeners = [
      on('register', (...wallets) => {
        return (swaAdapters.value = [...swaAdapters.value, ...wrapWalletsInAdapters(wallets)])
      }),
      on('unregister', (...wallets) => {
        return (swaAdapters.value = swaAdapters.value.filter((swaAdapter) =>
          wallets.some((wallet) => wallet === swaAdapter.wallet),
        ))
      }),
    ]
    onInvalidate(() => listeners.forEach((destroy) => destroy()))
  })

  return computed(() => [
    ...swaAdapters.value,
    ...adapters.value.filter(({ name }) => {
      if (swaAdapters.value.some((swaAdapter) => swaAdapter.name === name)) {
        if (!warnings.has(name)) {
          warnings.add(name)
          console.warn(
            `${name} was registered as a Standard Wallet. The Wallet Adapter for ${name} can be removed from your app.`,
          )
        }
        return false
      }
      return true
    }),
  ])
}

function wrapWalletsInAdapters(wallets) {
  return wallets
    .filter(isWalletAdapterCompatibleWallet)
    .map((wallet) => new StandardWalletAdapter({ wallet }))
}

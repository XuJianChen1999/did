import { WalletNotInitializedError } from '@/app/wallet-errors'
import { createWalletStore } from '@/app/createWalletStore'
let walletStore = null
export const useWallet = () => {
  if (walletStore) return walletStore
  throw new WalletNotInitializedError(
    'Wallet not initialized. Please use the `initWallet` method to initialize the wallet.',
  )
}
export const initWallet = (walletStoreProps) => {
  walletStore = createWalletStore(walletStoreProps)
}

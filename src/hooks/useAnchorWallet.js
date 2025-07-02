/*
 * @Author: Xujianchen
 * @Date: 2025-06-09 18:01:20
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-14 11:24:43
 * @Description: 使用Anchor钱包
 */
import { computed } from 'vue'
import { useWallet } from './wallet/useWallet'

export function useAnchorWallet() {
  const walletStore = useWallet()

  return computed(() => {
    // 确保钱包存储由 WalletProvider 初始化
    if (!walletStore) return
    // 确保钱包已连接并支持正确的方法
    const { signTransaction, signAllTransactions, publicKey } = walletStore
    if (!publicKey.value || !signTransaction.value || !signAllTransactions.value) return

    return {
      publicKey: publicKey.value,
      signTransaction: signTransaction.value,
      signAllTransactions: signAllTransactions.value,
    }
  })
}

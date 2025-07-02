/*
 * @Author: Xujianchen
 * @Date: 2025-02-10 20:08:38
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-30 16:15:23
 * @Description: 定义捕获给定钱包错误并处理它的逻辑
 */
import { WalletNotReadyError } from '@solana/wallet-adapter-base'

export function useErrorHandler(unloadingWindow, onError) {
  return (error, adapter) => {
    if (unloadingWindow.value) {
      return error
    }
    if (onError) {
      onError(error, adapter)
      return error
    }
    console.error(error)
    if (error instanceof WalletNotReadyError && typeof window !== 'undefined' && adapter) {
      window.open(adapter.url, '_blank')
    }
    return error
  }
}

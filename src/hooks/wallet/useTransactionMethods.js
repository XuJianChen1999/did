/*
 * @Author: Xujianchen
 * @Date: 2025-02-10 20:08:38
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-28 11:16:34
 * @Description: 获取所有可用于与钱包交互的方法。包括发送交易、签署交易和签署消息。
 */
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { WalletNotSelectedError } from '@/app/wallet-errors'

export function useTransactionMethods(wallet, handleError) {
  // 使用提供的连接发送交易
  const sendTransaction = async (transaction, connection, options) => {
    const adapter = wallet.value?.adapter
    if (!adapter) throw handleError(new WalletNotSelectedError())
    if (!adapter.connected) throw handleError(new WalletNotConnectedError(), adapter)

    try {
      const res = await adapter.sendTransaction(transaction, connection, options)
      return res
    } catch (error) {
      console.log(error)
    }
  }

  // 如果钱包支持，则签署交易
  const signTransaction = computed(() => {
    const adapter = wallet.value?.adapter
    if (!(adapter && 'signTransaction' in adapter)) return
    return async (transaction) => {
      if (!adapter.connected) throw handleError(new WalletNotConnectedError())
      return await adapter.signTransaction(transaction)
    }
  })

  // 如果钱包适配器支持，则签署多个交易
  const signAllTransactions = computed(() => {
    const adapter = wallet.value?.adapter
    if (!(adapter && 'signAllTransactions' in adapter)) return
    return async (transactions) => {
      if (!adapter.connected) throw handleError(new WalletNotConnectedError())
      return await adapter.signAllTransactions(transactions)
    }
  })

  // 如果钱包适配器支持，则对任意消息进行签名.
  const signMessage = computed(() => {
    const adapter = wallet.value?.adapter
    if (!(adapter && 'signMessage' in adapter)) return
    return async (message) => {
      if (!adapter.connected) throw handleError(new WalletNotConnectedError())
      return await adapter.signMessage(message)
    }
  })

  return {
    sendTransaction,
    signTransaction,
    signAllTransactions,
    signMessage,
  }
}

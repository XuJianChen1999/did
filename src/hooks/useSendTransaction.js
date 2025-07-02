/*
 * @Author: Xujianchen
 * @Date: 2025-06-25 11:27:14
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-01 15:19:26
 * @Description: 发送交易
 */
import { Connection, Transaction } from '@solana/web3.js'
import { useWallet } from './wallet/useWallet'
import { WALLET_CONNECTION_URL } from '@/const'

export function useSendTransaction() {
  const { wallet } = useWallet()

  /**
   * @description: 发送交易
   * @param {string} base64Tx 交易base64, 用于构造transaction
   * @param {string} payType 支付类型：buyVip | drawBox | recharge
   * @return {string} signature 交易签名
   */
  async function sendWalletTransaction(base64Tx) {
    // if (payType && payType === 'buyVip') {
    //   const balance = await getBalance(publicKey.value, WALLET_CONNECTION_URL)
    //   console.log(balance)
    //   // FIXME: (vip包月默认价格299)
    //   if (balance < 299) {
    //     showConfirmDialog({
    //       title: '温馨提示',
    //       message: '钱包余额不足',
    //       showCancelButton: false,
    //     })
    //     throw new Error('钱包余额不足')
    //   }
    // }

    // 创建连接
    const connection = new Connection(WALLET_CONNECTION_URL, 'confirmed')
    const buffer = _base64ToBuffer(base64Tx)
    const transaction = Transaction.from(buffer)

    try {
      const signature = await wallet.value.adapter.sendTransaction(transaction, connection)
      console.log('签名完成，交易已发送，签名:', signature)
      // TODO: 其中res.confirmations为交易确认次数，交易被确认了几次
      const res = await connection.confirmTransaction(signature, 'confirmed')
      console.log('交易已确认', res.value)
      return signature
    } catch (error) {
      console.log(error.name, '---', error.message)
      if (
        error?.message?.includes('User rejected') ||
        error?.message?.includes('rejected') ||
        error?.code === 4001 ||
        error?.name?.includes('WalletSign') ||
        error?.name?.includes('WalletSendTransactionError')
      ) {
        console.warn('用户取消了交易')
        throw new Error('USER_REJECTED')
      }

      // 交易预检查失败（如余额不足）
      if (error?.logs?.some((log) => log.includes('insufficient funds'))) {
        console.error('余额不足')
        throw new Error('INSUFFICIENT_FUNDS')
      }

      // 交易超时
      if (error?.name === 'TimeoutError') {
        console.error('交易确认超时')
        throw new Error('CONFIRMATION_TIMEOUT')
      }

      // 其他错误
      console.error('交易错误:', error)
      throw new Error('TRANSACTION_ERROR', { cause: error })
    }
  }

  // base64转buffer
  function _base64ToBuffer(base64) {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(base64, 'base64')
    } else {
      // 浏览器原生降级
      const binary = atob(base64)
      const len = binary.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      return bytes
    }
  }

  return {
    sendWalletTransaction,
  }
}

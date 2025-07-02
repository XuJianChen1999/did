/*
 * @Author: Xujianchen
 * @Date: 2025-06-09 20:03:36
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-01 14:14:07
 * @Description: 获取钱包余额
 */
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { WALLET_CONNECTION_URL } from '@/const'

export function useWalletBalance() {
  const balance = ref(0)

  async function getBalance(publicKey) {
    if (!publicKey) return null
    const connection = new Connection(WALLET_CONNECTION_URL)
    const balanceInLamports = await connection.getBalance(publicKey)
    const res = balanceInLamports / LAMPORTS_PER_SOL

    balance.value = res
    return res
  }

  return {
    balance,
    getBalance,
  }
}

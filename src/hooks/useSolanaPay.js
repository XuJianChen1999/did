/*
 * @Author: Xujianchen
 * @Date: 2025-06-25 10:56:27
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-25 11:27:00
 * @Description: solana支付
 */
import {
  Connection,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  PublicKey,
  clusterApiUrl,
  VersionedTransaction,
  TransactionMessage,
} from '@solana/web3.js'
import { WALLET_CLUSTER_API_URL } from '@/const'
import { useWallet } from './wallet/useWallet'

export function useSolanaPay() {
  const { publicKey, wallet } = useWallet()

  const payStatus = ref('idle')

  // 验签
  async function signMessage(message = `Login at ${Date.now()}`) {
    if (!wallet.value?.adapter || !publicKey.value) throw new Error('钱包未连接')
    if (!wallet.value.adapter.signMessage) throw new Error('signMessage不支持')

    // 这里的message先写死进行模拟
    const encodeMsg = new TextEncoder().encode(message)
    const signature = await wallet.value.adapter.signMessage(encodeMsg)

    console.log('signWalletMessage--signature--', signature)
    return signature
  }

  // 支付
  async function paySOL(toAddress, amount = 0.01) {
    payStatus.value = 'signing'
    if (!wallet.value?.adapter?.signTransaction || !publicKey.value) {
      payStatus.value = 'failed'
      throw new Error('钱包未连接')
    }

    try {
      const connection = new Connection(clusterApiUrl(WALLET_CLUSTER_API_URL), 'confirmed')
      const toPubkey = new PublicKey(toAddress)
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
      // 创建支付指令
      const lamports = amount * LAMPORTS_PER_SOL
      const amountBuffer = Buffer.alloc(8)
      amountBuffer.writeBigUInt64LE(BigInt(lamports), 0)

      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: publicKey.value, isSigner: true, isWritable: true },
          { pubkey: toPubkey, isSigner: false, isWritable: true },
        ],
        programId: SystemProgram.programId,
        data: amountBuffer, // 将金额通过 Buffer 传递
      })
      const message = new TransactionMessage({
        payerKey: publicKey.value,
        recentBlockhash: blockhash,
        instructions: [instruction],
      }).compileToV0Message()
      const tx = new VersionedTransaction(message)

      // 签名处理
      let signedTx
      try {
        signedTx = await wallet.value.adapter.signTransaction(tx)
      } catch (error) {
        payStatus.value = 'cancelled'
        throw new Error('用户取消签名', error)
      }

      payStatus.value = 'sending'
      // 发送交易
      const txid = await connection.sendTransaction(signedTx)
      payStatus.value = 'confirming'

      // 添加交易监听器
      const listener = connection.onSignature(
        txid,
        async (result, context) => {
          connection.removeSignatureListener(listener)
          if (result.err) {
            payStatus.value = 'failed'
            throw new Error('链上确认失败')
          } else {
            try {
              const confirmation = await connection.confirmTransaction(
                { signature: txid, blockhash, lastValidBlockHeight },
                'confirmed',
              )

              if (confirmation.value.err) {
                payStatus.value = 'failed'
                throw new Error('交易确认失败')
              }

              payStatus.value = 'success'
            } catch (error) {
              payStatus.value = 'failed'
              throw new Error('交易确认超时或失败', error)
            }
          }
        },
        'confirmed',
      )

      // 先设置20s超时
      setTimeout(() => {
        connection.removeSignatureListener(listener)
        if (payStatus.value === 'confirming') {
          payStatus.value = 'failed'
        }
      }, 20000)

      console.log('useSolanaPay--paySOL--txid', txid)
      return txid
    } catch (error) {
      if (payStatus.value !== 'cancelled') {
        payStatus.value = 'failed'
      }
      throw error
    }
  }

  return {
    payStatus,
    signMessage,
    paySOL,
  }
}

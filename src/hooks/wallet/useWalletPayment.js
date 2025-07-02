/*
 * @Author: Xujianchen
 * @Date: 2025-06-14 11:26:34
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-01 16:28:33
 * @Description: 钱包支付
 */
import {
  PublicKey,
  SystemProgram,
  Transaction,
  Connection,
  LAMPORTS_PER_SOL,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import { showFailToast, showSuccessToast } from 'vant'
import { WALLET_CONNECTION_URL } from '@/const'
import { useWallet } from './useWallet'

export function useWalletPayment() {
  const { publicKey, wallet, sendTransaction } = useWallet()

  const sending = ref(false)
  // idle --> 初始状态，未发起支付
  // signing --> 正在钱包中签名字交易，即验签中
  // sending --> 交易已签名，正在广播到链上，可理解为发送中
  // confirming --> 交易已发送，正在等待确认
  // success --> 交易成功
  // failed --> 交易失败（如余额不足、用户拒签等）
  // cancelled --> 手动取消支付流程（或拒绝了钱包签名请求）
  const payStatus = ref('idle')
  const signature = ref(null)

  /**
   * @description: 连接钱包进行交易
   * @param {number} amount 交易金额
   * @param {recipientAddress} recipientAddress 收款地址
   * @return {Promise<{success: boolean, signature?: string, error?: string}>}
   */
  const sendPayment = async (recipientAddress, amount = 0.01) => {
    if (!publicKey.value) return { success: false, error: '钱包未连接' }
    if (amount <= 0) {
      return { success: false, error: '金额必须大于0', signature: signature.value }
    }

    sending.value = true
    payStatus.value = 'pending'

    try {
      // 验证收款地址
      let recipientPubkey
      try {
        recipientPubkey = new PublicKey(recipientAddress)
      } catch (e) {
        console.error('无效的收款地址', e)
        showFailToast('无效的收款地址')
        throw new Error('无效的收款地址')
      }

      // 使用devnet进行测试，生产环境改为mainnet-beta
      // FIXME: 如果使用https地址则直接new Connection('Your URL', 'confirmed')即可
      const connection = new Connection(WALLET_CONNECTION_URL, 'confirmed')
      // 创建交易
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey.value,
          toPubkey: recipientPubkey,
          lamports: LAMPORTS_PER_SOL * amount,
        }),
      )
      // 发送交易
      const res = await sendTransaction(transaction, connection, {
        maxRetries: 3, // 最大重试次数
      })
      console.log('signature', res)
      // 等待交易确认
      await connection.confirmTransaction(res, 'confirmed')

      payStatus.value = 'success'
      signature.value = res
      showSuccessToast('支付成功')
      return { success: true, signature: res }
    } catch (error) {
      console.error('支付失败:', error)
      payStatus.value = 'failed'
      showFailToast(error.message || '支付失败')
      return { success: false, signature: signature.value, error: error.message || '支付失败' }
    } finally {
      sending.value = false
    }
  }

  // 验证签名
  const signWalletMessage = async (message = `Login at ${Date.now()}`) => {
    if (!wallet.value?.adapter || !publicKey.value) throw new Error('钱包未连接')
    if (!wallet.value.adapter.signMessage) throw new Error('signMessage不支持')

    // 这里的message先写死进行模拟
    const encodeMsg = new TextEncoder().encode(message)
    const signature = await wallet.value.adapter.signMessage(encodeMsg)

    console.log('signWalletMessage--signature--', signature)
    return signature
  }

  // 签署并发送交易(旧版)
  const signAndSendTransaction = async (toAddress, amount) => {
    if (!publicKey.value || !wallet.value?.adapter?.signTransaction) {
      throw new Error('钱包未连接或不支持')
    }

    // 官方写法：先创建连接
    const toPubkey = new PublicKey(toAddress)
    const connection = new Connection(WALLET_CONNECTION_URL)
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

    const tx = new Transaction({
      feePayer: publicKey.value,
      recentBlockhash: blockhash,
    }).add(
      SystemProgram.transfer({
        fromPubkey: publicKey.value,
        toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      }),
    )

    const signedTx = await wallet.value.adapter.signTransaction(tx)
    const txid = await connection.sendRawTransaction(signedTx.serialize())
    await connection.confirmTransaction(
      {
        signature: txid,
        blockhash,
        lastValidBlockHeight,
      },
      'confirmed',
    )

    return txid
  }

  // 新版支付: https://github.com/anza-xyz/wallet-adapter/blob/master/packages/starter/example/src/components/SendV0Transaction.tsx
  const paySOL = async (toAddress, amount = 0.01) => {
    payStatus.value = 'signing'
    if (!publicKey.value || !wallet.value?.adapter?.signTransaction) {
      payStatus.value = 'failed'
      throw new Error('钱包未连接或不支持')
    }

    const supportedTransactionVersions = wallet?.adapter.supportedTransactionVersions
    if (!supportedTransactionVersions) {
      payStatus.value = 'failed'
      throw new Error("Wallet doesn't support versioned transactions!")
    }
    if (!supportedTransactionVersions.has(0)) {
      payStatus.value = 'failed'
      throw new Error("Wallet doesn't support v0 transactions!")
    }

    try {
      const toPubkey = new PublicKey(toAddress)
      const connection = new Connection(WALLET_CONNECTION_URL)
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

      // 创建交易
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: publicKey.value,
        toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })

      // 创建 V0 消息体，因为之前的new TransactionMessage已经废弃所以改用新版方式
      const message = new TransactionMessage({
        payerKey: publicKey.value,
        recentBlockhash: blockhash,
        instructions: [transferInstruction],
      }).compileToV0Message()
      const tx = new VersionedTransaction(message)

      // FIXME: 在这里的时候用户有可能拒签
      let signedTx
      try {
        signedTx = await wallet.value.adapter.signTransaction(tx)
      } catch (error) {
        payStatus.value = 'cancelled'
        throw new Error('用户取消或者拒绝签名', error)
      }

      payStatus.value = 'sending'
      const txid = await connection.sendTransaction(signedTx)

      payStatus.value = 'confirming'
      const res = await connection.confirmTransaction(
        {
          signature: txid,
          blockhash,
          lastValidBlockHeight,
        },
        'confirmed',
      )

      if (res.value.err) {
        payStatus.value = 'failed'
        throw new Error('交易失败')
      }

      payStatus.value = 'success'
      console.log('paySOL---txid--', txid)
      return txid
    } catch (error) {
      if (payStatus.value !== 'cancelled') payStatus.value = 'failed'
      throw error
    }
  }

  return {
    publicKey,
    sending,
    payStatus,
    signature,
    sendPayment,
    signWalletMessage,
    signAndSendTransaction, // 旧版
    paySOL, // 新版
  }
}

import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js'
import { useWallet } from '@/hooks/wallet/useWallet'

export default async function sendLegacyBase64Tx(base64Tx) {
  const { publicKey, wallet } = useWallet()

  if (!publicKey.value) {
    throw new Error('钱包未连接或不支持 signTransaction')
  }

  const connection = new Connection(
    'https://solana-mainnet.core.chainstack.com/f047afdbbf976b608379a93789fbfa3d',
    'confirmed',
  )
  const buffer = Buffer.from(base64Tx, 'base64')
  let tx
  let isLegacy = false

  try {
    tx = Transaction.from(buffer)
    isLegacy = true
    // 重新设置 recentBlockhash 和 feePayer
    const latest = await connection.getLatestBlockhash()
    tx.recentBlockhash = latest.blockhash
    tx.lastValidBlockHeight = latest.lastValidBlockHeight
    if (!tx.feePayer) tx.feePayer = publicKey.value
  } catch (error) {
    tx = VersionedTransaction.deserialize(buffer)
  }

  let signature = undefined
  try {
    signature = await wallet.value.adapter.sendTransaction(tx, connection)
    if (!signature || typeof signature !== 'string') {
      throw new Error('sendTransaction 未返回签名')
    }
    console.log('发送成功，签名:', signature)
  } catch (e) {
    console.warn('sendTransaction 失败，使用 signTransaction 签名:', e)
    // fallback 签名方式
    let signedTx
    if (isLegacy) {
      signedTx = await wallet.value.adapter.signTransaction(tx)
    } else {
      signedTx = await wallet.value.adapter.signTransaction(tx)
    }
    const rawTx = signedTx.serialize()
    signature = await connection.sendRawTransaction(rawTx)
    console.log('手动广播成功，签名:', signature)
  }

  // 确认交易
  if (!signature) throw new Error('交易签名失败')
  const confirmation = await connection.confirmTransaction(
    Object.assign(
      { signature },
      isLegacy
        ? {
            blockhash: tx.recentBlockhash,
            lastValidBlockHeight: tx.lastValidBlockHeight,
          }
        : {},
    ),
    'confirmed',
  )
  if (confirmation.value.err) {
    throw new Error(`交易确认失败: ${JSON.stringify(confirmation.value.err)}`)
  }
  return signature
}

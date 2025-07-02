/*
 * @Author: Xujianchen
 * @Date: 2025-07-01 10:37:33
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-01 15:35:47
 * @Description: 统一支付
 */
import { showToast } from 'vant'
import { PaymentMap } from '@/const/payment'
import { SHOW_WALLET_CONNECTION } from '@/const/mitt'
import { useWallet } from '@/hooks/wallet/useWallet'
import { useSendTransaction } from '@/hooks/useSendTransaction'
import { drawBlindBox } from '@/api/blind-box'
import { checkVipStatus, queryIdCard } from '@/api/user'
import emitter from '@/app/event-bus'

export function usePayment() {
  const { publicKey } = useWallet()
  const { sendWalletTransaction } = useSendTransaction()

  async function pay(payType, params) {
    await _checkConnection()
    const payMethod = _getPayMethod(payType)
    await payMethod(params)
  }

  // vip会员购买
  async function payVip(params) {
    // const balance = await getBalance(publicKey.value)
    // console.log(balance)
    // const res = await buyVip()
    // const signature = await sendWalletTransaction(res.data.transcation_hax)
    const signature = await sendWalletTransaction(params.transcation_hax)
    const resp = await checkVipStatus(publicKey.value)
    console.log('signature', signature)
    console.log('vip会员信息:', resp)
    showToast('购买成功')
  }

  // 抽号
  async function payDrawNumber() {
    const res = await drawBlindBox()
    const resp = await sendWalletTransaction(res.data.trx)
    const result = await queryIdCard(res.data.number)
    console.log('payDrawNumber--sign: ', resp)
    console.log('queryIdCard: ', result)

    return {
      signature: resp,
      ...result,
    }
  }

  // 直播充值
  function payLiveRecharge() {}

  // 检查钱包连接状态
  function _checkConnection() {
    console.log(publicKey.value)
    if (!publicKey.value) {
      emitter.emit(SHOW_WALLET_CONNECTION)
      console.warn('钱包未连接')
      throw new Error('钱包未连接')
    }
  }

  function _getPayMethod(payType) {
    const payMethods = {
      [PaymentMap.BUY_VIP]: payVip,
      [PaymentMap.DRAW_NUMBER]: payDrawNumber,
      [PaymentMap.LIVE_RECHARGE]: payLiveRecharge,
    }[payType]

    return payMethods
  }

  return {
    pay,
    payVip,
    payDrawNumber,
    payLiveRecharge,
  }
}

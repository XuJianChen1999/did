/*
 * @Author: Xujianchen
 * @Date: 2025-06-14 11:12:46
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-03 09:55:19
 * @Description: 盲盒相关接口
 */
import http from '@/utils/http'

// 抽盲盒
export function drawBlindBox() {
  return http({
    url: '/api/social.number/drawNumber',
    method: 'post',
    data: {
      type: 'pay',
      amount: 0.01,
    },
  })
}

// nft签名
export function nftSign(data) {
  return http({
    url: '/api/dapp.user/nft_login_verify',
    method: 'post',
    data,
  })
}

/*
 * @Author: Xujianchen
 * @Date: 2025-06-14 11:12:46
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-28 14:25:41
 * @Description: 盲盒相关接口
 */
import http from '@/utils/http'

// 抽盲盒
export function drawBlindBox() {
  return http({
    url: '/social.number/drawNumber',
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
    url: '/dapp.user/nft_login_verify',
    method: 'post',
    data,
  })
}

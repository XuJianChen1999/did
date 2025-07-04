/*
 * @Author: Xujianchen
 * @Date: 2025-06-14 11:12:46
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-04 16:31:29
 * @Description: 盲盒相关接口
 */
import http from '@/utils/http'

// 抽盲盒
export function drawBlindBox(address) {
  return http({
    url: '/api/social.number/drawNumber',
    method: 'post',
    data: {
      type: 'pay',
      amount: 0.01,
      address,
    },
  })
}

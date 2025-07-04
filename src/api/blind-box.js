/*
 * @Author: Xujianchen
 * @Date: 2025-06-14 11:12:46
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-04 12:26:41
 * @Description: 盲盒相关接口
 */
import http from '@/utils/http'

// 抽盲盒
export function drawBlindBox() {
  return http({
    url: '/api/social.number/drawNumber',
    method: 'post',
    data: {
      type: 'free',
      amount: 0,
    },
  })
}

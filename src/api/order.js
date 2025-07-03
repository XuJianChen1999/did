/*
 * @Author: Xujianchen
 * @Date: 2025-06-14 10:08:11
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-03 09:55:34
 * @Description: 订单相关接口
 */
import http from '@/utils/http'

// 获取订单列表
export function getOrders(data) {
  return http({
    url: '/api/social.number/getUserOrder',
    params: data,
    loading: false,
  })
}

// 获取订单详情
export function getOrderDetail(order_id) {
  return http({
    url: '/api/social.number/getOrderDetail',
    params: {
      order_id,
    },
  })
}

// 购买vip
export function buyVip() {
  return http({
    url: '/api/dapp.user/BuyVip',
    method: 'post',
    data: {
      month: '1',
      amount: 0.01,
    },
  })
}

// 获取靓号列表
export function getNumberList() {
  return http({
    url: '/api/dapp.user/queryIdList',
    method: 'post',
  })
}

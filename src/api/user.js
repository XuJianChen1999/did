/*
 * @Author: Xujianchen
 * @Date: 2025-06-24 09:51:40
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-01 14:45:52
 * @Description: 用户相关接口
 */
import http from '@/utils/http'

// 用户钱包登录
export function walletLogin(data) {
  return http({
    method: 'post',
    data,
    url: '/user/loginByAddress',
  })
}

// 查询特定的id卡
export function queryIdCard(id) {
  return http({
    method: 'post',
    url: '/dapp.user/queryIdCard',
    data: {
      id,
    },
  })
}

// 查询用户vip状态
export function checkVipStatus(address) {
  return http({
    method: 'post',
    url: '/dapp.user/getVipInfo',
    data: {
      address,
    },
  })
}

// 会员钱包登录
export function loginByAddress(address) {
  return http({
    method: 'post',
    url: '/user/loginByAddress',
    data: {
      address,
    },
  })
}

/*
 * @Author: Xujianchen
 * @Date: 2025-06-03 15:35:24
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-03 16:33:11
 * @Description: 路由配置
 */
export default [
  {
    path: '/',
    redirect: '/apply-did',
    meta: {
      classLevel: 1,
    },
  },
  {
    path: '/apply-did',
    name: 'apply-did',
    component: () => import('@/views/apply-did/index.vue'),
    meta: {
      title: 'DID商城',
      classLevel: 2,
    },
  },
  {
    path: '/payment',
    name: 'payment',
    component: () => import('@/views/payment/index.vue'),
    meta: {
      title: '立即支付',
      classLevel: 2,
    },
  },
  {
    path: '/payment-success',
    name: 'payment-success',
    component: () => import('@/views/payment/success.vue'),
    meta: {
      title: '支付成功',
      classLevel: 3,
    },
  },
  {
    path: '/number-list',
    name: 'number-list',
    component: () => import('@/views/number-list/index.vue'),
    meta: {
      title: '靓号列表',
      classLevel: 2,
    },
  },
]

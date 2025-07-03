/*
 * @Author: Xujianchen
 * @Date: 2025-06-07 16:29:27
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-03 09:58:08
 * @Description: http请求封装
 */
import axios from 'axios'
import { showFailToast, showLoadingToast, showToast } from 'vant'
import { STORAGE_TOKEN, STORAGE_WALLET_TOKEN } from '@/const'
import { getStorage, removeItem } from './storage'

axios.defaults.withCredentials = true

const http = axios.create({
  baseURL: '',
  timeout: 90000,
  method: 'get',
})

http.interceptors.request.use(
  (config) => {
    const options = config?.options || {}
    const token = getStorage(STORAGE_TOKEN)
    const { lock = true, loadingText = '加载中...' } = options
    options?.loading &&
      showLoadingToast({
        message: loadingText,
        forbidClick: lock,
      })

    const walletToken = getStorage(STORAGE_WALLET_TOKEN)
    if (walletToken) {
      config.headers['Authorization'] = walletToken
      config.headers['token'] = walletToken
    } else {
      // FIXME: 临时测试token
      const tmpToken = token || '1c241bc8-b0dc-4ecb-8ff9-83e74edd831d'
      config.headers['Authorization'] = tmpToken
      config.headers['token'] = tmpToken
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  (response) => {
    const {
      data,
      config: { options },
    } = response
    // console.log(data)
    if (data.code !== 1 && data.code !== 200) {
      showToast(data?.msg || '请求失败')
      return Promise.reject(data)
    }

    options?.successText && showToast(data.msg || options?.successText)

    return data
  },
  (error) => {
    console.log(error)
    if (error?.response?.data?.code === 401) {
      removeItem(STORAGE_TOKEN)
    }
    showFailToast(error?.response?.data?.msg || '请求失败')
    return Promise.reject(error)
  },
)

export default http

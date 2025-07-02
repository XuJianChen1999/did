/*
 * @Author: Xujianchen
 * @Date: 2025-02-10 20:08:38
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-10 14:55:52
 * @Description: 检测当前环境
 */
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile'
import { WalletReadyState } from '@solana/wallet-adapter-base'

export var Environment
;(function (Environment) {
  Environment[(Environment['DESKTOP_WEB'] = 0)] = 'DESKTOP_WEB'
  Environment[(Environment['MOBILE_WEB'] = 1)] = 'MOBILE_WEB'
})(Environment || (Environment = {}))

export function useEnvironment(adapters) {
  const userAgent = getUserAgent()
  const uriForAppIdentity = getUriForAppIdentity()
  const environment = computed(() => getEnvironment(adapters.value, userAgent))
  const isMobile = computed(() => environment.value === Environment.MOBILE_WEB)

  return {
    userAgent,
    uriForAppIdentity,
    environment,
    isMobile,
  }
}

let _userAgent
function getUserAgent() {
  if (_userAgent === undefined) {
    _userAgent = globalThis.navigator?.userAgent ?? null
  }
  return _userAgent
}

function getUriForAppIdentity() {
  const location = globalThis.location
  if (location == null) return null
  return `${location.protocol}//${location.host}`
}

function getEnvironment(adapters, userAgent) {
  const hasInstalledAdapters = adapters.some(
    (adapter) =>
      adapter.name !== SolanaMobileWalletAdapterWalletName &&
      adapter.readyState === WalletReadyState.Installed,
  )
  /**
   * 浏览器扩展适配器只有两种方式能够达到“已安装”状态：
   *
   * 1. 其浏览器扩展已安装。
   * 2. 应用在移动钱包的应用内浏览器中运行。
   *
   * 无论哪种情况，我们都认为环境类似于桌面环境。
   */
  if (hasInstalledAdapters) {
    return Environment.DESKTOP_WEB
  }
  const isMobile =
    userAgent &&
    // 检查我们是否处于支持 MWA 的平台上
    isOsThatSupportsMwa(userAgent) &&
    // 确保我们*没有*在 WebView 中运行
    !isWebView(userAgent)
  if (isMobile) {
    return Environment.MOBILE_WEB
  }

  return Environment.DESKTOP_WEB
}

function isOsThatSupportsMwa(userAgent) {
  return /android/i.test(userAgent)
}

function isWebView(userAgent) {
  return /(WebView|Version\/.+(Chrome)\/(\d+)\.(\d+)\.(\d+)\.(\d+)|; wv\).+(Chrome)\/(\d+)\.(\d+)\.(\d+)\.(\d+))/i.test(
    userAgent,
  )
}

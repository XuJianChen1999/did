/*
 * @Author: Xujianchen
 * @Date: 2025-02-10 20:08:38
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-10 10:26:02
 * @Description: 提供一个布尔值，告诉我们窗口是否正在卸载。这仅与浏览器相关
 */

export function useUnloadingWindow(isUsingMwaAdapterOnMobile) {
  const unloadingWindow = ref(false)
  if (typeof window === 'undefined') {
    return unloadingWindow
  }

  watchEffect((onInvalidate) => {
    if (isUsingMwaAdapterOnMobile.value) {
      return
    }
    const handler = () => (unloadingWindow.value = true)
    window.addEventListener('beforeunload', handler)
    onInvalidate(() => window.removeEventListener('beforeunload', handler))
  })

  return unloadingWindow
}

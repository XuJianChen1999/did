/*
 * @Author: Xujianchen
 * @Date: 2025-02-10 20:08:38
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-10 10:24:19
 * @Description: 监听所有注册钱包中的“readyState”变化
 */
import { watchEffect } from 'vue'

export function useReadyStateListeners(wallets) {
  watchEffect((onInvalidate) => {
    function handleReadyStateChange(readyState) {
      const prevWallets = wallets.value
      const index = prevWallets.findIndex(({ adapter }) => adapter === this)
      if (index === -1) return
      wallets.value = [
        ...prevWallets.slice(0, index),
        { adapter: this, readyState },
        ...prevWallets.slice(index + 1),
      ]
    }

    wallets.value.forEach(({ adapter }) =>
      adapter.on('readyStateChange', handleReadyStateChange, adapter),
    )

    onInvalidate(() =>
      wallets.value.forEach(({ adapter }) =>
        adapter.off('readyStateChange', handleReadyStateChange, adapter),
      ),
    )
  })
}

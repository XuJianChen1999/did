/*
 * @Author: Xujianchen
 * @Date: 2025-06-24 17:35:17
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-24 17:39:44
 * @Description: 与app钱包交互
 */
import { getQueryParams } from '@/utils/url'

export default function useAppWallet() {
  const walletList = ref([])
  const params = getQueryParams()

  async function getWalletList() {
    if (!params?.isCnsApp) return

    const res = await window.getWalletList()
    walletList.value = res
    console.log(res)

    return res
  }

  function selectWallet() {}

  return {
    walletList,
    getWalletList,
    selectWallet,
  }
}

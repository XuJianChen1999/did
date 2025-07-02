/*
 * @Author: Xujianchen
 * @Date: 2025-06-09 17:44:47
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-07-01 11:43:26
 * @Description: 创建钱包存储
 */
import { WalletNotReadyError } from '@solana/wallet-adapter-base'
import {
  useAdapterListeners,
  useAutoConnect,
  useEnvironment,
  useErrorHandler,
  useMobileWalletAdapters,
  useReadyStateListeners,
  useSelectWalletName,
  useStandardWalletAdapters,
  useTransactionMethods,
  useUnloadingWindow,
  useWalletState,
  useWrapAdaptersInWallets,
} from '@/hooks/wallet'
import { WalletNotSelectedError } from '@/app/wallet-errors'
import { STORAGE_WALLET_NAME, WALLET_DISCONNECT } from '@/const'
import { removeItem } from '@/utils/storage'
import emitter from './event-bus'

export const createWalletStore = ({
  wallets: initialAdapters = [],
  autoConnect: initialAutoConnect = false,
  cluster: initialCluster = 'mainnet-beta',
  onError,
  localStorageKey = STORAGE_WALLET_NAME,
}) => {
  // 初始变量和加载状态
  const cluster = ref(initialCluster)
  const connecting = ref(false)
  const disconnecting = ref(false)

  // 从原始适配器到钱包的计算列表
  const rawAdapters = shallowRef(initialAdapters)
  const rawAdaptersWithSwa = useStandardWalletAdapters(rawAdapters)
  const { isMobile, uriForAppIdentity } = useEnvironment(rawAdaptersWithSwa)
  const adapters = useMobileWalletAdapters(rawAdaptersWithSwa, isMobile, uriForAppIdentity, cluster)
  const wallets = useWrapAdaptersInWallets(adapters)

  // 钱包选择和状态
  const { name, isUsingMwaAdapterOnMobile, select, deselect } = useSelectWalletName(
    localStorageKey,
    isMobile,
  )
  const { wallet, publicKey, connected, readyState, ready, refreshWalletState } = useWalletState(
    wallets,
    name,
  )

  // 窗口监听器和错误处理
  const unloadingWindow = useUnloadingWindow(isUsingMwaAdapterOnMobile)
  const handleError = useErrorHandler(unloadingWindow, onError)

  // 注册钱包监听器
  useReadyStateListeners(wallets)
  useAdapterListeners(
    wallet,
    unloadingWindow,
    isUsingMwaAdapterOnMobile,
    deselect,
    refreshWalletState,
    handleError,
  )
  // 自动连接功能
  const autoConnect = useAutoConnect(
    initialAutoConnect,
    wallet,
    isUsingMwaAdapterOnMobile,
    connecting,
    connected,
    ready,
    deselect,
  )

  // 交易方法
  const { sendTransaction, signTransaction, signAllTransactions, signMessage } =
    useTransactionMethods(wallet, handleError)

  // 连接钱包
  const connect = async () => {
    if (connected.value || connecting.value || disconnecting.value) return
    if (!wallet.value) throw handleError(new WalletNotSelectedError())
    const adapter = wallet.value.adapter
    if (!ready.value) throw handleError(new WalletNotReadyError(), adapter)
    try {
      connecting.value = true
      await adapter.connect()
    } catch (error) {
      deselect()
      // handleError也会被调用
      throw error
    } finally {
      connecting.value = false
    }
  }

  // 钱包断开连接
  const disconnect = async () => {
    if (disconnecting.value || !wallet.value) return
    try {
      disconnecting.value = true
      await wallet.value.adapter.disconnect()
      removeItem(STORAGE_WALLET_NAME)
      emitter.emit(WALLET_DISCONNECT)
    } finally {
      disconnecting.value = false
    }
  }

  return {
    // Props.
    wallets,
    autoConnect,
    cluster,
    // Data.
    wallet,
    publicKey,
    readyState,
    ready,
    connected,
    connecting,
    disconnecting,
    // Methods.
    select,
    connect,
    disconnect,
    sendTransaction,
    signTransaction,
    signAllTransactions,
    signMessage,
    refreshWalletState,
  }
}

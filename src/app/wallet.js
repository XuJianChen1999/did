import { initWallet, useWallet } from '@/hooks/wallet/useWallet'

export * from '@/app/createWalletStore'
export * from '@/app/wallet-errors'
export * from '@/hooks/wallet/index'
export * from '@/hooks/useAnchorWallet'
export * from '@/hooks/wallet/useWallet'

export default {
  install: (app, options) => {
    initWallet(options)
    app.config.globalProperties.$wallet = useWallet()
  },
}

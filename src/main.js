import '@/assets/styles/index.css'

import { createApp } from 'vue'
import { WALLET_CLUSTER_API_URL } from '@/const'
import VConsole from 'vconsole'

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  // Coin98WalletAdapter,
} from '@solana/wallet-adapter-wallets'

import SolanaWallets from '@/app/wallet'

import App from './App.vue'
import router from './router'

import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/image-preview/style'

import.meta.env.MODE === 'development' && new VConsole()
setupApp()

async function setupApp() {
  const app = createApp(App)
  const walletOptions = {
    wallets: [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: WALLET_CLUSTER_API_URL }),
      new TorusWalletAdapter(),
      // new Coin98WalletAdapter(),
    ],
    autoConnect: true,
  }

  app.use(router)

  app.use(SolanaWallets, walletOptions)

  await app.mount('#app')
}

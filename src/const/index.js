export const baseName = 'DID'
export const baseURL = 'https://www.ccoin.life/api'

// 缓存
export const STORAGE_WALLET_NAME = `${baseName}_walletName`
export const STORAGE_WALLET_ADDRESS = `${baseName}_walletAddress`
export const STORAGE_TOKEN = `${baseName}_token`
export const STORAGE_WALLET_TOKEN = `${baseName}_wallet_token`

// wallet
export const WALLET_CONNECT_SUCCESS = 'wallet_connect_success'
export const WALLET_CONNECT_ERROR = 'wallet_connect_error'
export const WALLET_DISCONNECT = 'wallet_disconnect'
export const WALLET_CLUSTER_API_URL = import.meta.env.MODE === 'development' ? 'devnet' : 'devnet' // mainnet-beta
export const WALLET_CONNECTION_URL =
  'https://solana-mainnet.core.chainstack.com/f047afdbbf976b608379a93789fbfa3d'

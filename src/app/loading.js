import Loading from '@/components/spin'

let instance = null

export default function showLoading(title = '加载中...') {
  if (instance) return instance.proxy

  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp({
    render() {
      return h(Loading, { title })
    },
  })

  app.mount(container)

  const close = () => {
    if (instance) {
      app.unmount()
      document.body.removeChild(container)
      instance = null
    }
  }

  instance = { close }
  return instance
}

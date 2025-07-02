import { showFailToast, showSuccessToast } from 'vant'

export default function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => showSuccessToast('复制成功'))
      .catch((err) => {
        console.error('复制失败:', err)
        // 降级处理
        fallbackCopyText(text)
      })
  } else {
    // 不支持 Clipboard API 的浏览器
    fallbackCopyText(text)
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  // FIXME: 防止页面抖动
  textArea.style.position = 'fixed'
  document.body.appendChild(textArea)
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    if (successful) {
      showSuccessToast('已复制到剪贴板')
    } else {
      showFailToast('复制失败，请查看手机权限')
    }
  } catch (error) {
    console.log(error, '复制失败，请手动复制')
    showFailToast('复制失败，请查看手机权限')
  }
}

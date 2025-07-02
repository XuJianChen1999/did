import { isString } from '@/utils/type'

/*
 * @Author: Xujianchen
 * @Date: 2025-06-11 16:10:35
 * @LastEditors: Xujianchen
 * @LastEditTime: 2025-06-14 14:57:04
 * @Description: 与flutter webview通信
 */
const globalListeners = new Set()

export function useFlutterWebview() {
  const messages = ref([])
  const lastMessage = ref(null)
  const error = ref(null)

  onMounted(() => {
    if (!window.receiveFromFlutter) {
      window.receiveFromFlutter = handleMessage
    }
  })
  // 组件卸载时清理
  onUnmounted(() => {
    if (window.receiveFromFlutter === handleMessage) {
      delete window.receiveFromFlutter
    }
  })

  // 处理来自 Flutter 的消息
  function handleMessage(rawMessage) {
    try {
      const message = isString(rawMessage) ? JSON.parse(rawMessage) : rawMessage
      if (!message.type) {
        throw new Error('Invalid message format: missing type field')
      }
      const newMessage = {
        type: message.type,
        payload: message.payload,
      }
      // 更新状态
      messages.value.push(newMessage)
      lastMessage.value = newMessage
      error.value = null
      // 通知所有监听器
      globalListeners.forEach((listener) => listener(newMessage))
    } catch (err) {
      error.value = `Message processing error: ${err instanceof Error ? err.message : String(err)}`
      console.error('Failed to process Flutter message:', err)
    }
  }

  // 发送消息
  function sendMessage(type, payload) {
    try {
      const message = { type, payload }
      const messageStr = isString(message) ? message : JSON.stringify(message)
      if (window.FlutterBridge) {
        // 通过 JavaScript 通道发送
        window.FlutterBridge.postMessage(messageStr)
      } else if (window.flutter_inappwebview) {
        // 对于 flutter_inappwebview 插件
        window.flutter_inappwebview.callHandler('handlerName', messageStr)
      } else {
        throw new Error('Flutter bridge不可用')
      }
    } catch (err) {
      error.value = `发送消息失败: ${err instanceof Error ? err.message : String(err)}`
      console.error('向flutter发送消息失败:', err)
    }
  }

  // 添加消息监听器
  function addMessageListener(listener) {
    globalListeners.add(listener)
    return () => {
      globalListeners.delete(listener)
    }
  }

  // 清空消息
  function clearMessages() {
    messages.value = []
    lastMessage.value = null
  }

  return {
    sendMessage,
    messages,
    addMessageListener,
    clearMessages,
    lastMessage,
    error,
  }
}

/* <script setup>
import { onMounted, onUnmounted } from 'vue';
import { useFlutterWebview } from '@/hooks/useFlutterWebview';

const { addMessageListener, sendMessage } = useFlutterWebview();

function handleAuthMessage(message) {
  console.log('Auth message received:', message);
  // 处理认证消息
}

onMounted(() => {
  // 添加特定类型的消息监听
  const removeListener = addMessageListener((message) => {
    if (message.type === 'authentication') {
      handleAuthMessage(message.payload);
    }
  });

  onUnmounted(() => {
    removeListener();
  });
});

function login() {
  sendMessage('login', { username: 'user', password: 'pass' });
}
</script> */

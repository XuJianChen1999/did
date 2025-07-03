<template>
  <div class="apply-did-container">
    <!--  -->
    <div class="apply-did" v-if="isApply">
      <div class="apply-did-header">
        <div class="apply-did-header-title">抽取DID靓号</div>
        <div class="apply-did-header-desc">靓号为6-9位的数字组合，每个用户可申请一个随机靓号</div>
      </div>
      <img src="@/assets/images/Onboarding_01_1@2x.png" alt="" />
      <div class="footer-btn">
        <div class="btn-apply" @click="handleDraw">抽取</div>
        <div class="btn-cancel" @click="cancel">取消</div>
      </div>
    </div>

    <div class="apply-did-success" v-else>
      <div class="confetti-container">
        <canvas
          id="confetti-canvas"
          :style="{ backgroundImage: confettiBg ? `url(${confettiBg})` : '' }"
        ></canvas>
        <div class="success-icon">
          <svg id="success-svg" width="110" height="110" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="80" fill="#5062ff" />
            <path
              id="checkmark"
              d="M55 95 L85 125 L130 75"
              stroke="#fff"
              stroke-width="8"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <div class="apply-did-success-header">
        <div class="apply-did-success-header-title">恭喜您获取DID靓号</div>
        <div class="apply-did-success-header-desc">DID靓号生成即可使用</div>
      </div>

      <div class="apply-success-content">
        <div class="success-centent">{{ drawData.number }}</div>
        <div class="success-copy" @click="copyToClipboard(drawData.number)">
          <copy-svg />
          复制靓号
        </div>
      </div>

      <!-- <div class="footer-btn">
        <div class="btn-apply">返回资产</div>
      </div> -->
    </div>

    <wallet-connection-modal
      v-model="isShowSelectWallet"
      @select="handleConnected"
      @success="showToast('连接成功')"
    />
  </div>
</template>

<script setup>
import { showToast, showLoadingToast } from 'vant'
import { useWallet } from '@/hooks/wallet/useWallet'
import { usePayment } from '@/hooks/usePayment'
import { loginByAddress } from '@/api/user'
import { PaymentMap } from '@/const/payment'
import { STORAGE_WALLET_TOKEN } from '@/const'
import { getQueryParams } from '@/utils/url'
import { setStorage } from '@/utils/storage'
import confetti from 'canvas-confetti'
import copyToClipboard from '@/utils/clipboard'
import showLoading from '@/app/loading'
import WalletConnectionModal from '@/components/wallet-connection-modal'
import CopySvg from '@/assets/svg/apply-did-copy'

const router = useRouter()
const { pay } = usePayment()
const { publicKey } = useWallet()

const isShowSelectWallet = ref(false)
const isApply = ref(true)
const confettiBg = ref('')
const drawData = ref({})

onMounted(async () => {
  const params = getQueryParams()
  console.log('getQueryParams---', params)
  if (params?.address) {
    const ins = showLoading('钱包登录中')
    try {
      const res = await loginByAddress(params.address)
      console.log('loginByAddress---', res)
      setStorage(STORAGE_WALLET_TOKEN, res.data.userinfo.token)
      ins.close()
    } catch (error) {
      ins.close()
      console.log('error---', error)
    }
  }
})

watch(isApply, async (newVal) => {
  if (!newVal) {
    await nextTick()
    confettiBg.value = ''
    const canvas = document.getElementById('confetti-canvas')
    const myConfetti = confetti.create(canvas, { resize: true, useWorker: true })

    // 2. 爆炸动画
    myConfetti({
      particleCount: 300,
      spread: 70,
      origin: { y: 0.6 },
    })

    // 3. 动画结束后，导出图片并设置为背景
    setTimeout(() => {
      // 导出canvas为图片
      confettiBg.value = canvas.toDataURL('image/png')
      // 可选：隐藏canvas
      // canvas.style.display = 'none';
    }, 2500) // 动画时长可根据实际调整

    // 4. SVG对勾描边动画
    const path = document.getElementById('checkmark')
    const length = path.getTotalLength()
    path.style.strokeDasharray = length
    path.style.strokeDashoffset = length
    path.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)'
    setTimeout(() => {
      path.style.strokeDashoffset = 0
    }, 800)
  }
})

async function handleConnected() {
  console.log(publicKey.value)
  await drawBox()
}

async function handleDraw() {
  if (!publicKey.value) {
    isShowSelectWallet.value = true
    return
  }
  showLoadingToast('正在处理')
  await drawBox()
}

async function drawBox() {
  const res = await loginByAddress(publicKey.value.toBase58())
  console.log(res)
  setStorage(STORAGE_WALLET_TOKEN, res.data.userinfo.token)

  const lodIns = await showLoading('正在抽取...')
  try {
    const res = await pay(PaymentMap.DRAW_NUMBER)
    await lodIns.close()
    showToast(`恭喜您获取DID靓号：${res.data.number}`)
    isApply.value = true
  } catch (error) {
    console.error(error)
    lodIns.close()
  }
}

function cancel() {
  router.go(-1)
}
</script>

<style lang="scss" scoped>
:deep(.van-field__control) {
  color: var(--primary-color);
}

* {
  font-family: 'PingFang SC';
}

.apply-did-container {
  width: 100%;
  height: 100vh;
  background-color: #fff;
}

.apply-did,
.apply-did-success {
  padding: var(--base-space);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .apply-did-header,
  .apply-did-success-header {
    text-align: center;
    .apply-did-header-title {
      font-weight: 700;
      font-size: 30px;
      color: #22252d;
      margin-bottom: var(--base-space);
    }
    .apply-did-header-desc,
    .apply-did-success-header-desc {
      font-size: 16px;
      color: #6d7385;
    }
  }

  img {
    width: 311px;
    height: 311px;
  }

  .footer-btn {
    position: fixed;
    bottom: 20px;
    .btn-apply,
    .btn-cancel {
      width: 343px;
      height: 48px;
      border-radius: var(--base-radius);
      background: linear-gradient(90deg, #3751ff 0%, #912eef 100%);
      text-align: center;
      line-height: 48px;
      // font-weight: 500;
      font-size: 16px;
      color: #ffffff;
    }

    .btn-cancel {
      margin-top: var(--base-space);
      background: #ffffff;
      border: 1px solid #3751ff;
      color: #3751ff;
    }
  }
}

.apply-did-success {
  // padding-top: 118px;
  img {
    width: 343px;
    height: calc(398px / 2);
  }
  .apply-did-success-header {
    margin-top: calc(78px / 2);
  }
}

.confetti-container {
  width: 343px;
  height: calc(598px / 2);
  position: relative;
  #confetti-canvas {
    width: 100%;
    height: 100%;
  }
  .success-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.apply-did-success-header-title {
  font-weight: 700;
  font-size: 30px;
  color: #22252d;
  margin-bottom: 8px;
}

.apply-success-content {
  margin-top: 32px;
  padding: 17px 12px;
  width: 343px;
  height: 56px;
  border-radius: var(--base-radius);
  border: 1px dashed #3751ff;
  box-sizing: border-box;
  background: #3751ff14;
  display: flex;
  .success-centent {
    font-weight: 700;
    width: calc(390px / 2);
    border-right: 1px solid #3751ff;
  }

  .success-copy {
    flex: 1;
    text-align: center;
    padding-right: 10px;
    // line-height: 112px;
    font-size: 16px;
    color: #3751ff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>

<!-- <style>
#app {
  background-color: #fff !important;
}
</style> -->

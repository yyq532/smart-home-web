<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  account: '',
  password: '',
  secretKey: '',
})
const showPassword = ref(false)
const errorMsg = ref('')
const loading = ref(false)

async function handleLogin() {
  errorMsg.value = ''
  if (!form.account || !form.password || !form.secretKey) {
    errorMsg.value = '请填写完整的登录信息'
    return
  }
  loading.value = true
  // 模拟网络请求延迟，后续替换为云服务登录接口
  await new Promise((r) => setTimeout(r, 500))
  const res = userStore.login(form)
  loading.value = false
  if (res.success) {
    router.replace('/home')
  } else {
    errorMsg.value = res.message
  }
}
</script>

<template>
  <div class="login_page">
    <div class="bg-decoration">
      <div class="circle c1"></div>
      <div class="circle c2"></div>
    </div>

    <div class="login-content">
      <div class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
            <path d="M9.5 21v-5h5v5" />
          </svg>
        </div>
        <h1>智能家居系统</h1>
        <p>Smart Home System</p>
      </div>

      <div class="login-card">
        <div class="form-item">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#8a94a6" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
          </svg>
          <input v-model.trim="form.account" type="text" placeholder="请输入用户 ID" autocomplete="off" />
        </div>

        <div class="form-item">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#8a94a6" stroke-width="2" stroke-linecap="round">
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          <input
            v-model.trim="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            autocomplete="off"
          />
          <span class="eye" @click="showPassword = !showPassword">
            {{ showPassword ? '隐藏' : '显示' }}
          </span>
        </div>

        <div class="form-item">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#8a94a6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V6a4 4 0 0 1 8 0" />
            <path d="m9.5 15 1.5 1.5 3.5-3.5" />
          </svg>
          <input v-model.trim="form.secretKey" type="text" placeholder="请输入唯一密钥" autocomplete="off" />
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button class="login-btn" :disabled="loading" @click="handleLogin">
          {{ loading ? '登录中...' : '登 录' }}
        </button>

        <p class="tip">密钥验证登录 · 账号唯一性校验</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login_page {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(160deg, #1e3c72 0%, #2a5298 55%, #3a7bd5 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg-decoration .circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}
.c1 { width: 300px; height: 300px; top: -80px; left: -80px; }
.c2 { width: 220px; height: 220px; bottom: -60px; right: -60px; }

.login-content {
  width: 100%; max-width: 380px; padding: 32px 24px; position: relative; z-index: 1;
  animation: fadeInUp 0.5s ease both;
}

.logo { text-align: center; color: #fff; margin-bottom: 36px; }
.logo-icon {
  width: 72px; height: 72px; margin: 0 auto 16px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 22px;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(6px);
}
.logo h1 { font-size: 24px; letter-spacing: 2px; margin-bottom: 6px; }
.logo p { font-size: 12px; opacity: 0.7; letter-spacing: 3px; text-transform: uppercase; }

.login-card {
  background: var(--card);
  border-radius: 20px;
  padding: 28px 22px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  transition: background 0.3s;
}
.form-item {
  display: flex; align-items: center; gap: 10px;
  background: var(--surface);
  border-radius: 12px;
  padding: 13px 14px;
  margin-bottom: 16px;
  transition: box-shadow 0.2s, background 0.3s;
}
.form-item:focus-within { box-shadow: 0 0 0 2px #3a7bd5; }
.form-item input {
  flex: 1; border: none; outline: none; background: transparent;
  font-size: 15px; color: var(--text-primary); min-width: 0;
}
.form-item input::placeholder { color: var(--text-faint); }
.eye { font-size: 12px; color: #3a7bd5; cursor: pointer; user-select: none; }

.error-msg {
  color: #e5484d; font-size: 13px; margin: -6px 0 10px 4px;
}

.login-btn {
  width: 100%; height: 46px; border: none; border-radius: 12px;
  background: linear-gradient(135deg, #2a5298, #3a7bd5);
  color: #fff; font-size: 16px; letter-spacing: 6px; cursor: pointer;
  transition: opacity 0.2s;
}
.login-btn:active { opacity: 0.85; }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.tip { text-align: center; font-size: 12px; color: var(--text-faint); margin-top: 16px; }
</style>

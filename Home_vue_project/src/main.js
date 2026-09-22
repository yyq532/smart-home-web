import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

/* ===== 初始化主题（白天/夜间） ===== */
const savedTheme = localStorage.getItem('sm_theme') || 'light'
document.documentElement.setAttribute('data-theme', savedTheme)

/* ===== 禁用浏览器页面缩放 =====
 * 1. Ctrl/Command + 鼠标滚轮缩放
 * 2. Ctrl/Command + '+' / '-' / '0' 键盘缩放
 * 3. 移动端双指捏合缩放（已由 viewport meta 限制）
 */
window.addEventListener(
  'wheel',
  (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
    }
  },
  { passive: false }
)

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0', '_'].includes(e.key)) {
    e.preventDefault()
  }
})

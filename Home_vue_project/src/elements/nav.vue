<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { path: '/home', label: '首页', short: '首页', icon: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M9.5 21v-6h5v6' },
  { path: '/device', label: '设备控制', short: '设备', icon: 'M4 5h16v6H4zM4 13h16v6H4zM7.5 8h.01M7.5 16h.01M17 8h.01M17 16h.01' },
  { path: '/data', label: '历史数据', short: '数据', icon: 'M4 20V10M10 20V4M16 20v-8M22 20H2' },
  { path: '/my', label: '个人中心', short: '我的', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5' },
]

const hidden = computed(() => route.meta.hideTabbar)
const isActive = (p) => route.path === p
function switchTab(p) {
  router.push(p)
}
</script>

<template>
  <!-- PC 左侧侧边栏导航 -->
  <aside v-if="!hidden" class="nav-side">
    <div class="side-logo">
      <div class="logo-mark">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M9.5 21v-5h5v5" />
        </svg>
      </div>
      <div class="logo-text">
        <p class="logo-name">智能家居</p>
        <p class="logo-sub">Smart Home</p>
      </div>
    </div>

    <nav class="side-menu">
      <div
        v-for="t in tabs"
        :key="t.path"
        class="side-item"
        :class="{ active: isActive(t.path) }"
        @click="switchTab(t.path)"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path :d="t.icon" />
        </svg>
        <span>{{ t.label }}</span>
      </div>
    </nav>

    <div class="side-footer">v1.0.0 · 毕业设计</div>
  </aside>

  <!-- 移动端底部导航 -->
  <nav v-if="!hidden" class="nav-bottom">
    <div
      v-for="t in tabs"
      :key="t.path"
      class="tab-item"
      :class="{ active: isActive(t.path) }"
      @click="switchTab(t.path)"
    >
      <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path :d="t.icon" />
      </svg>
      <span>{{ t.short }}</span>
    </div>
  </nav>
</template>

<style scoped>
/* ===== 移动端底部导航（默认） ===== */
.nav-bottom {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 60px;
  background: var(--card);
  display: flex;
  border-top: 1px solid var(--border);
  z-index: 100;
  transition: background 0.3s;
}
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: var(--text-faint);
  font-size: 11px;
  cursor: pointer;
  transition: color 0.2s;
}
.tab-item.active { color: #2a5298; }
.tab-item:active { opacity: 0.7; }

/* ===== PC 左侧侧边栏（默认隐藏） ===== */
.nav-side { display: none; }

@media (min-width: 768px) {
  .nav-bottom { display: none; }

  .nav-side {
    display: flex;
    flex-direction: column;
    width: 220px;
    flex-shrink: 0;
    height: 100vh;
    position: sticky;
    top: 0;
    background: linear-gradient(180deg, #1e3c72 0%, #2a5298 60%, #2f5fa8 100%);
    color: #fff;
    padding: 24px 14px;
  }

  .side-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 8px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    margin-bottom: 20px;
  }
  .logo-mark {
    width: 44px;
    height: 44px;
    border-radius: 13px;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .logo-name { font-size: 17px; font-weight: 700; letter-spacing: 1px; }
  .logo-sub { font-size: 11px; opacity: 0.65; letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }

  .side-menu { flex: 1; display: flex; flex-direction: column; gap: 6px; }
  .side-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }
  .side-item:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
  .side-item.active {
    background: rgba(255, 255, 255, 0.16);
    color: #fff;
    font-weight: 600;
  }
  .side-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 22px;
    border-radius: 0 3px 3px 0;
    background: #fff;
  }

  .side-footer {
    padding: 16px 10px 4px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.45);
    text-align: center;
  }
}
</style>

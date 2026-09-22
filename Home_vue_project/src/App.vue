<script setup>
import { watch } from 'vue'
import Nav from './elements/nav.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

// 初始化并同步主题到根节点
document.documentElement.setAttribute('data-theme', userStore.theme)
watch(
  () => userStore.theme,
  (t) => document.documentElement.setAttribute('data-theme', t)
)
</script>

<template>
  <div class="app-shell">
    <div class="app-container">
      <Nav />
      <main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="$route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style>
/* ===== 主题变量：白天模式（默认） ===== */
:root {
  --bg: #e9edf4;            /* 页面外背景 */
  --bg-page: #f5f7fb;       /* 内容区背景 */
  --card: #ffffff;          /* 卡片背景 */
  --surface: #f4f6fa;       /* 输入框/浅色块 */
  --surface-2: #eef1f6;     /* 更深的浅色块 */
  --border: #eef1f6;        /* 边框 */
  --text-strong: #1f2a3d;   /* 标题 */
  --text-primary: #2b3445;  /* 正文 */
  --text-secondary: #5a6478;/* 次要文字 */
  --text-muted: #8a94a6;    /* 弱文字 */
  --text-faint: #a5aec0;    /* 最弱文字/占位 */
  --accent-soft: #eaf1fd;   /* 主色浅底 */
  --success-soft: #e6f7ee;  /* 正常绿底 */
  --danger-soft: #fdeaea;   /* 报警红底 */
  --off-soft: #f0f2f6;      /* 离线灰底 */
  --card-on: linear-gradient(150deg, #eaf1fd 0%, #ffffff 100%);
  --shadow: 0 2px 10px rgba(31, 42, 61, 0.06);
  --shadow-lg: 0 10px 24px rgba(31, 42, 61, 0.12);
}

/* ===== 主题变量：夜间模式 ===== */
html[data-theme='dark'] {
  --bg: #0b0f18;
  --bg-page: #131926;
  --card: #1b2334;
  --surface: #232c42;
  --surface-2: #2a3450;
  --border: #29324a;
  --text-strong: #eef2f9;
  --text-primary: #d5dbe8;
  --text-secondary: #a7b0c2;
  --text-muted: #7c8699;
  --text-faint: #5c6679;
  --accent-soft: #26314a;
  --success-soft: #1f3a2c;
  --danger-soft: #3a2530;
  --off-soft: #232c42;
  --card-on: linear-gradient(150deg, #26314a 0%, #1b2334 100%);
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 24px rgba(0, 0, 0, 0.35);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  font-family: 'PingFang SC', 'Microsoft YaHei', -apple-system, sans-serif;
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  transition: background 0.3s;
}

#app { min-height: 100vh; }

.app-shell {
  min-height: 100vh;
  display: flex;
  justify-content: center;
}
.app-container {
  position: relative;
  width: 100%;
  max-width: 480px; /* 移动端：手机屏 */
  min-height: 100vh;
  background: var(--bg-page);
  box-shadow: 0 0 40px rgba(31, 42, 61, 0.12);
  display: flex;
  flex-direction: column;
  transition: background 0.3s;
}
.app-main {
  flex: 1;
  padding-bottom: 64px; /* 给底部导航留出空间 */
}

/* ===== PC 桌面端：全屏 + 左侧导航 + 右侧内容 ===== */
@media (min-width: 768px) {
  .app-shell { justify-content: stretch; }
  .app-container {
    max-width: none;
    width: 100%;
    min-height: 100vh;
    flex-direction: row;
    align-items: stretch;
    box-shadow: none;
  }
  .app-main {
    flex: 1;
    min-width: 0;
    height: 100vh;
    overflow-y: auto;
    padding-bottom: 0;
  }
}

/* ===== 路由切换过渡动画 ===== */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateX(28px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-28px);
}

/* ===== 全局关键帧动画 ===== */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulseRing {
  0%   { box-shadow: 0 0 0 0 rgba(229, 72, 77, 0.45); }
  70%  { box-shadow: 0 0 0 12px rgba(229, 72, 77, 0); }
  100% { box-shadow: 0 0 0 0 rgba(229, 72, 77, 0); }
}
@keyframes bellSwing {
  0%, 100% { transform: rotate(0); }
  20% { transform: rotate(14deg); }
  40% { transform: rotate(-12deg); }
  60% { transform: rotate(8deg); }
  80% { transform: rotate(-6deg); }
}
@keyframes slideDown {
  from { opacity: 0; transform: translate(-50%, -16px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}
</style>

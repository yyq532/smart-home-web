<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDeviceStore } from '../../stores/device'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const deviceStore = useDeviceStore()
const userStore = useUserStore()

const alarmList = computed(() => deviceStore.alarms)

/* 数字滚动动画 */
const displayTotal = ref(0)
const displayOnline = ref(0)
const displayAlarm = ref(0)

function countTo(target, setter, duration = 900) {
  const start = performance.now()
  function step(now) {
    const p = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - p, 3)
    setter(Math.round(target * eased))
    if (p < 1) requestAnimationFrame(step)
    else setter(target)
  }
  requestAnimationFrame(step)
}

/* 实时时间 */
const nowTime = ref('')
let clockTimer = null
function tickClock() {
  const d = new Date()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  nowTime.value = `${hh}:${mm}:${ss}`
}

/* 登录欢迎提示 */
const welcome = ref('')

onMounted(() => {
  countTo(deviceStore.total, (v) => (displayTotal.value = v))
  countTo(deviceStore.online, (v) => (displayOnline.value = v))
  countTo(alarmList.value.length, (v) => (displayAlarm.value = v))

  tickClock()
  clockTimer = setInterval(tickClock, 1000)

  if (userStore.justLoggedIn) {
    welcome.value = `欢迎，${userStore.userInfo.userName}`
    userStore.justLoggedIn = false
    setTimeout(() => (welcome.value = ''), 2500)
  }
})

onUnmounted(() => clearInterval(clockTimer))

const typeIcon = {
  light: 'M12 3a6 6 0 0 0-4 10.5V17h8v-3.5A6 6 0 0 0 12 3zM9.5 20h5',
  ac: 'M3 6h18v9H3zM3 12h18M6 19h4M14 19h4',
  gas: 'M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-4 3-6 5-9zM12 21v-6',
  lock: 'M6 11h12v9H6zM9 11V7a3 3 0 0 1 6 0v4',
  camera: 'M3 7h13v10H3zM16 10l5-3v10l-5-3',
  smoke: 'M4 17h16M6 13c1-2 3-2 4 0s3 2 4 0 3-2 4 0M8 9c1-2 3-2 4 0s3 2 4 0',
  humidifier: 'M12 3c2.5 3.5 6 6 6 10a6 6 0 0 1-12 0c0-4 3.5-6.5 6-10z',
  plug: 'M9 3v5M15 3v5M7 8h10v4a5 5 0 0 1-10 0zM12 17v4',
}
</script>

<template>
  <div class="home_page">
    <!-- 登录欢迎提示 -->
    <transition name="welcome">
      <div v-if="welcome" class="welcome-toast">{{ welcome }}</div>
    </transition>

    <!-- 顶部欢迎区 -->
    <header class="home-header">
      <div class="hello">
        <p class="date">智能之家 · 今天</p>
        <h2>你好，{{ userStore.userInfo.userName }}<span class="live-time">{{ nowTime }}</span></h2>
      </div>
      <div class="bell" :class="{ ring: alarmList.length }" @click="router.push('/device')">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 9a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7" />
          <path d="M10.5 20a2 2 0 0 0 3 0" />
        </svg>
        <span v-if="alarmList.length" class="badge">{{ alarmList.length }}</span>
      </div>
    </header>

    <!-- 状态概览卡片 -->
    <section class="overview">
      <div class="stat">
        <span class="num">{{ displayTotal }}</span>
        <span class="label">设备总数</span>
      </div>
      <div class="divider"></div>
      <div class="stat">
        <span class="num on">{{ displayOnline }}</span>
        <span class="label">在线设备</span>
      </div>
      <div class="divider"></div>
      <div class="stat">
        <span class="num alarm">{{ displayAlarm }}</span>
        <span class="label">报警设备</span>
      </div>
    </section>

    <!-- 当前设备状态列表：报警 / 正常 -->
    <section class="status-section">
      <div class="section-title">
        <h3>当前设备状态</h3>
        <span class="more" @click="router.push('/device')">管理设备 ›</span>
      </div>

      <div v-if="alarmList.length" class="alarm-banner">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3 2 20h20L12 3zM12 10v4M12 17.5v.5" />
        </svg>
        <span>{{ alarmList.length }} 个设备正在报警，请及时处理</span>
      </div>

      <div class="device-list">
        <div
          v-for="(dev, index) in deviceStore.devices"
          :key="dev.id"
          class="device-row"
          :class="{ alarming: dev.alarm }"
          :style="{ animationDelay: `${index * 60}ms` }"
        >
          <div class="dev-icon" :class="[{ off: !dev.on }, { alarming: dev.alarm }]">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path :d="typeIcon[dev.type] || typeIcon.plug" />
            </svg>
          </div>
          <div class="dev-info">
            <p class="dev-name">{{ dev.name }}</p>
            <p class="dev-room">{{ dev.room }}</p>
          </div>
          <span class="dev-status" :class="dev.alarm ? 'st-alarm' : dev.on ? 'st-normal' : 'st-off'">
            {{ dev.alarm ? '报警' : dev.on ? '正常' : '离线' }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home_page { padding: 20px 16px 24px; }

/* 欢迎提示 */
.welcome-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2a5298, #3a7bd5);
  color: #fff;
  padding: 13px 26px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
  z-index: 300;
  box-shadow: 0 12px 30px rgba(42, 82, 152, 0.4);
  white-space: nowrap;
}
.welcome-enter-active, .welcome-leave-active { transition: opacity 0.3s, transform 0.3s; }
.welcome-enter-from, .welcome-leave-to { opacity: 0; transform: translate(-50%, -18px); }

.home-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.date { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
.hello h2 { font-size: 22px; color: var(--text-strong); display: flex; align-items: baseline; }
.live-time {
  font-size: 14px; font-weight: 500; color: var(--text-muted);
  margin-left: 12px; letter-spacing: 1px; font-variant-numeric: tabular-nums;
}
.bell {
  position: relative; width: 42px; height: 42px; border-radius: 14px;
  background: linear-gradient(135deg, #2a5298, #3a7bd5);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: transform 0.2s;
}
.bell:active { transform: scale(0.9); }
.bell.ring { animation: bellSwing 1.2s ease-in-out infinite; transform-origin: top center; }
.badge {
  position: absolute; top: -4px; right: -4px;
  min-width: 18px; height: 18px; padding: 0 4px;
  background: #e5484d; color: #fff; border-radius: 9px;
  font-size: 11px; display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--bg-page);
  animation: pulseRing 1.6s ease-out infinite;
}

.overview {
  background: linear-gradient(135deg, #2a5298, #3a7bd5);
  border-radius: 18px; padding: 18px 10px;
  display: flex; align-items: center; justify-content: space-around;
  margin-bottom: 22px;
  box-shadow: 0 10px 24px rgba(42, 82, 152, 0.35);
}
.stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.num { font-size: 24px; font-weight: 700; color: #fff; }
.num.on { color: #9ff0c8; }
.num.alarm { color: #ffb4b6; }
.label { font-size: 12px; color: rgba(255, 255, 255, 0.75); }
.divider { width: 1px; height: 32px; background: rgba(255, 255, 255, 0.2); }

.section-title { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
.section-title h3 { font-size: 17px; color: var(--text-strong); }
.more { font-size: 13px; color: #3a7bd5; cursor: pointer; }

.alarm-banner {
  display: flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #e5484d, #ff7a59);
  color: #fff; font-size: 13px;
  border-radius: 12px; padding: 11px 14px; margin-bottom: 12px;
  animation: pulseRing 2s ease-out infinite;
}

.device-list { display: flex; flex-direction: column; gap: 10px; }
.device-row {
  display: flex; align-items: center; gap: 12px;
  background: var(--card); border-radius: 14px; padding: 13px 14px;
  box-shadow: var(--shadow);
  animation: fadeInUp 0.5s ease both;
  transition: background 0.3s;
}
.device-row.alarming { box-shadow: 0 2px 10px rgba(229, 72, 77, 0.15); }
.dev-icon {
  width: 42px; height: 42px; border-radius: 12px;
  background: var(--accent-soft); color: #3a7bd5;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.3s, color 0.3s;
}
.dev-icon.off { background: var(--off-soft); color: var(--text-faint); }
.dev-icon.alarming { background: var(--danger-soft); color: #e5484d; }
.dev-info { flex: 1; min-width: 0; }
.dev-name { font-size: 15px; color: var(--text-primary); }
.dev-room { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.dev-status { font-size: 12px; padding: 4px 10px; border-radius: 20px; flex-shrink: 0; }
.st-normal { background: var(--success-soft); color: #1f9d61; }
.st-alarm { background: var(--danger-soft); color: #e5484d; font-weight: 600; }
.st-off { background: var(--off-soft); color: var(--text-muted); }

/* PC 下设备状态列表自动铺满多列 + hover 提升 */
@media (min-width: 768px) {
  .device-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
  .device-row { transition: transform 0.2s, box-shadow 0.2s; }
  .device-row:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
}
</style>

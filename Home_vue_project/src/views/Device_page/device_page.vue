<script setup>
import { ref } from 'vue'
import { useDeviceStore } from '../../stores/device'

const deviceStore = useDeviceStore()

const rooms = ['全部', '客厅', '卧室', '厨房', '书房', '玄关', '走廊']
const activeRoom = ref('全部')

// 过滤设备列表
const filtered = () =>
  activeRoom.value === '全部'
    ? deviceStore.devices
    : deviceStore.devices.filter((d) => d.room === activeRoom.value)

/* 开关切换 + Toast 提示 */
const toast = ref('')
let toastTimer = null
function toggle(dev) {
  deviceStore.toggleDevice(dev.id)
  toast.value = `${dev.name} 已${dev.on ? '开启' : '关闭'}`
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 1500)
}

// 设备图标
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
  <div class="device_page">
    <header class="page-header">
      <h2>设备控制</h2>
      <p class="sub">在线 {{ deviceStore.online }} / 共 {{ deviceStore.total }} 台</p>
    </header>

    <!-- 房间筛选 -->
    <div class="room-tabs">
      <span
        v-for="room in rooms"
        :key="room"
        class="tab"
        :class="{ active: activeRoom === room }"
        @click="activeRoom = room"
      >
        {{ room }}
      </span>
    </div>

    <!-- 设备控制列表 -->
    <div class="device-grid">
      <div
        v-for="(dev, index) in filtered()"
        :key="dev.id"
        class="device-card"
        :class="{ on: dev.on }"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <div class="card-top">
          <div class="dev-icon" :class="{ off: !dev.on, alarming: dev.alarm }">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path :d="typeIcon[dev.type] || typeIcon.plug" />
            </svg>
          </div>
          <span v-if="dev.alarm" class="alarm-tag">报警</span>
        </div>
        <p class="dev-name">{{ dev.name }}</p>
        <p class="dev-room">{{ dev.room }} · {{ dev.on ? '运行中' : '已关闭' }}</p>

        <!-- 开关 -->
        <button
          class="switch"
          :class="{ checked: dev.on }"
          :aria-label="dev.on ? '关闭设备' : '开启设备'"
          @click="toggle(dev)"
        >
          <span class="knob"></span>
        </button>
      </div>
    </div>

    <!-- 开关切换提示 -->
    <transition name="toast">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </transition>

    <p class="hint">设备控制当前为本地模拟，后续接入云服务实现远程开关</p>
  </div>
</template>

<style scoped>
.device_page { padding: 20px 16px 24px; }
.page-header h2 { font-size: 22px; color: var(--text-strong); }
.sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

.room-tabs {
  display: flex; gap: 8px; overflow-x: auto;
  padding: 14px 2px; scrollbar-width: none;
}
.room-tabs::-webkit-scrollbar { display: none; }
.tab {
  flex-shrink: 0; font-size: 13px; color: var(--text-secondary);
  background: var(--card); padding: 7px 16px; border-radius: 20px;
  cursor: pointer; box-shadow: var(--shadow);
  transition: all 0.2s;
}
.tab.active { background: linear-gradient(135deg, #2a5298, #3a7bd5); color: #fff; }

.device-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
}
.device-card {
  background: var(--surface); border-radius: 16px; padding: 14px;
  transition: background 0.25s, transform 0.2s, box-shadow 0.2s;
  animation: fadeInUp 0.45s ease both;
}
.device-card:active { transform: scale(0.97); }
.device-card.on { background: var(--card-on); box-shadow: 0 4px 14px rgba(58, 123, 213, 0.12); }
.card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.dev-icon {
  width: 44px; height: 44px; border-radius: 13px;
  background: var(--surface-2); color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.25s;
}
.device-card.on .dev-icon { background: linear-gradient(135deg, #2a5298, #3a7bd5); color: #fff; }
.dev-icon.off { background: var(--surface-2); color: var(--text-faint); }
.dev-icon.alarming { background: var(--danger-soft); color: #e5484d; }
.alarm-tag {
  font-size: 11px; color: #e5484d; background: var(--danger-soft);
  padding: 3px 8px; border-radius: 10px; font-weight: 600;
}
.dev-name { font-size: 15px; color: var(--text-primary); font-weight: 600; }
.dev-room { font-size: 12px; color: var(--text-muted); margin: 4px 0 12px; }

.switch {
  width: 46px; height: 26px; border: none; border-radius: 13px;
  background: #d5dbe6; position: relative; cursor: pointer;
  transition: background 0.25s; padding: 0;
}
.switch .knob {
  position: absolute; top: 3px; left: 3px;
  width: 20px; height: 20px; border-radius: 50%; background: #fff;
  transition: transform 0.25s; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}
.switch.checked { background: linear-gradient(135deg, #2a5298, #3a7bd5); }
.switch.checked .knob { transform: translateX(20px); }

.hint { font-size: 11px; color: var(--text-faint); text-align: center; margin-top: 20px; }

/* 开关切换 Toast */
.toast {
  position: fixed;
  left: 50%;
  bottom: 84px;
  transform: translateX(-50%);
  background: rgba(31, 42, 61, 0.92);
  color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 13px;
  z-index: 200;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.toast-enter-active, .toast-leave-active { transition: opacity 0.25s, transform 0.25s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 12px); }

/* PC 下设备网格自动铺满多列 + hover 提升 */
@media (min-width: 768px) {
  .device-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
  .device-card:hover { transform: translateY(-5px); box-shadow: 0 12px 26px rgba(31, 42, 61, 0.12); }
  .device-card:active { transform: translateY(-2px) scale(0.98); }
}
</style>

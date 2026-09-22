<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useDeviceStore } from '../../stores/device'
import { useDataStore } from '../../stores/data'

const router = useRouter()
const userStore = useUserStore()
const deviceStore = useDeviceStore()
const dataStore = useDataStore()

const userName = computed(() => userStore.userInfo.userName)
const userId = computed(() => userStore.userInfo.userId)
const theme = computed(() => userStore.theme)

function setTheme(t) {
  userStore.setTheme(t)
}

/* 昵称编辑 */
const showEdit = ref(false)
const nickInput = ref('')
function openEdit() {
  nickInput.value = userStore.userInfo.userName
  showEdit.value = true
}
function saveName() {
  const name = nickInput.value.trim()
  if (name) userStore.updateName(name)
  showEdit.value = false
}

const settingItems = [
  { key: 'notice', label: '报警消息推送', desc: '接收设备报警通知' },
  { key: 'auto', label: '设备自动联动', desc: '按场景自动控制设备' },
  { key: 'about', label: '关于系统', desc: 'v1.0.0 · 毕业设计' },
]

function onSetting(item) {
  // 预留：后续接入云服务配置
  console.log('设置项：', item.key)
}

function handleLogout() {
  userStore.logout()
  router.replace('/login')
}
</script>

<template>
  <div class="my_page">
    <!-- 用户信息卡片（无头像，展示用户 ID，可修改昵称） -->
    <section class="user-card">
      <div class="id-badge">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
        </svg>
      </div>
      <div class="user-info">
        <div class="name-row">
          <h3>{{ userName }}</h3>
          <span class="edit-btn" @click="openEdit">编辑</span>
        </div>
        <p class="uid">用户 ID：{{ userId }}</p>
      </div>
    </section>

    <!-- 外观模式：白天 / 夜间 -->
    <section class="theme-card">
      <p class="group-title">外观模式</p>
      <div class="theme-options">
        <div class="theme-opt" :class="{ active: theme === 'light' }" @click="setTheme('light')">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
          白天模式
        </div>
        <div class="theme-opt" :class="{ active: theme === 'dark' }" @click="setTheme('dark')">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
          </svg>
          夜间模式
        </div>
      </div>
    </section>

    <!-- 数据统计 -->
    <section class="stat-row">
      <div class="stat-item">
        <span class="num">{{ deviceStore.total }}</span>
        <span class="label">我的设备</span>
      </div>
      <div class="stat-item">
        <span class="num">{{ dataStore.records.length }}</span>
        <span class="label">历史记录</span>
      </div>
      <div class="stat-item">
        <span class="num alarm">{{ deviceStore.alarms.length }}</span>
        <span class="label">待处理报警</span>
      </div>
    </section>

    <!-- 设置列表 -->
    <section class="setting-group">
      <p class="group-title">通用设置</p>
      <div v-for="item in settingItems" :key="item.key" class="setting-item" @click="onSetting(item)">
        <div class="item-text">
          <p class="item-label">{{ item.label }}</p>
          <p class="item-desc">{{ item.desc }}</p>
        </div>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--text-faint)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 5 7 7-7 7" />
        </svg>
      </div>
    </section>

    <!-- 登录/退出 -->
    <section class="setting-group">
      <p class="group-title">账号</p>
      <div class="setting-item" @click="handleLogout">
        <div class="item-text">
          <p class="item-label logout">退出登录</p>
        </div>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#e5484d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 4H5v16h4M15 8l4 4-4 4M19 12H9" />
        </svg>
      </div>
    </section>

    <!-- 昵称编辑弹窗 -->
    <transition name="modal">
      <div v-if="showEdit" class="modal-mask" @click.self="showEdit = false">
        <div class="modal">
          <p class="modal-title">修改昵称</p>
          <input v-model="nickInput" class="modal-input" type="text" placeholder="请输入新昵称" maxlength="12" @keyup.enter="saveName" />
          <div class="modal-actions">
            <button class="btn-cancel" @click="showEdit = false">取消</button>
            <button class="btn-ok" @click="saveName">保存</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.my_page { padding: 20px 16px 24px; }

.user-card {
  display: flex; align-items: center; gap: 16px;
  background: linear-gradient(135deg, #2a5298, #3a7bd5);
  border-radius: 18px; padding: 22px 18px;
  box-shadow: 0 10px 24px rgba(42, 82, 152, 0.3);
  animation: fadeInUp 0.5s ease both;
}
.id-badge {
  width: 62px; height: 62px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.name-row { display: flex; align-items: center; }
.user-info h3 { color: #fff; font-size: 19px; }
.edit-btn {
  font-size: 12px; color: #fff; cursor: pointer; margin-left: 10px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 2px 10px; border-radius: 12px; transition: background 0.2s;
}
.edit-btn:hover { background: rgba(255, 255, 255, 0.3); }
.uid { color: rgba(255, 255, 255, 0.75); font-size: 13px; margin-top: 6px; }

.theme-card { margin-top: 14px; }
.theme-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.theme-opt {
  background: var(--card); border-radius: 12px; padding: 14px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  color: var(--text-secondary); border: 2px solid transparent;
  cursor: pointer; font-size: 14px; transition: all 0.2s;
  box-shadow: var(--shadow);
}
.theme-opt.active {
  border-color: #3a7bd5; color: #3a7bd5; background: var(--accent-soft);
}

.stat-row {
  display: flex; background: var(--card); border-radius: 16px;
  margin-top: 14px; padding: 16px 0;
  box-shadow: var(--shadow);
  animation: fadeInUp 0.5s 0.08s ease both;
  transition: background 0.3s;
}
.stat-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.num { font-size: 20px; font-weight: 700; color: var(--text-primary); }
.num.alarm { color: #e5484d; }
.label { font-size: 12px; color: var(--text-muted); }

.setting-group { margin-top: 16px; }
.group-title { font-size: 13px; color: var(--text-muted); margin: 0 4px 8px; }
.setting-item {
  display: flex; align-items: center; justify-content: space-between;
  background: var(--card); padding: 14px;
  border-radius: 14px; margin-bottom: 8px; cursor: pointer;
  box-shadow: var(--shadow);
  transition: transform 0.15s, box-shadow 0.2s, background 0.3s;
  animation: fadeInUp 0.45s 0.12s ease both;
}
.setting-item:active { transform: scale(0.98); }
.setting-item:hover { box-shadow: var(--shadow-lg); }
.item-label { font-size: 15px; color: var(--text-primary); }
.item-label.logout { color: #e5484d; }
.item-desc { font-size: 12px; color: var(--text-faint); margin-top: 3px; }

/* 昵称编辑弹窗 */
.modal-mask {
  position: fixed; inset: 0; z-index: 400;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
}
.modal {
  background: var(--card); border-radius: 16px; padding: 22px;
  width: 300px; max-width: 86vw;
}
.modal-title { font-size: 16px; color: var(--text-strong); margin-bottom: 16px; }
.modal-input {
  width: 100%; border: 1px solid var(--border); background: var(--surface);
  color: var(--text-primary); border-radius: 10px; padding: 10px 12px;
  font-size: 14px; outline: none;
}
.modal-input:focus { border-color: #3a7bd5; }
.modal-actions { display: flex; gap: 10px; margin-top: 16px; }
.btn-cancel, .btn-ok { flex: 1; height: 40px; border: none; border-radius: 10px; font-size: 14px; cursor: pointer; }
.btn-cancel { background: var(--surface-2); color: var(--text-secondary); }
.btn-ok { background: linear-gradient(135deg, #2a5298, #3a7bd5); color: #fff; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

/* PC 下设置项分两列 */
@media (min-width: 768px) {
  .setting-group { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 12px; }
  .group-title { grid-column: 1 / -1; }
}
</style>

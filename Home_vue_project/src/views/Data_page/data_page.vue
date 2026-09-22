<script setup>
import { ref, computed } from 'vue'
import { useDataStore } from '../../stores/data'

const dataStore = useDataStore()

const filters = [
  { key: 'all', label: '全部' },
  { key: 'alarm', label: '报警记录' },
  { key: 'normal', label: '正常记录' },
]
const activeFilter = ref('all')

const list = computed(() =>
  activeFilter.value === 'all'
    ? dataStore.records
    : dataStore.records.filter((r) => r.level === activeFilter.value)
)

function tagClass(level) {
  return level === 'alarm' ? 'tag-alarm' : 'tag-normal'
}
function tagText(level) {
  return level === 'alarm' ? '报警' : '正常'
}
</script>

<template>
  <div class="data_page">
    <header class="page-header">
      <h2>历史数据</h2>
      <p class="sub">共 {{ dataStore.records.length }} 条记录 · 本地存储，后续接入云端</p>
    </header>

    <!-- 筛选 -->
    <div class="filter-tabs">
      <span
        v-for="f in filters"
        :key="f.key"
        class="tab"
        :class="{ active: activeFilter === f.key }"
        @click="activeFilter = f.key"
      >
        {{ f.label }}
      </span>
    </div>

    <!-- 记录列表 -->
    <div class="record-list">
      <div
        v-for="(rec, index) in list"
        :key="rec.id"
        class="record-card"
        :class="rec.level"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <div class="record-head">
          <span class="rec-device">{{ rec.device }}</span>
          <span class="tag" :class="tagClass(rec.level)">{{ tagText(rec.level) }}</span>
        </div>
        <p class="rec-event">{{ rec.event }}</p>
        <div class="record-foot">
          <span class="rec-value">{{ rec.value }}</span>
          <span class="rec-time">{{ rec.time }}</span>
        </div>
      </div>

      <div v-if="!list.length" class="empty">
        <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--text-faint)" stroke-width="1.5" stroke-linecap="round">
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8 9h8M8 13h8M8 17h4" />
        </svg>
        <p>暂无相关记录</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.data_page { padding: 20px 16px 24px; }
.page-header h2 { font-size: 22px; color: var(--text-strong); }
.sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

.filter-tabs {
  display: flex; gap: 8px; margin: 14px 0;
}
.tab {
  font-size: 13px; color: var(--text-secondary); background: var(--card);
  padding: 7px 16px; border-radius: 20px; cursor: pointer;
  box-shadow: var(--shadow); transition: all 0.2s;
}
.tab.active { background: linear-gradient(135deg, #2a5298, #3a7bd5); color: #fff; }

.record-list { display: flex; flex-direction: column; gap: 10px; }
.record-card {
  background: var(--card); border-radius: 14px; padding: 13px 14px;
  box-shadow: var(--shadow);
  border-left: 3px solid transparent;
  animation: fadeInUp 0.45s ease both;
  transition: transform 0.2s, box-shadow 0.2s, background 0.3s;
}
.record-card.alarm { border-left-color: #e5484d; }
.record-card.normal { border-left-color: #1f9d61; }

.record-head { display: flex; justify-content: space-between; align-items: center; }
.rec-device { font-size: 15px; color: var(--text-primary); font-weight: 600; }
.tag { font-size: 11px; padding: 3px 8px; border-radius: 10px; }
.tag-alarm { background: var(--danger-soft); color: #e5484d; font-weight: 600; }
.tag-normal { background: var(--success-soft); color: #1f9d61; }

.rec-event { font-size: 13px; color: var(--text-secondary); margin: 6px 0 10px; }
.record-foot { display: flex; justify-content: space-between; font-size: 12px; }
.rec-value { color: #3a7bd5; }
.rec-time { color: var(--text-faint); }

.empty { text-align: center; padding: 50px 0; color: var(--text-faint); font-size: 13px; }
.empty p { margin-top: 10px; }

/* PC 下历史记录自动铺满多列 + hover 提升 */
@media (min-width: 768px) {
  .record-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
  .record-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
}
</style>

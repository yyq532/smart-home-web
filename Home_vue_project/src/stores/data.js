import { defineStore } from 'pinia'

/**
 * 历史数据 store
 * 当前为本地模拟，后续可替换为云端历史数据存储/查询接口
 */
export const useDataStore = defineStore('data', {
  state: () => ({
    records: [
      { id: 1, device: '厨房燃气传感器', room: '厨房', level: 'alarm', event: '检测到燃气浓度超标', value: '燃气 320ppm', time: '2026-09-18 08:42' },
      { id: 2, device: '烟雾报警器', room: '走廊', level: 'alarm', event: '检测到烟雾', value: '烟雾等级 3 级', time: '2026-09-18 08:45' },
      { id: 3, device: '卧室空调', room: '卧室', level: 'normal', event: '温度上报', value: '26.5℃', time: '2026-09-18 09:00' },
      { id: 4, device: '客厅主灯', room: '客厅', level: 'normal', event: '设备开启', value: '手动开关', time: '2026-09-18 09:12' },
      { id: 5, device: '玄关门锁', room: '玄关', level: 'normal', event: '开锁记录', value: '指纹开锁', time: '2026-09-18 07:30' },
      { id: 6, device: '卧室加湿器', room: '卧室', level: 'normal', event: '湿度上报', value: '湿度 58%', time: '2026-09-17 22:10' },
      { id: 7, device: '智能插座', room: '书房', level: 'normal', event: '功率上报', value: '125W', time: '2026-09-17 21:40' },
      { id: 8, device: '烟雾报警器', room: '走廊', level: 'normal', event: '自检通过', value: '设备正常', time: '2026-09-17 20:00' },
    ],
  }),
  actions: {
    /** 新增一条历史记录（模拟，后续由云端推送/拉取） */
    addRecord(record) {
      this.records.unshift({ id: Date.now(), ...record })
    },
    /** 查询历史数据（模拟） TODO: 接入云服务分页查询 */
    fetchRecords() {
      return this.records
    },
  },
})

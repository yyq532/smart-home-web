import { defineStore } from 'pinia'

/**
 * 设备 store
 * 当前为本地模拟数据，后续可替换为云服务接口（设备状态同步 / 远程控制）
 */
export const useDeviceStore = defineStore('device', {
  state: () => ({
    // 设备列表：name 设备名 / room 所在房间 / type 图标类型 / on 开关状态 / alarm 是否报警
    devices: [
      { id: 1, name: '客厅主灯', room: '客厅', type: 'light', on: true, alarm: false },
      { id: 2, name: '卧室空调', room: '卧室', type: 'ac', on: true, alarm: false },
      { id: 3, name: '厨房燃气传感器', room: '厨房', type: 'gas', on: true, alarm: true },
      { id: 4, name: '玄关门锁', room: '玄关', type: 'lock', on: true, alarm: false },
      { id: 5, name: '客厅摄像头', room: '客厅', type: 'camera', on: false, alarm: false },
      { id: 6, name: '烟雾报警器', room: '走廊', type: 'smoke', on: true, alarm: true },
      { id: 7, name: '卧室加湿器', room: '卧室', type: 'humidifier', on: false, alarm: false },
      { id: 8, name: '智能插座', room: '书房', type: 'plug', on: true, alarm: false },
    ],
  }),
  getters: {
    total: (s) => s.devices.length,
    online: (s) => s.devices.filter((d) => d.on).length,
    alarms: (s) => s.devices.filter((d) => d.alarm),
    normal: (s) => s.devices.filter((d) => !d.alarm),
  },
  actions: {
    /** 切换设备开关（模拟，后续改为下发云端指令） */
    toggleDevice(id) {
      const dev = this.devices.find((d) => d.id === id)
      if (dev) dev.on = !dev.on
    },
    /** 拉取设备列表（模拟） TODO: 接入云服务 */
    fetchDevices() {
      return this.devices
    },
  },
})

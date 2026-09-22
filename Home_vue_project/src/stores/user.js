import { defineStore } from 'pinia'

/**
 * 用户 store
 * 当前为本地模拟，后续可替换为云服务接口（登录验证 / 唯一密钥校验 / 用户资料）
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户唯一性：唯一 ID + 唯一密钥（模拟）
    userInfo: {
      userId: 'SM20260001',
      userName: localStorage.getItem('sm_nickname') || '屋主',
      secretKey: 'HOME-8888-6666',
    },
    isLoggedIn: localStorage.getItem('sm_logged_in') === '1',
    // 主题：light 白天 / dark 夜间
    theme: localStorage.getItem('sm_theme') || 'light',
    // 刚登录标志，用于首页欢迎提示
    justLoggedIn: false,
  }),
  actions: {
    /**
     * 登录（模拟验证）
     * TODO: 后续接入云服务，改为服务端验证用户名/密码/唯一密钥
     */
    login({ account, password, secretKey }) {
      if (account === this.userInfo.userId && password === '123456' && secretKey === this.userInfo.secretKey) {
        this.isLoggedIn = true
        this.justLoggedIn = true
        localStorage.setItem('sm_logged_in', '1') // 后续替换为云端 token
        return { success: true, message: '登录成功' }
      }
      return { success: false, message: '账号、密码或唯一密钥错误' }
    },
    logout() {
      this.isLoggedIn = false
      localStorage.removeItem('sm_logged_in')
    },
    /** 修改昵称（本地持久化，后续同步云端） */
    updateName(name) {
      this.userInfo.userName = name
      localStorage.setItem('sm_nickname', name)
    },
    /** 切换主题（白天/夜间），同步到根节点 data-theme */
    setTheme(theme) {
      this.theme = theme
      localStorage.setItem('sm_theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    },
    /** 获取用户信息（模拟） TODO: 后续从云端拉取 */
    fetchUserInfo() {
      return this.userInfo
    },
  },
})

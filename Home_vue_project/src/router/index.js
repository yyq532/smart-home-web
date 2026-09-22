import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login_page/login_page.vue'),
      meta: { title: '登录', hideTabbar: true },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home_page/home_page.vue'),
      meta: { title: '首页' },
    },
    {
      path: '/device',
      name: 'device',
      component: () => import('../views/Device_page/device_page.vue'),
      meta: { title: '设备' },
    },
    {
      path: '/data',
      name: 'data',
      component: () => import('../views/Data_page/data_page.vue'),
      meta: { title: '数据' },
    },
    {
      path: '/my',
      name: 'my',
      component: () => import('../views/My_page/my_page.vue'),
      meta: { title: '我的' },
    },
  ],
})

// 简单登录拦截：未登录跳转登录页（后续可改为 token 校验）
router.beforeEach((to) => {
  const token = localStorage.getItem('sm_logged_in')
  if (to.name !== 'login' && !token) {
    return { name: 'login' }
  }
  if (to.name === 'login' && token) {
    return { name: 'home' }
  }
})

export default router

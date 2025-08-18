import user from '@/config/global.ts'
import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/MyIndex.vue'
import About from '@/views/MyAbout.vue'
import Login from '@/views/Auth/MyLogin.vue'
import Register from '@/views/Auth/MyRegister.vue'
import Profile from '@/views/Profile/MyProfile.vue'
import ForgotPassword from '@/views/Auth/ForgotPassword.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: '首页',
      path: '/',
      component: Index,
      meta: {
        icon: 'fas fa-home',
        type: 0
      },
    },
    {
      name: '随笔记',
      path: '/essay',
      component: About,
      meta: {
        icon: 'fas fa-info-circle',
        type: 0
      },
    },
    {
      name: '联系',
      path: '/contact',
      component: Index,
      meta: {
        icon: 'fas fa-phone',
        type: 0
      },
    },
    {
      name: '管理',
      path: '/admin',
      component: Index,
      meta: {
        icon: 'fas fa-cog',
        type: 1,
      },
      beforeEnter: (to, from, next) => {
      // 检查用户是否已登录
        const isLoggedIn = user.is_login
        const isAdmin = user.isAdmin
        if (isAdmin>0) {
          next() // 已登录，允许访问
        } else if (isLoggedIn) {
          next('/') // 未登录，重定向到登录页面
        }else {
          next('/login') // 未登录，重定向到登录页面
        }
      }
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/forgot-password',
      component: ForgotPassword,
    },
    {
    path: '/profile',
    component: Profile,
    beforeEnter: (to, from, next) => {
      // 检查用户是否已登录
      const isLoggedIn = user.is_login
      if (isLoggedIn) {
        next() // 已登录，允许访问
      } else {
        next('/login') // 未登录，重定向到登录页面
      }
    },
  },
  ],
})

export default router

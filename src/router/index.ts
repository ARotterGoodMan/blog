import { createRouter, createWebHistory } from 'vue-router'
import MyIndex from '@/views/MyIndex.vue'
import MyAbout from '@/views/MyAbout.vue'
import Login from '@/views/Auth/Login.vue'
import Register from '@/views/Auth/Register.vue'
import ForgotPassword from '@/views/Auth/ForgotPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MyIndex,
    },
    {
      path: '/index',
      component: MyIndex,
    },
    {
      path: '/about',
      component: MyAbout,
    },
    {
      path: '/t',
      redirect: '/',
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
  ],
})

export default router

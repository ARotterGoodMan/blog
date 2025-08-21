<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 360px">
      <h3 class="text-center mb-3"><i class="fas fa-sign-in-alt"></i> 登录</h3>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">邮箱</label>
          <input v-model="email" type="email" class="form-control" required/>
        </div>
        <div class="mb-3">
          <label class="form-label">密码</label>
          <input v-model="password" type="password" class="form-control" required/>
        </div>
        <!-- 密码错误显示 -->
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
        <button type="submit" class="btn btn-primary w-100">登录</button>
      </form>
      <div class="d-flex justify-content-between mt-3">
        <router-link to="/register">注册</router-link>
        <router-link to="/forgot-password">忘记密码？</router-link>
      </div>
    </div>
  </div>
  </main>

</template>

<script lang="ts" setup>
import {ref} from 'vue'
import router from '@/router'
import {useGlobalStore} from "@/config/global.ts";
import {Serverd} from "@/tools/Server.ts";

const email = ref('')
const password = ref('')
let errorMessage = ref('')
const global = useGlobalStore();

function handleLogin() {
  Serverd.login(email.value, password.value)
    .then((response) => {
      if (response.status === 200) {
        // 登录成功，设置用户信息
        console.log(response.data.data)
        if (response.data.status !== 200) {
          errorMessage.value= '登录失败，请检查邮箱和密码。'
          setTimeout(()=>{
            errorMessage.value = ''
          }, 3000)
          console.log('登录失败，请检查邮箱和密码。')
          return
        }
        let userData = {
          username: response.data.data.username || '',
          email: response.data.data.email || '',
          phone: response.data.data.phone || '',
          token: response.data.data.token || '',
          avatar: response.data.data.avatar || '',
          isAdmin: response.data.data.is_admin || 0,
          is_login: true,
        }
        sessionStorage.setItem('user', JSON.stringify(userData))
        let data: {
          username: string
          email: string
          phone: string
          token: string
          avatar: string
          isAdmin: number
          is_login: boolean
        } = {
          is_login: true,
          isAdmin: response.data.data.is_admin || 0,
          username: response.data.data.username || '',
          email: response.data.data.email || '',
          avatar: response.data.data.avatar || '',
          token: response.data.data.token || '',
          phone: response.data.data.phone || '',
        }
        global.setUser(data)
        router.push('/')

      } else {
        console.log('登录失败，请检查邮箱和密码。')
      }
    })
    .catch((error) => {
      console.error('登录错误:', error)
      console.log('登录失败，请稍后再试。')
    })

}
</script>

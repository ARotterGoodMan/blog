<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center"
         style="height: calc(100vh - 120px);">
      <div class="card p-4 shadow" style="width:360px">
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


const getIPByAPI = () => {
  return new Promise((resolve, reject) => {
    // 使用多个备选API
    const apiUrls = [
      'https://ipapi.co/json/',
      'https://jsonip.com'
    ];

    let attempts = 0;

    const tryNext = () => {
      if (attempts >= apiUrls.length) {
        reject(new Error('所有IP API请求都失败了'));
        return;
      }

      fetch(apiUrls[attempts], {mode: 'cors'})
        .then(response => response.json())
        .then(data => {
          // 不同API返回的数据结构不同
          const ip = data.ip || data.ipAddress;
          if (ip) {
            resolve(ip);
          } else {
            attempts++;
            tryNext();
          }
        })
        .catch(() => {
          attempts++;
          tryNext();
        });
    };

    tryNext();
  });
};

let ip: unknown = '';

getIPByAPI().then(res => {
  ip = res;
}).catch(err => {
  console.error("获取IP地址失败:", err);
})


function handleLogin() {
  Serverd.login(email.value, password.value, typeof ip === "string" ? ip : '')
    .then((response) => {
      if (response.status === 200) {
        // 登录成功，设置用户信息
        if (response.data.status !== 200) {
          errorMessage.value = response.data.message
          setTimeout(() => {
            errorMessage.value = ''
          }, 3000)
          console.log('登录失败，请检查邮箱和密码。')
          return
        }
        let userData = {
          username: response.data.data.username || '',
          email: response.data.data.email || '',
          token: response.data.data.token || '',
          avatar: response.data.data.avatar || '',
          isAdmin: response.data.data.is_admin || 0,
          is_login: true,
        }
        sessionStorage.setItem('user', JSON.stringify(userData))
        let data: {
          username: string
          email: string
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

<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center" style="height: 100%;">
    <div class="card p-4 shadow" style="width: 360px">
      <h3 class="text-center mb-3"><i class="fas fa-user-plus"></i> 注册</h3>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label class="form-label">用户名</label>
          <input v-model="username" type="text" class="form-control" required/>
        </div>
        <div class="mb-3">
          <label class="form-label">邮箱</label>
          <input v-model="email" type="email" class="form-control" required/>
        </div>
        <div class="mb-3">
          <label class="form-label">手机号</label>
          <input v-model="phone" type="tel" class="form-control" required/>
        </div>
        <div class="mb-3">
          <label class="form-label">密码</label>
          <input v-model="password" type="password" class="form-control" required/>
        </div>
        <div v-if="Message" :class="'alert '+ (massage_color ? 'alert-success' : 'alert-danger')">
          <i class="fas" :class="massage_color ? 'fa-check' : 'fa-exclamation-triangle'"></i>
          {{ Message }}
        </div>
        <button type="submit" class="btn btn-success w-100">注册</button>
      </form>
      <div class="text-center mt-3">
        <router-link to="/login">已有账号？去登录</router-link>
      </div>
    </div>
  </div>
  </main>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {Serverd} from "@/tools/Server.ts";

const username = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const Message = ref('')
let massage_color = true


const router = useRouter()

function handleRegister() {
  if (!username.value || !email.value || !phone.value || !password.value) {
    alert('请填写所有字段')
    return
  }
  // 这里可以添加更多的验证逻辑，比如邮箱格式、密码强度等
  // 发送注册请求到服务器
  Serverd.register({
    username: username.value,
    email: email.value,
    phone: phone.value,
    password: password.value
  }).then(response => {
    if (response.data.status==201) {

      alert('注册成功！请登录。')
      Message.value = '注册成功！请登录。'
      // 可以重定向到登录页面
      setTimeout(()=>router.push('/login'),3000)
    } else {
      massage_color = false
      Message.value = '注册失败：' + response.data.message

    }
  }).catch(error => {
    console.error('注册请求失败:', error)
  })

}
</script>

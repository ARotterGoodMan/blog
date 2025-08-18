<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow" style="width: 360px">
      <h3 class="text-center mb-3"><i class="fas fa-sign-in-alt"></i> 登录</h3>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">邮箱</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">密码</label>
          <input v-model="password" type="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">登录</button>
      </form>
      <div class="d-flex justify-content-between mt-3">
        <router-link to="/register">注册</router-link>
        <router-link to="/forgot-password">忘记密码？</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function handleLogin() {
  console.log(`登录: ${email.value}, ${password.value}`)
}
</script>

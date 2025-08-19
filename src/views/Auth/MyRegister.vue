<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow" style="width: 360px">
      <h3 class="text-center mb-3"><i class="fas fa-user-plus"></i> 注册</h3>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label class="form-label">用户名</label>
          <input v-model="username" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">邮箱</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">密码</label>
          <input v-model="password" type="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-success w-100">注册</button>
      </form>
      <div class="text-center mt-3">
        <router-link to="/login">已有账号？去登录</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')

function handleRegister() {
  alert(`注册: ${username.value}, ${email.value}, ${password.value}`)
}
</script>

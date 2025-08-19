<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow" style="width: 360px">
      <h3 class="text-center mb-3"><i class="fas fa-unlock-alt"></i> 忘记密码</h3>
      <form @submit.prevent="handleForgotPassword">
        <div class="mb-3">
          <label class="form-label">邮箱</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-warning w-100">重置密码</button>
      </form>
      <div class="text-center mt-3">
        <router-link to="/login">返回登录</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const email = ref('')

function handleForgotPassword() {
  alert(`重置密码邮件已发送到: ${email.value}`)
}
</script>

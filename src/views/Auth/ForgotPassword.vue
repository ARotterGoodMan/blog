<template>
  <div class="container d-flex justify-content-center align-items-center"
       style="height: calc(100vh - 122px);">
    <div class="card p-4 shadow" style="width: 360px">
      <h3 class="text-center mb-3"><i class="fas fa-unlock-alt"></i> 忘记密码</h3>
      <form @submit.prevent="handleForgotPassword">
        <div class="mb-3">
          <label class="form-label">邮箱</label>
          <input v-model="email" type="email" class="form-control" required/>
        </div>
        <button type="submit" class="btn btn-warning w-100">重置密码</button>
      </form>
      <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>
      <div class="text-center mt-3">
        <router-link to="/login">返回登录</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {Servers} from "@/tools/Server.ts";

const email = ref('')
const message = ref('')
const loading = ref(false)


function handleForgotPassword() {
  message.value = ''
  loading.value = true

  Servers.forgot_password(email.value).then(res => {
    message.value = '✅ 重置链接已发送，请查收'
  }).catch(err => {
    message.value = err.response?.data?.error || '❌ 请求失败'
  }).finally(() => {
    loading.value = false
  })
}

</script>

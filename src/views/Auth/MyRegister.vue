<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center"
         style="height: calc(100vh - 122px);">
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
            <label class="form-label">密码</label>
            <input v-model="password" type="password" class="form-control" required/>
          </div>
          <div class="mb-3">
            <label class="form-label">确认密码</label>
            <input v-model="ConfirmPassword" type="password" class="form-control" required/>
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
import {Servers} from "@/tools/Server.ts";
import {sm2} from 'sm-crypto';
import {type KEY} from "@/config/config.ts";

const username = ref('')
const email = ref('')
const password = ref('')
const ConfirmPassword = ref('')
const Message = ref('')
let massage_color = true
const router = useRouter()

const key = ref<KEY>({
  key_id: '',
  public_key: '',
})

function handleRegister() {
  if (!username.value || !email.value || !password.value || !ConfirmPassword.value) {
    Message.value = '请填写所有字段'
    massage_color = false
    return
  }
  if (password.value !== ConfirmPassword.value) {
    Message.value = '两次输入的密码不匹配'
    massage_color = false
    return
  }
  Servers.getKey().then(res => {
    if (res.status != 200) {
      Message.value = '获取公钥失败：' + res.data.message
      massage_color = false
      return
    }

    key.value.key_id = res.data.key_id
    key.value.public_key = res.data.public_key
    password.value = sm2.doEncrypt(password.value, key.value.public_key, 0);
    Servers.register({
      username: username.value,
      email: email.value,
      password: password.value,
      key_id: key.value.key_id
    }).then((res) => {
      if (res.data.status == 201) {
        Message.value = '注册成功！请登录。'
        // 可以重定向到登录页面
        setTimeout(() => router.push('/login'), 3000)
      } else {
        massage_color = false
        Message.value = '注册失败：' + res.data.message
      }
    }).catch(error => {
      console.error('注册请求失败:', error)
    })
  })
}
</script>

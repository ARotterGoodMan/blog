<template>
  <div class="container d-flex justify-content-center align-items-center"
       style="height: calc(100vh - 122px);">
    <div class="card p-4 shadow" style="width: 360px">
      <h3 class="text-center mb-3"><i class="fas fa-key"></i> 重置密码</h3>
      <form @submit.prevent="handleResetPassword">
        <div class="mb-3">
          <label class="form-label">新密码</label>
          <input v-model="password" type="password" class="form-control" required/>
        </div>
        <button type="submit" class="btn btn-success w-100">提交</button>
      </form>
      <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {sm2} from 'sm-crypto';
import {useRoute} from 'vue-router'
import {type KEY} from "@/config/config.ts";
import {Servers} from "@/tools/Server.ts";

const route = useRoute()
const token = route.query.token as string
const password = ref('')
const message = ref('')
const key = ref<KEY>({
  key_id: '',
  public_key: '',
})

function handleResetPassword() {

  Servers.getKey().then(res => {
    key.value.key_id = res.data.key_id
    key.value.public_key = res.data.public_key
    let newpassword = sm2.doEncrypt(password.value, key.value.public_key, 0)
    Servers.reset_password(key.value.key_id, token, newpassword).then(res => {
      message.value = res.data.message
    }).catch(err => {
      message.value = err.data.message
    })
  })


}
</script>

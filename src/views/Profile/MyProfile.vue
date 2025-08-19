<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow" style="width: 500px">
      <h3 class="text-center mb-3"><i class="fas fa-user"></i> 个人信息</h3>

      <div v-if="!isEditing">
        <div class="text-center mb-3">
          <img
            src="@/assets/img/logo.png"
            alt="User Avatar"
            class="rounded-circle"
            width="120"
            height="120"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">用户名</label>
          <p class="form-control">{{ userdata.name }}</p>
        </div>
        <div class="mb-3">
          <label class="form-label">邮箱</label>
          <p class="form-control">{{ userdata.email }}</p>
        </div>

        <div class="mb-3">
          <label class="form-label">密码</label>
          <p class="form-control">{{ userdata.password }}</p>
        </div>

        <div class="d-flex justify-content-between mt-3">
          <button class="btn btn-primary" @click="toggleEditMode">
            <i class="fas fa-edit"></i> 编辑
          </button>
          <button class="btn btn-info" @click="toggleLogout">
            <i class="fas fa-times"></i> 退出
          </button>
        </div>
      </div>

      <!-- 编辑模式 -->
      <div v-else>
        <div class="mb-3">
          <label class="form-label">用户名</label>
          <input v-model="editableUser.name" type="text" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">邮箱</label>
          <input v-model="editableUser.email" type="email" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">密码</label>
          <input v-model="editableUser.password" type="password" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">头像</label>
          <input
            v-model="editableUser.avatar"
            type="url"
            class="form-control"
            placeholder="请输入头像URL"
          />
        </div>
        <div class="d-flex justify-content-between mt-3">
          <button class="btn btn-success" @click="saveChanges">
            <i class="fas fa-save"></i> 保存
          </button>
          <button class="btn btn-secondary" @click="toggleEditMode">
            <i class="fas fa-times"></i> 取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import user from '@/config/global.ts'
import router from '@/router'

interface User {
  name: string
  email: string
  avatar: string
  password: string
  isAdmin: number
  token: string
}

const userdata = ref<User>(user)

const editableUser = ref<User>({ ...user })
const isEditing = ref(false)

function toggleLogout() {
  user.is_login = false
  user.name = ''
  user.email = ''
  user.avatar = ''
  user.password = ''
  user.isAdmin = 0
  user.token = ''
  userdata.value = { ...user }
  editableUser.value = { ...user }
  router.push('/')
}

function toggleEditMode() {
  isEditing.value = !isEditing.value
}

function saveChanges() {
  user.name = editableUser.value.name
  user.email = editableUser.value.email
  user.avatar = editableUser.value.avatar
  user.password = editableUser.value.password
  user.isAdmin = editableUser.value.isAdmin
  user.token = editableUser.value.token
  userdata.value = { ...user }
  editableUser.value = { ...user }
  toggleEditMode()
  alert('信息已更新！')
}
</script>

<style scoped>
.card {
  max-width: 500px;
}

img {
  object-fit: cover;
}
</style>

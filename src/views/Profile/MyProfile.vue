<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center"
         style="height: calc(100vh - 122px);">
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
            <p class="form-control">{{ userdata.username }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label">邮箱</label>
            <p class="form-control">{{ userdata.email }}</p>
          </div>

          <!--        <div class="mb-3">
                    <label class="form-label">手机号</label>
                    <p class="form-control">{{ userdata.phone }}</p>
                  </div>-->

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
            <input v-model="editableUser.username" type="text" class="form-control"/>
          </div>
          <div class="mb-3">
            <label class="form-label">邮箱 <span
              style="color:#f00;font-size: .75rem">用于登录无法修改</span></label>
            <input v-model="editableUser.email" type="email" class="form-control" disabled/>
          </div>
          <!--        <div class="mb-3">
                    <label class="form-label">手机号</label>
                    <input v-model="editableUser.phone" type="text" class="form-control"/>
                  </div>-->
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
  </main>

</template>

<script lang="ts" setup>
import {ref} from 'vue'
import router from '@/router'
import {Serverd} from "@/tools/Server.ts";
import {useGlobalStore} from "@/config/global";

const global = useGlobalStore()

interface User {
  username: string
  email: string
  avatar: string
  isAdmin: number
  token: string
  is_login: boolean
}

const userdata = ref<User>(global.user)

const editableUser = ref<User>({...global.user})
const isEditing = ref(false)

function toggleLogout() {
  sessionStorage.removeItem('user')
  Serverd.logout()
  global.setUser({
    username: '',
    email: '',
    avatar: '',
    isAdmin: 0,
    token: '',
    is_login: false
  })
  userdata.value = {...global.user}
  editableUser.value = {...global.user}
  router.push('/')
}

function toggleEditMode() {
  isEditing.value = !isEditing.value
}

function saveChanges() {
  global.setUser({
    username: editableUser.value.username,
    email: editableUser.value.email,
    avatar: editableUser.value.avatar,
    isAdmin: editableUser.value.isAdmin,
    token: editableUser.value.token,
    is_login: true
  })
  sessionStorage.setItem('user', JSON.stringify(global.user))
  userdata.value = {...global.user}
  editableUser.value = {...global.user}
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

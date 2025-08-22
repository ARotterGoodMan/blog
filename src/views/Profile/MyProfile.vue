<template>
  <main>
    <div class="container d-flex justify-content-center align-items-center">
      <div class="card p-4 shadow" style="width: 700px">
        <h3 class="text-center mb-3"><i class="fas fa-user"></i> 个人信息</h3>

        <!-- 头像预览 -->
        <div class="text-center mb-3">
          <img
            src="@/assets/img/logo.png"
            alt="User Avatar"
            class="rounded-circle"
            width="100"
            height="100"
          />
        </div>

        <!-- Tab 切换 -->
        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#basic">基础信息
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#contact">联系方式
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#address">地址信息
            </button>
          </li>
        </ul>

        <!-- Tab 内容 -->
        <div class="tab-content">
          <!-- 基础信息 -->
          <div class="tab-pane fade show active" id="basic">
            <div class="row">
              <div class="mb-3 col-md-6">
                <label class="form-label">用户名</label>
                <input v-model="editableUser.username" type="text" class="form-control"
                       :disabled="!isEditing"/>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">邮箱
                  <span style="color:#f00;font-size:.75rem">用于登录无法修改</span>
                </label>
                <input v-model="editableUser.email" type="email" class="form-control" disabled/>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">姓名</label>
                <input v-model="editableProfile.name" type="text" class="form-control"
                       :disabled="!isEditing"/>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">性别</label>
                <select v-model="editableProfile.sex" class="form-control" :disabled="!isEditing">
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="保密">保密</option>
                </select>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">出生日期</label>
                <input v-model="editableProfile.birth_date" type="date" class="form-control"
                       :disabled="!isEditing"/>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">头像</label>
                <input v-model="editableUser.avatar" type="url" class="form-control"
                       placeholder="请输入头像URL" :disabled="!isEditing"/>
              </div>
            </div>
          </div>

          <!-- 联系方式 -->
          <div class="tab-pane fade" id="contact">
            <div class="row">
              <div class="mb-3 col-md-12">
                <label class="form-label">手机号</label>
                <input v-model="editableProfile.phone" type="text" class="form-control"
                       :disabled="!isEditing"/>
              </div>
            </div>
          </div>

          <!-- 地址信息 -->
          <div class="tab-pane fade" id="address">
            <div class="row">
              <div class="mb-3 col-md-6">
                <label class="form-label">国家</label>
                <input v-model="editableProfile.country" type="text" class="form-control"
                       :disabled="!isEditing"/>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">城市</label>
                <input v-model="editableProfile.city" type="text" class="form-control"
                       :disabled="!isEditing"/>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">地址</label>
                <input v-model="editableProfile.address" type="text" class="form-control"
                       :disabled="!isEditing"/>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label">邮编</label>
                <input v-model="editableProfile.postal_code" type="text" class="form-control"
                       :disabled="!isEditing"/>
              </div>
            </div>
          </div>
        </div>

        <!-- 统一底部按钮 -->
        <div class="card-buttons">
          <div>
            <template v-if="!isEditing">
              <button class="btn btn-primary" @click="toggleEditMode">
                <i class="fas fa-edit"></i> 编辑
              </button>
            </template>
            <template v-else>
              <button class="btn btn-success" @click="saveChanges">
                <i class="fas fa-save"></i> 保存
              </button>
            </template>
          </div>
          <div>
            <template v-if="!isEditing">
              <button class="btn btn-info" @click="toggleLogout">
                <i class="fas fa-sign-out-alt"></i> 退出
              </button>
            </template>
            <template v-else>
              <button class="btn btn-secondary" @click="toggleEditMode">
                <i class="fas fa-times"></i> 取消
              </button>
            </template>
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

interface UserProfile {
  name: string
  sex: '男' | '女' | '保密'
  birth_date: string | null
  phone: string
  address: string
  city: string
  country: string
  postal_code: string
}

const userdata = ref<User>(global.user)
const profile = ref<UserProfile>({
  name: '',
  sex: '保密',
  birth_date: null,
  phone: '',
  address: '',
  city: '',
  country: '',
  postal_code: ''
})

// 表单编辑对象
const editableUser = ref<User>({...userdata.value})
const editableProfile = ref<UserProfile>({...profile.value})

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
  userdata.value = global.user
  profile.value = {
    name: '',
    sex: '保密',
    birth_date: null,
    phone: '',
    address: '',
    city: '',
    country: '',
    postal_code: ''
  }
  editableUser.value = {...userdata.value}
  editableProfile.value = {...profile.value}
  router.push('/')
}

function toggleEditMode() {
  // 如果是取消编辑，恢复数据
  if (isEditing.value) {
    editableUser.value = {...userdata.value}
    editableProfile.value = {...profile.value}
  }
  isEditing.value = !isEditing.value
}

function saveChanges() {
  // 更新 global 里的基础信息
  global.setUser({...editableUser.value, is_login: true})
  sessionStorage.setItem('user', JSON.stringify(global.user))
  userdata.value = {...global.user}

  // 更新资料信息
  profile.value = {...editableProfile.value}

  isEditing.value = false
  alert('信息已更新！')
}
</script>

<style scoped>

img {
  object-fit: cover;
}

.card {
  max-width: 700px;
  height: calc(100vh - 122px); /* 固定卡片高度 */
  display: flex;
  flex-direction: column;
  padding-bottom: 20px; /* 给按钮留空间 */
}

@media (max-width: 576px) {
  .card {
    width: 100%;
    height: auto;
    display: flex;
  }
}

.tab-content {
  flex: 1; /* 填满剩余高度 */
  overflow: visible; /* 不出现滚动条 */
}

/* 底部按钮固定，左右分布 */
.card-buttons {
  display: flex;
  justify-content: space-between; /* 左右分布 */
  margin-top: auto; /* 自动推到最底部 */
  text-align: center;
}

/* .card 适用手机界面 */


</style>

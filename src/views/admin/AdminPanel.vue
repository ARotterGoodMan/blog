<template>
  <main>
    <div class="container mt-5">
      <h2 class="mb-4 text-center"><i class="fas fa-user-shield"></i> 管理员后台</h2>

      <!-- 添加用户按钮 -->
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-success" @click="openAddUserModal">
          <i class="fas fa-user-plus"></i> 添加用户
        </button>
      </div>

      <!-- 用户表格 -->
      <table class="table table-bordered table-hover shadow-sm text-center">
        <thead class="table-dark">
          <tr>
            <th>用户名</th>
            <th>邮箱</th>
            <th>手机号</th>
            <th>角色</th>
            <th>密码</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.role }}</td>
            <td>********</td>
            <td>
              <button class="btn btn-sm btn-primary me-2" @click="editUser(index)">
                <i class="fas fa-edit"></i> 编辑
              </button>
              <button class="btn btn-sm btn-danger" @click="deleteUser(index)">
                <i class="fas fa-trash"></i> 删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 编辑/添加用户 Modal -->
      <div
        v-if="isModalOpen"
        class="modal fade show d-block"
        tabindex="-1"
        style="background: rgba(0, 0, 0, 0.5)"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i :class="isAdding ? 'fas fa-user-plus' : 'fas fa-user-edit'"></i>
                {{ isAdding ? '添加用户' : '修改用户' }}
              </h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveChanges">
                <div class="mb-3">
                  <label class="form-label">用户名</label>
                  <input v-model="editableUser.name" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">邮箱</label>
                  <input v-model="editableUser.email" type="email" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">手机号</label>
                  <input v-model="editableUser.phone" type="tel" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">角色</label>
                  <select v-model="editableUser.role" class="form-select">
                    <option value="0">用户</option>
                    <option value="1">管理员</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">密码</label>
                  <input
                    v-model="editableUser.password"
                    type="password"
                    class="form-control"
                    required
                  />
                </div>
                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-secondary me-2" @click="closeModal">
                    取消
                  </button>
                  <button type="submit" class="btn btn-success">
                    <i class="fas fa-save"></i> 保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 定义用户类型
interface User {
  name: string
  email: string
  phone: string
  role: string
  password: string
}

// 模拟用户数据
const users = ref<User[]>([
  {
    name: '潇遥',
    email: 'xiaoyao@example.com',
    phone: '13800138000',
    role: '管理员',
    password: 'admin123',
  },
  {
    name: '小明',
    email: 'xiaoming@example.com',
    phone: '13900139000',
    role: '用户',
    password: 'user123',
  },
  {
    name: '小红',
    email: 'xiaohong@example.com',
    phone: '13700137000',
    role: '用户',
    password: 'user456',
  },
])

// 弹窗状态
const isModalOpen = ref(false)
const isAdding = ref(false) // 区分添加和编辑
const editableUser = ref<User>({ name: '', email: '', phone: '', role: 'user', password: '' })
const editingIndex = ref<number | null>(null)

// 打开“添加用户”弹窗
function openAddUserModal() {
  isAdding.value = true
  editableUser.value = { name: '', email: '', phone: '', role: 'user', password: '' }
  isModalOpen.value = true
}

// 点击编辑按钮
function editUser(index: number) {
  isAdding.value = false
  editableUser.value = { ...users.value[index] }
  editingIndex.value = index
  isModalOpen.value = true
}

// 保存修改 / 添加
function saveChanges() {
  if (isAdding.value) {
    users.value.push({ ...editableUser.value })
  } else if (editingIndex.value !== null) {
    users.value[editingIndex.value] = { ...editableUser.value }
  }
  closeModal()
}

// 删除用户
function deleteUser(index: number) {
  if (confirm('确定要删除该用户吗？')) {
    users.value.splice(index, 1)
  }
}

// 关闭弹窗
function closeModal() {
  isModalOpen.value = false
  editingIndex.value = null
}
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
.modal {
  display: block;
}
</style>

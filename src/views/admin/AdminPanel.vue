<template>
  <main>
    <div class="container my-4">
    <!-- 顶部操作栏 -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
      <h4 class="fw-bold">用户管理</h4>
      <div class="d-flex gap-2 flex-wrap">
        <!-- 搜索框 -->
        <input
          v-model="searchQuery"
          type="text"
          class="form-control"
          placeholder="搜索用户名 / 邮箱 / 手机号"
          style="max-width: 250px"
        />

        <!-- 角色筛选 -->
        <select v-model="roleFilter" class="form-select" style="max-width: 150px">
          <option value="">全部角色</option>
          <option value="管理员">管理员</option>
          <option value="用户">用户</option>
        </select>

        <!-- 添加用户 -->
        <button class="btn btn-success" @click="openEditModal(null)">
          <i class="fas fa-user-plus me-2"></i> 添加用户
        </button>
      </div>
    </div>

    <!-- 桌面端表格 -->
    <div class="table-responsive d-none d-md-block">
      <table class="table table-hover align-middle text-center">
        <thead class="table-light">
          <tr>
            <th>用户名</th>
            <th>邮箱</th>
            <th>手机号</th>
            <th>角色</th>
            <th>密码</th>
            <th class="text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.email">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>
              <span
                class="badge"
                :class="user.role === '管理员' ? 'bg-danger' : 'bg-secondary'"
              >
                {{ user.role }}
              </span>
            </td>
            <td>********</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(user)">
                <i class="fas fa-edit"></i> 编辑
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user)">
                <i class="fas fa-trash"></i> 删除
              </button>
            </td>
          </tr>
          <tr v-if="paginatedUsers.length === 0">
            <td colspan="6" class="text-center text-muted">没有找到匹配的用户</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 移动端卡片视图 -->
    <div class="d-md-none">
      <div
        v-for="user in paginatedUsers"
        :key="user.email"
        class="card mb-3 shadow-sm"
      >
        <div class="card-body">
          <h5 class="card-title d-flex justify-content-between">
            <span>{{ user.username }}</span>
            <span
              class="badge"
              :class="user.role === '管理员' ? 'bg-danger' : 'bg-secondary'"
            >
              {{ user.role }}
            </span>
          </h5>
          <p class="mb-1"><i class="fas fa-envelope me-2"></i>{{ user.email }}</p>
          <p class="mb-1"><i class="fas fa-phone me-2"></i>{{ user.phone }}</p>
          <p class="mb-2"><i class="fas fa-lock me-2"></i>********</p>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-sm btn-outline-primary" @click="openEditModal(user)">
              <i class="fas fa-edit"></i> 编辑
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user)">
              <i class="fas fa-trash"></i> 删除
            </button>
          </div>
        </div>
      </div>
      <p v-if="paginatedUsers.length === 0" class="text-center text-muted">没有找到匹配的用户</p>
    </div>

    <!-- 分页控制 -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2">
      <div class="d-flex align-items-center gap-2">
        <span>每页显示:</span>
        <select v-model.number="itemsPerPage" class="form-select form-select-sm" style="width: 80px">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
      </div>
      <nav>
        <ul class="pagination mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage">上一页</button>
          </li>
          <li class="page-item disabled">
            <span class="page-link">第 {{ currentPage }} / {{ totalPages }} 页</span>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="nextPage">下一页</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- 编辑模态框 -->
    <div class="modal fade" id="editModal" tabindex="-1" ref="editModalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="saveUser">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingUser?.email ? "编辑用户" : "添加用户" }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">用户名</label>
                <input v-model="tempUser.username" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">邮箱</label>
                <input v-model="tempUser.email" type="email" class="form-control" :disabled="!!editingUser?.email" required />
              </div>
              <div class="mb-3">
                <label class="form-label">手机号</label>
                <input v-model="tempUser.phone" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">角色</label>
                <select v-model="tempUser.role" class="form-select" required>
                  <option value="管理员">管理员</option>
                  <option value="用户">用户</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
              <button type="submit" class="btn btn-primary">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  </main>

</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Modal } from "bootstrap";

interface User {
  username: string;
  email: string;
  phone: string;
  role: string;
}

const users = ref<User[]>([
  { username: "潇遥", email: "xiaoyao@example.com", phone: "13800138000", role: "管理员" },
  { username: "小明", email: "xiaoming@example.com", phone: "13900139000", role: "用户" },
  { username: "小红", email: "xiaohong@example.com", phone: "13700137000", role: "用户" },
]);

const searchQuery = ref("");
const roleFilter = ref("");
const itemsPerPage = ref(5);
const currentPage = ref(1);

// 编辑/新增用户
const editingUser = ref<User | null>(null);
const tempUser = ref<User>({ username: "", email: "", phone: "", role: "用户" });
const editModalRef = ref<HTMLElement | null>(null);
let bsModal: Modal | null = null;

// 过滤后的用户
const filteredUsers = computed(() =>
  users.value.filter((u) => {
    const matchesSearch =
      u.username.includes(searchQuery.value) ||
      u.email.includes(searchQuery.value) ||
      u.phone.includes(searchQuery.value);
    const matchesRole = roleFilter.value ? u.role === roleFilter.value : true;
    return matchesSearch && matchesRole;
  })
);

// 总页数
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredUsers.value.length / itemsPerPage.value))
);

// 分页后的用户
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredUsers.value.slice(start, start + itemsPerPage.value);
});

// 翻页方法
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

// 当搜索/筛选改变时，重置到第一页
watch([searchQuery, roleFilter, itemsPerPage], () => {
  currentPage.value = 1;
});

// 删除用户
function deleteUser(user: User) {
  if (confirm(`确定要删除用户 ${user.username} 吗？`)) {
    users.value = users.value.filter((u) => u.email !== user.email);
  }
}

// 打开编辑/新增模态框
function openEditModal(user: User | null) {
  editingUser.value = user;
  tempUser.value = user ? { ...user } : { username: "", email: "", phone: "", role: "用户" };
  if (editModalRef.value) {
    bsModal = new Modal(editModalRef.value);
    bsModal.show();
  }
}

// 保存用户
function saveUser() {
  if (editingUser.value) {
    // 更新
    const index = users.value.findIndex((u) => u.email === editingUser.value?.email);
    if (index !== -1) users.value[index] = { ...tempUser.value };
  } else {
    // 新增
    users.value.push({ ...tempUser.value });
  }
  bsModal?.hide();
}
</script>

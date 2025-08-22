<template>
  <main>
    <div class="container my-4">
      <!-- 顶部操作栏 -->
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
        <h4 class="fw-bold">用户管理</h4>
        <div class="d-flex gap-2 flex-wrap">
          <input v-model="searchQuery" type="text" class="form-control"
                 placeholder="搜索用户名 / 邮箱 / 手机号" style="max-width: 250px"/>
          <select v-model="roleFilter" class="form-select" style="max-width: 150px">
            <option value="">全部角色</option>
            <option value="1">管理员</option>
            <option value="0">用户</option>
          </select>
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
              <th>ID</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.email">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="badge" :class="user.role === 1 ? 'bg-danger' : 'bg-secondary'">
                  {{ user.role === 1 ? '管理员' : '用户' }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(user)">
                  <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user)">
                  <i class="fas fa-trash"></i> 删除
                </button>
              </td>
            </tr>
            <tr v-if="paginatedUsers.length === 0">
              <td colspan="5" class="text-center text-muted">没有找到匹配的用户</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 移动端卡片 -->
      <div class="d-md-none">
        <div v-for="user in paginatedUsers" :key="user.email" class="card mb-3 shadow-sm">
          <div class="card-body">
            <h5 class="card-title d-flex justify-content-between">
              <span>{{ user.username }}</span>
              <span class="badge" :class="user.role === 1 ? 'bg-danger' : 'bg-secondary'">
                {{ user.role === 1 ? '管理员' : '用户' }}
              </span>
            </h5>
            <p class="mb-1"><i class="fas fa-envelope me-2"></i>{{ user.email }}</p>
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

      <!-- 分页 -->
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2">
        <div class="d-flex align-items-center gap-2">
          <span>每页显示:</span>
          <select v-model.number="itemsPerPage" class="form-select form-select-sm"
                  style="width: 80px">
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

      <!-- 编辑/新增用户模态框 -->
      <div class="modal fade" id="editModal" tabindex="-1" ref="editModalRef">
        <div class="modal-dialog">
          <div class="modal-content">
            <form @submit.prevent="saveUser">
              <div class="modal-header">
                <h5 class="modal-title">{{ editingUser?.email ? "编辑用户" : "添加用户" }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div class="modal-body">
                <!-- 操作提示信息 -->
                <div class="mb-3">
                  <label class="form-label">用户名</label>
                  <input v-model="tempUser.username" type="text" class="form-control" required/>
                </div>
                <div class="mb-3">
                  <label class="form-label">邮箱</label>
                  <input v-model="tempUser.email" type="email" class="form-control"
                         :disabled="!!editingUser?.email" required/>
                </div>
                <div class="mb-3">
                  <label class="form-label">密码</label>
                  <input v-model="tempUser.password" type="password" class="form-control"
                         :required="!editingUser?.email"
                         placeholder="编辑用户可留空保持原密码"/>
                </div>
                <div class="mb-3">
                  <label class="form-label">角色</label>
                  <select v-model.number="tempUser.role" class="form-select" required>
                    <option :value="1">管理员</option>
                    <option :value="0">用户</option>
                  </select>
                </div>
              </div>
              <div v-if="ModalAlert" class="alert alert-success text-center mb-2">
                {{ ModalAlert }}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消
                </button>
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
import {ref, computed, watch, onMounted} from "vue";
import {Modal} from "bootstrap";
import {Serverd} from "@/tools/Server.ts";

interface User {
  id: number;
  username: string;
  email: string;
  role: 0 | 1;
  password?: string;
}

const users = ref<User[]>([]);

// 获取后端用户列表
Serverd.getAllUsers().then((res) => {
  users.value = res.data.data.map((user: any) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.is_admin,
    password: user.password
  }));
});

const searchQuery = ref("");
const roleFilter = ref<string | "">("");
const itemsPerPage = ref(5);
const currentPage = ref(1);
const ModalAlert = ref(""); // 提示信息
const editingUser = ref<User | null>(null);
const tempUser = ref<User>({id: 0, username: "", email: "", role: 0, password: ""});
const editModalRef = ref<HTMLDivElement | null>(null);
let bsModal: Modal | null = null;

// 初始化模态框
onMounted(() => {
  if (editModalRef.value) {
    bsModal = new Modal(editModalRef.value, {backdrop: 'static'});
  }
});

// 过滤后的用户
const filteredUsers = computed(() =>
  users.value.filter(u => {
    const matchesSearch = u.username.includes(searchQuery.value) || u.email.includes(searchQuery.value);
    const matchesRole = roleFilter.value === "" ? true : u.role === Number(roleFilter.value);
    return matchesSearch && matchesRole;
  })
);

// 总页数
const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / itemsPerPage.value)));

// 分页后的用户
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredUsers.value.slice(start, start + itemsPerPage.value);
});

// 翻页
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

// 搜索/筛选/分页数量改变重置页码
watch([searchQuery, roleFilter, itemsPerPage], () => {
  currentPage.value = 1;
});

// 删除用户
function deleteUser(user: User) {

  if (confirm(`确定要删除用户 ${user.username} 吗？`)) {
    users.value = users.value.filter(u => u.email !== user.email);
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
  }
}

// 打开编辑/新增模态框
function openEditModal(user: User | null) {
  editingUser.value = user;
  tempUser.value = user ? {...user} : {id: 0, username: "", email: "", role: 0, password: ""};
  bsModal?.show();
}

// 显示提示信息
function showAlert(msg: string, duration = 3000, callback?: () => void) {
  ModalAlert.value = msg;
  setTimeout(() => {
    ModalAlert.value = "";
    if (callback) callback();
  }, duration);
}

// 保存用户
function saveUser() {
  if (editingUser.value) {
    const index = users.value.findIndex(u => u.email === editingUser.value?.email);
    if (index !== -1) {
      Serverd.updateUser({
        id: users.value[index].id,
        username: tempUser.value.username,
        email: tempUser.value.email,
        Admin: tempUser.value.role,
        password: tempUser.value.password || users.value[index].password
      }).then(() => {
        showAlert("用户修改成功！", 2000, () => {
          bsModal?.hide();
        });
        users.value[index] = {
          ...tempUser.value,
          password: tempUser.value.password || users.value[index].password
        };
      }).catch((error) => {
        console.error("修改用户失败:", error);
        alert("修改用户失败，请稍后再试。");
      });
      showAlert("用户修改成功！", 2000, () => {
        bsModal?.hide();
      });
    }
  } else {
    if (!tempUser.value.password) {
      alert("请设置密码");
      return;
    }
    users.value.push({...tempUser.value});
    Serverd.register({
      username: tempUser.value.username,
      email: tempUser.value.email,
      password: tempUser.value.password
    }).then(() => {
      showAlert("用户添加成功！", 1000, () => {
        bsModal?.hide();
      });
    }).catch((error) => {
      console.error("添加用户失败:", error);
      alert("添加用户失败，请稍后再试。");
    });
  }
}

</script>

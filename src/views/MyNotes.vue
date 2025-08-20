<template>
  <main class="notes-app">
    <div class="container-fluid p-2 app-container">
      <div class="row h-100">
        <!-- 左侧笔记列表 -->
        <aside
          class="col-md-2 col-lg-2 border-end p-2 d-none d-md-flex flex-column notes-sidebar"
          :class="{ 'd-flex': showSidebar }"
        >
          <div class="sidebar-header">
            <h5 class="mb-3">📚 我的笔记</h5>
            <button class="btn btn-sm btn-primary w-100 mb-3" @click="createNote">
              <i class="fas fa-plus"></i> 新建笔记
            </button>
          </div>

          <div class="notes-list-container">
            <ul v-if="hasNotes" class="list-group notes-list">
              <li
                v-for="note in notes"
                :key="note.id"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center note-item"
                :class="{ active: isNoteActive(note.id) }"
                @click="selectNote(note)"
              >
                <span class="text-truncate note-title">
                  {{ note.title || '未命名笔记' }}
                </span>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click.stop="confirmDeleteNote(note)"
                  :disabled="isDeleting"
                  aria-label="删除笔记"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </li>
            </ul>

            <div v-else class="empty-state">
              <p>暂无笔记，点击上方按钮创建新笔记</p>
            </div>
          </div>

          <!-- 移动端侧边栏切换按钮 -->
          <button
            v-if="showSidebar"
            class="btn btn-sm btn-secondary mt-auto d-md-none"
            @click="showSidebar = false"
          >
            <i class="fas fa-times"></i> 关闭
          </button>
        </aside>

        <!-- 移动端顶部栏 -->
        <div class="d-flex d-md-none mobile-header mb-2">
          <button class="btn btn-sm btn-outline-secondary me-2" @click="showSidebar = true">
            <i class="fas fa-bars"></i>
          </button>
          <select
            class="form-select me-2"
            v-model="currentNoteId"
            @change="onMobileSelect"
            :disabled="!hasNotes"
          >
            <option v-for="note in notes" :key="note.id" :value="note.id">
              {{ note.title || '未命名笔记' }}
            </option>
          </select>
          <button class="btn btn-sm btn-primary" @click="createNote">
            <i class="fas fa-plus"></i>
          </button>
        </div>

        <!-- 右侧编辑区 -->
        <section class="col-12 col-md-10 col-lg-10 d-flex flex-column editor-section">
          <div
            class="editor-header p-2 border-bottom d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2"
          >
            <input
              v-model="currentNote.title"
              class="form-control title-input"
              placeholder="请输入标题..."
              @keyup.enter="saveNotes"
            />
            <div class="d-flex gap-2 controls">
              <button class="btn btn-success" @click="saveNotes" :disabled="isSaving">
                <i class="fas fa-save"></i> 保存
              </button>
              <button class="btn btn-info d-md-none" @click="showSidebar = true">
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>

          <div class="editor-content flex-grow-1">
            <MdEditor
              v-model="currentNote.content"
              :preview="false"
              class="md-editor"
              :language="'zh-CN'"
              @onSave="saveNotes"
              github-style="none"
            />
          </div>

          <div v-if="lastSaved" class="last-saved-info px-2 py-1 text-muted small">
            最后保存: {{ lastSaved }}
          </div>
        </section>
      </div>
    </div>

    <!-- 删除确认模态框 -->
    <div v-if="noteToDelete" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">确认删除</h5>
          </div>
          <div class="modal-body">
            <p>确定要删除笔记"{{ noteToDelete.title || '未命名笔记' }}"吗？此操作无法撤销。</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="noteToDelete = null">
              取消
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteNote(noteToDelete.id)"
              :disabled="isDeleting"
            >
              {{ isDeleting ? '删除中...' : '确认删除' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="noteToDelete" class="modal-backdrop fade show"></div>
  </main>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

interface Note {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

// 响应式数据
const notes = ref<Note[]>([])
const currentNote = reactive<Note>(createEmptyNote())
const currentNoteId = ref<number | null>(null)
const lastSaved = ref<string>('')
const isSaving = ref<boolean>(false)
const isDeleting = ref<boolean>(false)
const noteToDelete = ref<Note | null>(null)
const showSidebar = ref<boolean>(false)

// 计算属性
const hasNotes = computed(() => notes.value.length > 0)

// 创建空笔记模板
function createEmptyNote(): Note {
  const timestamp = new Date().toISOString()
  return {
    id: 0,
    title: '',
    content: '',
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

// 初始化加载
onMounted(() => {
  loadNotes()
  // 添加键盘快捷键
  window.addEventListener('keydown', handleKeydown)
})

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// 键盘快捷键处理
function handleKeydown(e: KeyboardEvent) {
  // Ctrl+S 或 Cmd+S 保存
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    saveNotes()
  }

  // Ctrl+N 或 Cmd+N 新建笔记
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault()
    createNote()
  }
}

// 从本地存储加载笔记
function loadNotes() {
  try {
    const saved = localStorage.getItem('notes')
    if (saved) {
      notes.value = JSON.parse(saved)
      // 迁移旧数据（兼容性处理）
      if (notes.value.length > 0 && !notes.value[0].createdAt) {
        notes.value = notes.value.map((note) => ({
          ...note,
          createdAt: note.createdAt || new Date().toISOString(),
          updatedAt: note.updatedAt || new Date().toISOString(),
        }))
      }

      if (notes.value.length > 0) {
        selectNote(notes.value[0])
      }
    }
  } catch (error) {
    console.error('加载笔记失败:', error)
    notes.value = []
  }
}

// 自动保存到 localStorage（使用防抖）
let saveTimeout: number | null = null
watch(
  notes,
  (val) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    saveTimeout = setTimeout(() => {
      localStorage.setItem('notes', JSON.stringify(val))
      lastSaved.value = new Date().toLocaleString()
    }, 1000) as unknown as number
  },
  { deep: true },
)

// 检查笔记是否当前活动笔记
function isNoteActive(noteId: number): boolean {
  return currentNote && currentNote.id === noteId
}

// 新建笔记
function createNote(): void {
  const note: Note = {
    id: Date.now(),
    title: '新建笔记',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  notes.value.unshift(note)
  selectNote(note)
  currentNoteId.value = note.id
  showSidebar.value = false
}

// 选择笔记
function selectNote(note: Note): void {
  Object.assign(currentNote, note)
  currentNoteId.value = note.id
  showSidebar.value = false
}

// 手机选择笔记
function onMobileSelect(): void {
  const note = notes.value.find((n) => n.id === currentNoteId.value)
  if (note) {
    selectNote(note)
  }
}

// 确认删除笔记
function confirmDeleteNote(note: Note): void {
  noteToDelete.value = note
}

// 删除笔记
async function deleteNote(id: number): Promise<void> {
  if (isDeleting.value) return

  isDeleting.value = true
  try {
    // 模拟异步操作（实际应用中可能是API调用）
    await new Promise((resolve) => setTimeout(resolve, 500))

    notes.value = notes.value.filter((n) => n.id !== id)
    if (currentNote.id === id) {
      if (notes.value.length > 0) {
        selectNote(notes.value[0])
      } else {
        Object.assign(currentNote, createEmptyNote())
        currentNoteId.value = null
      }
    }
    noteToDelete.value = null
  } catch (error) {
    console.error('删除笔记失败:', error)
  } finally {
    isDeleting.value = false
  }
}

// 保存笔记内容
async function saveNotes(): Promise<void> {
  if (isSaving.value) return

  isSaving.value = true
  try {
    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 300))

    const index = notes.value.findIndex((n) => n.id === currentNote.id)
    if (index !== -1) {
      currentNote.updatedAt = new Date().toISOString()
      notes.value[index] = { ...currentNote }
    }

    // 显示保存反馈
    lastSaved.value = new Date().toLocaleString()
  } catch (error) {
    console.error('保存笔记失败:', error)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.notes-app {
  height: calc(100vh - 110px);
  width: 95vw;
  margin: 60px auto 50px auto;
}

.app-container {
  height: 100%;
}

.notes-sidebar {
  height: 100%;
  overflow-y: auto;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.sidebar-header {
  flex-shrink: 0;
}

.notes-list-container {
  flex-grow: 1;
  overflow-y: auto;
}

.notes-list {
  overflow-y: auto;
}

.note-item {
  transition: all 0.2s ease;
}

.note-item:hover {
  background-color: #e9ecef;
}

.note-title {
  max-width: 70%;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: #6c757d;
}

.mobile-header {
  background-color: white;
  padding: 0.5rem;
  border-bottom: 1px solid #dee2e6;
  position: sticky;
  top: 0;
  z-index: 100;
}

.editor-section {
  height: 100%;
  position: relative;
}

.editor-header {
  flex-shrink: 0;
  background-color: white;
  z-index: 10;
}

.title-input {
  flex-grow: 1;
}

.controls {
  flex-shrink: 0;
}

.editor-content {
  min-height: 0;
  position: relative;
}

.md-editor {
  height: 100%;
  border: none;
}

.last-saved-info {
  flex-shrink: 0;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

.modal-backdrop {
  opacity: 0.5;
}

@media (max-width: 767.98px) {
  .notes-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 80%;
    max-width: 300px;
    z-index: 1000;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }

  .editor-header {
    position: sticky;
    top: 0;
  }
}
</style>

<template>
  <main class="notes-app">
    <div class="container-fluid p-2 app-container">
      <div class="row h-100">
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

          <button
            v-if="showSidebar"
            class="btn btn-sm btn-secondary mt-auto d-md-none"
            @click="showSidebar = false"
          >
            <i class="fas fa-times"></i> 关闭
          </button>
        </aside>

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

        <section class="col-12 col-md-10 col-lg-10 d-flex flex-column editor-section">
          <div
            class="editor-header p-2 border-bottom d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2"
          >
            <input
              v-model="currentNote.title"
              class="form-control title-input"
              placeholder="请输入标题..."
              @keyup.enter="saveNotesHandler"
            />
            <div class="d-flex gap-2 controls">
              <button class="btn btn-success" @click="saveNotesHandler" :disabled="isSaving">
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
              @onSave="saveNotesHandler"
              github-style="none"
            />
          </div>

          <div v-if="lastSaved" class="last-saved-info px-2 py-1 text-muted small">
            最后保存: {{ lastSaved }}
          </div>
        </section>
      </div>
    </div>

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
              @click="deleteNoteHandler(noteToDelete.id)"
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
import {ref, reactive, onMounted, onUnmounted, computed} from "vue";
import {MdEditor} from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import {
  type Note,
  loadNotes,
  saveNotes as saveNotesService,
  deleteNote as deleteNoteService
} from "@/tools/storageService.ts";

const notes = ref<Note[]>([]);
const currentNote = reactive<Note>(createEmptyNote());
const currentNoteId = ref<string | null>(null);
const lastSaved = ref<string>("");
const isSaving = ref(false);
const isDeleting = ref(false);
const noteToDelete = ref<Note | null>(null);
const showSidebar = ref(false);

const hasNotes = computed(() => notes.value.length > 0);

function createEmptyNote(): Note {
  const timestamp = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: "",
    content: "",
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

onMounted(async () => {
  notes.value = await loadNotes();
  if (notes.value.length > 0) selectNote(notes.value[0]);
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    saveNotesHandler();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    createNote();
  }
}

function isNoteActive(noteId: string): boolean {
  return currentNote && currentNote.id === noteId;
}

function createNote(): void {
  const note: Note = createEmptyNote();
  note.title = "新建笔记";
  notes.value.unshift(note);
  selectNote(note);
  currentNoteId.value = note.id;
  showSidebar.value = false;
}

function selectNote(note: Note): void {
  Object.assign(currentNote, note);
  currentNoteId.value = note.id;
  showSidebar.value = false;
}

function onMobileSelect(): void {
  const note = notes.value.find(n => n.id === currentNoteId.value);
  if (note) selectNote(note);
}

function confirmDeleteNote(note: Note): void {
  noteToDelete.value = note;
}

async function deleteNoteHandler(id: string): Promise<void> {
  if (isDeleting.value) return;
  isDeleting.value = true;
  try {
    notes.value = await deleteNoteService(notes.value, id);
    if (currentNote.id === id) {
      if (notes.value.length > 0) selectNote(notes.value[0]);
      else Object.assign(currentNote, createEmptyNote());
      currentNoteId.value = notes.value.length > 0 ? notes.value[0].id : null;
    }
    noteToDelete.value = null;
  } catch (error) {
    console.error("删除笔记失败:", error);
  } finally {
    isDeleting.value = false;
  }
}

// ------------------ 批量保存笔记 ------------------
let saveTimeout: number | null = null;

function saveNotesHandler(): void {
  if (isSaving.value) return;
  isSaving.value = true;

  try {
    // 确保当前笔记更新到列表
    if (!currentNote.title.trim()) {
      currentNote.title = currentNote.content.split("\n")[0]?.slice(0, 20) || "未命名笔记";
    }
    currentNote.updatedAt = new Date().toISOString();
    const index = notes.value.findIndex(n => n.id === currentNote.id);
    if (index !== -1) notes.value[index] = {...currentNote};
    else notes.value.unshift({...currentNote});

    // 防抖批量保存
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = window.setTimeout(async () => {
      await saveNotesService(notes.value);
      lastSaved.value = new Date().toLocaleString();
      isSaving.value = false;
    }, 500);
  } catch (err) {
    console.error("批量保存失败:", err);
    isSaving.value = false;
  }
}
</script>

<style scoped>
/* 样式同前面组件一致，可复用 */
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

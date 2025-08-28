<template>
  <main>
    <div class="container mt-5">
      <div v-if="post" class="card shadow p-4">
        <h2 class="mb-3">{{ post.title }}</h2>
        <h6 class="text-muted mb-4">作者：{{ post.author }} | 时间：{{ post.date }}</h6>
        <p class="fs-5">{{ post.content }}</p>

        <div class="mt-4">
          <router-link to="/" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> 返回文章列表
          </router-link>
        </div>
      </div>

      <div v-else class="alert alert-warning text-center">未找到该文章！</div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {type Post} from "@/config/config.ts";


// 模拟文章数据库（实际可从后端获取）
const posts: Post[] = [
  {
    id: 1,
    title: 'Vue3 + TS 博客系统',
    author: '潇遥',
    date: '2025-08-20',
    content: '这是一个基于 Vue3 和 TypeScript 的博客系统详细页面示例。支持展示文章完整内容。',
  },
  {
    id: 2,
    title: '前端学习路线',
    author: '小明',
    date: '2025-08-18',
    content:
      '如果你想成为前端开发工程师，可以学习 HTML、CSS、JavaScript、Vue、React 等。掌握 TypeScript 和 Node.js 会让你更有优势。',
  },
  {
    id: 3,
    title: '前端学习路线',
    author: '小明',
    date: '2025-08-18',
    content:
      '如果你想成为前端开发工程师，可以学习 HTML、CSS、JavaScript、Vue、React 等。掌握 TypeScript 和 Node.js 会让你更有优势。',
  },
  {
    id: 4,
    title: '前端学习路线',
    author: '小明',
    date: '2025-08-18',
    content:
      '如果你想成为前端开发工程师，可以学习 HTML、CSS、JavaScript、Vue、React 等。掌握 TypeScript 和 Node.js 会让你更有优势。',
  },
]

const route = useRoute()
const post = ref<Post | null>(null)

onMounted(() => {
  const id = Number(route.params.id)
  post.value = posts.find((p) => p.id === id) || null
})
</script>

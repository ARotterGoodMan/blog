<template>
  <main>
    <div class="container">
      <div class="row">
        <section class="col-md-8">
          <article class="blog-item" v-for="item in [1, 2, 3, 4]" :key="item">
            <time>2025-8-10</time>
            <router-link :to="'/blog/' + item">
              <h1 class="blog-title">欢迎来到我的个人主页</h1>
              <p class="blog-content">
                这是一个使用 Vue 3 和 TypeScript 构建的个人主页模板。
                你可以在这里展示你的个人信息、技能、项目经验等内容。
                该模板采用响应式设计，适配各种设备和屏幕尺寸。
              </p>
            </router-link>
          </article>
        </section>
        <aside class="col-md-4 col-sm-8 col-xs-8">
          <div class="sidebar">
            <div class="search-widget">
              <div class="input-group margin-bottom-sm">
                <input class="form-control" type="text" placeholder="查询信息"/>
                <a href="#" class="input-group-addon" @click="search">
                  <i class="fa fa-search fa-fw" style="width: 50px; line-height: 50px"></i>
                </a>
              </div>
            </div>

            <a class="template-images">
              <h1>欢迎来到我的个人主页</h1>
              <p>如果你有任何问题或建议，请通过以下方式联系我：</p>
              <ul>
                <li>Email:295007463@qq.com</li>
                <li>QQ: 2195007463</li>
                <li>微信: sxy13370658284</li>
              </ul>
            </a>

            <div class="subscribe-widget">
              <h4 class="text-capitalize text-center">通过电子邮件联系我</h4>
              <div class="input-group margin-bottom-sm">
                <input class="form-control" type="text" placeholder="你的邮箱"/>
                <a href="#" class="input-group-addon" @click="mail_to_me">
                  <i class="fa fa-paper-plane fa-fw" style="width: 50px; line-height: 50px"></i>
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
const search = () => {
  const input = document.querySelector('.search-widget input') as HTMLInputElement
  const query = input.value.trim()
  input.value = ''
  if (query) {
    console.log('查找内容:', query)
  } else {
    console.log('请确认您要查找的内容。')
  }
}

const mail_to_me = () => {
  const input = document.querySelector('.subscribe-widget input') as HTMLInputElement
  const mail = input.value.trim()
  input.value = ''
  if (mail) {
    console.log('您的邮箱:', mail)
  } else {
    console.log('请确认您的邮箱。')
  }
}
</script>

<style>
section a {
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;
}
</style>

<template>
  <main>
    <div class="container">
      <div class="row">
        <section class="col-md-8"></section>
        <aside class="col-md-4 col-sm-8 col-xs-8">
          <div class="sidebar">
            <div class="search-widget">
              <div class="input-group margin-bottom-sm">
                <input class="form-control" type="text" placeholder="查询信息" />
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
                <input class="form-control" type="text" placeholder="你的邮箱" />
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
    // Implement search logic here
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
    // Implement search logic here
  } else {
    console.log('请确认您的邮箱。')
  }
}
</script>

<style></style>

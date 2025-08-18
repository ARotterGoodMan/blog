import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入 Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

// 引入 Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 引入 Bootstrap 图标
import 'bootstrap-icons/font/bootstrap-icons.css'

// 引入 fontawesome 图标
import '@fortawesome/fontawesome-free/css/all.min.css'

import '@/assets/style.css'

const app = createApp(App)

app.use(router)

app.mount('#app')

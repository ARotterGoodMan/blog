import App from './App.vue'
import router from './router'
import {createApp} from 'vue'
import {createPinia} from "pinia";
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@/assets/style.css'

const pinia = createPinia();

const app = createApp(App)

app.use(pinia)

app.use(router)


app.mount('#app')


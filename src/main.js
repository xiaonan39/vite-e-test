import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'element-plus/dist/index.css'
import '@/assets/style/basic.scss'

// createApp(App).use(router).use(ElementPlus, { locale, size: 'default' }).mount('#app')
import {createPinia} from 'pinia'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, { locale, size: 'default' })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(createPinia())
app.mount('#app')
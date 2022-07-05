import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

import App from './App.vue'
// import { directs } from '@/utils/vue/directs'

// import { createVueInit } from '@/utils/vue/index'
import { createPreloadCdn } from '@/plugins/preloadCdn.class'
import { useVant } from './plugins/useVant'

createPreloadCdn()

const app = createApp(App)
app.use(createPinia())
useVant(app)
// createVueInit(app).useDirects(directs).useComps()
app.use(router).mount('#app')

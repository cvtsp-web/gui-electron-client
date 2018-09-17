import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import '@/utils/menus'
import '@/utils/global-elementui'
import Drag from '@/utils/directive/drag'
import './install'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.use(Drag)

/** plugins install */


/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  render: h => h(App)
}).$mount('#app')

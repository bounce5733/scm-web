import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './icons' // icon
import '@/styles/index.scss' // global css
import store from '@/store'
import App from './App'
import router from './router'
import './icons' // icon
import './permission'

Vue.config.productionTip = false

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})

// ------加载码表------
store.dispatch('addCodes')
store.dispatch('addPathMap')

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

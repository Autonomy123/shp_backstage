import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import hintButton from '@/components/hintButton'
Vue.component(hintButton.name,hintButton)

import '@/icons' // icon
import '@/permission' // permission control

import CategorySelect from '@/components/CategorySelect'
Vue.component(CategorySelect.name,CategorySelect)

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI)

Vue.config.productionTip = false
//引入相关Api接口
import API from '@/api';
//组件实例的原型的原型指向的是Vue.prototype
//任意组件可以使用API相关的接口
Vue.prototype.$API = API;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

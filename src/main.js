import App from './App'

// 注册全局过滤器
import filter from './common/filter/filter'
Vue.prototype.$filter = filter

// 引入mixin
import mixin from './common/mixin/mixin'
Vue.mixin(mixin)

// 引入vuex
import store from './store'
Vue.prototype.$store = store

// uView ui组件 uviewui.com
import uView from 'uview-ui'
Vue.use(uView)

//
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
Vue.mixin(MescrollMixin)

import { commonConfig } from './networking/config.js'
commonConfig.loginCallback = () => {
  uni.removeStorageSync('accessToken')
  uni.removeStorageSync('userId')
  uni.removeStorageSync('avatarUrl')
}

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

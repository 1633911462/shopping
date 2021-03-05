import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import myMixin from './mixin.js'
import vRegion from 'v-region'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueSocketIO from 'vue-socket.io'
Vue.use(ElementUI)
Vue.use(vRegion)
Vue.mixin(myMixin)
Vue.use(new VueSocketIO({
  debug: false,
  connection: 'http://120.25.215.239:7001'
}))

Vue.config.productionTip = false
Vue.prototype.axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

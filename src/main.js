import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './routes'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
  router
}).$mount('#app')

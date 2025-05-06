import Vue from 'vue'
import App from './App.vue'
import {router} from './router'
import store from './store'
// 引入基础样式
import '@/assets/styles/base.scss'
// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/iconfont/iconfont.css'
import VueParticles from 'vue-particles'
import 'font-awesome/css/font-awesome.min.css'



Vue.config.productionTip = false

Vue.use(VueParticles)
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

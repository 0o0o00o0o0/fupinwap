// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vant from 'vant'
import Mint from '_mint-ui@2.2.13@mint-ui';
// import { Swipe, SwipeItem } from '_mint-ui@2.2.13@mint-ui';
import 'vant/lib/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'mint-ui/lib/style.css'
import App from './App'
import router from './router'

import { Lazyload } from 'vant';

import global from './assets/js/globalConfig'
import apiKey from './assets/js/apiKey'
import axios from './assets/js/request'
import { Swipe, SwipeItem } from 'vant';

Vue.use(Swipe).use(SwipeItem);
Vue.config.productionTip = false
Vue.prototype.GLOBAL = global;
Vue.prototype.API_KEY = apiKey;
Vue.prototype.$axios = axios;

Vue.use(Vant);
// options 为可选参数，无则不传
Vue.use(Lazyload);
/* eslint-disable no-new */
Vue.use(Mint);
// Vue.component(Swipe.name, Swipe);
// Vue.component(SwipeItem.name, SwipeItem);
// router.beforeEach((to, from, next) => {
//   if (to.fullPath == '/navContainer/fupin' || to.fullPath == '/active') {
//     document.title = "长沙农商银行扶贫商城"
//   } else {
//     document.title = '';//"城惠添福商城"
//   }
//   next()
// })
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

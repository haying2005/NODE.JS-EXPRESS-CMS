import Vue from 'vue'
import vueRouter from 'vue-router'
import vueResource from 'vue-resource'
import { routes } from './routes'
import element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.use(vueResource);
Vue.use(vueRouter);
Vue.use(element);

import App from './App.vue'

import eventBus from './eventBus.js'
Vue.prototype.$bus = eventBus;


import Editor from './components/Util/Eidtor.vue'
Vue.component(Editor.name, Editor)

//Vue.config.productionTip = false


const router = new vueRouter({ routes });
// router.beforeEach((to, from) => {

// });
router.afterEach((to, from) => {
  console.log('to route: ' + to.fullPath);
  console.log(router);
});

let host = '';
if (process.env.NODE_ENV == 'production') {
  host = '';
  console.log('生产环境');
}
else {
  host = 'http://localhost:3000';
  console.log('开发环境.');
}
Vue.http.interceptors.push((request, next) => {
  request.credentials = true; //cookie
  request.url = host + request.url;
  console.log(request.method, request.url, request.body, request.params);
  next(res => {
    console.log('response for url: ', res.url);
    let code = res.body.code;
    if (code == -1) {
      //需要登录
      eventBus.$emit('logout');
    }
  });
});

Vue.http.ins


new Vue({
  el: '#app',
  render: h => h(App),
  router: router,
  http: {
    //root: 'http://localhost:3000',
    headers: {
      //Authorization: 'Basic YXBpOnBhc3N3b3Jk'
    }
  }
})

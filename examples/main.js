import Vue from 'vue'
import VueRouter from 'vue-router'
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.less'
import 'geelato-ui-ant/lib/geelato-ui-ant.css'

import ApiSettings from './ApiSettings'
// import apiHelper from "./apiHelper";
import geelatoAui from "geelato-ui-ant";
import geelatoIde from './../packages/index'
import './../packages/ide.css'

import Ide from './components/Ide'
import Preview from './components/Preview'
import GlPage from '../runtime/gl-page/index.js'


Vue.config.productionTip = false

let auiOptions = {
  // 修改服务地址，默认为http://localhost:8080/api
  api: new ApiSettings({
    baseURL: 'http://localhost:8080/api',
  })
}

Vue.use(VueRouter)
Vue.use(Antd)
Vue.use(geelatoAui, auiOptions)
Vue.use(geelatoIde)
Vue.use(GlPage)


// 2. 定义路由
const routes = [
  {path: '/', redirect: '/ide'},
  {path: '/ide', component: Ide},
  {path: '/preview/:pageId', component: Preview}
]

// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

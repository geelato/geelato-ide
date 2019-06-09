import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.less'
import 'geelato-ui-ant/lib/geelato-ui-ant.css'

import apiHelper from "./apiHelper";
import geelatoAui from "geelato-ui-ant";
import geelatoIde from './../packages/index'
import './../packages/ide.css'

Vue.config.productionTip = false


// 可以自行实现api，再调用geelatoAui.setApi(api)
// 这里采用geelatoAui默认的api的方式。只进行请求拦截，不重置原有的api。
// 以下service是Axios实例
const service = geelatoAui.api.getService()
apiHelper.interceptors(service)
Vue.prototype.$gl ? Vue.prototype.$gl.api = geelatoAui.api : Vue.prototype.$gl = {api: geelatoAui.api}

// 修改服务地址，默认为http://localhost:8080/api
let apiOptions = {api: {baseURL: 'http://localhost:8080/api'}}
// let apiOptions = {api: {baseURL: 'http://api.geelato.org:8080/api'}}
Vue.use(geelatoAui, apiOptions)


Vue.use(geelatoIde)
Vue.use(Antd)

new Vue({
  render: h => h(App),
}).$mount('#app')

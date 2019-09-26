import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.less'
import 'geelato-ui-ant/lib/geelato-ui-ant.css'

import ApiSettings from './ApiSettings'
import apiHelper from "./apiHelper";
import geelatoAui from "geelato-ui-ant";
import geelatoIde from './../packages/index'
import './../packages/ide.css'

Vue.config.productionTip = false

let auiOptions = {
  // 修改服务地址，默认为http://localhost:8080/api
  api: new ApiSettings({
    baseURL: 'http://localhost:8080/api',
  })
}

Vue.use(Antd)
Vue.use(geelatoAui, auiOptions)
Vue.use(geelatoIde)

new Vue({
  render: h => h(App),
}).$mount('#app')

import {extend} from 'vee-validate'
import {localize} from 'vee-validate';
import zhCN from 'vee-validate/dist/locale/zh_CN.json';
import * as rules from 'vee-validate/dist/rules'
// 导入组件，组件必须声明 name
import GlPage from './components/gl-page/index.js'

const component = {
  name: 'GlRuntime'
}

// 为组件提供 install 安装方法，供按需引入
component.install = function (Vue) {
  console.log('install >', component.name)
  Vue.prototype.$globalVue = Vue
  Vue.use(GlPage)

  // Install and Activate the zh_CN locale.
  localize('zh_CN', zhCN);
  Object.keys(rules).forEach(rule => {
    console.log('install rule >', rule)
    extend(rule, rules[rule])
  })
}

// 默认导出组件
export default component

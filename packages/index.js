import GlIde from './gl-ide/index'
import GlIdePluginBase from './gl-ide-plugin-base/index'
import GlIdePluginFileCombination from './gl-ide-plugin-file-combination/index'
import GlIdePluginProject from './gl-ide-plugin-project/index'
import GlIdePluginCards from './gl-ide-plugin-cards/index'
// import GlIdePluginStructure from './gl-ide-plugin-structure/index'
import ide from './gl-ide/src/ide'
import Api from './Api'


import './ide.css'

// 存储组件列表
const components = [
  GlIde
]


let uiApi = new Api()
// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue, options) {
  // 判断是否安装
  if (install.installed) return

  // ide加载插件
  ide.setVue(Vue)
  ide.use(GlIdePluginBase.config)
  ide.use(GlIdePluginFileCombination.config)
  ide.use(GlIdePluginProject.config)
  // ide.use(GlIdePluginStructure.config)
  ide.use(GlIdePluginCards.config)
  // console.log(' aui options > ', options)
  Vue.prototype.$api = Vue.prototype.$api || (options && options.api ? new Api(options.api) : uiApi)
  Vue.prototype.$bus = Vue.prototype.$bus || new Vue()
  Vue.prototype.$ide = Vue.prototype.$ide || ide

  // 遍历注册全局组件
  components.map(component => {
    Vue.component(component.name, component)
  })

}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

function setApi(api) {
  uiApi = api || new Api()
}

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 服务端访问api
  setApi,
  api: uiApi
}

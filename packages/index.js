// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.less'
// import 'geelato-ui-ant/lib/geelato-ui-ant.css'

import draggable from 'vuedraggable'
import GlIde from './gl-ide/index'
import GlIdePluginLayout from './gl-ide-plugin-layout/index'
import GlIdePluginFormDesigner from './gl-ide-plugin-form-designer/index'
import GlIdePluginTableDesigner from './gl-ide-plugin-table-designer/index'
import GlIdePluginProject from './gl-ide-plugin-project/index'
import GlIdePluginCards from './gl-ide-plugin-cards/index'
import GlIdePluginFields from './gl-ide-plugin-fields/index'

// import GlIdePluginStructure from './gl-ide-plugin-structure/index'
import ide from './gl-ide/src/ide'
import Api from './Api'
// import geelatoAui from "geelato-ui-ant";

// 导入依赖表单验证
import VeeValidate from 'vee-validate'
//引入中文包，提示信息可以以中文形式显示
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import VueI18n from 'vue-i18n'

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
  // ide.use(GlIdePluginFileCombination.config)
  ide.use(GlIdePluginProject)
  ide.use(GlIdePluginLayout)
  ide.use(GlIdePluginFormDesigner)
  ide.use(GlIdePluginTableDesigner)
  // ide.use(GlIdePluginStructure.config)
  ide.use(GlIdePluginCards)
  ide.use(GlIdePluginFields)

  Vue.prototype.$ide = Vue.prototype.$ide || ide
  Vue.prototype.$globalVue = Vue
  console.log('geelato-ide > ide: ', ide)

  // 遍历注册全局组件
  components.map(component => {
    Vue.component(component.name, component)
  })
  Vue.component('gl-draggable', draggable)

  // 注册组件库
  Vue.use(VueI18n)
  Vue.use(VeeValidate, {
    i18n: new VueI18n({
      locale: 'zh_CN',
    }),
    i18nRootKey: 'validations',
    dictionary: {
      zh_CN
    },
    // fixed：The computed property "fields" is already defined in data.
    errorBagName: 'errorBags',
    fieldsBagName: 'fieldBags'
  })

  Vue.use(GlIde)


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

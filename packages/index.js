// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.less'
// import 'geelato-ui-ant/lib/geelato-ui-ant.css'

import draggable from 'vuedraggable'
import GlIde from './gl-ide/index'
import GlIdePluginLayout from './gl-ide-plugin-layout/index'
import GlIdePluginHeaderDesigner from './gl-ide-plugin-header-designer/index'
import GlIdePluginFormDesigner from './gl-ide-plugin-form-designer/index'
import GlIdePluginTableDesigner from './gl-ide-plugin-table-designer/index'
import GlIdePluginSegmentDesigner from './gl-ide-plugin-segment-designer/index'
import GlIdePluginTreeDesigner from './gl-ide-plugin-tree-designer/index'
import GlIdePluginPageLoaderDesigner from './gl-ide-plugin-page-loader-designer/index'
import GlIdePluginProject from './gl-ide-plugin-project/index'
import GlIdePluginCards from './gl-ide-plugin-cards/index'
// import GlIdePluginFields from './gl-ide-plugin-fields/index'
import GlIdePluginDataMeta from './gl-ide-plugin-data-meta/index'
import GlPage from '../runtime/components/gl-page/index'
import GlTag from '../runtime/components/gl-tag/index'
import GlTemplate from '../runtime/components/gl-template/index'
import GlSegment from '../runtime/components/gl-segment/index'
import GlText from '../runtime/components/gl-text/index'
// 公共组件
import GlDataSource from './components/gl-data-source/index'
import GlSettingStyle from './components/gl-setting-style/Index'
import GlSettingControl from './components/gl-setting-control/index'

// import GlIdePluginStructure from './gl-ide-plugin-structure/index'
import ide from './gl-ide/src/ide'
// import Api from './Api'
// import geelatoAui from "geelato-ui-ant";

// 导入依赖表单验证
// import VeeValidate from 'vee-validate'
//引入中文包，提示信息可以以中文形式显示
// import zhCN from 'vee-validate/dist/locale/zh_CN'
// import VueI18n from 'vue-i18n'
// color
import Verte from 'verte';
import 'verte/dist/verte.css';

import './ide.css'

// 存储组件列表
const components = [
  Verte,
  GlIde,
  GlPage,
  GlTag,
  GlTemplate,
  GlSegment,
  GlText,
  GlDataSource,
  GlSettingStyle,
  GlSettingControl
]

// let uiApi = new Api()
// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue, options) {
  // 判断是否安装
  if (install.installed) return

  // ide加载插件
  ide.setVue(Vue)
  // ide.use(GlIdePluginFileCombination.config)
  ide.use(GlIdePluginProject)
  ide.use(GlIdePluginLayout)
  ide.use(GlIdePluginHeaderDesigner)
  ide.use(GlIdePluginFormDesigner)
  ide.use(GlIdePluginTableDesigner)
  ide.use(GlIdePluginSegmentDesigner)
  ide.use(GlIdePluginTreeDesigner)
  ide.use(GlIdePluginPageLoaderDesigner)
  ide.use(GlIdePluginCards)
  // ide.use(GlIdePluginFields)
  ide.use(GlIdePluginDataMeta)

  Vue.prototype.$ide = Vue.prototype.$ide || ide
  console.log('geelato-ide > ide: ', ide)

  // 遍历注册全局组件
  components.map(component => {
    Vue.component(component.name, component)
  })
  Vue.component('gl-draggable', draggable)
  Vue.component('gl-color-picker', Verte)

  // 注册组件库
  // Vue.use(VueI18n)
  // Vue.use(VeeValidate, {
  //   i18n: new VueI18n({
  //     locale: 'zh_CN',
  //   }),
  //   i18nRootKey: 'validations',
  //   dictionary: {
  //     zhCN
  //   },
  //   // fixed：The computed property "fields" is already defined in data.
  //   errorBagName: 'errorBags',
  //   fieldsBagName: 'fieldBags'
  // })
  Vue.use(GlIde)
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// function setApi(api) {
//   uiApi = api || new Api()
// }

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 服务端访问api
  // setApi
  // api: uiApi
}

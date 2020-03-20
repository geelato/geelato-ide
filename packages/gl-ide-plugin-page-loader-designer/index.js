// 导入组件，组件必须声明 name
import GLIdePluginPageLoaderDesigner from './src/Index'
import events from './src/events'

const plugin = {
  name: 'GLIdePluginPageLoaderDesigner',
  description: '页面引用设计器',
}
// 默认导出组件
export default {
  name: plugin.name,
  install: function (Vue) {
    Vue.component(GLIdePluginPageLoaderDesigner.name, GLIdePluginPageLoaderDesigner)
  },
  config: plugin,
  events: events
}

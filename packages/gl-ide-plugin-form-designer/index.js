// 导入组件，组件必须声明 name
import GLIdePluginFormDesigner from './src/Index'
import events from './src/events'

const plugin = {
  name: 'GlIdePluginFormDesigner',
  description: '表单设计器',
}
// 默认导出组件
export default {
  name: plugin.name,
  install: function (Vue) {
    Vue.component(GLIdePluginFormDesigner.name, GLIdePluginFormDesigner)
  },
  config: plugin,
  events: events
}

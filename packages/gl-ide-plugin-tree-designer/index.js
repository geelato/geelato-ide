// 导入组件，组件必须声明 name
import GlIdePluginTreeDesigner from './src/Index'
import events from './src/events'

const plugin = {
  name: 'GlIdePluginTreeDesigner',
  description: '列表设计器',
}
// 默认导出组件
export default {
  name: plugin.name,
  install: function (Vue) {
    Vue.component(GlIdePluginTreeDesigner.name, GlIdePluginTreeDesigner)
  },
  config: plugin,
  events: events
}

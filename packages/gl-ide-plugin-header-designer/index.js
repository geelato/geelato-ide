// 导入组件，组件必须声明 name
import GlIdePluginHeaderDesigner from './src/Index'
import events from './src/events'

const plugin = {
  name: 'GlIdePluginHeaderDesigner',
  description: '标题设计器',
}
// 默认导出组件
export default {
  name: plugin.name,
  install: function (Vue) {
    Vue.component(GlIdePluginHeaderDesigner.name, GlIdePluginHeaderDesigner)
  },
  config: plugin,
  events: events
}

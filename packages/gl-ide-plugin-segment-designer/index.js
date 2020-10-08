// 导入组件，组件必须声明 name
import GLIdePluginSegmentDesigner from './src/Index'
import events from './src/events'

const plugin = {
  name: 'GLIdePluginSegmentDesigner',
  description: 'UI片段设计器',
}
// 默认导出组件
export default {
  name: plugin.name,
  install: function (Vue) {
    Vue.component(GLIdePluginSegmentDesigner.name, GLIdePluginSegmentDesigner)
  },
  config: plugin,
  events: events
}

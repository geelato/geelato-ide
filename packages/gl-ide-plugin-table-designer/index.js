// 导入组件，组件必须声明 name
import GLIdePluginTableDesigner from './src/Index'
import events from './src/events'

const plugin = {
  name: 'GLIdePluginTableDesigner',
  description: '列表设计器',
}
// 默认导出组件
export default {
  name: plugin.name,
  install: function (Vue) {
    Vue.component(GLIdePluginTableDesigner.name, GLIdePluginTableDesigner)
  },
  config: plugin,
  events: events
}

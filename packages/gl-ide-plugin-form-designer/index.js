// 导入组件，组件必须声明 name
import GLIdePluginFormDesigner from './src/Index'
import events from './src/events'

const plugin = {
  name: 'gl-ide-plugin-form-designer',
  description: '表单设计器',
}
// 默认导出组件
export default {
  name: plugin.name,
  install: function (Vue) {
    console.log('>>>', GLIdePluginFormDesigner.name, GLIdePluginFormDesigner)
    Vue.component(GLIdePluginFormDesigner.name, GLIdePluginFormDesigner)
  },
  config: plugin,
  events: events
}

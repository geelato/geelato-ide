// 导入组件，组件必须声明 name
import GLIdePluginFormDesigner from './src/Index'
import events from './src/events'
import IfBlock from './src/settings/logic-and-rule/block/IfBlock'
import ForBlock from './src/settings/logic-and-rule/block/ForBlock'
import ConditionBlock from './src/settings/logic-and-rule/block/ConditionBlock'
import SetValueBlock from './src/settings/logic-and-rule/block/SetValueBlock'


const plugin = {
  name: 'GlIdePluginFormDesigner',
  description: '表单设计器',
}
// 默认导出组件
export default {
  name: plugin.name,
  install: function (Vue) {
    Vue.component(GLIdePluginFormDesigner.name, GLIdePluginFormDesigner)
    Vue.component(IfBlock.name, IfBlock)
    Vue.component(ForBlock.name, ForBlock)
    Vue.component(ConditionBlock.name, ConditionBlock)
    Vue.component(SetValueBlock.name, SetValueBlock)
  },
  config: plugin,
  events: events
}

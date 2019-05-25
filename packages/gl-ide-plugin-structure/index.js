// 导入组件，组件必须声明 name
import Structure from './src/Structure'
import events from './src/events'

const plugin = {
  name: 'gl-ide-plugin-structure',
  sidebar: {
    title: '文件结构',
    component: Structure
  }
}
// 默认导出组件
export default {
  name: plugin.name,
  config: plugin,
  events: events
}

// 导入组件，组件必须声明 name
import Cards from './src/Cards'
import events from './src/events'

const plugin = {
  name: 'gl-ide-plugin-cards',
  description: '组件库，以卡片的方式展示在sidebar中',
  sidebar: {
    title: '组件',
    component: Cards
  }
}
// 默认导出组件
export default {
  name: plugin.name,
  config: plugin,
  events: events
}

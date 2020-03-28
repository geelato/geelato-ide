// 导入组件，组件必须声明 name
import Sidebar from './src/Sidebar'
import events from './src/events'

const plugin = {
  name: 'gl-ide-plugin-project',
  sidebar: {
    title: '应用结构',
    icon:'apartment',
    component: Sidebar
  }
}
// 默认导出组件
export default {
  name: plugin.name,
  // 为组件提供 install 安装方法，供按需引入
  //   // install: function (Vue) {
  //   //   Vue.component(Sidebar.name, Sidebar)
  //   //   let ide = Vue.component('gl-ide')
  //   //   if (!ide) {
  //   //     console.error('由于gl-ide未加载，无法注册插件' + plugin.name + '到gl-ide中。')
  //   //   } else {
  //   //     ide.use(plugin)
  //   //   }
  //   // },
  config: plugin,
  events: events
}

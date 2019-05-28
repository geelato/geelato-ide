// 导入组件，组件必须声明 name
import Sidebar from './src/Sidebar'
import Stage from './src/Stage/Index'
import events from './src/events'
// import formData from "../gl-ide-plugin-file-combination/src/formData";

const plugin = {
  name: 'gl-ide-plugin-layout',
  description: '页面布局插件',
  file: {
    title: '页面布局',
    type: 'gl-page-layout',
    icon: 'th list icon',
    description: '可组合的高级页面',
    toolbar: [],
    stagePanels: [{
      title: '设计',
      component: 'gl-ide-layout-stage',
      opts: {cardMap: {}},
      query: {}
    },
      // {
      //   name: 'code',
      //   title: '配置',
      //   content: {
      //     opts: {codes: JSON.stringify(formData)}
      //   }
      // }
      //   {
      //   name: 'ui',
      //   title: '预览',
      //   content: {
      //     component: 'gl-form',
      //     opts: formData
      //   }
      // }
    ],
    settingPanels: [
      {
        title: '基本信息',
        component: 'gl-ide-base-setting-file-info'
      },
    ]
  },
  sidebar: {
    title: '布局',
    component: Sidebar
  }
}
// 默认导出组件
export default {
  name: plugin.name,
  install: function (Vue) {
    Vue.component(Stage.name, Stage)
  },
  config: plugin,
  events: events
}

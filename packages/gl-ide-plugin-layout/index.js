// 导入组件，组件必须声明 name
import Sidebar from './src/Sidebar'
import Stage from './src/Stage/Index'
import events from './src/events'
// import formData from "../gl-ide-plugin-file-combination/src/formData";

const plugin = {
  name: 'gl-ide-plugin-layout',
  description: '页面布局插件',
  file: {
    title: '页面',
    type: 'GlPageLayout',
    icon: 'iconfont icon-file',
    description: '可组合的高级页面',
    toolbar: [],
    stagePanels: [{
      title: '设计',
      type: 'ui',
      component: 'GlIdePluginLayoutStage',
      opts: {
        cardMap: {},
        layout: {
          gutter: 4,
          rows: [
          //   {
          //   title: '一行一列',
          //   cols: [
          //     {span: 24, offset: 0, items: []}
          //   ]
          // }, {
          //   title: '一行两列',
          //   cols: [
          //     {span: 7, offset: 0, items: []}, {span: 17, offset: 0, items: []}
          //   ]
          // }
          ]
        }
      },
      query: {}
    }
    ],
    settingPanels: [
      {
        title: '页面信息',
        component: 'GlIdeSettingFileInfo',
        opts: {},
        query: {}
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

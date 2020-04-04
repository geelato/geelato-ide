// 导入组件，组件必须声明 name
import Sidebar from './src/Sidebar'
// import StageUI from './src/stage/UI'
// import StageSrc from './src/stage/Src'
import events from './src/events'
// import GlIdeSettingObjectTree from './src/settings/GlIdeSettingObjectTree'
// import formData from "../gl-ide-plugin-file-combination/src/formData";

const plugin = {
  name: 'gl-ide-plugin-data-meta',
  description: '数据模型插件',
  file: {
    title: '数据模型',
    type: 'GlDataMeta',
    icon: 'iconfont icon-file',
    description: '实体元数据管理、数据库同步管理',
    toolbar: [],
    stagePanels: [{
      title: '设计',
      type: 'ui',
      component: 'GlIdePluginLayoutStageUI',
      opts: {
        componentRefs: {},
        layout: {
          gutter: 4,
          rows: []
        }
      },
      params: {}
    }
    ],
    settingPanels: [
      {
        title: '页面信息',
        component: 'GlIdeSettingFileInfo',
        opts: {},
        params: {}
      }
    ]
  },
  sidebar: {
    title: '数据模型',
    icon: 'table',
    component: Sidebar
  }
}
// 默认导出组件
export default {
  name: plugin.name,
  install: function (Vue) {
    // Vue.component(StageUI.name, StageUI)
    // Vue.component(StageSrc.name, StageSrc)
  },
  config: plugin,
  events: events
}

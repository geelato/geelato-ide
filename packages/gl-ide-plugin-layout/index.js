// 导入组件，组件必须声明 name
import Sidebar from './src/Sidebar'
import StageUI from './src/stage/UI'
import StageSrc from './src/stage/Src'
import events from './src/events'
import GlIdeSettingObjectTree from './src/settings/GlIdeSettingObjectTree'
import GlIdePluginLayoutCardSettings from './src/settings/CardSettings'
// import formData from "../gl-ide-plugin-file-combination/src/formData";

const plugin = {
  name: 'gl-ide-plugin-layout',
  description: '页面布局插件',
  file: {
    title: '页面',
    type: 'GlPageLayout',
    icon: 'iconfont icon-file-primary',
    description: '可组合的高级页面',
    toolbar: [],
    stagePanels: [{
      title: '设计',
      type: 'ui',
      component: 'GlIdePluginLayoutStageUI',
      opts: {
        componentRefs: {},
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
    }, {
      title: '源码',
      type: 'src',
      component: 'GlIdePluginLayoutStageSrc',
      opts: {
        componentRefs: {},
        layout: {
          gutter: 4,
          rows: []
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
      {
        title: '对象树',
        component: 'GlIdeSettingObjectTree',
        opts: {},
        query: {}
      },
      {
        title: '卡片',
        component: 'GlIdePluginLayoutCardSettings',
        opts: {},
        query: {}
      }
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
    Vue.component(StageUI.name, StageUI)
    Vue.component(StageSrc.name, StageSrc)
    Vue.component(GlIdeSettingObjectTree.name, GlIdeSettingObjectTree)
    Vue.component(GlIdePluginLayoutCardSettings.name, GlIdePluginLayoutCardSettings)
  },
  config: plugin,
  events: events
}

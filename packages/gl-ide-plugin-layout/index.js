// 导入组件，组件必须声明 name
import Sidebar from './src/Sidebar'
import StageUI from './src/stage/UI'
import StageSrc from './src/stage/Src'
import events from './src/events'
import GlStringValueSettingTip from './src/settings/event-handler-setings/common/StringValueSettingTip'
import GlIdeSettingObjectTree from './src/settings/GlIdeSettingObjectTree'
import GlIdePluginLayoutCardSettings from './src/settings/CardSettings'
import GlIdePluginLayoutControlSettings from './src/settings/ControlSettings'
import GlIdePluginLayoutSegmentSettings from './src/settings/SegmentSettings'

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
      params: {}
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
      params: {}
    }
    ],
    settingPanels: [
      // {
      //   title: '页面',
      //   component: 'GlIdeSettingFileInfo',
      //   opts: {},
      //   params: {}
      // },
      {
        title: '动作',
        component: 'GlIdeSettingObjectTree',
        opts: {},
        params: {}
      },
      {
        title: '单元格',
        component: 'GlIdePluginLayoutCardSettings',
        opts: {},
        params: {}
      },
      {
        title: '容器',
        component: 'GlIdePluginLayoutSegmentSettings',
        opts: {},
        params: {}
      },
      {
        title: '组件',
        component: 'GlIdePluginLayoutControlSettings',
        opts: {},
        params: {}
      }
    ]
  },
  sidebar: {
    title: '布局',
    icon: 'layout',
    component: Sidebar
  }
}
// 默认导出组件
export default {
  name: plugin.name,
  install: function (Vue) {
    Vue.component(StageUI.name, StageUI)
    Vue.component(StageSrc.name, StageSrc)
    Vue.component(GlStringValueSettingTip.name, GlStringValueSettingTip)
    Vue.component(GlIdeSettingObjectTree.name, GlIdeSettingObjectTree)
    Vue.component(GlIdePluginLayoutCardSettings.name, GlIdePluginLayoutCardSettings)
    Vue.component(GlIdePluginLayoutControlSettings.name, GlIdePluginLayoutControlSettings)
    Vue.component(GlIdePluginLayoutSegmentSettings.name, GlIdePluginLayoutSegmentSettings)
  },
  config: plugin,
  events: events
}

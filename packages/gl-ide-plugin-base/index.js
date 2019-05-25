// 导入组件，组件必须声明 name
import StageBlank from './src/StageBlank'
import StageUI from './src/StageUI'
import SettingFileInfo from './src/SettingFileInfo'
import StageCode from './src/StageCode'

const plugin = {
  name: 'gl-ide-plugin-base',
  description: 'ide的基础插件，集成了基础的展示面版，如UI展示、代码展示。',
  panels: [{
    name: 'blank', component: StageBlank
  }, {
    name: 'ui', component: StageUI
  }, {
    name: 'code', component: StageCode
  }, {
    name: 'fileInfo', component: SettingFileInfo
  }]
}
// 默认导出组件
export default {
  name: plugin.name,
  config: plugin
}

// 导入组件，组件必须声明 name
import component from './src/Index'
import LayoutDesigner from './src/layout/LayoutDesigner'
import StageUI from './src/panels/StageUI'
import StageCode from './src/panels/StageCode'
import StageBlank from './src/panels/StageBlank'
import SettingFileInfo from './src/panels/SettingFileInfo'

// 为组件提供 install 安装方法，供按需引入
component.install = function (Vue) {
  Vue.component(component.name, component)
  Vue.component(LayoutDesigner.name, LayoutDesigner)
  Vue.component(StageUI.name, StageUI)
  Vue.component(StageCode.name, StageCode)
  Vue.component(StageBlank.name, StageBlank)
  Vue.component(SettingFileInfo.name, SettingFileInfo)
}

// 默认导出组件
export default component

// 导入组件，组件必须声明 name
import component from './src/Index'
import LayoutDesigner from './src/layout/LayoutDesigner'
// 为组件提供 install 安装方法，供按需引入
component.install = function (Vue) {
  Vue.component(component.name, component)
  Vue.component(LayoutDesigner.name, LayoutDesigner)
}

// 默认导出组件
export default component

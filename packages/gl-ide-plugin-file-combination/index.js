import formData from './src/formData'

const plugin = {
  name: 'gl-ide-plugin-file-combination',
  file: {
    title: '组合页面',
    type: 'gl-page-combination',
    icon: 'th list icon',
    description: '可组合的高级页面',
    toolbar: [],
    stagePanels: [{
      name: 'ui',
      title: '设计',
      content: {
        component: 'gl-ide-layout-designer',
        opts: formData
      }
    },
      {
        name: 'code',
        title: '配置',
        content: {
          opts: {codes: JSON.stringify(formData)}
        }
      }
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
        name: 'fileInfo',
        title: '基本信息'
      },
    ]
  }
}

// 默认导出组件
export default {
  name: plugin.name,
  // 为组件提供 install 安装方法，供按需引入
  // install: function (Vue) {
  //   Vue.component(Sidebar.name, Sidebar)
  //   let ide = Vue.component('gl-ide')
  //   if (!ide) {
  //     console.error('由于gl-ide未加载，无法注册插件' + plugin.name + '到gl-ide中。')
  //   } else {
  //     ide.use(plugin)
  //   }
  // },
  config: plugin

}

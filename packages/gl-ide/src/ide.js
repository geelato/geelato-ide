const plugins = []
const files = []
const panels = []
let GlobalVue

function checkPlugin() {
  // 是否存在重名的插件

  return null
}

/**
 * @param component :component name or component object
 * @returns {*}
 */
function parseComponent(component) {
  console.log('ide > parseComponent > component: ', component)
  if (!component) {
    return component
  }
  if (typeof component === 'string') {
    return GlobalVue.component(component)
  } else if (typeof component === 'object') {
    return component
  } else {
    console.error('未知的组件格式：', component, '。component应为全局注册组件名、或组件对象。')
  }
}

/**
 *
 * @param fileType
 * @param panelsGroup 'stagePanels' or 'SettingPanels'
 */
function findPanels(fileType, panelsGroup) {
  let matchPanels = []
  // console.log('files>', files)
  for (let i in files) {
    let file = files[i]
    if (file.type === fileType) {
      // console.log('file>', file)
      file[panelsGroup].forEach((panel) => {
        matchPanels.push({
          title: panel.title,
          component: parseComponent(panel.component),
          opts: panel.opts ? JSON.parse(JSON.stringify(panel.opts)) : {}
        })
        console.log('ide > matchPanel> panel.component: ', panel.component, 'panel: ', matchPanels[matchPanels.length - 1])
      })
    }
  }
  return matchPanels
}

// function findPanelComponent(name) {
//   for (let i in panels) {
//     let panel = panels[i]
//     if (panel.name === name) {
//       return panel.component
//     }
//   }
//   console.warn('ide > findPanelComponent > name: ', name, ' panels: ', panels)
//   return undefined
// }

export default {
  setVue(Vue) {
    GlobalVue = Vue
  },
  use(pluginComponet, options) {
    let plugin = pluginComponet.config
    let checkInfo = checkPlugin(plugin)
    if (!checkInfo) {
      plugins.push(plugin)
      // use file
      if (plugin.file) {
        files.push(plugin.file)
      }
      // use panels
      if (plugin.panels) {
        panels.push(...(plugin.panels))
      }
      // install
      if (typeof pluginComponet.install === 'function') {
        pluginComponet.install(GlobalVue)
      }
    } else {
      return checkInfo
    }
    console.log('ide > use plugin > ', plugin, 'options > ', options)
  },
  theme: {
    background: 'rgb(238, 238, 238)'
    // background: '#2185d0'
  },
  editingFile: {
    type: 'gl-page-layout',
    content: {opts: {ui: ''}}
  },
  plugins: plugins,
  panels: panels,
  files: files,
  parseComponent: parseComponent,
  findStagePanels: function (fileType) {
    return findPanels(fileType, 'stagePanels')
  },
  findSettingPanels: function (fileType) {
    return findPanels(fileType, 'settingPanels')
  }
}

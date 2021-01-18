import SimplePageDefinition from "../../../runtime/definition/SimplePageDefinition";

const plugins = []
const files = []
const fileTypes = {}
const panels = []
const history = {}
// 设计时辅助设置
const assist = {
  showComponentId: false
}
const defaultLayout = {
  // ide 主界面
  main: {},
  // 弹出的设计页面
  modal: {
    width: '800px'
  }
}

let GlobalVue
// let editingFile = {
//   type: 'GlPageLayout',
//   content: {opts: {ui: ''}}
// }
// let editingCardItem = {}
let defaultFile = {}
let store = {
  refreshToggleFlag: true,
  // 当打开的project
  editingProject: {id: undefined, name: undefined},
  editingFile: {
    // 加载时，动态渲染的组件树
    // objectTree: [],
    // 该文件绑定的事件集合，key为控件gid，需持久化
    // events: {}
  },
  editingCardItem: {},
  stagePanels: [],
  settingPanels: [],
  assist: JSON.parse(JSON.stringify(assist)),
  layout: JSON.parse(JSON.stringify(defaultLayout))
}

/**
 *  除了project，其它的需重置
 */
function resetStore() {
  GlobalVue.set(store, 'stagePanels', [])
  GlobalVue.set(store, 'settingPanels', [])
  GlobalVue.set(store, 'editingFile', {})
  GlobalVue.set(store, 'editingCardItem', {})
  GlobalVue.set(store, 'assist', JSON.parse(JSON.stringify(assist)))
  // GlobalVue.set(store, 'editingCardItem', {})
  GlobalVue.set(store, 'layout', JSON.parse(JSON.stringify(defaultLayout)))
}

function checkPlugin() {
  // 是否存在重名的插件

  return null
}

/**
 * @param component :component name or component object
 * @returns {*}
 */
function parseComponent(component) {
  console.log('geelato-ide > ide.js > parseComponent > component: ', component)
  if (!component) {
    return component
  }
  if (typeof component === 'string') {
    if (GlobalVue.component(component) === undefined) {
      console.warn(`Vue.component('${component}')`, GlobalVue.component(component))
    }
    return GlobalVue.component(component)
  } else if (typeof component === 'object') {
    return component
  } else {
    console.error('未知的组件格式：', component, '。component应为全局注册组件名、或组件对象。')
  }
}

/**
 *
 * @param {String} fileType
 * @param {String} panelsGroup 'stagePanels' or 'SettingPanels'
 * @return {Array} 返回符合条件的的panel集合copy
 */
function findPanelsCopy(fileType, panelsGroup) {
  let matchPanels = []
  for (let i in files) {
    let file = files[i]
    if (file.type === fileType) {
      // console.log('file>', file)
      file[panelsGroup].forEach((panel) => {
        matchPanels.push({
          title: panel.title,
          type: panel.type,
          component: parseComponent(panel.component),
          name: panel.component,
          opts: panel.opts ? JSON.parse(JSON.stringify(panel.opts)) : {}
        })
        console.log('geelato-ide > ide.js > findPanelsCopy() > matchPanel panel.component: ', panel.component, 'panel: ', matchPanels[matchPanels.length - 1])
      })
    }
  }
  console.log('geelato-ide > ide.js > findPanelsCopy() > matchPanels:', matchPanels)
  return matchPanels
}

export default {
  setVue(Vue) {
    GlobalVue = Vue
  },
  store: store,
  use(pluginComponent, options) {
    if (!GlobalVue) {
      console.error('安装ide插件失败，必需先调用setVue(Vue)设置Vue。')
      return
    }

    let plugin = pluginComponent.config
    let checkInfo = checkPlugin(plugin)
    if (!checkInfo) {
      // install 注册全局组件
      if (typeof pluginComponent.install === 'function') {
        pluginComponent.install(GlobalVue)
      }
      plugins.push(plugin)
      // use file
      if (plugin.file) {
        files.push(plugin.file)
        fileTypes[plugin.file.type] = {
          type: plugin.file.type,
          icon: plugin.file.icon,
          name: plugin.file.title
        }
      }
      // use panels
      if (plugin.panels) {
        panels.push(...plugin.panels)
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
  plugins: plugins,
  panels: panels,
  files: files,
  fileTypes: fileTypes,
  parseComponent: parseComponent,
  findStagePanels: function (fileType) {
    return findPanelsCopy(fileType, 'stagePanels')
  },
  findSettingPanels: function (fileType) {
    return findPanelsCopy(fileType, 'settingPanels')
  },
  openDefaultFile(id) {
    let fileConfig = JSON.parse(JSON.stringify(defaultFile))
    fileConfig.id = id
    fileConfig.isInitFromTemplate = true
    this.openFile(fileConfig)
  },
  openFile(fileData, callback) {
    let fileConfig = new SimplePageDefinition(fileData, fileData.isInitFromTemplate)
    let stagePanels = findPanelsCopy(fileConfig.type, 'stagePanels')
    let settingPanels = findPanelsCopy(fileConfig.type, 'settingPanels')
    if (fileConfig.isInitFromTemplate) {
      // 来源于模板文件，将模板文件的配置信息设置到editingFile中
      // 依据约定，有且只有一个type为ui的panel
      for (let i in stagePanels) {
        let panel = stagePanels[i]
        if (panel.type === 'ui') {
          fileConfig.sourceContent.opts = panel.opts
          // console.log('gl-ide > openFile() > fileConfig.sourceContent.opts:', panel.opts)
          break
        }
      }
    } else {
      // 来源于服务端已存储的实例文件
    }
    // 重置存储
    resetStore()
    // 确保重新加载文件能刷新
    GlobalVue.nextTick(() => {
      console.log('geelato-ide > gl-ide > openFile > reset store.')
      GlobalVue.set(store, 'stagePanels', stagePanels)
      GlobalVue.set(store, 'settingPanels', settingPanels)
      GlobalVue.set(store, 'editingFile', fileConfig)
      console.log('geelato-ide > gl-ide > openFile > store after set:', store)
      if (typeof callback === 'function') {
        callback()
      }
    })
  },
  openCardItem(cardItemConfig) {
    GlobalVue.set(store, 'editingCardItem', cardItemConfig)
  },
  commitFile(fileConfig) {
    if (typeof fileConfig !== 'object') {
      console.error('geelato-ide > gl-ide > commitFile() > fileConfig is not typeof object, fileConfig:', fileConfig)
      return
    }
    Object.assign(store.editingFile, fileConfig)
  },
  // 提交版本
  commitFileOpts(fileType, data) {
    console.log('commitOpts>', fileType, data)
    store.editingFile.sourceContent.opts[fileType] = data
    if (!history[fileType]) {
      history[fileType] = []
    }
    let len = history[fileType].length
    if (typeof data === 'object') {
      let strData = JSON.stringify(data)
      let copyData = JSON.parse(strData)
      if (len > 0) {
        // 如果和最后一次提交的一致，则不记录版本
        let lastData = history[fileType][len - 1]
        if (JSON.stringify(lastData) !== strData) {
          history[fileType].push(copyData)
        }
      } else {
        history[fileType].push(copyData)
      }
    } else if (typeof data === 'string') {
      // 对编辑的内容，分代码类做版本管理
      if (len > 0 && history[fileType][len - 1] === data) {
        // 如果和最后一次提交的一致，则不记录版本
      } else {
        history[fileType].push(data)
      }
    } else {
      console.error('不支持的数据格式，', typeof data, data)
    }
  },

  // 回撤
  retreatOpts(fileType) {
    let str = history[fileType].length > 0 ? history[fileType].pop() : ''
    this.store.editingFile.sourceContent.opts[fileType] = str
    return str
  }
}

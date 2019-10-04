import SimplePageDefinition from './SimplePageDefinition'

/**
 * 存储当前设计器的状态数据
 */
class IdeStore {
  /**
   *
   * @param fileTypes 必选，本编辑器支持的文件类型，例如：
   * {fileTypes: {
   *   list: {
   *     type: 'list',
   *        icon: 'th list icon',
   *        name: '列表页面',
   *        subTypes: ['ui', 'json']
   *   },
   *   api: {
   *     type: 'api',
   *     icon: 'plug icon',
   *     name: '通用接口',
   *     subTypes: ['mvel', 'sql', 'json']
   *   }
   * }}
   */
  constructor ({pluginNames, plugins, fileTypes, dict}) {
    this.project = {id: ''}
    this.fileTypes = fileTypes
    this.dict = dict || {}
    this.pluginNames = pluginNames || []
    this.plugins = plugins || {}
    this.reset()
  }

  // 当更新编辑页面时，重置内部的相关数据
  reset (editingPage = new SimplePageDefinition()) {
    this.editingPage = editingPage
    this.history = {}
  }

  // 提交版本
  commitOpts (fileType, data) {
    console.log('commitOpts>', fileType, data)
    this.editingPage.content.opts[fileType] = data
    if (!this.history[fileType]) {
      this.history[fileType] = []
    }
    let len = this.history[fileType].length
    if (typeof data === 'object') {
      let strData = JSON.stringify(data)
      let copyData = JSON.parse(strData)
      if (len > 0) {
        // 如果和最后一次提交的一致，则不记录版本
        let lastData = this.history[fileType][len - 1]
        if (JSON.stringify(lastData) !== strData) {
          this.history[fileType].push(copyData)
        }
      } else {
        this.history[fileType].push(copyData)
      }
    } else if (typeof data === 'string') {
      // 对编辑的内容，分代码类做版本管理
      if (len > 0 && this.history[fileType][len - 1] === data) {
        // 如果和最后一次提交的一致，则不记录版本
      } else {
        this.history[fileType].push(data)
      }
    } else {
      console.error('不支持的数据格式，', typeof data, data)
    }
  }

  // 回撤
  retreatOpts (fileType) {
    let str = this.history[fileType].length > 0 ? this.history[fileType].pop() : ''
    this.editingPage.content.opts[fileType] = str
    return str
  }
}

// let instance = new DesignerStore()
export default IdeStore

/**
 *  动态页面结构定义
 */
class SimplePageDefinition {
  /**
   * @param options
   * @param isFromRemote 是否从模板初始化，默认为false，方便打开页面时区分是否要加载模板的配置信息还是从服务器加载配置信息
   */
  constructor (options, isInitFromTemplate = false) {
    this.reset(options)
    this.isInitFromTemplate = isInitFromTemplate
  }

  reset (options) {
    let params = options || {}
    let defaultContent = {
      // code: {
      //   mvel: '',
      //   sql: ''
      // },
      // 页面的内容
      // 格式1：'/components/collections/grid'
      // 格式2：vue component对象，{template:''}
      component: params.component || '',
      // 用于传递给component的opts，一般用于页面的定义配置
      opts: {
        // 页面的配置信息
        // body: {},
        // 页面元素的配置信息
        // elements:{'id1':{'ui':{}},'id2':{}}
        // elements: {},
        // 结构树
        // tree:['id1':['id3','id4'],'id2']
        // tree: {}
      },
      // 默认查询参数，与opts不同，query是同一页面定义下的不同参数
      params: {}
    }
    // 对像数据库中的id(guid)
    this.id = params.id || ''
    // 扩展id，用于关联其它对象
    this.extendId = params.extendId
    // 页面名称 不需要名称字段，从树节点中获取
    // this.name = params.name || ''
    // 类型，唯一，如api、form、table
    this.type = params.type || ''
    // 页面编码，唯一
    this.code = params.code || ''
    // 描述
    this.description = params.description || ''
    // 包含component、opts、params等内容
    this.content = params.content ? this.parseContent(params.content) : defaultContent
  }

  /**
   * @param content 字符串
   * @returns {*} content 对象
   */
  parseContent (content) {
    if (typeof content === 'string') {
      let c = JSON.parse(content)
      return {
        component: c.component,
        opts: c.opts,
        params: c.params
        // code: c.code
      }
    } else {
      return content
    }
  }

  // 组合里面的code、component、opts、params等，转换成pageCfg的格式
  // toPageCfg () {
  //   return {
  //     code: this.code,
  //     component: this.content.component,
  //     opts: this.content.opts,
  //     params: this.content.params
  //   }
  // }
}

export default SimplePageDefinition

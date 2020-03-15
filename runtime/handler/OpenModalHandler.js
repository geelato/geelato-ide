export default class OpenModalHandler {

  constructor($root) {
    this.$root = $root
  }

  /**
   *  打开窗口
   *  负责对页面传参进行转换处理
   * @param action
   * @param ctx
   * @param data 由于采用基于paramMapping的方式，直接从ctx中取值，不再使用该值
   */
  doAction(action, ctx, data) {
    console.log('geelato > runtime > OpenModalHandler.js > doAction() > action:', action)
    console.log('geelato > runtime > OpenModalHandler.js > doAction() > ctx:', ctx)
    console.log('geelato > runtime > OpenModalHandler.js > doAction() > data:', data)
    const query = {}
    if (action.params.paramMapping) {
      action.params.paramMapping.forEach(param => {
        query[param.name] = param.value
      })
    }
    console.log('geelato > runtime > OpenModalHandler.js > doAction() > parse paramMapping and get param:', query)

    this.$root.$gl.ui.openModal(ctx, {
      title: action.params.title,
      width: action.params.width || '1000px',
      height: action.params.height || '480px',
      body: {
        type: 'dynamic',
        component: 'GlPage',
        props: {
          extendId: action.params.pageId,
          query: query || data
        }
      },
      actions: action.params.actions,
      actionAlign: 'center',
      on: [{fn: 'save', ctx: 'content', then: {fn: 'close', ctx: 'this', then: {fn: 'refresh', ctx: 'opener'}}}],
    })
  }
}

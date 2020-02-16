// import ShowMessageHandler from './handler/ShowMessageHandler'

export default class ActionHandler {

  constructor($root) {
    this.$root = $root
    this.handlers = {
      // ShowMessageHandler: new ShowMessageHandler(this.$root)
    }
  }

  /**
   * 动态加载./handler/下的XXXHandler,并执行
   * @param action
   * @param ctx 触发事件的上下文
   */
  doAction(action, ctx, data) {
    const that = this
    for (const index in action.do) {
      const doItem = action.do[index]
      const handlerName = doItem.handler + 'Handler'
      if (!this.handlers[handlerName]) {
        const fn = () => import('./handler/' + handlerName + '.js')
        fn().then((result) => {
          const Handler = result.default
          that.handlers[handlerName] = new Handler(that.$root)
          try {
            this.handlers[handlerName].doAction(doItem, ctx, data)
          } catch (e) {
            console.error(e, 'action:', action)
          }
        })
      } else {
        try {
          this.handlers[handlerName].doAction(doItem, ctx, data)
        } catch (e) {
          console.error(e, 'action:', action)
        }
      }
    }
  }
}

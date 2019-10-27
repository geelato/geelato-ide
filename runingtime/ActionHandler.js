// import ShowMessageHandler from './handler/ShowMessageHandler'

export default class ActionHandler {

  constructor($root) {
    this.$root = $root
    this.handlers = {
      // ShowMessageHandler: new ShowMessageHandler(this.$root)
    }
  }

  /**
   * 动态加载./handler/下的XXXHandler,并搪行
   * @param action
   */
  doAction(action) {
    let that = this
    for (let index in action.do) {
      let doItem = action.do[index]
      let handlerName = doItem.handler + 'Handler'
      if (!this.handlers[handlerName]) {
        let fn = () => import('./handler/' + handlerName + '.js')
        fn().then((result) => {
          that.handlers[handlerName] = new result.default(that.$root)
          try {
            this.handlers[handlerName].doAction(doItem)
          } catch (e) {
            console.error(e, 'action:', action)
          }
        })
      } else {
        try {
          this.handlers[handlerName].doAction(doItem)
        } catch (e) {
          console.error(e, 'action:', action)
        }
      }
    }
  }
}

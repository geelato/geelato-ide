import ShowMessageHandler from './handler/ShowMessageHandler'

export default class ActionHandler {

  constructor($root) {
    this.$root = $root
    this.handlers = {
      ShowMessageHandler: new ShowMessageHandler(this.$root)
    }
  }

  doAction(action) {
    for (let index in action.do) {
      let doItem = action.do[index]
      this.handlers[doItem.handler + 'Handler'].doAction(doItem)
    }
  }

}

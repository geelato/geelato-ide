export default class ShowMessageHandler {

  constructor($root) {
    this.$root = $root
  }

  doAction(action, ctx) {
    this.$root.$message[action.params.method](action.params.content, action.params.duration)
  }

}

export default class ShowMessageHandler {

  constructor($root) {
    this.$root = $root
  }

  doAction(action, ctx, data) {
    const msg = action.params.ShowMessage
    this.$root.$message[msg.method](msg.content, msg.duration)
  }
}

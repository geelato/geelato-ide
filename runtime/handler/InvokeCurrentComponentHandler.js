export default class InvokeCurrentComponentHandler {

  constructor($root) {
    this.$root = $root
  }

  doAction(action, ctx, data) {
    console.log('geelato > runtime > InvokeCurrentComponentHandler.js > doAction() > action:', action)
    console.log('geelato > runtime > InvokeCurrentComponentHandler.js > doAction() > ctx:', ctx)
    console.log('geelato > runtime > InvokeCurrentComponentHandler.js > doAction() > data:', data)
  }
}

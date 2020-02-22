export default class InvokeCurrentComponentHandler {

  constructor($root) {
    this.$root = $root
  }

  doAction(action, ctx, data) {
    console.log('geelato > runtime > InvokeCurrentComponentHandler.js > doAction() > action:', action)
    console.log('geelato > runtime > InvokeCurrentComponentHandler.js > doAction() > ctx:', ctx)
    console.log('geelato > runtime > InvokeCurrentComponentHandler.js > doAction() > data:', data)
    let params = {}
    action.params.InvokeCurrentComponent.fn.params.forEach(param => {
      params[param.name] = param.value
    })
    params.data = data
    let promise = ctx[action.params.InvokeCurrentComponent.fn.name](params)
    console.log('doAction promise>', promise)

    return promise
  }
}

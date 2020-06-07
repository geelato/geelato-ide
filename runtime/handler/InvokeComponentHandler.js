export default class InvokeComponentHandler {

  constructor($root) {
    this.$root = $root
  }

  doAction(action, ctx, data) {
    console.log('geelato > runtime > InvokeComponentHandler.js > doAction() > action:', action)
    console.log('geelato > runtime > InvokeComponentHandler.js > doAction() > ctx:', ctx, this.getComponentRefs(ctx))
    console.log('geelato > runtime > InvokeComponentHandler.js > doAction() > data:', data)
    const params = {}
    action.params.InvokeComponent.fn.params.forEach(param => {
      params[param.name] = param.value
    })
    params.data = data
    // 获取该页面的所有引用组件
    let refs = this.getComponentRefs(ctx)
    // 通过refId获取组件，并调用该组件的方法
    const promise = refs[action.params.InvokeComponent.refId].component[action.params.InvokeComponent.fn.name](params)
    console.log('geelato > runtime > InvokeComponentHandler.js > doAction() > promise:', promise)
    return promise
  }

  getComponentRefs(c) {
    if (typeof c.componentRefs === 'object') {
      return c.componentRefs
    } else {
      return this.getComponentRefs(c.$parent)
    }
  }
}

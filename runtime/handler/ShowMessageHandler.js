export default class ShowMessageHandler {

  constructor($root) {
    this.$root = $root
  }

  doAction(action, page, ctx, data) {
    const msg = action.params.ShowMessage
    const pageVars = page.$data.$_vars
    const componentVars = ctx.$data.$_vars
    console.log('geelato > runtime > ShowMessageHandler.js > doAction() > inParam page vars:', pageVars)
    console.log('geelato > runtime > ShowMessageHandler.js > doAction() > inParam component vars:', componentVars)
    // 按页面变量、组件变量进行字符串值转换
    const result = new Function('page', 'component', 'return `' + msg.content + '`')(pageVars, componentVars)
    console.log('geelato > runtime > ShowMessageHandler.js > doAction() > before convert:', msg.content)
    console.log('geelato > runtime > ShowMessageHandler.js > doAction() > after convert :', result)
    this.$root.$message[msg.method](result, msg.duration)
  }
}

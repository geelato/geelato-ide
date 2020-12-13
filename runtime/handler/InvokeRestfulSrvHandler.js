import utils from "../utils";

export default class InvokeRestfulSrvHandler {

  constructor($root) {
    this.$root = $root
  }

  doAction(action, page, ctx, data) {
    let that = this

    console.log('geelato > runtime > InvokeRestfulSrvHandler.js > doAction() > action:', action)
    console.log('geelato > runtime > InvokeRestfulSrvHandler.js > doAction() > ctx:', ctx)
    console.log('geelato > runtime > InvokeRestfulSrvHandler.js > doAction() > data:', data)
    console.log('geelato > runtime > InvokeRestfulSrvHandler.js > doAction() > page:', page)

    let service = this.$root.$gl.api.getService()

    const params = {}

    action.params.InvokeRestfulSrv.params.paramMapping.forEach(param => {
      // 传过来的数据data一般来说是用gid作为key的，也有可能用name作为key
      const targetGid = param.target.gid.substring(param.target.gid.lastIndexOf('.') + 1)
      const srcData = utils.eval('$ctx.' + param.src.dataCtx, ctx)
      const value = srcData[param.src.gid] || srcData[param.src.name]
      console.log('geelato > runtime > InvokeRestfulSrvHandler.js > doAction() > srcData:', srcData)
      params[param.target.name] = value
    })

    let serviceOptions = {
      url: action.params.InvokeRestfulSrv.srvUrl,
      method: action.params.InvokeRestfulSrv.method,
      transformResponse: [function (responseStr) {
        // 预处理，获取里面的data用于存到页面变量中
        console.log('geelato > runtime > InvokeRestfulSrvHandler.js > doAction() > responseStr:', responseStr)
        const responseJson = typeof responseStr === 'object' ? responseStr : JSON.parse(responseStr)
        // 对 data 进行任意转换处理
        let result = responseJson
        if (action.params.InvokeRestfulSrv.result.handler) {
          console.log('geelato > runtime > InvokeRestfulSrvHandler.js > doAction() > handler: ', action.params.InvokeRestfulSrv.result.handler)
          const fn = new Function('$ctx', '$utils', action.params.InvokeRestfulSrv.result.handler)
          // 执行处理函数
          result = fn({data: responseJson.data}, that.$root.$gl.utils)
        }

        // 设置变量值到组件或页面中
        const setVar = action.params.InvokeRestfulSrv.result.setVar
        if (setVar.name) {
          if (setVar.scope === 'COMPONENT') {
            ctx.$set(ctx.$data.$_vars, setVar.name, result)
            console.log('geelato > runtime > InvokeRestfulSrvHandler.js > doAction() > component $_vars:', ctx.$data.$_vars)
          } else if (setVar.scope === 'PAGE') {
            page.$set(page.$data.$_vars, setVar.name, result)
            console.log('geelato > runtime > InvokeRestfulSrvHandler.js > doAction() > page $_vars:', page.$data.$_vars)
          }
        }
        // 直接近回结果，不影响后续的拦截处理
        return responseStr;
      }]
    }

    if (action.params.InvokeRestfulSrv.method === 'GET') {
      serviceOptions.params = params
    } else {
      serviceOptions.data = params
    }

    console.log('geelato > runtime > InvokeRestfulSrvHandler.js > doAction() > service options:', serviceOptions)

    // TODO 不生效？
    const x = async function () {
      await service(serviceOptions)
    }

    return x()
  }
}

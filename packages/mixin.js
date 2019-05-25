// import pluginManager from './gl-ide/src/pluginManager'

// console.log('pluginManager.plugins>', pluginManager.plugins)
export default {
  props: {
    theme: {
      type: Object
    },
    layout: {
      type: Object,
      default() {
        return {
          width: 0,
          height: 0
        }
      }
    },
    plugins: {
      type: Array,
      default() {
        return []
      }
    },
    panels: {
      type: Array,
      default() {
        return []
      }
    },
    files: {
      type: Array,
      default() {
        return []
      }
    },
    editingFile:{
      type:Object,
      default(){}
    }
    // api: {
    //   type: Object,
    //   default() {
    //     return this.$gl.api
    //   }
    // },
    // // 组件渲染配置信息
    // opts: {
    //   type: Object,
    //   required: false
    // },
    // // 表单的查询信息，如{id:'1345362334482731423'}，{treeNodeId:'1345362334482731423'}
    // query: {
    //   type: Object,
    //   required: false,
    //   default() {
    //     return {}
    //   }
    // }
  },
  methods: {
    findPlugin(type) {
      let plugins = []
      for (let i in this.plugins) {
        let plugin = this.plugins[i]
        if (plugin[type]) {
          plugins.push(plugin)
        }
      }
      // console.log('i', plugins)
      return plugins
    }
  }
}

export default {
  props: {
    designComponentName: {
      type: String
    },
    objectTree: {
      type: Array,
      required: true
    },
    params: {
      type: Object,
      default() {
        return {
          [this.name]: JSON.parse(JSON.stringify(this.defaultConfig))
        }
      }
    }
  },
  data() {
    return {
      name: 'XxxSettingComponentName', // e.g. InvokeRestfulSrv
      defaultConfig: {},
      treeData: this.convertTreeNodeComponentOnly()
    }
  },
  computed: {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.params && !this.params[this.name]) {
        this.$set(this.params, this.name, JSON.parse(JSON.stringify(this.defaultConfig)))
      }
    },
    convertTreeNodeComponentOnly() {
      // let treeNodes = JSON.parse(JSON.stringify(this.objectTree))

      function parse(treeNodes) {
        let newTreeNodes = []
        for (let index in treeNodes) {
          let treeNode = treeNodes[index]
          let {disabled, key, slots, title, value, _component} = treeNode
          let newTreeNode = {disabled, key, slots, title, value, _component}
          newTreeNodes.push(newTreeNode)
          newTreeNode.disabled = true
          if (treeNode._component) {
            newTreeNode.disabled = false
          } else {
            if (treeNode.children) {
              newTreeNode.children = parse(treeNode.children)
            }
          }
        }
        return newTreeNodes
      }

      return parse(this.objectTree)
    }
  }
}


export default {
  props: {
    componentRefs: {
      type: Object,
      required: true
    },
    rows: {
      type: Array,
      default() {
        return []
      }
    },
    bindEventHandlers: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      rowItems: this.rows,
    }
  },
  destroyed() {
  },
  methods: {
    /**
     * 初始化组件树中的组件引用
     * 不包括布局容器
     */
    initComponentRefs() {
      for (let rowIndex in this.rowItems) {
        let row = this.rowItems[rowIndex]
        for (let cellIndex in row.cols) {
          for (let cellItemIndex in row.cols[cellIndex].items) {
            this.generateComponentRef(row.cols[cellIndex].items[cellItemIndex])
          }
        }
      }
    },
    generateComponentRef(item) {
      // 过滤掉容器
      if (!item.gid || !(item.componentName)) {
        return
      }
      // item 示例：
      // {component: "GlTable"
      //   img: ""
      //   bind: Object
      //   meta: Object
      //   icon: "table"
      //   show: true
      //   description: ""
      //   id: "XSOb2tMmwgk6KfFR"
      //   title: "列表"
      // }
      console.log('runtime > components > gl-page > pageItemMixin > generateComponentRef() > item:', item)
      console.log('runtime > components > gl-page > pageItemMixin > generateComponentRef() > this.$refs:', this.$refs)
      console.log('runtime > components > gl-page > pageItemMixin > generateComponentRef() > this.$refs[item.gid]:', this.$refs[item.gid])
      if (!this.$refs[item.gid]) {
        console.error('runtime > components > gl-page > pageItemMixin > generateComponentRef() > 组件未渲染，gid为:', item.gid)
      } else {
        this.componentRefs[item.gid] = {
          id: item.gid,
          gid: item.gid,
          component: this.$refs[item.gid][0],
          type: item.type,
          bind: item.bind,
          meta: item.meta
        }
      }
    },
    /**
     * 初始化创建树节点
     */
    generateTreeNodeData() {
      let that = this
      that.rows.filter((row) => !!row.cols).forEach((row) => {
        that.generateRowNodeAndBindEvent(row)
        row.cols.filter((cell) => !!cell.items).forEach((cell) => {
          // ==========item为单元格内一个组件的配置信息，例如下方所示===================
          // {id:'',title: '列表',icon: 'table',component: 'GlTable',bind: {opts: table, query: {}},
          //   meta: {
          //     component: 'GlIdePluginTableDesigner',
          //       title: '列表设计器',
          //       objectTree: [{title: '查询栏', path: 'query.mix.properties'}, {title: '工具栏', path: 'toolbar.actions'}]
          //   }
          // }
          // =======================================================================
          // cell 单元格
          // cellItem 单元格内的项，可能是组件(存在cellItem.component)，也可能是tabs等容器
          cell.items.forEach((cellItem) => {
            if (cellItem.componentName||cellItem.component) {
              that.generateComponentNodeAndBindEvent(cellItem, cell)
            } else {
              // cellItem.items 对应tabs的多个面板
              // panel 容器的一个面板
              that.generateContainerNodeAndBindEvent(cellItem, cell)
              cellItem.items.forEach((panel) => {
                that.generateContainerPanelNodeAndBindEvent(panel, cellItem)
                // panel.items 对应页板内的多个组件
                panel.items.forEach((component) => {
                  that.generateComponentNodeAndBindEvent(component, panel)
                })
              })
              // slots 容器的的插槽
              if (cellItem.slots && cellItem.slots.length > 0) {
                cellItem.slots.forEach((slotComponent) => {
                  that.generateComponentNodeAndBindEvent(slotComponent, cellItem)
                })
              }
            }
          })
        })
      })
      console.log('gl-ide-plugin-layout-item> generateTreeData() > componentRefs:', this.componentRefs)
    },
  }
}

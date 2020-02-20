/* eslint-disable no-useless-constructor */
import ActionHandler from './ActionHandler'

/**
 * 解析pageFile配置信息，构建对象树、绑定事件
 * 用于页面设计器及页面执行器
 */
export default class EditingFileParser {

  constructor() {
  }

  init($root) {
    this.actionHandlerInstance = new ActionHandler($root)
    return this
  }

  convertSourceToRunningTime(currentVue, editingFile) {
    const rows = editingFile.sourceContent.opts.layout.rows
    const treeNodes = editingFile.objectTree
    generateTreeNodeData()

    /**
     * 初始化创建树节点
     */
    function generateTreeNodeData() {
      if (treeNodes !== undefined && treeNodes.length > 0) {
        // 已创建，不重复创建
        return
      }
      rows.filter((row) => !!row.cols).forEach((row) => {
        row.cols.filter((col) => !!col.items).forEach((col) => {
          // ==========item为卡片内一个组件的配置信息，例如下方所示
          // {id:'',title: '列表',icon: 'table',component: 'GlTable',bind: {opts: table, query: {}},
          //   meta: {
          //     component: 'GlIdePluginTableDesigner',
          //       title: '列表编辑器',
          //       objectTree: [{title: '查询栏', path: 'query.mix.properties'}, {title: '工具栏', path: 'toolbar.actions'}]
          //   }
          // }

          col.items.forEach((item) => {
            generateObjectTreeNode(item)
          })
        })
      })
      console.log('gl-ide > EditingFileParser > generateTreeData() > componentRefs:', this.componentRefs)
    }

    /**
     * 创建该组件(treeNodes)下的树节点
     * @param item 组件配置信息item
     */
    function generateObjectTreeNode(item) {

      const that = this
      // 如果已存在treeNodes中，则不添加
      if (treeNodes.filter((node) => node.key === item.id).length > 0) {
        console.warn('gl-ide > EditingFileParser > generateObjectTreeNode() > 已存在treeNodes中，不添加item:', item)
        return
      }
      // 加载每张卡片组件配置cardComponent
      //  {id: item.id, component: this.$refs[item.id][0], type: item.type, meta: item.meta}
      const cardComponent = that.componentRefs[item.id]

      // console.log('gl-ide > EditingFileParser > generateObjectTreeNode() > cardComponent:', cardComponent)
      const groups = []
      if (cardComponent && cardComponent.meta && cardComponent.meta.objectTree) {
        cardComponent.meta.objectTree.forEach((treeNodeObject) => {
          // treeNodeObject: {title:xx,path:xx.yy.zz}
          const childrenNodes = []
          const childrenObjects = eval('item.bind.opts.' + treeNodeObject.path)
          console.log('gl-ide > EditingFileParser > generateTreeData() > childrenObjects:', cardComponent.title, childrenObjects)
          if (childrenObjects && typeof childrenObjects === 'object') {
            for (const key in childrenObjects) {
              const childObj = childrenObjects[key]
              if (childObj.control) {
                // 未设置control值的，可能为form的隐藏属性，这里需过滤掉
                // console.log('childObj>', childObj)
                childrenNodes.push({
                  title: childObj.title + ' [' + childObj.control + ']',
                  // 组件id+组件内的控件id
                  key: item.id + '_$_' + childObj.gid, // that.$gl.utils.uuid(8),
                  slots: {
                    icon: 'link'
                  }
                })
              }
            }
          }

          groups.push({
            title: treeNodeObject.title + '[组]',
            key: that.$gl.utils.uuid(8),
            disabled: true,
            slots: {
              icon: 'folder'
            },
            children: childrenNodes
          })
        })
      }

      treeNodes.push({
        title: item.title,
        key: item.id,
        slots: {
          icon: item.icon
        },
        children: groups
      })
    }

    /**
     * 移除objectTree相应的节点
     * @param item 组件配置信息item
     */
    // function removeObjectTreeNode(item) {
    //   treeNodes.forEach((node, index) => {
    //     if (node.key === item.id) {
    //       treeNodes.splice(index, 1)
    //     }
    //   })
    // }

    /**
     * 初始化组件树中的组件引用
     */
    // function initComponentRefs(rowItems) {
    //   for (const rowIndex in rowItems) {
    //     const row = rowItems[rowIndex]
    //     for (const colIndex in row.cols) {
    //       for (const colItemIndex in row.cols[colIndex].items) {
    //         generateComponentRef(row.cols[colIndex].items[colItemIndex])
    //       }
    //     }
    //   }
    // }

    // function generateComponentRef(item) {
    //   console.log('gl-ide > EditingFileParser > generateComponentRef() > item:', item)
    //   console.log('gl-ide > EditingFileParser > generateComponentRef() > this.$refs[item.id]:', this.$refs[item.id])
    //   editingFile.sourceContent.opts._componentRefs[item.id] = {
    //     id: item.id,
    //     component: currentVue.$refs[item.id][0],
    //     type: item.type,
    //     meta: item.meta
    //   }
    // }
  }

  /**
   *
   * @param file 当前editingFile的子页面，如弹层页面
   * @param toParentFile 所添加子页面的父页面
   */
  addSubFile(file, toParentFile) {
    // 在结构树中添加页面结构
  }

  removeSubFile(file, fromParentFile) {

  }

  /**
   * 绑定事件
   * @param controlBindEvents 所有的控件事件引用，并在此方法中增加当前控件事件
   * @param control 绑定的目标控件
   * @param actions 绑定的事件配置（一到多个事件）
   * @param controlCtx 绑定的目标控件所在的组件（上下文），如：目标控件按钮，上线文组件为表格组件
   */
  bindEvent(controlBindEvents, control, actions, controlCtx) {
    console.log('geelato > runtime > EditingFileParser > bindEvent() > controlBindEvents, control, actions，controlCtx>', controlBindEvents, control, actions, controlCtx)
    for (const actionIndex in actions) {
      const action = actions[actionIndex]
      const eventKey = control.gid + '_$_' + action.on
      controlBindEvents[eventKey] = this.createActionHandlerFn(action, controlCtx)
      // control.component.$off(action.on, controlBindEvents[eventKey])
      control.component.$on(action.on, controlBindEvents[eventKey])
      console.log('geelato > runtime > EditingFileParser > bindEvent() > this.controlBindEvents>', controlBindEvents, eventKey)
    }
  }

  /**
   * 打开设置窗口时，解绑事件，避免重复绑定
   * @param actions
   */
  clearEvent(controlBindEvents, control, actions) {
    for (const actionIndex in actions) {
      const action = actions[actionIndex]
      const eventKey = control.gid + '_$_' + action.on
      if (controlBindEvents[eventKey] === undefined) {
        continue
      }
      control.component.$off(action.on, controlBindEvents[eventKey])
      console.log('clearEvent() > this.controlBindEvents>', controlBindEvents, eventKey)
    }
  }

  createActionHandlerFn(action, controlCtx) {
    const that = this
    return function (ctx, data) {
      console.log('geelato > runtime > createActionHandlerFn controlCtx,ctx>', controlCtx, ctx)
      that.actionHandlerInstance.doAction(action, controlCtx || ctx, data)
    }
  }

  convertSourceToSave(editingFile) {
    let sourceContent = {
      component: {},
      opts: {layout: [], params: {}},
      events: {}
    }
    // 对于非新建的页面
    if (editingFile.sourceContent) {
      sourceContent = {
        component: editingFile.sourceContent.component,
        opts: {
          layout: editingFile.sourceContent.opts.layout,
          params: editingFile.sourceContent.opts.params
        },
        events: editingFile.sourceContent.events
      }
    }

    return {
      id: editingFile.id,
      extendId: editingFile.extendId,
      type: editingFile.type,
      code: editingFile.code,
      description: editingFile.description,
      sourceContent: sourceContent,
      previewContent: sourceContent,
      releaseContent: sourceContent
    }
  }

}

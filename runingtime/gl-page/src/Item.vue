<template>
  <div class="gl-ide-preview">
    <a-row v-for="(row,rowIndex) in rowItems" :gutter="row.gutter||gutter" :key="rowIndex" class="gl-dnd-row-handle">
      <a-col v-for="(col,colIndex) in row.cols" :span="col.span" :offset="col.offset" :key="colIndex" style="">
        <template v-if="col.card">
          <a-card :title="getCardConfig(col.card).title" style="margin-top: 8px">
            <component :ref="col.card" :is="getCardComponent(col.card)"
                       :opts="getCardConfig(col.card).opts"
                       :query="getCardConfig(col.card).query">
              正在加载...
            </component>
          </a-card>
        </template>
        <template v-else-if="col.rows">
          <gl-page-item :rows="col.rows" :componentRefs="componentRefs" :bindEvents="bindEvents"
                                      :gutter="gutter" :treeNodes="treeNodes"></gl-page-item>
        </template>
        <template v-else>
          <div v-for="(colItem,colItemIndex) in col.items" :key="colItem.id" class="gl-dnd-col-handle">
            <component :ref="colItem.id" v-show="colItem.show" :is="$globalVue.component(colItem.component)"
                       v-bind="colItem.bind"></component>
          </div>
        </template>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Vue from 'vue'
  // import events from '../events'
  import EditingFileParser from "../../EditingFileParser";

  export default {
    name: "GlPageItem",
    props: {
      componentRefs: {
        type: Object,
        required: true
      },
      events: {
        type: Object,
        required: true
      },
      bindEvents: {
        type: Object,
        required: true
      },
      rows: {
        type: Array,
        default() {
          return []
        }
      },
      treeNodes: {
        type: Array,
        default() {
          return []
        }
      },
      gutter: {
        type: Number,
        default() {
          return 8
        }
      }
    },
    data() {
      return {
        rowItems: this.rows,
        colItems: [],
        // {id:component}
        colCards: {},
      }
    },
    computed: {},
    mounted() {
      this.editingFileParser = new EditingFileParser().init(this.$root)
      this.initComponentRefs()
      this.generateTreeNodeData()
    },
    methods: {
      /**
       * 初始化创建树节点
       */
      generateTreeNodeData() {
        console.log('gl-ide > gl-ide-plugin-item > generateTreeData() > treeNodes:', this.treeNodes)
        let that = this
        if (that.treeNodes !== undefined && that.treeNodes.length > 0) {
          // 已创建，不重复创建
          return;
        }
        that.rows.filter((row) => !!row.cols).forEach((row) => {
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
              that.generateObjectTreeNodeAndBindEvent(item)
            })
          })
        })
        console.log('gl-ide > gl-ide-plugin-item > generateTreeData() > componentRefs:', this.componentRefs)
      },
      /**
       * 初始化组件树中的组件引用
       */
      initComponentRefs() {
        for (let rowIndex in this.rowItems) {
          let row = this.rowItems[rowIndex]
          for (let colIndex in row.cols) {
            for (let colItemIndex in row.cols[colIndex].items) {
              this.generateComponentRef(row.cols[colIndex].items[colItemIndex])
            }
          }
        }
      },
      generateComponentRef(item) {
        console.log('gl-ide > gl-ide-plugin-item > generateComponentRef() > item:', item)
        console.log('gl-ide > gl-ide-plugin-item > generateComponentRef() > this.$refs:', this, this.$refs)
        console.log('gl-ide > gl-ide-plugin-item > generateComponentRef() > this.$refs[item.id]:', this.$refs[item.id])
        this.componentRefs[item.id] = {id: item.id, component: this.$refs[item.id][0], type: item.type, meta: item.meta}
      },
      /**
       * 创建该组件(treeNodes)下的树节点
       * @param item 组件配置信息item
       */
      generateObjectTreeNodeAndBindEvent(item) {

        let that = this
        // 如果已存在treeNodes中，则不添加
        if (that.treeNodes.filter((node) => node.key === item.id).length > 0) {
          console.warn('gl-ide > gl-ide-plugin-item > generateObjectTreeNodeAndBindEvent() > 已存在treeNodes中，不添加item:', item)
          return
        }
        // 加载每张卡片组件配置cardComponent
        //  {id: item.id, component: this.$refs[item.id][0], type: item.type, meta: item.meta}
        let cardComponent = that.componentRefs[item.id]
        console.log('gl-ide > gl-ide-plugin-item > generateObjectTreeNodeAndBindEvent() > item.id,cardComponent:', item.id, cardComponent, that.componentRefs)

        // console.log('gl-ide > gl-ide-plugin-item > generateObjectTreeNodeAndBindEvent() > cardComponent:', cardComponent)
        let groups = []
        if (cardComponent && cardComponent.meta && cardComponent.meta.objectTree) {
          cardComponent.meta.objectTree.forEach((treeNodeObject) => {
            // treeNodeObject: {title:xx,path:xx.yy.zz}
            let childrenNodes = []
            let childrenObjects = eval('item.bind.opts.' + treeNodeObject.path)
            console.log('gl-ide > gl-ide-plugin-layout > generateTreeData() > childrenObjects:', cardComponent.title, childrenObjects)
            if (childrenObjects && typeof childrenObjects === "object") {
              for (let key in childrenObjects) {
                let childObj = childrenObjects[key]
                if (childObj.control) {
                  // 未设置control值的，可能为form的隐藏属性，这里需过滤掉
                  // console.log('childObj>', childObj)
                  childrenNodes.push({
                    title: childObj.title + ' [' + childObj.control + ']',
                    // 组件id+组件内的控件id
                    key: item.id + '_$_' + childObj.gid, // that.$gl.utils.uuid(8),
                    slots: {
                      icon: 'link',
                    }
                  })
                  // 基于配置的事件初始化绑定
                  let componentItem = that.componentRefs[item.id]
                  let controlComponent = componentItem.component.$_getRefByGid(childObj.gid)
                  let control = {
                    gid: childObj.gid,
                    title: childObj.title,
                    component: controlComponent
                  }
                  if (controlComponent && that.events[childObj.gid]) {
                    that.editingFileParser.bindEvent(that.bindEvents, control, that.events[childObj.gid])
                  }
                }
              }
            }
            groups.push({
              title: treeNodeObject.title + '[组]',
              key: that.$gl.utils.uuid(8),
              disabled: true,
              slots: {
                icon: 'folder',
              },
              children: childrenNodes
            })
            // console.log('gl-ide > gl-ide-plugin-layout > generateTreeData() > component.$refs.query:', eval('item.bind.opts.' + treeNodeObject.path))
          })
        }

        that.treeNodes.push({
          title: item.title,
          key: item.id,
          slots: {
            icon: item.icon,
          },
          children: groups
        })
      },
      getCardConfig(cardId) {
        return this.componentRefs[cardId]
      },
      getCardComponent(cardId) {
        let card = this.getCardConfig(cardId)
        return Vue.component(card.type)
      },
      onEnd: function (e) {
        console.log('gl-ide-plugin-layout > stage > onEnd: ', e)
      },
      onRowAdd: function (e) {
        console.log('gl-ide-plugin-layout > stage > onRowAdd: ', e)
      },
      removeRow(rowIndex) {
        let that = this
        this.$confirm({
          title: '是否删除该行?',
          cancelText: '是',
          okText: '否',
          content: '',
          onOk() {
          },
          onCancel() {
            that.rowItems.splice(rowIndex, 1)
          },
        });
      },
      onRowChange(e) {
        console.log('gl-ide-plugin-layout > stage > onRowChange: ', e)
      },
      onClone(e) {
        console.log('gl-ide-plugin-layout > stage > onClone: ', e)
      },
      onAddCol: function (e) {
        console.log('gl-ide-plugin-layout > stage > onAddCol: ', e, this.componentRefs)
      },
      onColChange(e) {
        console.log('gl-ide-plugin-layout > stage > onColChange: ', e)
      },
      onColChoose(e) {
        console.log('gl-ide-plugin-layout > stage > onColChoose: ', e)
      },
      onCardOpen(col, item, index) {
        if (typeof item.onOpen === 'function') {
          item.onOpen({item: item, col: col, index: index})
        }
        this.$gl.bus.$emit(events.card_open, {col: col, item: item, index: index})
        console.log('gl-ide-plugin-layout > stage > onCardOpen: ', col, item, index)
      },
      onColDelete(col, item, index) {
        console.log('gl-ide-plugin-layout > stage > onColDelete: ', col, item, index)
        this.$confirm({
          title: '是否删除该卡片内容?',
          cancelText: '是',
          okText: '否',
          content: '',
          onOk() {
          },
          onCancel() {
            col.items.splice(index, 1);
          },
        });
      }
    }
  }
</script>

<style>
  .gl-ide-layout-stage .gl-dnd-row-handle {
    border: 1px solid #f0f0f0;
    margin-bottom: 0.1em;
    cursor: move;
  }

  .gl-ide-layout-stage .gl-dnd-row-handle.sortable-chosen {
    background-color: rgb(107, 209, 255);
  }

  .gl-dnd-col-wrapper {
    min-height: 2em;
  }

  .gl-dnd-row-toolbar {
    position: absolute;
    right: -0.5em;
    display: none;
  }

  .gl-dnd-row-toolbar i {
    font-size: 1.5em;
    line-height: 1.5em;
    cursor: pointer;
  }

  .gl-dnd-row-handle:hover .gl-dnd-row-toolbar {
    display: inline-block;
  }

  .gl-dnd-col-toolbar {
    padding: 0 1em;
    line-height: 2em;
    height: 2em;
    background-color: #e5e5e5
  }

  .gl-dnd-col-toolbar button {
    background-color: #e5e5e5;
    border-color: #e5e5e5
  }

  /*.gl-ide-layout-stage .gl-dnd-row-handle > div {*/
  /*!*padding: 0 1px !important;*!*/
  /*}*/

  /*.gl-ide-layout-stage .gl-dnd-row-handle:hover > div > div {*/
  /*!*background-color: rgba(255, 202, 17, 0.7);*!*/
  /*}*/

  .gl-ide-layout-stage .gl-dnd-row-handle:hover {
    /*box-shadow: 0 0 1px #000 inset;*/
    box-shadow: 0 0 4px #ffca11;
  }

  .gl-ide-layout-stage .gl-dnd-row-handle > div > div {
    background-color: rgba(161, 222, 255, 0.35);
    /*text-align: center;*/
  }

  .gl-ide-layout-stage .gl-dnd-row-handle > div > div:hover {
    /*background-color: rgba(211, 211, 211, 0.3);*/
    background-color: rgba(255, 202, 17, 0.35);
    /*border: 1px dotted #a5a5a5;*/
  }


</style>

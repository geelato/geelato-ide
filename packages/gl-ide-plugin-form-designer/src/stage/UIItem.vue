<template>
  <div>
    <gl-draggable
        :list="rowItems"
        handle=".gl-dnd-row-handle"
        group='layoutItems'
        :sort="true"
        @add="onRowAdd"
        @end="onEnd"
        @clone="onClone"
        @change="onRowChange"
    >
      <a-row v-for="(row,rowIndex) in rowItems" :gutter="row.gutter||gutter" :key="rowIndex" class="gl-dnd-row-handle">
        <a-col v-for="(col,colIndex) in row.cols" :span="col.span" :offset="col.offset" :key="colIndex" style="">
          <a-row v-for="(item,itemIndex) in col.items" :key="itemIndex"
                 class="col">
            <a-col :span="item.fieldSpan.label" class="label">
              <gl-label v-if="item.fields[0]&&item.fields[0].field" :label="item.fields[0].label"
                        :property="getProperty(item.fields[0].field)"></gl-label>
            </a-col>
            <a-col :span="item.fieldSpan.control" class="control">
              <gl-draggable
                  :list="item.fields"
                  handle=".gl-dnd-col-handle"
                  group='field'
                  :sort="false"
                  @add="onAddCol($event,col)"
                  @change="onColChange"
                  @choose="onColChoose"
                  class="gl-dnd-col-wrapper"
              >
                <gl-control v-if="fieldItem.field" class="gl-dnd-col-handle " v-for="fieldItem in item.fields"
                            :ref="getProperty(fieldItem.field).gid" :form="form"
                            :property="getProperty(fieldItem.field)"></gl-control>
                <!--@propertyUpdate="onPropertyUpdate" @loadRefData="onLoadRefData"-->
              </gl-draggable>
            </a-col>
          </a-row>

        </a-col>
        <div class="gl-dnd-row-toolbar" @click="removeRow(rowIndex)" title="删除行">
          <a-icon type="close-circle" theme="twoTone" twoToneColor="#f5222d"/>
        </div>
      </a-row>
      <div v-if="!rowItems||rowItems.length===0" style="text-align: center;padding-top: 1em">
        从左边【布局】栏目中拖动布局行列到该区域，再从【组件】栏目拖动组件到布局行列中。
      </div>
    </gl-draggable>
    <div v-if="modalVisible">
      <!--<a-button type="primary" @click="() => modalVisible = true">Vertically centered modal dialog</a-button>-->
      <a-modal class="gl-card-designer" :title="modalTitle" centered :width=modalWidth v-model="modalVisible"
               @ok="() => modalVisible = false" @cancel="onCloseModal" okText="保存" cancelText="取消"
               :maskClosable="false">
        <component :is="$globalVue.component(currentOpenedCard.meta.component)"
                   v-bind="currentOpenedCard.bind"></component>
        <template slot="footer">
          <div style="text-align: center">
            <!--<a-button type="primary" @click="saveCardComponent">暂存</a-button>-->
            <a-button type="danger" @click="onCloseModal">
              关闭
            </a-button>
          </div>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  import EditingFileParser from '../../../../runingtime/EditingFileParser'
  import Vue from 'vue'


  export default {
    name: "GlIdePluginLayoutStageUIItem",
    props: {
      componentRefs: {
        type: Object,
        required: false
      },
      events: {
        type: Object,
        required: false
      },
      bindEvents: {
        type: Object,
        required: false
      },
      rows: {
        type: Array,
        default() {
          return []
        }
      },
      properties: {
        type: Object,
        default() {
          return {}
        }
      },
      form: {
        type: Object,
        default() {
          return {}
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
        color: '#FFF',
        modalTitle: '&nbsp;',
        modalWidth: (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * .98,
        currentOpenedCard: {},
        modalVisible: false,
        rowItems: this.rows,
        colItems: [],
        // {id:component}
        colCards: {},
        currentCardId: ''
      }
    },
    watch: {
      'rowItems.length'(val, oval) {
        // console.log(val, oval)
        // console.log('this.props>>>>>>>>>>>>', this.componentRefs)
        // console.log('this.props>>>>>>>>>>>>', this.rows)
        // console.log('this.props>>>>>>>>>>>>', this.treeNodes)
        // console.log('this.props>>>>>>>>>>>>', this.gutter)
      }
    },
    mounted() {
      // console.log('this.props>>>>>>>>>>>>', this.componentRefs)
      // console.log('this.props>>>>>>>>>>>>', this.rows)
      // console.log('this.props>>>>>>>>>>>>', this.treeNodes)
      // console.log('this.props>>>>>>>>>>>>', this.gutter)
      this.reset()
    },
    methods: {
      reset() {
        this.editingFileParser = new EditingFileParser().init(this.$root)
        this.initComponentRefs()
        this.generateTreeNodeData()
      },
      /**
       * 初始化创建树节点
       */
      generateTreeNodeData() {
        console.log('gl-ide > gl-ide-plugin-item > generateTreeData() > treeNodes:', this.treeNodes)
        let that = this
        if (that.treeNodes !== undefined && that.treeNodes.length > 0) {
          // 已创建，不重复创建
          console.warn('已创建，不重复创建')
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
        // console.log('gl-ide > gl-ide-plugin-item > generateComponentRef() > item:', item)
        // console.log('gl-ide > gl-ide-plugin-item > generateComponentRef() > this.$refs:', this.$refs)
        // console.log('gl-ide > gl-ide-plugin-item > generateComponentRef() > this.$refs[item.id]:', this.$refs[item.id])
        // this.componentRefs[item.id] = {
        //   id: item.id,
        //   component: this.$refs[item.id][0],
        //   type: item.type,
        //   bind: item.bind,
        //   meta: item.meta
        // }
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
      /**
       * 移除objectTree相应的节点
       * @param item 组件配置信息item
       */
      removeObjectTreeNode(item) {
        let that = this
        that.treeNodes.forEach((node, index) => {
          if (node.key === item.id) {
            that.treeNodes.splice(index, 1)
          }
        })
      },
      saveCardComponent(e) {
        console.log('saveCardComponent>', e)
      },

      onCloseModal(e) {
        this.modalVisible = false
        this.onCardReload(this.currentOpenedCard)
      },
      onCardOpen(col, item, index) {
        if (item.meta) {
          this.modalTitle = item.meta.title
          this.currentOpenedCard = item
        }
        this.modalVisible = true
      },
      getCardConfig(cardId) {
        return this.componentRefs[cardId]
      },
      getCardComponent(cardId) {
        let card = this.getCardConfig(cardId)
        return Vue.component(card.type)
      },
      onEnd: function (args) {
        console.log('gl-ide-plugin-layout > stage > onEnd: ', args)
      },
      onRowAdd: function (args) {
        console.log('gl-ide-plugin-layout > stage > onRowAdd: ', args, this.rowItems)
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
      onAddCol: function (e, col) {
        // console.log('gl-ide-plugin-layout > stage > onAddCol() > event.newIndex: ', e.newIndex)
        // console.log('gl-ide-plugin-layout > stage > onAddCol() > items: ', col.items.length)
        // let item = col.items[col.items.length === e.newIndex && e.newIndex > 0 ? e.newIndex - 1 : e.newIndex]
        // this.generateComponentRef(item)
        // this.generateObjectTreeNodeAndBindEvent(item)
        // console.log('gl-ide-plugin-layout > stage > onAddCol() > this.refs: ', this.$refs)
        // console.log('gl-ide-plugin-layout > stage > onAddCol() > this.componentRefs: ', this.componentRefs)
      },

      onColChange(e) {
        console.log('gl-ide-plugin-layout > stage > onColChange: ', e)
      },
      onColChoose(e) {
        console.log('gl-ide-plugin-layout > stage > onColChoose: ', e)
      },
      onColDelete(col, item, index) {
        console.log('gl-ide-plugin-layout > stage > onColDelete: ', col, item, index)
        let that = this
        this.$confirm({
          title: '是否删除该卡片内容?',
          cancelText: '是',
          okText: '否',
          content: '',
          onOk() {
          },
          onCancel() {
            col.items.splice(index, 1);
            delete  that.componentRefs[item.id]
            that.removeObjectTreeNode(item)
            console.log('gl-ide-plugin-layout > stage > onColDelete() > this.componentRefs: ', that.componentRefs)
          },
        });
      },
      onCardReload(item) {
        item.show = !item.show
        this.$nextTick(() => {
          item.show = !item.show
        })
      },
      getProperty(name) {
        if (!name || !this.properties[name]) {
          return {control: 'null', title: ' ', gid: this.$gl.utils.uuid(8)}
        }
        return this.properties[name]
      },
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

  .gl-table-designer .label {
    background-color: #eeeeee;
    text-align: right;
    padding-right: 1em;
    /*min-height: 2.4em;*/
    vertical-align: middle;
    line-height: 2em;
  }

  .gl-table-designer .control {
    line-height: 2.4em;
    background-color: rgb(217, 248, 255);
  }

  .gl-table-designer .col {
    background-color: #eeeeee;
  }


</style>

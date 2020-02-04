<template>
  <div>
    <gl-draggable
        :list="rowItems"
        handle=".gl-dnd-row-handlex"
        group='layoutItems'
        :sort="true"
        @add="onRowAdd"
        @end="onEnd"
        @clone="onRowClone"
        @change="onRowChange"
    >
      <a-row v-for="(row,rowIndex) in rowItems" :gutter="row.gutter||gutter" :key="rowIndex" class="gl-dnd-row-handle">
        <a-col v-for="(col,colIndex) in row.cols" :span="col.span" :offset="col.offset" :key="colIndex" style="">
          <a-row v-for="(item,itemIndex) in col.items" :key="itemIndex"
                 class="col">
            <a-col :span="item.fieldSpan.label" class="label">
              <gl-label v-if="item.fields[0]&&item.fields[0].field" :label="getProperty(item.fields[0].field).title"
                        :property="getProperty(item.fields[0].field)"></gl-label>
            </a-col>
            <a-col :span="item.fieldSpan.control" class="control">
              <gl-draggable
                  :list="item.fields"
                  handle=".gl-dnd-control-handle"
                  group='field'
                  :sort="false"
                  @add="onAddControl($event,item)"
                  @end="onEndControl($event,item)"
                  @change="onControlChange($event,item)"
                  @choose="onControlChoose($event,item)"
                  class="gl-dnd-col-wrapper"
              >
                <gl-control v-if="fieldItem.field" class="gl-dnd-control-handle " v-for="fieldItem in item.fields"
                            :ref="getProperty(fieldItem.field).gid" :form="form"
                            :property="getProperty(fieldItem.field)"></gl-control>
                <!--<div v-if="fieldItem.field" class="gl-dnd-control-handle" v-for="fieldItem in item.fields">-->
                <!--<a-icon :type="getControlType(getProperty(fieldItem.field).control).icon"/>-->
                <!--{{getControlType(getProperty(fieldItem.field).control).title}}-->
                <!--</div>-->
              </gl-draggable>
            </a-col>
          </a-row>
        </a-col>
        <div class="gl-dnd-row-toolbar">
          <!--<a-icon type="close-circle" theme="twoTone" twoToneColor="#f5222d" class="gl-dnd-row-handlex" title="移动行"/>-->
          <a-icon type="close-circle" theme="twoTone" twoToneColor="#f5222d" @click="removeRow(rowIndex)" title="删除行"/>&nbsp;&nbsp;
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
  import controlTypes from '../data/controlTypes'

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
        colCards: {},
        currentCardId: '',
        controlTypes: controlTypes
      }
    },
    watch: {},
    created() {
      this.$gl.bus.$on('gl_ide_plugin_layout__modal_close', this.onClose)
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
        // this.initComponentRefs()
        // this.generateTreeNodeData()
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
        console.log('gl-ide-plugin-layout > stage > onEnd: ', args, this.properties)
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
            // that.removePropertiesInRow(rowIndex)
            that.rowItems.splice(rowIndex, 1)
          },
        });
      },
      onRowChange(e) {
        console.log('gl-ide-plugin-layout > stage > onRowChange: ', e)
      },
      onRowClone(e) {
        console.log('gl-ide-plugin-layout > stage > onRowClone: ', e)
      },
      onAddControl: function (e, fieldItems) {

        console.log('gl-ide-plugin-form-designer > stage > onAddControl() > e: ', e)
        console.log('gl-ide-plugin-form-designer > stage > onAddControl() > fieldItems: ', fieldItems)
        let item = this.getCurrentControlItem(e, fieldItems)
        // 获取已引用的实体
        let bindEntityNames = {}
        for (let key in this.properties) {
          const property = this.properties[key]
          if (property.entity) {
            bindEntityNames[property.entity] = property.entity
          }
        }

        this.$gl.bus.$emit('gl-ide-plugin-form-designer.stage.fieldSelect', this.getProperty(item.field), bindEntityNames)
        console.log('gl-ide-plugin-form-designer > stage > onAddControl() > item: ', item)
        // let item = col.items[col.items.length === e.newIndex && e.newIndex > 0 ? e.newIndex - 1 : e.newIndex]
        // this.generateComponentRef(item)
        // this.generateObjectTreeNodeAndBindEvent(item)
        // console.log('gl-ide-plugin-layout > stage > onAddControl() > this.refs: ', this.$refs)
        // console.log('gl-ide-plugin-layout > stage > onAddControl() > this.componentRefs: ', this.componentRefs)
      },
      onEndControl: function (e, fieldItems) {
        console.log('gl-ide-plugin-form-designer > stage > onEndControl() > e: ', e)
        console.log('gl-ide-plugin-form-designer > stage > onEndControl() > fieldItems: ', fieldItems)
        let item = this.getCurrentControlItem(e, fieldItems)
        console.log('gl-ide-plugin-form-designer > stage > onEndControl() > item: ', item)

        // let item = col.items[col.items.length === e.newIndex && e.newIndex > 0 ? e.newIndex - 1 : e.newIndex]
        // this.generateComponentRef(item)
        // this.generateObjectTreeNodeAndBindEvent(item)
        // console.log('gl-ide-plugin-layout > stage > onAddControl() > this.refs: ', this.$refs)
        // console.log('gl-ide-plugin-layout > stage > onAddControl() > this.componentRefs: ', this.componentRefs)
      },

      onControlChange(e, fieldItems) {
        console.log('gl-ide-plugin-form-designer > stage > onControlChange() > e: ', e)
        console.log('gl-ide-plugin-form-designer > stage > onControlChange() > fieldItems: ', fieldItems)
      },
      onControlChoose(e, fieldItems) {
        console.log('gl-ide-plugin-layout > stage > onControlChoose: ', e)
        let item = this.getCurrentControlItem(e, fieldItems)
        this.$gl.bus.$emit('gl-ide-plugin-form-designer.stage.fieldSelect', this.getProperty(item.field))
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
      getCurrentControlItem(e, fieldItems) {
        // console.log('getCurrentControlItem>', e, fieldItems)
        if (e.newIndex === undefined || e.newIndex === null) {
          // 无新增
          return fieldItems.fields[e.oldIndex]
        }
        return fieldItems.fields[fieldItems.fields.length === e.newIndex && e.newIndex > 0 ? e.newIndex - 1 : e.newIndex]
      },
      /**
       * 获取表单属性，若无属性，则直接创建
       * @param filedItem {field, control, title}
       * @return {*}
       */
      getProperty(field) {
        return this.properties[field]
      },
      getControlType(control) {
        return this.controlTypes.find(function (item) {
          return item.control === control
        })

      },
      onClose() {
        console.log('close>>>>>>>>>>>>>>>>')
        // removePropertiesInRow(rowIndex) {
        //   const that = this
        //   const row = that.rowItems[rowIndex]
        //   row.cols.forEach(function (col) {
        //     console.log('col>', JSON.stringify(col))
        //     delete that.properties[col.field]
        //   })
        // },
        const that = this
        that.rowItems.forEach(function (rowItem) {
          console.log('that.rows', that.rows)
        })
      }
    }
  }
</script>

<style scoped>
  /*.gl-dnd-control-handle {*/
  /*padding: 0 1em;*/
  /*margin: 0.25em;*/
  /*width: 99%;*/
  /*line-height: 2em;*/
  /*border: #d3d3d3 solid 1px;*/
  /*}*/

  /*.gl-dnd-control-handle i {*/
  /*margin: 0 0.5em;*/
  /*}*/

  /*.gl-dnd-control-handle:hover {*/
  /*border: #72daff solid 1px;*/
  /*}*/
</style>

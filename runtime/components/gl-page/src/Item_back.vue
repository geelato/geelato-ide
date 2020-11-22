<template>
  <div class="gl-ide-preview">
    <a-row v-for="(row,rowIndex) in rowItems" :gutter="row.gutter||gutter" :key="rowIndex" class="gl-row">
      <a-col v-for="(cell,colIndex) in row.cols" :span="cell.span" :offset="cell.offset" :key="colIndex" style="">
        <template v-if="cell.card">
          <a-card :title="getCardConfig(cell.card).title" style="margin-top: 8px">
            <component :ref="cell.card" :is="getCardComponent(cell.card)"
                       :opts="getCardConfig(cell.card).opts"
                       :params="params"
            >
              正在加载...
            </component>
          </a-card>
        </template>
        <template v-else-if="cell.rows">
          <gl-page-item :rows="cell.rows" :componentRefs="componentRefs" :bindEvents="bindEvents"
                        :gutter="gutter" :treeNodes="treeNodes" :params="params"
                        @doAction="$emit('doAction',$event)"></gl-page-item>
        </template>
        <template v-else>
          <!-- 卡片内的组件渲染  -->
          <template v-if="cell.displayMode==='Tabs'">
            <!-- 卡片内的组件渲染 --采用tabs方式  -->
            <a-tabs :defaultActiveKey="cell.opts?cell.opts.defaultActiveKey||0:0"
                    :tabPosition="cell.opts?cell.opts.tabPosition:'top'">
              <!-- 只展示非slot的组件 -->
              <a-tab-pane :forceRender="true"
                          v-for="(cellItem,colItemIndex) in cell.items.filter(item=>{ return item.displayMode!=='slot'})"
                          :tab="cellItem.title"
                          :key="colItemIndex">
                <!--v-show="cellItem.show"-->
                <component :ref="cellItem.gid" :is="$globalVue.component(cellItem.component)"
                           :gid="cellItem.gid" v-bind="cellItem.bind" :params="params"
                           @doAction="$emit('doAction',$event)"
                           v-show="cellItem.isShow===undefined||cellItem.isShow"
                           @display="(display)=>{$set(cellItem,'isShow',display.isShow)}"></component>
              </a-tab-pane>
              <!--<div class="extra-wrapper" slot="tabBarExtraContent">-->
              <!--<span v-for="extraItem in cell.opts.extraItems">-->
              <!--<gl-control :property="extraItem" :form="{}"></gl-control>-->
              <!--</span>-->
              <!--</div>-->
              <!--<div class="extra-wrapper" slot="tabBarExtraContent"-->
              <!--v-if="cell.opts.slots&&cell.opts.slots.length>0&&(currentColItem=getColItemById(cell.items,cell.opts.slots[0].name))">-->
              <!--{{cell.opts.slots}}-->
              <!--{{currentColItem}}-->
              <!--</div>-->
              <template
                  v-if="cell.opts.slots&&cell.opts.slots.length>0&&(currentColItem=getColItemById(cell.items,cell.opts.slots[0].gid))">
                <component :ref="currentColItem.gid"
                           :is="$globalVue.component(currentColItem.component)"
                           :gid="currentColItem.gid"
                           v-bind="currentColItem.bind" :params="params"
                           @doAction="$emit('doAction',$event)"
                           v-show="currentColItem.isShow===undefined||currentColItem.isShow"
                           @display="(display)=>{$set(currentColItem,'isShow',display.isShow)}"
                           slot="tabBarExtraContent" class="extra-wrapper"></component>
              </template>
              <!--<gl-toolbar v-if="cell.items.find(cellItem=>{ return cellItem.component==='GlToolbar'})"-->
              <!--class="extra-wrapper" slot="tabBarExtraContent"-->
              <!--:opts="{items:cell.items.find(cellItem=>{ return cellItem.component==='GlToolbar'})||[]}"></gl-toolbar>-->
            </a-tabs>
          </template>
          <template v-else-if="cell.displayMode==='Collapse'">
            <!-- 卡片内的组件渲染 --采用Collapse方式  -->
            <a-collapse :defaultActiveKey="cell.opts?cell.opts.defaultActiveKey||0:0">
              <a-collapse-panel :forceRender="true" v-for="(cellItem,colItemIndex) in cell.items" :header="cellItem.title"
                                :key="colItemIndex">
                <component :ref="cellItem.gid" :is="$globalVue.component(cellItem.component)"
                           :gid="cellItem.gid" v-bind="cellItem.bind" :params="params"
                           @doAction="$emit('doAction',$event)" v-show="cellItem.isShow===undefined||cellItem.isShow"
                           @display="(display)=>{$set(cellItem,'isShow',display.isShow)}"></component>
                <div class="extra-wrapper" slot="extra" style="margin-top: -.35em">
                  <a>今日</a>
                  <a>本周</a>
                  <a>本月</a>
                  <a>本年</a>
                  <a-range-picker :style="{width: '256px'}"/>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </template>
          <template v-else>
            <!-- 卡片内的组件渲染 --采用默认方式  -->
            <div v-for="(cellItem) in cell.items" :key="cellItem.gid" class="gl-cell">
              <!--v-show="cellItem.show"-->
              <!--<textarea :value="JSON.stringify(cellItem.bind)" style="width: 100%"></textarea>-->
              <!--<textarea :value="JSON.stringify(params[cellItem.gid])" style="width: 100%"></textarea>-->
              <component :ref="cellItem.gid" :is="$globalVue.component(cellItem.component)"
                         :gid="cellItem.gid" v-bind="cellItem.bind" :params="params[cellItem.gid]"
                         @doAction="$emit('doAction',$event)" v-show="cellItem.isShow===undefined||cellItem.isShow"
                         @display="(display)=>{$set(cellItem,'isShow',display.isShow)}"></component>
            </div>
          </template>
        </template>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Vue from 'vue'
  // import events from '../events'
  import EditingFileParser from '../../../EditingFileParser'

  export default {
    name: 'GlPageItem',
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
      },
      params: {
        type: Object,
        default() {
          return {}
        }
      },
    },
    data() {
      return {
        rowItems: this.rows,
        colItems: [],
        // {id:component}
        colCards: {},
        componentsDisplay: {},
        //
        currentColItem: {}
      }
    },
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
        const that = this
        if (that.treeNodes !== undefined && that.treeNodes.length > 0) {
          // 已创建，不重复创建
          return
        }
        that.rows.filter((row) => !!row.cols).forEach((row) => {
          row.cols.filter((cell) => !!cell.items).forEach((cell) => {
            // ==========item为卡片内一个组件的配置信息，例如下方所示
            // {id:'',title: '列表',icon: 'table',component: 'GlTable',bind: {opts: table, params: {}},
            //   meta: {
            //     component: 'GlIdePluginTableDesigner',
            //       title: '列表编辑器',
            //       objectTree: [{title: '查询栏', path: 'params.mix.properties'}, {title: '工具栏', path: 'toolbar.actions'}]
            //   }
            // }

            cell.items.forEach((item) => {
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
        for (const rowIndex in this.rowItems) {
          const row = this.rowItems[rowIndex]
          for (const colIndex in row.cols) {
            for (const colItemIndex in row.cols[colIndex].items) {
              this.generateComponentRef(row.cols[colIndex].items[colItemIndex])
            }
          }
        }
      },
      generateComponentRef(item) {
        console.log('gl-ide > gl-ide-plugin-item > generateComponentRef() > item:', item)
        console.log('gl-ide > gl-ide-plugin-item > generateComponentRef() > this.$refs:', this, this.$refs)
        console.log('gl-ide > gl-ide-plugin-item > generateComponentRef() > this.$refs[item.gid]:', this.$refs[item.gid], ' by item.gid:', item.gid)
        if (!this.$refs[item.gid]) {
          console.error('组件未渲染，id为:', item.gid)
        } else {
          this.componentRefs[item.gid] = {
            id: item.gid,
            component: this.$refs[item.gid][0],
            type: item.type,
            meta: item.meta
          }
        }
      },
      /**
       * 创建该组件(treeNodes)下的树节点
       * @param item 组件配置信息item
       */
      generateObjectTreeNodeAndBindEvent(item) {

        const that = this
        // 如果已存在treeNodes中，则不添加
        if (that.treeNodes.filter((node) => node.key === item.gid).length > 0) {
          console.warn('gl-ide > gl-ide-plugin-item > generateObjectTreeNodeAndBindEvent() > 已存在treeNodes中，不添加item:', item)
          return
        }
        // 加载每张卡片组件配置cardComponent
        //  {id: item.gid, component: this.$refs[item.gid][0], type: item.type, meta: item.meta}
        const cardComponent = that.componentRefs[item.gid]
        console.log('gl-ide > gl-ide-plugin-item > generateObjectTreeNodeAndBindEvent() > item.gid,cardComponent:', item.gid, cardComponent, that.componentRefs)

        // console.log('gl-ide > gl-ide-plugin-item > generateObjectTreeNodeAndBindEvent() > cardComponent:', cardComponent)
        const groups = []
        if (cardComponent && cardComponent.meta && cardComponent.meta.objectTree) {
          cardComponent.meta.objectTree.forEach((treeNodeObject) => {
            // treeNodeObject: {title:xx,path:xx.yy.zz}
            const childrenNodes = []
            const childrenObjects = eval('item.bind.opts.' + treeNodeObject.path)
            console.log('gl-ide > gl-ide-plugin-layout > generateTreeData() > childrenObjects:', cardComponent.title, childrenObjects)
            if (childrenObjects && typeof childrenObjects === 'object') {
              for (const key in childrenObjects) {
                const childObj = childrenObjects[key]
                if (childObj.control) {
                  // 未设置control值的，可能为form的隐藏属性，这里需过滤掉
                  // console.log('childObj>', childObj)
                  childrenNodes.push({
                    title: childObj.title + ' [' + childObj.control + ']',
                    // 组件id+组件内的控件id
                    key: item.gid + '_$_' + childObj.gid, // that.$gl.utils.uuid(8),
                    slots: {
                      icon: 'link'
                    }
                  })
                  // 基于配置的事件初始化绑定
                  const componentItem = that.componentRefs[item.gid]
                  const controlComponent = componentItem.component.$_getRefByGid(childObj.gid)
                  const control = {
                    gid: childObj.gid,
                    title: childObj.title,
                    component: controlComponent
                  }
                  if (controlComponent && that.events[childObj.gid]) {
                    that.editingFileParser.bindEvent(that.bindEvents, control, that.events[childObj.gid], componentItem.component)
                  }
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
            // console.log('gl-ide > gl-ide-plugin-layout > generateTreeData() > component.$refs.params:', eval('item.bind.opts.' + treeNodeObject.path))
          })
        }

        that.treeNodes.push({
          title: item.title,
          key: item.gid,
          slots: {
            icon: item.icon
          },
          children: groups
        })
      },
      getCardConfig(cardId) {
        return this.componentRefs[cardId]
      },
      getCardComponent(cardId) {
        const card = this.getCardConfig(cardId)
        console.log('...................', cardId, card, Vue.component(card.type))
        return Vue.component(card.type)
      },
      onEnd: function (e) {
        console.log('gl-ide-plugin-layout > stage > onEnd: ', e)
      },
      onRowAdd: function (e) {
        console.log('gl-ide-plugin-layout > stage > onRowAdd: ', e)
      },
      removeRow(rowIndex) {
        const that = this
        this.$confirm({
          title: '是否删除该行?',
          cancelText: '是',
          okText: '否',
          content: '',
          onOk() {
          },
          onCancel() {
            that.rowItems.splice(rowIndex, 1)
          }
        })
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
      onCardOpen(cell, item, index) {
        if (typeof item.onOpen === 'function') {
          item.onOpen({item: item, cell: cell, index: index})
        }
        this.$gl.bus.$emit(this.events.card_open, {cell: cell, item: item, index: index})
        console.log('gl-ide-plugin-layout > stage > onCardOpen: ', cell, item, index)
      },
      onColDelete(cell, item, index) {
        console.log('gl-ide-plugin-layout > stage > onColDelete: ', cell, item, index)
        this.$confirm({
          title: '是否删除该卡片内容?',
          cancelText: '是',
          okText: '否',
          content: '',
          onOk() {
          },
          onCancel() {
            cell.items.splice(index, 1)
          }
        })
      },
      // onChangeDisplay(id, data) {
      //   this.$set(this.componentsDisplay, id, data.isShow)
      //   console.log('gl-ide-plugin-layout > stage > onChangeDisplay > data:', id, data)
      // },
      // isShow(id) {
      //   if (!this.componentsDisplay[id]) {
      //     return true
      //   } else {
      //     return this.componentsDisplay[id]
      //   }
      // }
      getColItemById(items, id) {
        return items.find(item => {
          return item.gid === id
        })
      }
    }
  }
</script>

<style>
</style>

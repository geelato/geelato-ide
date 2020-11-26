<template>
  <div>
    <gl-draggable
        :list="rowItems"
        animation="700"
        handle=".gl-dnd-row-handle"
        group='layoutItems'
        :sort="true"
        @add="onRowAdd($event,rowItems)"
        @end="onRowEnd($event,rowItems)"
        @clone="onClone($event,rowItems)"
        @change="onRowChange($event,rowItems)"
    >
      <a-row v-for="(row,rowIndex) in rowItems" :gutter="row.gutter||gutter" :key="rowIndex" class="gl-dnd-row xxxx"
             :class="{'gl-selected':currentSelectObjectUid===row.gid}">
        <div class="gl-dnd-row-toolbar">
          <!--<div style="display:inline" @click="showBreadcrumbs=true">&gt;</div>-->
          <div style="display:inline" title="拖动单元格" class="gl-dnd-row-handle">
            <a-icon type="table"/>
            行
          </div>&nbsp;
          <div style="display:inline-block;float: right">
            <a-button size="small" @click="onRowDelete(rowIndex)" title="删除行" type="danger">
              <a-icon type="delete"></a-icon>
            </a-button>
          </div>
        </div>
        <a-col v-for="(cell,colIndex) in row.cols" :span="cell.span" :offset="cell.offset" :key="colIndex"
               class="gl-dnd-cell"
               :class="{'gl-selected':currentSelectObjectUid===cell.gid}">
          <div class="gl-dnd-cell-toolbar">
            <div style="display:inline" title="拖动单元格" class="gl-dnd-cell-handle">
              <a-icon type="border"/>
              单元格{{cell.displayMode==='Tabs'?'显示为【标签页】':(cell.displayMode==='Collapse'?'显示为【折叠面板】':'')}}
            </div>&nbsp;
            <div style="display:inline-block;float: right">
              <a-button size="small" @click="onComponentDelete(cell.items,cellItem,cellItemIndex)" type="danger"
                        title="删除该单元格">
                <a-icon type="delete"></a-icon>
              </a-button>
            </div>
          </div>

          <template v-if="cell.card">
            <a-card :title="getCellComponentConfig(cell.card).title" style="margin-top: 8px">
              <component :ref="cell.card" :is="getCellComponent(cell.card)"
                         v-bind="getCellComponentConfig(cell.card).bind">
                正在加载...
              </component>
            </a-card>
          </template>
          <template v-else-if="cell.rows">
            <GlIdePluginLayoutStageUIItem :rows="cell.rows" :componentRefs="componentRefs" :bindEvents="bindEvents"
                                          :gutter="gutter" :treeNodes="treeNodes"></GlIdePluginLayoutStageUIItem>
          </template>
          <template v-else>
            <gl-draggable
                :list="cell.items"
                animation="700"
                handle=".gl-dnd-handle-cell-item"
                group='card'
                :sort="true"
                @add="onCellItemAdd($event,cell)"
                @change="onCellItemChange($event,cell)"
                class="gl-dnd-wrapper-cell-item"
            >
              <div v-for="(cellItem,cellItemIndex) in cell.items" :key="cellItem.gid"
                   class="gl-cell-item-wrapper"
                   style="padding-top: 0.1em;position: relative"
                   :class="{'gl-selected':currentSelectObjectUid===cellItem.gid}">
                <template v-if="cellItem.component">
                  <div class="gl-component-item-hover-title">
                    <div style="text-align: left;display:inline" class="gl-dnd-handle-cell-item">
                      <a-icon :type="cellItem.icon"/>
                      {{cellItem.title}}{{$ide.store.assist.showComponentId?'-'+cellItem.gid:''}}
                    </div>&nbsp;
                  </div>
                  <div class="gl-component-item-breadcrumbs" v-if="showBreadcrumbs">
                    <div class="crumbs" @click="onSelectObject({currentUID:row.gid,row:row})">行</div>
                    <div class="crumbs-link">
                      <a-icon type="minus" :rotate="-45"/>
                    </div>
                    <div class="crumbs"
                         @click="onSelectObject({currentUID:cell.gid,row:row,cell:cell});onCardSettingOpen(cell,colIndex)">
                      <a-icon type="border"></a-icon>
                      单元格
                    </div>
                    <div class="crumbs-link">
                      <a-icon type="minus" :rotate="-45"/>
                    </div>
                    <div class="crumbs gl-dnd-handle-cell-item" @click="showBreadcrumbs=false" title="拖动单元格">
                      <a-icon :type="cellItem.icon"/>
                      {{cellItem.title}}{{$ide.store.assist.showComponentId?'-'+cellItem.gid:''}}
                    </div>&nbsp;
                  </div>
                  <div class="gl-component-item-toolbar" v-if="!showBreadcrumbs">
                    <div style="display:inline;margin: 0 1em 0 0;cursor: pointer" @click="showBreadcrumbs=true">
                      <a-icon type="double-left"/>
                    </div>
                    <div style="display:inline" title="拖动单元格" class="gl-dnd-handle-cell-item">
                      <a-icon :type="cellItem.icon"/>
                      {{cellItem.title}}{{$ide.store.assist.showComponentId?'-'+cellItem.gid:''}}
                    </div>&nbsp;
                    <div style="display:inline-block;float: right">
                      <!--<a-button size="small" @click="onCardReload(cell,cellItem,cellItemIndex)"-->
                      <!--title="刷新">-->
                      <!--<a-icon type="reload"/>-->
                      <!--</a-button>-->
                      <!--<a-button size="small"-->
                      <!--title="单元格设置">-->
                      <!--<a-icon type="layout" theme="filled"/>-->
                      <!--&lt;!&ndash;<span>单元格设置</span>&ndash;&gt;-->
                      <!--</a-button>-->
                      <a-button size="small" @click="onCardOpen(cell,cellItem,cellItemIndex)"
                                title="组件设置">
                        <a-icon type="setting" theme="filled"/>
                      </a-button>
                      <a-button size="small" v-if="cellItem.show!==false" @click="cellItem.show=false" title="隐藏该组件内容">
                        <a-icon type="eye-invisible"/>
                      </a-button>
                      <a-button size="small" v-if="cellItem.show===false" @click="cellItem.show=true" title="展示该组件内容">
                        <a-icon type="eye"/>
                      </a-button>
                      <a-button size="small" @click="onComponentDelete(cell.items,cellItem,cellItemIndex)" type="danger"
                                title="删除该组件">
                        <a-icon type="delete"></a-icon>
                      </a-button>
                    </div>
                  </div>
                  <!-- 组件 -->
                  <div class="gl-component-wrapper gl-dnd-handle-cell-item"
                       @click="onSelectObject({currentUID:cellItem.gid,row:row,cell:cell,cellItem:cellItem})">
                    <!--{{row.gid}}{{row.gid}}-->
                    <component :ref="cellItem.gid" v-show="cellItem.show" :is="$globalVue.component(cellItem.component)"
                               v-bind="cellItem.bind" :style="cellItem.style"></component>
                    <div v-if="!cellItem.show" style="text-align: center;font-size: 3em;background-color: #f0f0f0">
                      <a-icon :type="cellItem.icon" @click="cellItem.show=true" title="点击展示该组件内容"/>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <!-- 容器 -->
                  <div class="gl-container-wrapper">
                    <a-tabs v-if="cellItem.type==='Tabs'" :default-active-key="0" type="editable-card"
                            @edit="(targetKey, action)=>{onTabsEdit(targetKey, action,cellItem)}">
                      <a-tab-pane :tab="tabItem.title" v-for="(tabItem,tabItemIndex) in cellItem.items"
                                  :key="tabItemIndex">
                        <gl-draggable
                            :list="tabItem.items"
                            animation="700"
                            handle=".gl-dnd-handle-cell-item"
                            group='card'
                            :sort="true"
                            @add="onContainerAdd($event,tabItem)"
                            @change="onCellItemChange"
                            class="gl-dnd-panel-wrapper"
                        >
                          <div v-for="(panel,panelIndex) in tabItem.items" :key="panel.gid"
                               class="gl-container-item-wrapper"
                               style="padding-top: 0.1em;position: relative" :style="panel.style"
                               :class="{'gl-selected':currentSelectObjectUid===panel.gid}">
                            <div class="gl-component-item-hover-title">
                              <div style="text-align: left;display:inline" class="gl-dnd-handle-cell-item">
                                <a-icon :type="panel.icon"/>
                                {{panel.title}}{{$ide.store.assist.showComponentId?'-'+panel.gid:''}}
                              </div>&nbsp;
                            </div>
                            <div class="gl-component-item-breadcrumbs" v-if="showBreadcrumbs">
                              <div class="crumbs" @click="onSelectObject({currentUID:row.gid,row:row})">行</div>
                              <div class="crumbs-link">
                                <a-icon type="minus" :rotate="-45"/>
                              </div>
                              <div class="crumbs"
                                   @click="onSelectObject({currentUID:cell.gid,row:row,cell:cell});onCardSettingOpen(cell,colIndex)">
                                <a-icon type="border"></a-icon>
                                单元格
                              </div>
                              <div class="crumbs-link">
                                <a-icon type="minus" :rotate="-45"/>
                              </div>
                              <div class="crumbs gl-dnd-handle-cell-item" @click="showBreadcrumbs=false" title="拖动单元格">
                                <a-icon :type="panel.icon"/>
                                {{panel.title}}{{$ide.store.assist.showComponentId?'-'+panel.gid:''}}
                              </div>&nbsp;
                            </div>
                            <div class="gl-component-item-toolbar" v-if="!showBreadcrumbs">
                              <div style="display:inline;margin: 0 1em 0 0;cursor: pointer"
                                   @click="showBreadcrumbs=true">
                                <a-icon type="double-left"/>
                              </div>
                              <div style="display:inline" title="拖动单元格" class="gl-dnd-handle-cell-item">
                                <a-icon :type="panel.icon"/>
                                {{panel.title}}{{$ide.store.assist.showComponentId?'-'+panel.gid:''}}
                              </div>&nbsp;
                              <div style="display:inline-block;float: right">
                                <a-button size="small" @click="onCardOpen(cell,panel,panelIndex)"
                                          title="组件设置">
                                  <a-icon type="setting" theme="filled"/>
                                </a-button>
                                <a-button size="small" v-if="panel.show!==false" @click="panel.show=false"
                                          title="隐藏该组件内容">
                                  <a-icon type="eye-invisible"/>
                                </a-button>
                                <a-button size="small" v-if="panel.show===false" @click="panel.show=true"
                                          title="展示该组件内容">
                                  <a-icon type="eye"/>
                                </a-button>
                                <a-button size="small" @click="onComponentDelete(tabItem.items,panel,panelIndex)"
                                          type="danger"
                                          title="删除该组件">
                                  <a-icon type="delete"></a-icon>
                                </a-button>
                              </div>
                            </div>
                            <div class="gl-component-wrapper gl-dnd-handle-cell-item" style="min-height: 4em"
                                 @click="onSelectObject({currentUID:panel.gid,row:row,cell:cell,cellItem:panel,container:''})">
                              <component :ref="panel.gid" v-show="panel.show"
                                         :is="$globalVue.component(panel.component)"
                                         v-bind="panel.bind"></component>
                              <div v-if="!panel.show" class="gl-component-hidden-placeholder">
                                <a-icon :type="panel.icon" @click="panel.show=true" title="点击展示该组件内容"/>
                              </div>
                            </div>
                          </div>
                          <div class="gl-dnd-panel-placeholder" v-if="tabItem.items.length===0">{拖入组件}</div>
                        </gl-draggable>
                      </a-tab-pane>
                      <!--插槽 slots-->
                      <div style="display: inline-block" slot="tabBarExtraContent">
                        <gl-draggable
                            :list="cellItem.slots"
                            animation="700"
                            handle=".gl-dnd-handle-cell-item"
                            group='card'
                            :sort="true"
                            @add="onAddSlot($event,cellItem)"
                            @change="onCellItemChange"
                            class="gl-dnd-slot-wrapper"
                        >
                          <div v-for="(slot,slotIndex) in cellItem.slots" :key="slot.gid"
                               class="gl-slot-item-wrapper"
                               style="padding-top: 0.1em;position: relative"
                               :class="{'gl-selected':currentSelectObjectUid===slot.gid}">
                            <div class="gl-component-item-hover-title">
                              <div style="text-align: left;display:inline" class="gl-dnd-handle-cell-item">
                                <a-icon :type="slot.icon"/>
                                {{slot.title}}{{$ide.store.assist.showComponentId?'-'+slot.gid:''}}
                              </div>&nbsp;
                            </div>
                            <div class="gl-component-item-breadcrumbs" v-if="showBreadcrumbs">
                              <div class="crumbs" @click="onSelectObject({currentUID:row.gid,row:row})">行</div>
                              <div class="crumbs-link">
                                <a-icon type="minus" :rotate="-45"/>
                              </div>
                              <div class="crumbs"
                                   @click="onSelectObject({currentUID:cell.gid,row:row,cell:cell});onCardSettingOpen(cell,colIndex)">
                                <a-icon type="border"></a-icon>
                                单元格
                              </div>
                              <div class="crumbs-link">
                                <a-icon type="minus" :rotate="-45"/>
                              </div>
                              <div class="crumbs gl-dnd-handle-cell-item" @click="showBreadcrumbs=false" title="拖动单元格">
                                <a-icon :type="slot.icon"/>
                                {{slot.title}}{{$ide.store.assist.showComponentId?'-'+slot.gid:''}}
                              </div>&nbsp;
                            </div>
                            <div class="gl-component-item-toolbar" v-if="!showBreadcrumbs">
                              <!--Tab插槽只需要展示这部分操作即可-->
                              <div style="display:inline-block;float: right">
                                <a-button size="small" @click="onCardOpen(cell,slot,slotIndex)"
                                          title="组件设置">
                                  <a-icon type="setting" theme="filled"/>
                                </a-button>
                                <a-button size="small" @click="onComponentDelete(cellItem.slots,slot,slotIndex)"
                                          type="danger"
                                          title="删除该组件">
                                  <a-icon type="delete"></a-icon>
                                </a-button>
                              </div>
                            </div>
                            <div class="gl-component-wrapper gl-dnd-handle-cell-item"
                                 @click="onSelectObject({currentUID:slot.gid,row:row,cell:cell,cellItem:slot})">
                              <component :ref="slot.gid" v-show="slot.show" :is="$globalVue.component(slot.component)"
                                         v-bind="slot.bind" :style="slot.style"></component>
                              <div v-if="!slot.show" style="text-align: center;font-size: 3em">
                                <a-icon :type="slot.icon" @click="slot.show=true" title="点击展示该组件内容"/>
                              </div>
                            </div>
                          </div>
                          <div class="gl-dnd-slot-placeholder" v-if="cellItem.slots.length===0">
                            { 拖入组件 }
                          </div>
                        </gl-draggable>
                      </div>
                    </a-tabs>
                  </div>
                </template>
              </div>
              <div class="gl-dnd-placeholder" v-if="cell.items.length===0">{ 拖入组件或布局容器 }</div>
              <!--<div v-if="rowItems.length===1&&(!cell.items||cell.items.length===0)"-->
              <!--style="text-align: center;padding-top:.2em">-->
              <!--从左边【组件】栏目拖动组件到此。-->
              <!--</div>-->
            </gl-draggable>
          </template>
        </a-col>
        <!--<div class="gl-dnd-row-toolbar" @click="onRowDelete(rowIndex)" title="删除行">-->
        <!--<a-icon type="close-circle" theme="twoTone" twoToneColor="#f5222d"/>-->
        <!--</div>-->
      </a-row>
      <div v-if="!rowItems||rowItems.length===0" style="text-align: center;padding-top: 1em">
        从左边【布局】栏目中拖动布局行列到该区域，再从【组件】栏目拖动组件到布局行列中。
      </div>
    </gl-draggable>
    <div v-if="modalVisible">
      <a-modal class="gl-card-designer" :title="modalTitle" centered :width="modalWidth" v-model="modalVisible"
               @ok="() => modalVisible = false" @cancel="onCloseModal" okText="保存" cancelText="取消"
               :maskClosable="false">
        <component :is="$globalVue.component(currentSelectedCardItem.meta.designer)"
                   v-bind="currentSelectedCardItem.bind"></component>
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
  import EditingFileParser from '../../../../runtime/EditingFileParser'
  import Vue from 'vue'
  import events from '../../../gl-ide/src/events'

  export default {
    name: "GlIdePluginLayoutStageUIItem",
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
        color: '#FFF',
        modalVisible: false,
        modalTitle: '&nbsp;',
        modalWidthPercentDefault: .98,
        modalWidthPercent: this.modalWidthPercentDefault,
        // modalWidth: (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * this.modalWidthPercent,
        currentSelectedRow: {},
        // 一个单元格对应一个col
        currentSelectedCard: {},
        // 单元格内的项，即表单、列表等组件
        currentSelectedCardItem: {},
        rowItems: this.rows,
        cellItems: [],
        // {id:component}
        colCards: {},
        // currentCardId: '',
        currentSelectObjectUid: '',
        showBreadcrumbs: false
      }
    },
    computed: {
      modalWidth: function () {
        return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * this.modalWidthPercent
      }
    },
    watch: {
      'rowItems.length'(val, oval) {
      }
    },
    mounted() {
      this.reset()
    },
    created() {
      this.$gl.bus.$on(events.ide_setting_switch_panel, this.onSettingSwitchPanel)
    },
    destroyed() {
      this.$gl.bus.$off(events.ide_setting_switch_panel, this.onSettingSwitchPanel)
    },
    methods: {
      onSettingSwitchPanel({panel}) {
        console.log('panel:', panel, this.currentSelectObjectUid, this.currentSelectedCard, this.currentSelectedCardItem)
        if (panel.name === "GlIdePluginLayoutCardSettings") {
          this.currentSelectObjectUid = this.currentSelectedCard.gid
        } else if (panel.name === "GlIdePluginLayoutSegmentSettings") {
          this.currentSelectObjectUid = this.currentSelectedCardItem.gid
        }
      },
      reset() {
        this.editingFileParser = new EditingFileParser().init(this.$root)
        this.initComponentRefs()
        this.generateTreeNodeData()
      },
      /**
       * 初始化创建树节点
       */
      generateTreeNodeData() {
        let that = this
        if (that.treeNodes !== undefined && that.treeNodes.length > 0) {
          // 已创建，不重复创建
          console.warn('已创建，不重复创建')
          return;
        }
        that.rows.filter((row) => !!row.cols).forEach((row) => {
          that.generateRowNodeAndBindEvent(row)
          row.cols.filter((cell) => !!cell.items).forEach((cell) => {
            // ==========item为单元格内一个组件的配置信息，例如下方所示
            // {id:'',title: '列表',icon: 'table',component: 'GlTable',bind: {opts: table, query: {}},
            //   meta: {
            //     component: 'GlIdePluginTableDesigner',
            //       title: '列表设计器',
            //       objectTree: [{title: '查询栏', path: 'query.mix.properties'}, {title: '工具栏', path: 'toolbar.actions'}]
            //   }
            // }
            cell.items.forEach((cellItem) => {
              if (cellItem.component) {
                that.generateComponentNodeAndBindEvent(cell, cellItem)
              } else {
                // tab panel
                cellItem.items.forEach((panel) => {
                  that.generateContainerNodeAndBindEvent(cell, cellItem)
                  panel.items.forEach((component) => {
                    that.generateContainerPanelNodeAndBindEvent(cellItem, panel)
                    that.generateComponentNodeAndBindEvent(cellItem, component)
                  })
                })
              }
            })
          })
        })
        console.log('gl-ide > gl-ide-plugin-layout-item> generateTreeData() > componentRefs:', this.componentRefs)
      },
      /**
       * 初始化组件树中的组件引用
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
        if (!item.gid || !item.component) {
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
        console.log('gl-ide > gl-ide-plugin-layout-item> generateComponentRef() > item:', item)
        console.log('gl-ide > gl-ide-plugin-layout-item> generateComponentRef() > this.$refs:', this.$refs)
        console.log('gl-ide > gl-ide-plugin-layout-item> generateComponentRef() > this.$refs[item.gid]:', this.$refs[item.gid])
        this.componentRefs[item.gid] = {
          id: item.gid,
          component: this.$refs[item.gid][0],
          type: item.type,
          bind: item.bind,
          meta: item.meta
        }
      },
      /**
       * 创建该组件(treeNodes)下的树节点
       * @param parent 父节点
       * @param item 组件配置信息item
       */
      generateComponentNodeAndBindEvent(parentItem, item) {
        let that = this
        let parentNode = that.findTreeNode(parentItem.gid)
        console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > parentItem,parentNode:', parentItem, parentNode)

        let node = that.findTreeNode(item.gid) || {
          title: item.title,
          key: item.gid,
          slots: {
            icon: item.icon,
          },
          children: [],
          _component: ''
        }
        parentNode.children.push(node)
        let groups = node.children

        // 加载每个单元格内的组件
        //  {id: item.gid, component: this.$refs[item.gid][0], type: item.type, meta: item.meta}
        let cardComponent = that.componentRefs[item.gid]
        console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > item.gid,cardComponent:', item.gid, cardComponent, that.componentRefs)
        if (cardComponent && cardComponent.meta && cardComponent.meta.objectTree) {
          node._component = cardComponent.meta.component
          cardComponent.meta.objectTree.forEach((treeNodeObject) => {
            // treeNodeObject: {title:xx,path:xx.yy.zz}
            let group = groups.find(group => group.key === treeNodeObject.path)
            console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > find group:', treeNodeObject.path, ' and result:', group)
            if (!group) {
              group = {
                title: treeNodeObject.title + '[组]',
                key: treeNodeObject.path,
                disabled: true,
                slots: {
                  icon: 'folder',
                },
                children: []
              }
              groups.push(group)
            }
            let childNodes = group.children
            // childObjects 为简单对象或数组
            let childObjects = eval('item.bind.opts.' + treeNodeObject.path)
            console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > card title, childObjects:', cardComponent.meta.title, childObjects, treeNodeObject.path)
            if (childObjects && typeof childObjects === "object") {
              // stepA 为对象树添加，找已有的对象树中，是否存在控件，没有则添加
              for (let key in childObjects) {
                let childObj = childObjects[key]
                console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > key, gid, childObj:', key, childObj.gid, childObj)
                if (childObj.control) {
                  // 未设置control值的，可能为form的隐藏属性，这里需过滤掉
                  let foundChildrenNode = childNodes.find((childNode) => childNode.key === item.gid + '_$_' + childObj.gid)
                  let foundChildrenNodeTitle = childObj.title + ' [' + childObj.control + ']'
                  console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > find control:', childObj.gid, ' and result:', foundChildrenNode)
                  if (!foundChildrenNode) {
                    console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > add control:', foundChildrenNodeTitle)
                    childNodes.push({
                      title: foundChildrenNodeTitle,
                      // 组件id+组件内的控件id
                      key: item.gid + '_$_' + childObj.gid, // that.$gl.utils.uuid(16),
                      slots: {
                        icon: 'link',
                      }
                    })
                  }
                  // 基于配置的事件初始化绑定
                  let componentItem = that.componentRefs[item.gid]
                  let controlComponent = componentItem.component.$_getRefByGid(childObj.gid)
                  let control = {
                    gid: childObj.gid,
                    title: childObj.title,
                    component: controlComponent
                  }
                  if (controlComponent && that.events[childObj.gid]) {
                    that.editingFileParser.bindEvent(that.bindEvents, control, that.events[childObj.gid], controlComponent.$parent)
                  }
                } else {
                  console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > 未设置control值：', childObj)
                }
              }
              // stepB 从对象树删除多余的控件
              childNodes.forEach((childNode, index) => {
                // 是个数组
                let childObjectIndex = 0
                let found = false
                for (let key in childObjects) {
                  let childObject = childObjects[key]
                  if (childNode.key === item.gid + '_$_' + childObject.gid) {
                    found = true
                    break
                  }
                  childObjectIndex++
                }
                if (!found) {
                  console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > find invalid control and delete：', childNode)
                  childNodes.splice(childObjectIndex, 1)
                }
              })
            }
          })
        }

        console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > treeNodes result:', that.treeNodes)
      },

      generateContainerNodeAndBindEvent(parentItem, container) {
        let that = this
        let parentNode = that.findTreeNode(parentItem.gid)
        let node = that.findTreeNode(container.gid) || {
          title: container.title,
          key: container.gid,
          disabled: true,
          slots: {
            icon: 'folder',
          },
          children: [],
        }
        parentNode.children.push(node)
      },

      generateContainerPanelNodeAndBindEvent(parentItem, panel) {
        let that = this
        let parentNode = that.findTreeNode(parentItem.gid)
        let node = that.findTreeNode(panel.gid) || {
          title: panel.title,
          key: panel.gid,
          disabled: true,
          slots: {
            icon: 'folder',
          },
          children: [],
        }
        parentNode.children.push(node)
      },

      generateRowNodeAndBindEvent(row) {
        let that = this
        let node = that.findTreeNode(row.gid) || {
          title: row.title,
          key: row.gid,
          disabled: true,
          slots: {
            icon: 'folder',
          },
          children: [],
        }
        that.treeNodes.push(node)
        row.cols.forEach((cell) => {
          that.generateCellNodeAndBindEvent(row, cell)
        })
      },
      generateCellNodeAndBindEvent(row, cell) {
        let rowNode = this.findTreeNode(row.gid)
        let group = {
          title: cell.title || '单元格',
          key: cell.gid,
          disabled: true,
          slots: {
            icon: 'folder',
          },
          children: []
        }
        rowNode.children.push(group)
      },
      // 递归查找树节点
      findTreeNode(gid) {
        return function recursionFindTreeNode(nodes, gid) {
          if (!nodes || nodes.length === 0) {
            return
          }

          for (let index in nodes) {
            let node = nodes[index]
            if (node.key === gid) {
              return node
            } else {
              if (node.children && node.children.length > 0) {
                let foundNode = recursionFindTreeNode(node.children, gid)
                if (foundNode) {
                  return foundNode
                }
              }
            }
          }
        }(this.treeNodes, gid)
      },
      /**
       * 移除objectTree相应的节点
       * @param gid 节点key
       */
      removeObjectTreeNode(gid) {
        return function removeObjectTreeNode(nodes, gid) {
          if (!nodes || nodes.length === 0) {
            return
          }
          for (let index in nodes) {
            let node = nodes[index]
            console.log('removeObjectTreeNode>', node.key, gid, node.key === gid)
            if (node.key === gid) {
              nodes.splice(index, 1)
              return node
            } else {
              if (node.children && node.children.length > 0) {
                let foundNode = removeObjectTreeNode(node.children, gid)
                if (foundNode) {
                  return foundNode
                }
              }
            }
          }
        }(this.treeNodes, gid)
      },
      saveCardComponent(e) {
        console.log('saveCardComponent>', e)
      },

      onCloseModal(e) {
        this.modalVisible = false
        this.modalWidthPercent = this.modalWidthPercentDefault
        this.$gl.bus.$emit('gl_ide_plugin_layout__modal_close')
        this.onCardReload(this.currentSelectedCardItem)
      },
      /**
       * card 对应 cell
       */
      onCardOpen(cell, item, index) {
        console.log('gl-ide-plugin-layout > UIItem > onCardOpen() > item:', item)
        if (item.meta) {
          this.modalTitle = item.meta.title
          this.currentSelectedCardItem = item
          this.modalWidthPercent = item.meta.modalWidthPercent || this.modalWidthPercentDefault
        }
        this.modalVisible = true
      },

      onCardSettingOpen(cell) {
        console.log('gl-ide-plugin-layout > UIItem > onCardSettingOpen>', cell)
        this.currentSelectedCard = cell
        this.$gl.bus.$emit(events.ide_setting_open, {panelName: 'GlIdePluginLayoutCardSettings', config: cell})
      },
      onCardSettingUpdate(cell) {
        console.log('gl-ide-plugin-layout > UIItem > onCardSettingUpdate>', cell)
        this.currentSelectedCard = cell
        this.$gl.bus.$emit(events.ide_setting_update, {panelName: 'GlIdePluginLayoutCardSettings', config: cell})
      },
      getCellComponentConfig(cardId) {
        return this.componentRefs[cardId]
      },
      getCellComponent(cardId) {
        let card = this.getCellComponentConfig(cardId)
        return Vue.component(card.type)
      },
      onRowEnd: function (args, rowItems) {
        console.log('gl-ide-plugin-layout > UIItem > onRowEnd: ', args, rowItems, rowItems[rowItems.length === 1 ? 0 : args.newIndex])
      },
      onRowAdd: function (args, rowItems) {
        console.log('gl-ide-plugin-layout > UIItem > onRowAdd: ', args, rowItems, rowItems[rowItems.length === 1 ? 0 : args.newIndex], rowItems.length)
        let that = this
        let row = rowItems[rowItems.length === 1 ? 0 : args.newIndex]
        row.gid = that.$gl.utils.uuid(16)
        row.cols.forEach(cell => {
          cell.gid = that.$gl.utils.uuid(16)
        })
        this.generateRowNodeAndBindEvent(row)
      },
      onRowDelete(rowIndex) {
        let that = this
        this.$confirm({
          title: '是否删除该行?',
          cancelText: '是',
          okText: '否',
          content: '',
          onOk() {
          },
          onCancel() {
            // 先清除引用
            that.rowItems[rowIndex].cols.forEach(cell => {
              cell.items.forEach(item => {
                delete that.componentRefs[item.gid]
                that.removeObjectTreeNode(item.gid)
                console.log('gl-ide-plugin-layout > UIItem > onRowDelete() > remove componentRef: ', item.gid)
              })
            })
            that.rowItems.splice(rowIndex, 1)
          },
        });
      },
      onRowChange(e) {
        console.log('gl-ide-plugin-layout > UIItem > onRowChange: ', e)
      },
      onRowClone(e) {
        console.log('gl-ide-plugin-layout > UIItem > onRowClone: ', e)
      },
      // 单元格内加组件或容器
      onCellItemAdd: function (e, cell) {
        let that = this
        console.log('gl-ide-plugin-layout > UIItem > onCellItemAdd() > event.newIndex: ', e.newIndex)
        console.log('gl-ide-plugin-layout > UIItem > onCellItemAdd() > items: ', cell.items)
        let item = cell.items[cell.items.length === e.newIndex && e.newIndex > 0 ? e.newIndex - 1 : e.newIndex]


        if (!item.component) {
          // 若添加的为容器
          console.log('gl-ide-plugin-layout > UIItem > onCellItemAdd() > !item.component. e,item:', e, item)
          // 构建对象树
          item.gid = item.gid || this.$gl.utils.uuid(16)
          that.generateContainerNodeAndBindEvent(cell, item)

          item.items.forEach((panel) => {
            panel.gid = panel.gid || this.$gl.utils.uuid(16)
            panel.items.forEach((component) => {
              that.generateContainerPanelNodeAndBindEvent(item, panel)
              // that.generateComponentNodeAndBindEvent(cellItem, component)
            })
          })
        }else{
          // 若添加的为组件
          this.generateComponentRef(item)
          this.generateComponentNodeAndBindEvent(cell, item)
        }
        console.log('gl-ide-plugin-layout > UIItem > onCellItemAdd() > item: ', item)
        console.log('gl-ide-plugin-layout > UIItem > onCellItemAdd() > this.refs: ', this.$refs)
        console.log('gl-ide-plugin-layout > UIItem > onCellItemAdd() > this.componentRefs: ', this.componentRefs)
      },
      // 容器内添加组件
      onContainerAdd(e, tab) {
        let item = tab.items[tab.items.length === e.newIndex && e.newIndex > 0 ? e.newIndex - 1 : e.newIndex]
        this.generateComponentRef(item)
        this.generateComponentNodeAndBindEvent(tab, item)
      },
      onAddSlot(e, item) {

      },
      onCellItemChange(e, cell) {
        console.log('gl-ide-plugin-layout > UIItem > onCellItemChange: ', e, cell)
        // 在移动时，先清除该树节点
        if (e.added && e.added.element && e.added.element.gid) {
          this.removeObjectTreeNode(e.added.element.gid)
        }
      },
      onCellChoose(e) {
        console.log('gl-ide-plugin-layout > UIItem > onCellChoose: ', e)
      },
      // onColDelete(cell, item, index) {
      //   console.log('gl-ide-plugin-layout > UIItem > onColDelete: ', cell, item, index)
      //   let that = this
      //   this.$confirm({
      //     title: '是否删除该单元格内容?',
      //     cancelText: '是',
      //     okText: '否',
      //     content: '',
      //     onOk() {
      //     },
      //     onCancel() {
      //       cell.items.splice(index, 1);
      //       delete that.componentRefs[item.gid]
      //       that.removeObjectTreeNode(item.gid)
      //       console.log('gl-ide-plugin-layout > UIItem > onColDelete() > this.componentRefs: ', that.componentRefs)
      //     },
      //   });
      // },
      // 容器内的项、tab内的项、slot内的项
      onComponentDelete(items, item, index, confirmTitle) {
        console.log('gl-ide-plugin-layout > UIItem > onItemDelete: ', items, item, index)
        let that = this
        this.$confirm({
          title: confirmTitle || '是否删除?',
          cancelText: '是',
          okText: '否',
          content: '',
          onOk() {
          },
          onCancel() {
            items.splice(index, 1);
            delete that.componentRefs[item.gid]
            that.removeObjectTreeNode(item.gid)
            console.log('gl-ide-plugin-layout > UIItem > onComponentDelete() > this.componentRefs: ', that.componentRefs)
          },
        });
      },
      // onSlotDelete(cellItem, slot, index) {
      //   console.log('gl-ide-plugin-layout > UIItem > onColDelete: ', cellItem, slot, index)
      //   let that = this
      //   this.$confirm({
      //     title: '是否删除该插槽?',
      //     cancelText: '是',
      //     okText: '否',
      //     content: '',
      //     onOk() {
      //     },
      //     onCancel() {
      //       cellItem.slots.splice(index, 1);
      //       delete that.componentRefs[slot.gid || slot.gid]
      //       that.removeObjectTreeNode(slot.gid)
      //       console.log('gl-ide-plugin-layout > UIItem > onColDelete() > this.componentRefs: ', that.componentRefs)
      //     },
      //   });
      // },
      onCardReload(item) {
        console.log('gl-ide-plugin-layout > UIItem > onCardReload() > item: ', item)
        // 重新创建引用、绑定事件
        this.generateComponentRef(item)
        this.generateComponentNodeAndBindEvent(item)
        // 重绘单元格
        console.log('..................', this.$refs[item.gid][0].name, typeof this.$refs[item.gid][0].refresh)
        if (typeof this.$refs[item.gid][0].refresh === 'function') {
          this.$refs[item.gid][0].refresh()
        }
        item.show = !item.show
        this.$nextTick(() => {
          item.show = !item.show
        })
      },
      onComponentSettingOpen(component) {
        this.currentSelectedCardItem = component
        this.$gl.bus.$emit(events.ide_setting_open, {panelName: 'GlIdePluginLayoutSegmentSettings', config: component})
      },
      onComponentSettingUpdate(component) {
        console.log('gl-ide-plugin-layout > UIItem > onComponentSettingUpdate>', component)
        this.currentSelectedCardItem = component
        this.$gl.bus.$emit(events.ide_setting_update, {
          panelName: 'GlIdePluginLayoutSegmentSettings',
          config: component
        })
      },
      onRowSettingOpen(row) {

      },
      onRowSettingUpdate(row) {
        this.currentSelectedRow = row
      },
      /**
       * @param currentUID 当前选择对象的UID，如行、单元格、组件、字段等对象ID
       * @param row 选择的行，若选择了row，则col及cellItem为空
       * @param cell 选择的单元格(列、格)，若选择了col，则cellItem为空
       * @param cellItem 选择的组件
       */
      onSelectObject({currentUID, row, cell, cellItem}) {
        console.log('{currentUID, row, cell, cellItem}>', {currentUID, row, cell, cellItem})
        this.currentSelectObjectUid = currentUID

        this.onRowSettingUpdate(row)
        this.onCardSettingUpdate(cell)
        this.onComponentSettingUpdate(cellItem)

        if (cellItem) {
          this.onComponentSettingOpen(cellItem)
        } else if (cell) {
          this.onCardSettingOpen(cell)
        } else if (row) {
          this.onRowSettingOpen(row)
        }
        this.showBreadcrumbs = false
      },
      onTabsEdit(targetKey, action, tabs) {
        console.log(targetKey, action, tabs)
        if (action === 'add') {
          tabs.items.push({title: '新标签页', items: []})
        } else if (action === 'remove') {
          if (tabs.items.length > 1) {
            tabs.items.splice(targetKey, 1)
          } else {
            this.$message.warn('无法删除，至少需保留一个')
          }
        }
      },
    }
  }
</script>

<style>

</style>

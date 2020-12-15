<template>
  <div>
    <gl-draggable
        :list="rowItems"
        animation="700"
        handle=".gl-dnd-row-handle"
        group='layoutItems'
        :sort="true"
        @add="onRowAdd($event,rowItems)"
    >
      <a-row v-for="(row,rowIndex) in rowItems" :gutter="row.gutter||gutter" :key="rowIndex" class="gl-dnd-row xxxx"
             :class="{'gl-selected':currentSelectObjectUid===row.gid}">
        <div class="gl-dnd-row-toolbar">
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
              <a-button size="small" @click="onCellClear(cell)" type="danger"
                        title="清空该单元格">
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
                  <!-- 单元格内该项为组件 -->
                  <!--组件工具条-->
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
                         @click="onSelectObject({currentUID:cell.gid,row:row,cell:cell});onCellSettingOpen(cell,colIndex)">
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
                      <a-button size="small" @click="onComponentDesignerOpen(cell,cellItem,cellItemIndex)"
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
                       @click="onSelectObject({currentUID:cellItem.gid,row:row,cell:cell,component:cellItem})">
                    <component :ref="cellItem.gid" v-show="cellItem.show" :is="$globalVue.component(cellItem.component)"
                               v-bind="cellItem.bind" :style="cellItem.style"></component>
                    <div v-if="!cellItem.show" style="text-align: center;font-size: 3em;background-color: #f0f0f0">
                      <a-icon :type="cellItem.icon" @click="cellItem.show=true" title="点击展示该组件内容"/>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <!-- 单元格内该项为容器 -->
                  <div class="gl-container-wrapper">
                    <a-tabs v-if="cellItem.type==='Tabs'" :default-active-key="0" type="editable-card"
                            @edit="(targetKey, action)=>{onTabsEdit(targetKey, action,cellItem)}">
                      <a-tab-pane :tab="panel.title" v-for="(panel,panelIndex) in cellItem.items"
                                  :key="panelIndex">
                        <gl-draggable
                            :list="panel.items"
                            animation="700"
                            handle=".gl-dnd-handle-cell-item"
                            group='card'
                            :sort="true"
                            @add="onContainerPanelComponentAdd($event,panel)"
                            @change="onContainerPanelComponentChange($event,panel)"
                            class="gl-dnd-panel-wrapper"
                        >
                          <div v-for="(component,componentIndex) in panel.items" :key="component.gid"
                               class="gl-container-item-wrapper"
                               style="padding-top: 0.1em;position: relative" :style="component.style"
                               :class="{'gl-selected':currentSelectObjectUid===component.gid}">
                            <div class="gl-component-item-hover-title">
                              <div style="text-align: left;display:inline" class="gl-dnd-handle-cell-item">
                                <a-icon :type="component.icon"/>
                                {{component.title}}{{$ide.store.assist.showComponentId?'-'+component.gid:''}}
                              </div>&nbsp;
                            </div>
                            <div class="gl-component-item-breadcrumbs" v-if="showBreadcrumbs">
                              <div class="crumbs" @click="onSelectObject({currentUID:row.gid,row:row})">行</div>
                              <div class="crumbs-link">
                                <a-icon type="minus" :rotate="-45"/>
                              </div>
                              <div class="crumbs"
                                   @click="onSelectObject({currentUID:cell.gid,row:row,cell:cell});onCellSettingOpen(cell,colIndex)">
                                <a-icon type="border"></a-icon>
                                单元格
                              </div>
                              <div class="crumbs-link">
                                <a-icon type="minus" :rotate="-45"/>
                              </div>
                              <div class="crumbs gl-dnd-handle-cell-item" @click="showBreadcrumbs=false" title="拖动单元格">
                                <a-icon :type="component.icon"/>
                                {{component.title}}{{$ide.store.assist.showComponentId?'-'+component.gid:''}}
                              </div>&nbsp;
                            </div>
                            <div class="gl-component-item-toolbar" v-if="!showBreadcrumbs">
                              <div style="display:inline;margin: 0 1em 0 0;cursor: pointer"
                                   @click="showBreadcrumbs=true">
                                <a-icon type="double-left"/>
                              </div>
                              <div style="display:inline" title="拖动单元格" class="gl-dnd-handle-cell-item">
                                <a-icon :type="component.icon"/>
                                {{component.title}}{{$ide.store.assist.showComponentId?'-'+component.gid:''}}
                              </div>&nbsp;
                              <div style="display:inline-block;float: right">
                                <a-button size="small" @click="onComponentDesignerOpen(cell,component,componentIndex)"
                                          title="组件设置">
                                  <a-icon type="setting" theme="filled"/>
                                </a-button>
                                <a-button size="small" v-if="component.show!==false" @click="component.show=false"
                                          title="隐藏该组件内容">
                                  <a-icon type="eye-invisible"/>
                                </a-button>
                                <a-button size="small" v-if="component.show===false" @click="component.show=true"
                                          title="展示该组件内容">
                                  <a-icon type="eye"/>
                                </a-button>
                                <a-button size="small" @click="onComponentDelete(panel.items,component,componentIndex)"
                                          type="danger"
                                          title="删除该组件">
                                  <a-icon type="delete"></a-icon>
                                </a-button>
                              </div>
                            </div>
                            <div class="gl-component-wrapper gl-dnd-handle-cell-item" style="min-height: 4em"
                                 @click="onSelectObject({currentUID:component.gid,row:row,cell:cell,component:component})">
                              <component :ref="component.gid" v-show="component.show"
                                         :is="$globalVue.component(component.component)"
                                         v-bind="component.bind"></component>
                              <div v-if="!component.show" class="gl-component-hidden-placeholder">
                                <a-icon :type="component.icon" @click="component.show=true" title="点击展示该组件内容"/>
                              </div>
                            </div>
                          </div>
                          <div class="gl-dnd-panel-placeholder" v-if="panel.items.length===0"
                               @click="onSelectObject({currentUID:cell.gid,row:row,cell:cell})">{拖入组件}
                          </div>
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
                            @add="onContainerSlotComponentAdd($event,cellItem)"
                            @change="onContainerSlotComponentChange($event,cellItem)"
                            class="gl-dnd-slot-wrapper"
                        >
                          <div v-for="(slotComponent,slotComponentIndex) in cellItem.slots" :key="slotComponent.gid"
                               class="gl-slot-item-wrapper"
                               style="padding-top: 0.1em;position: relative"
                               :class="{'gl-selected':currentSelectObjectUid===slotComponent.gid}">
                            <div class="gl-component-item-hover-title">
                              <div style="text-align: left;display:inline" class="gl-dnd-handle-cell-item">
                                <a-icon :type="slotComponent.icon"/>
                                {{slotComponent.title}}{{$ide.store.assist.showComponentId?'-'+slotComponent.gid:''}}
                              </div>&nbsp;
                            </div>
                            <div class="gl-component-item-breadcrumbs" v-if="showBreadcrumbs">
                              <div class="crumbs" @click="onSelectObject({currentUID:row.gid,row:row})">行</div>
                              <div class="crumbs-link">
                                <a-icon type="minus" :rotate="-45"/>
                              </div>
                              <div class="crumbs"
                                   @click="onSelectObject({currentUID:cell.gid,row:row,cell:cell});onCellSettingOpen(cell,colIndex)">
                                <a-icon type="border"></a-icon>
                                单元格
                              </div>
                              <div class="crumbs-link">
                                <a-icon type="minus" :rotate="-45"/>
                              </div>
                              <div class="crumbs gl-dnd-handle-cell-item" @click="showBreadcrumbs=false" title="拖动单元格">
                                <a-icon :type="slotComponent.icon"/>
                                {{slotComponent.title}}{{$ide.store.assist.showComponentId?'-'+slotComponent.gid:''}}
                              </div>&nbsp;
                            </div>
                            <div class="gl-component-item-toolbar" v-if="!showBreadcrumbs">
                              <!--Tab插槽只需要展示这部分操作即可-->
                              <div style="display:inline-block;float: right">
                                <a-button size="small"
                                          @click="onComponentDesignerOpen(cell,slotComponent,slotComponentIndex)"
                                          title="组件设置">
                                  <a-icon type="setting" theme="filled"/>
                                </a-button>
                                <a-button size="small"
                                          @click="onComponentDelete(cellItem.slots,slotComponent,slotComponentIndex)"
                                          type="danger"
                                          title="删除该组件">
                                  <a-icon type="delete"></a-icon>
                                </a-button>
                              </div>
                            </div>
                            <div class="gl-component-wrapper gl-dnd-handle-cell-item"
                                 @click="onSelectObject({currentUID:slotComponent.gid,row:row,cell:cell,component:slotComponent})">
                              <component :ref="slotComponent.gid" v-show="slotComponent.show"
                                         :is="$globalVue.component(slotComponent.component)"
                                         v-bind="slotComponent.bind" :style="slotComponent.style"></component>
                              <div v-if="!slotComponent.show" style="text-align: center;font-size: 3em">
                                <a-icon :type="slotComponent.icon" @click="slotComponent.show=true" title="点击展示该组件内容"/>
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
              <div class="gl-dnd-placeholder" v-if="cell.items.length===0"
                   @click="onSelectObject({currentUID:row.gid,row:row})">{ 拖入组件或布局容器 }
              </div>
            </gl-draggable>
          </template>
        </a-col>
      </a-row>
      <div v-if="!rowItems||rowItems.length===0" style="text-align: center;padding-top: 1em">
        从左边【布局】栏目中拖动布局行列到该区域，再从【组件】栏目拖动组件到布局行列中。
      </div>
    </gl-draggable>
    <div v-if="modalVisible">
      <a-modal class="gl-card-designer" :title="modalTitle" centered :width="modalWidth" v-model="modalVisible"
               @ok="() => modalVisible = false" @cancel="onCloseModal" okText="保存" cancelText="取消"
               :maskClosable="false">
        <component :is="$globalVue.component(currentSelectedComponent.meta.designer)"
                   v-bind="currentSelectedComponent.bind"></component>
        <template slot="footer">
          <div style="text-align: center">
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
        // 一个单元格对应一个cell
        currentSelectedCell: {},
        // 单元格内的项，即表单、列表等组件
        currentSelectedComponent: {},
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
        console.log('gl-ide-plugin-layout-item > onSettingSwitchPanel > panel:', panel, this.currentSelectObjectUid, this.currentSelectedCell, this.currentSelectedComponent)
        if (panel.name === "GlIdePluginLayoutCardSettings") {
          this.currentSelectObjectUid = this.currentSelectedCell ? this.currentSelectedCell.gid : ''
        } else if (panel.name === "GlIdePluginLayoutSegmentSettings") {
          this.currentSelectObjectUid = this.currentSelectedComponent ? this.currentSelectedComponent.gid : ''
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
              if (cellItem.component) {
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
              }
            })
          })
        })
        console.log('gl-ide-plugin-layout-item> generateTreeData() > componentRefs:', this.componentRefs)
      },
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
        console.log('gl-ide-plugin-layout-item> UIItem > generateComponentRef() > item:', item)
        console.log('gl-ide-plugin-layout-item> UIItem > generateComponentRef() > this.$refs:', this.$refs)
        console.log('gl-ide-plugin-layout-item> UIItem > generateComponentRef() > this.$refs[item.gid]:', this.$refs[item.gid])
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
       * @param item 组件配置信息item
       * @param parent 父节点
       */
      generateComponentNodeAndBindEvent(item, parentItem) {
        let that = this
        console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > generate node from item（component config）:', item)
        const resultNode = this.updateComponentNodeAndBindEvent(item)
        console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > find parentNode by parentItem.gid, parentItem is:', parentItem)
        let parentNode = that.findTreeNode(parentItem.gid)
        console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > found parentNode:', parentNode, 'and push componentNode', resultNode)
        parentNode.children.push(resultNode)
      },
      /**
       * 创建或更新该组件配置对应的树节点
       * 树节点子的控件会自动去重
       * @param item 组件配置信息item
       * @return node 创建的节点
       */
      updateComponentNodeAndBindEvent(item) {
        const that = this
        let node = that.findTreeNode(item.gid) || {
          title: item.title,
          key: item.gid,
          slots: {
            icon: item.icon,
          },
          children: [],
          _component: ''
        }
        let groups = node.children

        // 加载每个单元格内的组件
        //  {id: item.gid, component: this.$refs[item.gid][0], type: item.type, meta: item.meta}
        let cardComponent = that.componentRefs[item.gid]
        // console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > item.gid,cardComponent:', item.gid, cardComponent, that.componentRefs)
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
                  console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > control(', childObj.gid, ') in objectTree? ', !foundChildrenNode ? 'No.' : 'Yes.')
                  if (!foundChildrenNode) {
                    console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > add control(', childObj.gid, ',', foundChildrenNodeTitle, ')to objectTree:'
                    )
                    childNodes.push({
                      title: foundChildrenNodeTitle,
                      // 组件id+组件内的控件id
                      key: item.gid + '_$_' + childObj.gid, // that.$gl.utils.uuid(16),
                      slots: {
                        icon: 'link',
                      }
                    })
                  } else {
                    // 存在，则更新
                    foundChildrenNode.title = foundChildrenNodeTitle
                    foundChildrenNode.slots = childObj.slots
                  }
                  // 基于配置的事件初始化绑定
                  let componentItem = that.componentRefs[item.gid]
                  let controlComponent = componentItem.component.$_getRefControlByGid(childObj.gid)
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
        return node
      },
      /**
       * 创建容器树节点
       * @param item 组件配置信息item
       * @param parent 父节点
       */
      generateContainerNodeAndBindEvent(container, parentItem) {
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

      generateContainerPanelNodeAndBindEvent(panel, parentItem) {
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

      /**
       *  递归查找树节点
       */
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

      onCloseModal(e) {
        this.modalVisible = false
        this.modalWidthPercent = this.modalWidthPercentDefault
        this.$gl.bus.$emit('gl_ide_plugin_layout__modal_close')
        this.onComponentReload(this.currentSelectedComponent)
      },
      /**
       * 打开组件的独立设计器
       */
      onComponentDesignerOpen(cell, component, index) {
        console.log('gl-ide-plugin-layout > UIItem > onComponentDesignerOpen() > component:', component)
        if (component.meta) {
          this.modalTitle = component.meta.title
          this.currentSelectedComponent = component
          this.modalWidthPercent = component.meta.modalWidthPercent || this.modalWidthPercentDefault
        }
        this.modalVisible = true
      },

      /**
       *  删除组件
       *  包括容器内的项(组件)、tab内的项(组件)、slot内的项(组件)
       *  @param components 删除的组件所在的集合
       *  @param component  删除的组件
       *  @param index 删除的组件所在的集合的索引位置
       *  @param confirmTitle 提醒确认信息
       */
      onComponentDelete(components, component, index, confirmTitle) {
        console.log('gl-ide-plugin-layout > UIItem > onItemDelete: ', components, component, index)
        let that = this
        this.$confirm({
          title: confirmTitle || '是否删除?',
          cancelText: '是',
          okText: '否',
          content: '',
          onOk() {
          },
          onCancel() {
            that.currentSelectedComponent = {}
            components.splice(index, 1);
            delete that.componentRefs[component.gid]
            that.removeObjectTreeNode(component.gid)
            console.log('gl-ide-plugin-layout > UIItem > onComponentDelete() > this.componentRefs: ', that.componentRefs)
          },
        });
      },
      /**
       *  关闭组件配置页面时，需重新加载组件，确保对组件的更新都生效
       *  如组件内增加了控件，在关闭配置页面时，需同步在对象树中新增
       *  @param item 组件配置信息
       */
      onComponentReload(item) {
        console.log('gl-ide-plugin-layout > UIItem > onComponentReload() > item: ', item)
        // 重新创建引用、绑定事件
        this.generateComponentRef(item)
        this.updateComponentNodeAndBindEvent(item)
        // 重绘单元格
        // console.log('..................', this.$refs[item.gid][0].name, typeof this.$refs[item.gid][0].refresh)
        if (typeof this.$refs[item.gid][0].refresh === 'function') {
          this.$refs[item.gid][0].refresh()
        }
        item.show = !item.show
        this.$nextTick(() => {
          item.show = !item.show
        })
      },

      /**
       * 打开主设计器的组件设置面板
       */
      onComponentSettingOpen(component) {
        this.currentSelectedComponent = component
        this.$gl.bus.$emit(events.ide_setting_open, {panelName: 'GlIdePluginLayoutSegmentSettings', config: component})
      },
      onComponentSettingUpdate(component) {
        console.log('gl-ide-plugin-layout > UIItem > onComponentSettingUpdate>', component)
        this.currentSelectedComponent = component
        this.$gl.bus.$emit(events.ide_setting_update, {
          panelName: 'GlIdePluginLayoutSegmentSettings',
          config: component
        })
      },


      /**
       * 打开主设计器的单元格属性设置面板
       * @param cell 需设置的单元格
       */
      onCellSettingOpen(cell) {
        console.log('gl-ide-plugin-layout > UIItem > onCellSettingOpen>', cell)
        this.currentSelectedCell = cell
        this.$gl.bus.$emit(events.ide_setting_open, {panelName: 'GlIdePluginLayoutCardSettings', config: cell})
      },
      onCellSettingUpdate(cell) {
        console.log('gl-ide-plugin-layout > UIItem > onCellSettingUpdate>', cell)
        this.currentSelectedCell = cell
        this.$gl.bus.$emit(events.ide_setting_update, {panelName: 'GlIdePluginLayoutCardSettings', config: cell})
      },
      getCellComponentConfig(cardId) {
        return this.componentRefs[cardId]
      },
      getCellComponent(cardId) {
        let card = this.getCellComponentConfig(cardId)
        return Vue.component(card.type)
      },

      /**
       *  添加行
       */
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
      /**
       *  删除行
       */
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
      /**
       *  单元格内加cellItem（组件或容器）
       */
      onCellItemAdd: function (e, cell) {
        let that = this
        let cellItem = cell.items[cell.items.length === e.newIndex && e.newIndex > 0 ? e.newIndex - 1 : e.newIndex]
        let isContainer = !cellItem.component
        console.log('gl-ide-plugin-layout > UIItem > onCellItemAdd() > added cellItem' + (isContainer ? '(container)' : '(component)') + ':', cellItem, ' at newIndex: ', e.newIndex)
        console.log('gl-ide-plugin-layout > UIItem > onCellItemAdd() > then the items:', cell.items)

        if (isContainer) {
          // 若添加的为容器
          cellItem.gid = cellItem.gid || this.$gl.utils.uuid(16)
          that.generateContainerNodeAndBindEvent(cellItem, cell)
          // cellItem.items 对应tabs的多个面板
          // panel 容器的一个面板
          cellItem.items.forEach((panel) => {
            panel.gid = panel.gid || this.$gl.utils.uuid(16)
            // 【注意】通过拖拉过来创建的容器项，其子组的数组items默认不具有响应式，需要在items中拖入第2个组件时才变成响应式
            // 这里通过加多一次$set的方式，让panel的items即刻变成响应式，第1次在items内拖入组件时，就可以触发事件。
            that.$set(panel, 'items', [])
            that.generateContainerPanelNodeAndBindEvent(panel, cellItem)
            // panel.items 对应页板内的多个组件
            // panel.items.forEach((component) => {
            // that.generateComponentNodeAndBindEvent(cellItem, component)
            // })
          })
        } else {
          // 若添加的cellItem为组件
          this.generateComponentRef(cellItem)
          this.generateComponentNodeAndBindEvent(cellItem, cell)
        }
        console.log('gl-ide-plugin-layout > UIItem > onCellItemAdd() > this.refs: ', this.$refs)
        console.log('gl-ide-plugin-layout > UIItem > onCellItemAdd() > this.componentRefs: ', this.componentRefs)
      },
      //
      /**
       * 容器内的面板添加组件
       *  @param e 拖拉变更事件
       *  @param panel 面板，如tabPane
       */
      onContainerPanelComponentAdd(e, panel) {
        console.log('gl-ide-plugin-layout > UIItem > onContainerPanelComponentAdd() > e:', e, 'panel:', panel)
        let component = panel.items[panel.items.length === e.newIndex && e.newIndex > 0 ? e.newIndex - 1 : e.newIndex]
        this.generateComponentRef(component)
        this.generateComponentNodeAndBindEvent(component, panel)
      },
      onContainerPanelComponentChange(e, item) {
        console.log('gl-ide-plugin-layout > UIItem > onContainerPanelComponentChange: ', e, item)
        this.removeObjectTreeNodeBeforeComponentMove(e)
      },
      /**
       * 直接将添加到插槽的组件挂到容器上
       *  @param e 拖拉变更事件
       *  @param cellItem 容器
       */
      onContainerSlotComponentAdd(e, cellItem) {
        let component = cellItem.slots[cellItem.slots.length === e.newIndex && e.newIndex > 0 ? e.newIndex - 1 : e.newIndex]
        this.generateComponentRef(component)
        this.generateComponentNodeAndBindEvent(component, cellItem)
        console.log('gl-ide-plugin-layout > UIItem > onContainerSlotComponentAdd: ', e, cellItem)
      },
      onContainerSlotComponentChange(e, item) {
        console.log('gl-ide-plugin-layout > UIItem > onContainerSlotComponentChange: ', e, item)
        this.removeObjectTreeNodeBeforeComponentMove(e)
      },
      onCellItemChange(e, cell) {
        console.log('gl-ide-plugin-layout > UIItem > onCellItemChange: ', e, cell)
        this.removeObjectTreeNodeBeforeComponentMove(e)
      },
      /**
       *  清除该单元格内的所有内容，单元格本身不删除
       *  @param cell 单元格
       */
      onCellClear(cell) {
        let that = this
        this.$confirm({
          title: '是否清空该单元格?',
          cancelText: '是',
          okText: '否',
          content: '',
          onOk() {
          },
          onCancel() {
            for (let index in cell.items) {
              let cellItem = cell.items[index]
              if (cell.items[index].component) {
                delete that.componentRefs[cellItem.gid]
              } else {
                cellItem.items.forEach((panel) => {
                  panel.items.forEach(component => {
                    delete that.componentRefs[component.gid]
                  })
                })
              }
              that.removeObjectTreeNode(cellItem.gid)
            }
            cell.opts = {}
            cell.items.splice(0, cell.items.length)
          },
        });
      },

      onRowSettingOpen(row) {

      },
      onRowSettingUpdate(row) {
        this.currentSelectedRow = row
      },
      /**
       *  在组件移动时，先清除该树节点
       *  @param e change event of dnd
       */
      removeObjectTreeNodeBeforeComponentMove(e) {
        if (e.added && e.added.element && e.added.element.gid) {
          this.removeObjectTreeNode(e.added.element.gid)
        }
      },
      /**
       * @param currentUID 当前选择对象的UID，如行、单元格、组件、字段等对象ID
       * @param row 选择的行，若本次选择了row对象，则cell及component为空
       * @param cell 选择的单元格(列、格)，若本次选择了cell对象，则component为空
       * @param component 选择的组件
       */
      onSelectObject({currentUID, row, cell, component}) {
        console.log('{currentUID, row, cell, component}>', {currentUID, row, cell, component})
        this.currentSelectObjectUid = currentUID

        this.onRowSettingUpdate(row)
        this.onCellSettingUpdate(cell)
        this.onComponentSettingUpdate(component)

        if (component) {
          this.onComponentSettingOpen(component)
        } else if (cell) {
          this.onCellSettingOpen(cell)
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

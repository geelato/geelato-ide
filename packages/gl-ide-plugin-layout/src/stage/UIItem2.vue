<template>
  <div>
    <gl-draggable
        :list="rowItems"
        animation="700"
        handle=".gl-dnd-row-handle"
        group='layoutItems'
        :sort="true"
        @add="onRowAdd($event,rowItems)"
        ghostClass="gl-dnd-ghost"
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
            <GlIdePluginLayoutStageUIItem :rows="cell.rows" :componentRefs="componentRefs"
                                          :bindEventHandlers="bindEventHandlers"
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
                ghostClass="gl-dnd-ghost"
            >
              <div v-for="(cellItem,cellItemIndex) in cell.items" :key="cellItem.gid"
                   class="gl-cell-item-wrapper"
                   style="padding-top: 0.1em;position: relative"
                   :class="{'gl-selected':currentSelectObjectUid===cellItem.gid}">
                <template v-if="cellItem.component||cellItem.componentName">
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
                    <component :ref="cellItem.gid" v-show="cellItem.show"
                               :is="$globalVue.component(cellItem.component||cellItem.componentName)"
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
                            ghostClass="gl-dnd-ghost"
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
                                         :is="$globalVue.component(component.component||component.componentName)"
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
                            ghostClass="gl-dnd-ghost"
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
                                         :is="$globalVue.component(slotComponent.component||slotComponent.componentName)"
                                         v-bind="slotComponent.bind" :style="slotComponent.style"></component>
                              <div v-if="!slotComponent.show" style="text-align: center;font-size: 3em">
                                <a-icon :type="slotComponent.icon" @click="slotComponent.show=true" title="点击展示该组件内容"/>
                              </div>
                            </div>
                          </div>
                          <div class="gl-dnd-slot-placeholder" v-if="cellItem.slots.length===0">
                            { 拖入组件 xx}
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
  import pageItemMixin from "../../../../runtime/components/gl-page/src/pageItemMixin";

  export default {
    name: "GlIdePluginLayoutStageUIItem",
    mixins: [pageItemMixin],
    props: {
      events: {
        type: Object,
        required: true
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
      this.$gl.bus.$on(events.ide_setting_panel_switch, this.onSettingSwitchPanel)
      this.$gl.bus.$on(events.ide_setting_object_tree_node_update, this.onObjectTreeNodeUpdate)
      this.$gl.bus.$on(events.ide_setting_component_event_state_update, this.onComponentEventStateUpdate)
    },
    destroyed() {
      this.$gl.bus.$off(events.ide_setting_panel_switch, this.onSettingSwitchPanel)
      this.$gl.bus.$off(events.ide_setting_object_tree_node_update, this.onObjectTreeNodeUpdate)
      this.$gl.bus.$off(events.ide_setting_component_event_state_update, this.onComponentEventStateUpdate)
    },
    methods: {
      onSettingSwitchPanel({panel}) {
        console.log('gl-ide-plugin-layout-item > onSettingSwitchPanel > panel:', panel, this.currentSelectObjectUid, this.currentSelectedCell, this.currentSelectedComponent)
        if (panel.name === "GlIdePluginLayoutCardSettings") {
          this.currentSelectObjectUid = this.currentSelectedCell ? this.currentSelectedCell.gid : ''
        } else if (panel.name === "GlIdePluginLayoutControlSettings") {
          this.currentSelectObjectUid = this.currentSelectedComponent ? this.currentSelectedComponent.gid : ''
        }
      },
      reset() {
        this.editingFileParser = new EditingFileParser().init(this.$root)
        this.initComponentRefs()
        if (this.treeNodes !== undefined && this.treeNodes.length > 0) {
          // 已创建，不重复创建
          console.warn('已创建，不重复创建')
          return;
        }
        this.generateTreeNodeData()
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
        // 若是基础组件（控件）
        if ((item.component || item.componentName) === 'GlControl') {
          return this.updateControlNodeAndBindEvent(item)
        }
        // 若是高级组件，如表单、列表
        const that = this
        let node = that.findTreeNode(item.gid) || {
          title: item.title,
          key: item.gid,
          value: item.gid,
          slots: {
            icon: item.icon,
          },
          disabled: true,
          children: [],
          _type: 'component',
          _component: ''
        }
        let groups = node.children

        // 加载每个单元格内的组件
        //  {id: item.gid, component: this.$refs[item.gid][0], type: item.type, meta: item.meta}
        let cardComponent = that.componentRefs[item.gid]
        // console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > item.gid,cardComponent:', item.gid, cardComponent, that.componentRefs)
        if (cardComponent && cardComponent.meta && cardComponent.meta.objectTree) {
          node._component = cardComponent.meta.component || cardComponent.meta.componentName
          cardComponent.meta.objectTree.forEach((treeNodeObject) => {
            // treeNodeObject: {title:xx,path:xx.yy.zz}
            let group = groups.find(group => group.key === treeNodeObject.path)
            console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > find group:', treeNodeObject.path, ' and result:', group)
            if (!group) {
              group = {
                title: treeNodeObject.title + '[组]',
                key: treeNodeObject.path,
                value: treeNodeObject.path,
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
                    foundChildrenNode = {
                      title: foundChildrenNodeTitle,
                      // 组件id+组件内的控件id
                      key: item.gid + '_$_' + childObj.gid,
                      value: item.gid + '_$_' + childObj.gid,
                      slots: {
                        icon: 'link',
                      }
                    }
                    childNodes.push(foundChildrenNode)
                  } else {
                    // 存在，则更新
                    foundChildrenNode.title = foundChildrenNodeTitle
                    foundChildrenNode.slots = childObj.slots
                  }
                  // 基于配置的事件初始化绑定
                  let componentItem = that.componentRefs[item.gid]
                  console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > find component in componentRefs:', that.componentRefs, 'by gid "', item.gid, '" and get', componentItem)
                  let controlComponent = componentItem.component.$_getRefControlByGid(childObj.gid)
                  let control = {
                    gid: childObj.gid,
                    title: childObj.title,
                    component: controlComponent
                  }
                  // 初始事件配置状态
                  foundChildrenNode.class = 'gl-not-configured'
                  if (controlComponent && that.events[childObj.gid] && that.events[childObj.gid].length > 0) {
                    // 更新节点的事件配置状态
                    foundChildrenNode.class = 'gl-configured'
                    // 绑定事件
                    that.editingFileParser.bindEvent(that.bindEventHandlers, control, that.events[childObj.gid], controlComponent.$parent)
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
          // 更新节点的事件配置状态
          // that.onComponentEventStateUpdate(cardComponent)
          // for (let key in cardComponent.component.glRefControls) {
          //   const control = cardComponent.component.glRefControls[key]
          //   let e = this.$ide.store.editingFile.sourceContent.events[control.opts.gid]
          //   // 【注意】control的gid规则：component.gid+'_$_'+control.gid
          //   this.onObjectTreeNodeUpdate({
          //     gid: cardComponent.id + '_$_' + control.opts.gid,
          //     class: e && e.length > 0 ? 'gl-configured' : 'gl-not-configured'
          //   })
          // }
        }

        console.log('gl-ide-plugin-layout > UIItem > generateComponentNodeAndBindEvent() > treeNodes result:', that.treeNodes)
        return node
      },

      /**
       * 创建或更新该控件（本质上是组件，属于基本的组件）配置对应的树节点
       * 树节点子的控件会自动去重
       * @param item 组件配置信息item
       * @return node 创建的节点
       */
      updateControlNodeAndBindEvent(item) {
        const that = this
        // let node = that.findTreeNode(item.gid) || {
        //   title: item.title,
        //   key:  item.gid+ '_$_' +item.bind.opts.gid,
        //   slots: {
        //     icon: 'link' // item.icon,
        //   },
        //   disabled: false,
        //   children: [],
        //   _component: ''
        // }
        let foundChildrenNode = that.findTreeNode(item.gid)

        let childObj = item.bind.opts
        console.log('gl-ide-plugin-layout > UIItem > updateControlNodeAndBindEvent() > gid, childObj:', childObj.gid, childObj)
        if (childObj.control) {
          // 未设置control值的，可能为form的隐藏属性，这里需过滤掉
          let foundChildrenNodeTitle = childObj.title + ' [' + childObj.control + ']'
          console.log('gl-ide-plugin-layout > UIItem > updateControlNodeAndBindEvent() > control(', childObj.gid, ') in objectTree? ', !foundChildrenNode ? 'No.' : 'Yes.')
          if (!foundChildrenNode) {
            console.log('gl-ide-plugin-layout > UIItem > updateControlNodeAndBindEvent() > add control(', childObj.gid, ',', foundChildrenNodeTitle, ')to objectTree:'
            )
            foundChildrenNode = {
              title: foundChildrenNodeTitle,
              // 组件id+组件内的控件id
              key: item.gid + '_$_' + childObj.gid,
              value: item.gid + '_$_' + childObj.gid,
              slots: {
                icon: 'link',
              }
            }
          } else {
            // 存在，则更新
            foundChildrenNode.title = foundChildrenNodeTitle
            // foundChildrenNode.slots = childObj.slots
          }
          // 基于配置的事件初始化绑定
          // let controlComponent = that.$refs[item.gid][0]
          let componentItem = that.componentRefs[item.gid]
          console.log('gl-ide-plugin-layout > UIItem > updateControlNodeAndBindEvent() > find component in componentRefs:', that.componentRefs, 'by gid "', item.gid, '" and get', componentItem)
          let controlComponent = componentItem.component
          console.log('gl-ide-plugin-layout > UIItem > updateControlNodeAndBindEvent() > controlComponent:', controlComponent, that.$refs)
          let control = {
            gid: childObj.gid,
            title: childObj.title,
            component: controlComponent
          }
          // 初始事件配置状态
          foundChildrenNode.class = 'gl-not-configured'
          if (controlComponent && that.events[childObj.gid] && that.events[childObj.gid].length > 0) {
            // 更新节点的事件配置状态
            foundChildrenNode.class = 'gl-configured'
            // 绑定事件
            console.log('control>>>>>', control, that.$refs)
            that.editingFileParser.bindEvent(that.bindEventHandlers, control, that.events[childObj.gid], controlComponent.$parent)
          }
        } else {
          console.log('gl-ide-plugin-layout > UIItem > updateControlNodeAndBindEvent() > 未设置control值：', childObj)
        }

        return foundChildrenNode
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
          value: container.gid,
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
          value: panel.gid,
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
          value: row.gid,
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
          value: cell.gid,
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
            // node.key.indexOf(gid) != -1 该规则用于匹配GlControl直接当组件使用，不在高级组件中
            if (node.key === gid || node.key.indexOf(gid) != -1) {
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
       *  重新标识该组件下所有控件的绑定事件状态
       *  @param component 组件(高级组件或控件)
       *  @param gid 组件gid
       */
      onComponentEventStateUpdate({currentComponent, currentControl}) {
        let that = this
        let {component, gid, id} = currentComponent
        console.log('gl-ide-plugin-layout > UIItem > onComponentEventStateUpdate > {component, gid, id}:', {
          component,
          gid,
          id
        })
        if (component.glType === 'control') {
          // update(gid, component.opts.gid)
          update(gid, currentControl.gid)
        } else if (component.glType === 'component') {
          update(gid, currentControl.gid)
          // for (let key in component.glRefControls) {
          //   // 过滤掉部分节点的更新，分组节点，如：component.glRefControls[key]，为gl-table的query组，该组没有gid
          //   if (component.glRefControls[key].gid) {
          //     update(gid, component.glRefControls[key].gid)
          //   }
          // }
        }

        function update(componentGid, controlGid) {
          console.assert(controlGid, 'controlGid不能为空。')
          let e = that.$ide.store.editingFile.sourceContent.events[controlGid]
          console.log('gl-ide-plugin-layout > UIItem > onComponentEventStateUpdate.update() > componentGid, controlGid:', componentGid, controlGid)
          console.log('gl-ide-plugin-layout > UIItem > onComponentEventStateUpdate.update() > event:', e)
          // 【注意】control的gid规则：component.gid+'_$_'+control.gid
          that.onObjectTreeNodeUpdate({
            gid: componentGid + '_$_' + controlGid,
            class: e && e.length > 0 ? 'gl-configured' : 'gl-not-configured'
          })
        }
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
            that.currentSelectObjectUid = ''
            that.currentSelectedComponent = {}
            components.splice(index, 1);
            delete that.componentRefs[component.gid]
            that.removeObjectTreeNode(component.gid)
            that.$gl.bus.$emit(events.ide_stage_component_delete, component)
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
        // 如果是 GlControl
        if (component.componentName === 'GlControl') {
          this.$gl.bus.$emit(events.ide_setting_open, {
            panelName: 'GlIdePluginLayoutControlSettings',
            config: component
          })
        }
      },
      onComponentSettingUpdate(component) {
        console.log('gl-ide-plugin-layout > UIItem > onComponentSettingUpdate>', component)
        this.currentSelectedComponent = component
        this.$gl.bus.$emit(events.ide_setting_update, {
          panelName: 'GlIdePluginLayoutControlSettings',
          config: component
        })
      },

      /**
       * 更新对象树节点的名称
       */
      onObjectTreeNodeUpdate(treeNode) {
        const node = this.findTreeNode(treeNode.gid)
        console.log('gl-ide > gl-ide-plugin-layout > onObjectTreeNodeUpdate > node:', node, ',treeNodes:', this.treeNodes, 'treeNode:', treeNode)
        Object.assign(node, treeNode)
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
        row.gid = 'row_'+that.$gl.utils.uuid(12)
        row.cols.forEach(cell => {
          cell.gid = 'cel_'+that.$gl.utils.uuid(12)
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
        let isContainer = !(cellItem.component || cellItem.componentName)
        console.log('gl-ide-plugin-layout > UIItem > onCellItemAdd() > added cellItem' + (isContainer ? '(container)' : '(component)') + ':', cellItem, ' at newIndex: ', e.newIndex)
        console.log('gl-ide-plugin-layout > UIItem > onCellItemAdd() > then the items:', cell.items)

        if (isContainer) {
          // 若添加的为容器
          cellItem.gid = cellItem.gid || ('ctn_'+this.$gl.utils.uuid(12))
          that.generateContainerNodeAndBindEvent(cellItem, cell)
          // cellItem.items 对应tabs的多个面板
          // panel 容器的一个面板
          cellItem.items.forEach((panel) => {
            panel.gid = panel.gid || ('pan_'+this.$gl.utils.uuid(12))
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
              if (cell.items[index].component || cell.items[index].componentName) {
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
      /**
       * 添加tab
       * @param targetKey
       * @param action
       * @param tabs
       */
      onTabsEdit(targetKey, action, tabs) {
        console.log(targetKey, action, tabs)
        if (action === 'add') {
          tabs.items.push({gid: 'tab_' + this.$gl.utils.uuid(12), title: '新标签页', items: []})
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

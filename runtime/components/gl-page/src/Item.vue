<template>
  <div class="gl-ide-preview">
    <a-row v-for="(row,rowIndex) in rowItems" :gutter="row.gutter||gutter" :key="rowIndex" class="gl-row">
      <a-col v-for="(cell,colIndex) in row.cols" :span="cell.span" :offset="cell.offset" :key="colIndex" style="">
        <template v-if="cell.card">
          <a-card :title="getCardConfig(cell.card).title" style="margin-top: 8px">
            <component :glCtx="glCtx" :ref="cell.card" :is="getCardComponent(cell.card)"
                       :opts="getCardConfig(cell.card).opts"
                       :params="params"
                       :style="getCardConfig(cell.card).style"
            >
              正在加载...
            </component>
          </a-card>
        </template>
        <template v-else-if="cell.rows">
          <gl-page-item :glCtx=glCtx :rows="cell.rows" :componentRefs="componentRefs"
                        :bindEventHandlers="bindEventHandlers"
                        :gutter="gutter" :treeNodes="treeNodes" :params="params"
                        @doAction="$emit('doAction',$event)"></gl-page-item>
        </template>
        <template v-else>
          <!-- 卡片内的组件渲染 --采用默认方式  -->
          <div v-for="(cellItem) in cell.items" :key="cellItem.gid" class="gl-cell">
            <!--组件-->
            <template v-if="cellItem.componentName">
              <component :glCtx="glCtx" :ref="cellItem.gid" :is="$globalVue.component(cellItem.componentName)"
                         :gid="cellItem.gid" v-bind="cellItem.bind" :params="params[cellItem.gid]"
                         @doAction="$emit('doAction',$event)" v-show="cellItem.isShow===undefined||cellItem.isShow"
                         @display="(display)=>{$set(cellItem,'isShow',display.isShow)}"
                         :style="cellItem.style" data-xx="xxx"></component>
            </template>
            <!--容器-->
            <template v-else>
              <template v-if="cellItem.type==='Tabs'">
                <a-tabs :default-active-key="0" :type="cellItem.opts.type" :size="cellItem.opts.size"
                        :tabPosition="cellItem.opts.tabPosition">
                  <a-tab-pane :tab="tabItem.title" v-for="(tabItem,tabItemIndex) in cellItem.items"
                              :key="tabItemIndex">
                    <div v-for="(panel) in tabItem.items" :key="panel.gid"
                         style="padding-top: 0.1em;position: relative">
                      <component :glCtx="glCtx" :ref="panel.gid" :is="$globalVue.component(panel.componentName)"
                                 :gid="panel.gid" v-bind="panel.bind" :params="params[panel.gid]"
                                 @doAction="$emit('doAction',$event)" v-show="panel.isShow===undefined||panel.isShow"
                                 @display="(display)=>{$set(panel,'isShow',display.isShow)}"
                                 :style="panel.style"></component>
                    </div>
                  </a-tab-pane>
                  <!--插槽 slots-->
                  <template slot="tabBarExtraContent">
                    <div v-for="(slot) in cellItem.slots" :key="slot.gid"
                         style="padding-top: 0.1em;padding-right:0.2em;position: relative;display: inline-block">
                      <component :glCtx="glCtx" :ref="slot.gid" v-show="slot.show"
                                 :is="$globalVue.component(slot.componentName)"
                                 v-bind="slot.bind" :style="slot.style"></component>
                    </div>
                  </template>
                </a-tabs>
              </template>
              <template v-else>未支持的type:{{cellItem.type}}</template>
            </template>

          </div>
        </template>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Vue from 'vue'
  import EditingFileParser from '../../../EditingFileParser'
  import pageItemMixin from "./pageItemMixin";

  export default {
    name: 'GlPageItem',
    mixins: [pageItemMixin],
    props: {
      // 上下文信息，可以获取应用的id @see CtxPage
      glCtx: {
        type: Object,
        required: true
      },

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
        colItems: [],
        colCards: {},
        componentsDisplay: {},
        //
        currentColItem: {}
      }
    },
    mounted() {
      this.editingFileParser = new EditingFileParser().init(this.$root)
      this.initComponentRefs()
      this.bindEvent()
    },
    methods: {
      /**
       * 初始化创建树节点
       */
      bindEvent() {
        let that = this

        function bindComponentEvent(component, ctx) {
          if (component.glType === 'control') {
            // 是基础组件（控件）
            that.editingFileParser.bindEvent(that.bindEventHandlers, component, that.events[component.opts.gid], ctx || component)
          } else if (component.glType === 'component') {
            // 是高级组件，如GlForm、GlTable
            for (let key in component.glRefControls) {
              bindComponentEvent(component.glRefControls[key], component)
            }
          } else {
            // 非geelate的组件，如AButton
            console.log('component.$vnode>', component)
            that.editingFileParser.bindEvent(that.bindEventHandlers, component, that.events[component.$vnode.data.ref], ctx || component)
          }
        }

        that.rows.filter((row) => !!row.cols).forEach((row) => {
          row.cols.filter((cell) => !!cell.items).forEach((cell) => {
            cell.items.forEach((cellItem) => {
              if (cellItem.componentName) {
                bindComponentEvent(this.componentRefs[cellItem.gid].component, cellItem)
              } else {
                // cellItem.items 对应tabs的多个面板
                // panel 容器的一个面板
                // that.generateContainerNodeAndBindEvent(cellItem, cell)
                cellItem.items.forEach((panel) => {
                  // that.generateContainerPanelNodeAndBindEvent(panel, cellItem)
                  // panel.items 对应页板内的多个组件
                  panel.items.forEach((component) => {
                    bindComponentEvent(this.componentRefs[component.gid].component, panel)
                  })
                })
                // slots 容器的的插槽
                if (cellItem.slots && cellItem.slots.length > 0) {
                  cellItem.slots.forEach((slotComponent) => {
                    console.log('slotComponent:', slotComponent, this.componentRefs, this.componentRefs[slotComponent.gid])
                    bindComponentEvent(this.componentRefs[slotComponent.gid].component, cellItem)
                  })
                }
              }
            })
          })
        })
      }

      ,
      onComponentClick($event) {
        console.log('$event', $event)
      }
      ,
      getCardConfig(cardId) {
        return this.componentRefs[cardId]
      }
      ,
      getCardComponent(cardId) {
        const card = this.getCardConfig(cardId)
        // console.log('...................', cardId, card, Vue.component(card.type))
        return Vue.component(card.type)
      }
    }
  }
</script>

<style>
</style>

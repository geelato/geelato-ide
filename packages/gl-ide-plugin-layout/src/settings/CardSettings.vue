<template>
  <div class="gl-ide-plugin-designer-settings">
    <div v-if="config">
      <div class="gl-title">
        <a-icon type="setting"/>
        外观
      </div>
      <table class="gl-table">
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            主题：
          </td>
          <td class="gl-table-cell">
            <a-radio-group :value="1" size="small">
              <a-radio-button :value="1">默认</a-radio-button>
            </a-radio-group>
          </td>
        </tr>
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            显示边框：
          </td>
          <td class="gl-table-cell">
            <a-switch v-model="config.showBorder"></a-switch>
          </td>
        </tr>
        <!--<tr class="gl-table-row">-->
        <!--<td class="gl-table-cell gl-table-cell-sub-label">-->
        <!--显示模式：-->
        <!--</td>-->
        <!--<td class="gl-table-cell">-->
        <!--<a-select v-model="config.displayMode" :allowClear="false" style="min-width: 99%">-->
        <!--<a-select-option v-for="displayModeOption in selectionDisplayMode" :key="displayModeOption.value"-->
        <!--:value="displayModeOption.value"-->
        <!--:title="displayModeOption.title">-->
        <!--{{displayModeOption.title}}-->
        <!--</a-select-option>-->
        <!--</a-select>-->
        <!--</td>-->
        <!--</tr>-->
      </table>

      <div class="gl-title" v-if="config.items&&config.items.length>0">
        <a-icon type="setting"/>
        组件和容器
      </div>
      <table class="gl-table">
        <tr class="gl-table-row" style="text-align: center">
          <th class="gl-table-cell" style="width: 6em">
            格内项类型
          </th>
          <th class="gl-table-cell gl-table-cell-sub-label" style="text-align: center">
            标题
          </th>
          <th class="gl-table-cell" style="width: 4em">
            操作
          </th>
        </tr>
        <gl-draggable
            :list="config.items"
            animation="700"
            handle=".gl-dnd-item-handle"
            group='rowActions'
            :sort="true"
            element="tbody"
        >
          <tr class="gl-table-row" v-for="(cellItem,cellItemIndex) in config.items" :key="cellItemIndex">
            <td colspan="3">
              <table style="width: 100%;">
                <tr>
                  <td class="gl-table-cell" style="width: 6em">
                    {{cellItem.component?'组件':'容器-'+cellItem.type}}
                  </td>
                  <td class="gl-table-cell gl-table-cell-sub-label">
                    <a-input v-model="cellItem.title" style="width: 98%" @change="changeObjectTreeNodeTitle(cellItem)">
                    </a-input>
                  </td>
                  <td class="gl-table-cell" style="width: 4em">
                    <a-button class="gl-mini-btn" v-if="currentContainerItemIndex!==cellItemIndex"
                              @click="currentContainerItemIndex = cellItemIndex" title="显示更多设置">
                      <a-icon type="setting"/>
                    </a-button>
                    <a-button class="gl-mini-btn" v-if="currentContainerItemIndex===cellItemIndex"
                              @click="currentContainerItemIndex = -1" title="隐藏更多设置">
                      <a-icon type="eye-invisible"/>
                    </a-button>
                    <a-button class="gl-dnd-item-handle gl-mini-btn">
                      <a-icon type="drag"></a-icon>
                    </a-button>
                  </td>
                </tr>
                <template v-if="currentContainerItemIndex===cellItemIndex">
                  <tr v-if="cellItem.type==='Tabs'">
                    <td colspan="3" style="padding:0.5em;">
                      标签容器设置
                      <table class="gl-table" style="border: 1px solid">
                        <tr class="gl-table-row">
                          <td class="gl-table-cell gl-table-cell-sub-label" style="width: 5em">
                            标题：
                          </td>
                          <td class="gl-table-cell">
                            <gl-draggable
                                :list="cellItem.items"
                                animation="700"
                                handle=".gl-dnd-item-handle"
                                group='tabs'
                                :sort="true"
                            >
                              <div v-for="(component,componentIndex) in cellItem.items" :key="componentIndex">
                                <a-input v-model="component.title" @change="changeObjectTreeNodeTitle(component)">
                                  <a-icon type="drag" slot="addonAfter" class="gl-dnd-item-handle"></a-icon>
                                </a-input>
                              </div>
                            </gl-draggable>
                          </td>
                        </tr>
                        <tr class="gl-table-row">
                          <td class="gl-table-cell gl-table-cell-sub-label">
                            <a-icon type="info-circle" title="该设置不会在舞台中预览，需在预览页面查看。"/>
                            位置：
                          </td>
                          <td class="gl-table-cell">
                            <a-radio-group v-model="cellItem.opts.tabPosition" size="small">
                              <a-radio-button value="top">上</a-radio-button>
                              <a-radio-button value="bottom">下</a-radio-button>
                              <a-radio-button value="left">左</a-radio-button>
                              <a-radio-button value="right">右</a-radio-button>
                            </a-radio-group>
                          </td>
                        </tr>
                        <tr class="gl-table-row">
                          <td class="gl-table-cell gl-table-cell-sub-label">
                            <a-icon type="info-circle" title="该设置不会在舞台中预览，需在预览页面查看。"/>
                            类型：
                          </td>
                          <td class="gl-table-cell">
                            <a-radio-group v-model="cellItem.opts.type" size="small">
                              <a-radio-button value="line">下划线式</a-radio-button>
                              <a-radio-button value="card">卡片式</a-radio-button>
                            </a-radio-group>
                          </td>
                        </tr>
                        <tr class="gl-table-row">
                          <td class="gl-table-cell gl-table-cell-sub-label">
                            <a-icon type="info-circle" title="该设置不会在舞台中预览，需在预览页面查看。"/>
                            大小：
                          </td>
                          <td class="gl-table-cell">
                            <a-radio-group v-model="cellItem.opts.size" size="small">
                              <a-radio-button value="large">大</a-radio-button>
                              <a-radio-button value="default">中</a-radio-button>
                              <a-radio-button value="small">小</a-radio-button>
                            </a-radio-group>
                          </td>
                        </tr>
                        <tr class="gl-table-row">
                          <td class="gl-table-cell gl-table-cell-sub-label">
                            插槽：
                          </td>
                          <td class="gl-table-cell">
                            <gl-draggable
                                :list="cellItem.slots"
                                animation="700"
                                handle=".gl-dnd-item-handle"
                                group='slots'
                                :sort="true"
                            >
                              <div v-for="(component,componentIndex) in cellItem.slots" :key="componentIndex">
                                <a-input v-model="component.title" @change="changeObjectTreeNodeTitle(component)">
                                  <a-icon type="drag" slot="addonAfter" class="gl-dnd-item-handle"></a-icon>
                                </a-input>
                              </div>
                            </gl-draggable>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr v-else-if="cellItem.type==='Collapse'">
                    <td colspan="3" style="padding:0.2em;">
                      无更多设置
                    </td>
                  </tr>
                  <tr v-else-if="cellItem.type==='Flow'">
                    <td colspan="3" style="padding:0.2em;">
                      无更多设置
                    </td>
                  </tr>
                  <tr v-else>
                    <td colspan="3" style="padding:0.2em;">
                      未支持的设置
                    </td>
                  </tr>
                </template>
              </table>
            </td>
          </tr>
        </gl-draggable>
      </table>
      <!--<div class="gl-title" v-if="config.displayMode==='Tabs'">-->
      <!--<a-icon type="setting"/>-->
      <!--标签页（Tabs）设置-->
      <!--</div>-->
      <!--<table class="gl-table" v-if="config.displayMode==='Tabs'">-->
      <!--<tr class="gl-table-row">-->
      <!--<td class="gl-table-cell gl-table-cell-sub-label">-->
      <!--标签位置：-->
      <!--</td>-->
      <!--<td class="gl-table-cell">-->
      <!--<a-radio-group v-model="config.opts.tabPosition" size="small">-->
      <!--<a-radio-button value="top">上</a-radio-button>-->
      <!--<a-radio-button value="bottom">下</a-radio-button>-->
      <!--<a-radio-button value="left">左</a-radio-button>-->
      <!--<a-radio-button value="right">右</a-radio-button>-->
      <!--</a-radio-group>-->
      <!--</td>-->
      <!--</tr>-->
      <!--<tr class="gl-table-row">-->
      <!--<td class="gl-table-cell gl-table-cell-sub-label">-->
      <!--标签页面：-->
      <!--</td>-->
      <!--<td class="gl-table-cell">-->
      <!--<a-radio-group v-model="config.opts.tabPosition" size="small">-->
      <!--<a-radio-button value="top">上</a-radio-button>-->
      <!--<a-radio-button value="bottom">下</a-radio-button>-->
      <!--<a-radio-button value="left">左</a-radio-button>-->
      <!--<a-radio-button value="right">右</a-radio-button>-->
      <!--</a-radio-group>-->
      <!--</td>-->
      <!--</tr>-->
      <!--<tr class="gl-table-row">-->
      <!--<td class="gl-table-cell gl-table-cell-sub-label">-->
      <!--标签插槽：-->
      <!--</td>-->
      <!--<td class="gl-table-cell">-->
      <!--{{config.opts.slots.length===0?' 无':''}}-->
      <!--<div v-for="(slot) in config.opts.slots">-->
      <!--<a-input style="width: 98%" v-model="slot.name" readonly="true">-->
      <!--<a-icon slot="addonBefore" type="api"/>-->
      <!--</a-input>-->
      <!--</div>-->
      <!--</td>-->
      <!--</tr>-->
      <!--</table>-->
      <!--===============设计辅助========================-->
      <div class="gl-title">
        <a-icon type="setting"/>
        设计辅助
      </div>
      <table class="gl-table">
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            显示组件ID：
          </td>
          <td class="gl-table-cell">
            <a-switch v-model="$ide.store.assist.showComponentId"></a-switch>
          </td>
        </tr>
      </table>
    </div>
    <a-alert v-else
             message="未选择单元格"
             description="请将鼠标移动到左边的设计界面上，点击相应的【单元格设置】按钮。"
             type="info"
             showIcon
    />
  </div>
</template>

<script>
  import ideConfig from '../../../gl-ide/src/data/ideSelectItems.js'
  import events from "../../../gl-ide/src/events";
  let componentName = 'GlIdePluginLayoutCardSettings'
  export default {
    name: componentName,
    components: {},
    props: {
      ideStore: {
        type: Object
      },
      config: {
        type: Object
      }
    },
    data() {
      return {
        selectionDisplayMode: [{title: '默认平铺(Default)', value: 'Default'}, {title: '标签页(Tabs)', value: 'Tabs'}, {
          title: '折叠面板(Collapse)',
          value: 'Collapse'
        }],
        controls: ideConfig.controls,
        // 当前控件
        currentControl: {text: '按钮', icon: 'border', value: 'button'},
        currentContainerItemIndex: 0
      }
    },
    watch: {},
    updated() {
      this.reset()
    },
    mounted() {
      console.log('CardSettings mounted config...', this.config)
      this.reset()
    },
    created() {
    },
    destroyed() {
    },
    methods: {
      reset() {
        if (!this.config) {
          return
        }
        if (!this.config.opts) {
          this.$set(this.config, 'opts', {})
        }
        this.$set(this.config.opts, 'tabPosition', this.config.opts.tabPosition || 'top')
        this.$set(this.config.opts, 'slots', this.config.opts.slots || [])
        this.$set(this.config.opts, 'extraItems', this.config.opts.extraItems || [])
        this.$set(this.config, 'showBorder', this.config.showBorder)
        // this.$set(this.config, 'displayMode', this.config.displayMode || 'Default')
        this.$set(this.config, 'items', this.config.items)
        for (let i in this.config.items) {
          let item = this.config.items[i]
          this.$set(item, 'style', item.style || {float: 'none', width: '100%'})
        }
      },
      selectControl(value) {
        let foundControl = this.controls.find(control => {
          return control.value === value
        })
        this.currentControl = {
          value: foundControl.value,
          text: foundControl.text, // option.componentOptions.children[0].text
          icon: foundControl.icon
        }
      },
      changeCardItemDisplayMode(card, cellItem) {
        if (cellItem.displayMode === 'slot') {
          // 加入
          let found = card.opts.slots.find(item => {
            return item.gid === cellItem.gid
          })
          if (!found) {
            card.opts.slots.push({
              name: cellItem.title,
              id: cellItem.gid
            })
          }
        } else {
          // 删除
          card.opts.slots.forEach((item, index) => {
            if (item.gid === cellItem.gid) {
              card.opts.slots.splice(index, 1)
            }
          })
        }
      },
      changeObjectTreeNodeTitle({gid, title}) {
        this.$gl.bus.$emit(events.ide_setting_object_tree_node_update, {gid, title})
      }
    }
  }
</script>

<style scoped>
</style>

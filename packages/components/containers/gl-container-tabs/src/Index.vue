<template>
  <div class="gl-container-wrapper gl-container-tabs">
    <a-tabs v-if="opts.type==='Tabs'" :default-active-key="0" type="editable-card"
            @edit="(targetKey, action)=>{onTabsAdd(targetKey, action,opts)}">
      <a-tab-pane :tab="panel.title" v-for="(panel,panelIndex) in opts.items"
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
    </a-tabs>
  </div>
</template>

<script>
  import mixinsComponent from '../../mixins-component'
  import mixinsContainer from '../../mixins-container'

  export default {
    name: 'GlContainerTabs',
    mixins: [mixinsComponent, mixinsContainer],
    components: {},
    props: {},
    data() {
      return {}
    },
    mounted() {
      console.log('opts>>>>>>>>>>>>>', this.opts)
    },
    created() {
    },
    destroyed() {
    },
    methods: {
      /**
       * 添加tab
       * @param targetKey
       * @param action
       * @param tabs
       */
      onTabsAdd(targetKey, action, tabs) {
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
      onContainerPanelComponentAdd() {
      },
      onContainerPanelComponentChange() {
      }
    }
  }
</script>

<style>
  .gl-setting-control-popover {
    margin-top: 24px !important;
    margin-right: 48px !important;;
  }
</style>

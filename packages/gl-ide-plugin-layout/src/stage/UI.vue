<template>
  <div class="gl-ide-layout-stage"
       style="height: 760px;overflow-x: hidden;padding-left: 0.5em;padding-right: 1em;padding-top: 1.75em">
    <GlIdePluginLayoutStageUIItem :rows="ideStore.editingFile.sourceContent.opts.layout.rows"
                                  :componentRefs="ideStore.editingFile.sourceContent._componentRefs"
                                  :events="ideStore.editingFile.sourceContent.events"
                                  :bindEventHandlers="ideStore.editingFile.sourceContent._bindEventHandlers"
                                  :gutter="ideStore.editingFile.sourceContent.opts.layout.gutter"
                                  :treeNodes="ideStore.editingFile.objectTree"
    ></GlIdePluginLayoutStageUIItem>
  </div>
</template>

<script>
  import GlIdePluginLayoutStageUIItem from './UIItem'
  import events from '../../../gl-ide/src/events'

  export default {
    name: "GlIdePluginLayoutStageUI",
    components: {GlIdePluginLayoutStageUIItem},
    props: {
      ideStore: {
        type: Object,
        required: true
      }
    },
    data() {
      return {}
    },
    created() {
      // this.$gl.bus.$on(events.ide_setting_update, this.onSettingUpdate)
    },
    destroyed() {
      // this.$gl.bus.$off(events.ide_setting_update, this.onSettingUpdate)
    },
    mounted() {
      console.log('geelato-ide >  GlIdePluginLayoutStageUI > mounted()', this.ideStore.editingFile.sourceContent)
    },
    methods: {
      // onSettingUpdate(config) {
      // }
    }
  }
</script>

<style>

  .gl-dnd-cell {
    padding: 0.5em;
  }

  .gl-dnd-card-toolbar {
    position: absolute;
    top: -16px;
    display: none;
    text-align: center;
    width: 100%;
  }

  .gl-dnd-cell:hover > .gl-dnd-card-toolbar {
    display: block;
  }

  .gl-ide-layout-stage .gl-dnd-wrapper-cell-item {
    min-height: 2em;
  }

  .gl-ide-layout-stage .gl-dnd-panel-wrapper {
    min-height: 2em;
    margin-top: -1em;
  }

  .gl-ide-layout-stage .gl-dnd-row-toolbar {
    display: none;
    background-color: #2cc786;
    font-size: 12px;
    top: -24px;
    z-index: 999;
    position: absolute;
    color: white;
    padding: 0 1em;
    line-height: 2em;
    height: 2em;
  }

  .gl-dnd-row.gl-selected > .gl-dnd-row-toolbar {
    display: block;
  }

  .gl-ide-layout-stage .gl-dnd-row-toolbar button {
    background-color: #2cc786;
    border-color: #2cc786;
    color: white;
  }

  .gl-ide-layout-stage .gl-dnd-row-toolbar button:hover {
    color: #2cc786;
  }

  .gl-dnd-row.gl-selected {
    border: solid 1px #2cc786;
  }

  .gl-ide-layout-stage .gl-dnd-cell-toolbar {
    display: none;
    background-color: #b91fbc;
    font-size: 12px;
    top: -24px;
    z-index: 999;
    position: absolute;
    color: white;
    padding: 0 1em;
    line-height: 2em;
    height: 2em;
    margin-left: -3px;
  }

  .gl-dnd-cell.gl-selected > .gl-dnd-cell-toolbar {
    display: block;
  }

  .gl-ide-layout-stage .gl-dnd-cell-toolbar button {
    background-color: #b91fbc;
    border-color: #b91fbc;
    color: white;
  }

  .gl-ide-layout-stage .gl-dnd-cell-toolbar button:hover {
    color: #b91fbc;
  }

  .gl-dnd-cell.gl-selected {
    border: solid 1px #b91fbc;
  }

  .gl-ide-layout-stage .gl-component-item-hover-title, .gl-ide-layout-stage .gl-component-item-breadcrumbs, .gl-ide-layout-stage .gl-component-item-toolbar {
    display: none;
    background-color: #178df7;
    font-size: 12px;
    top: -22px;
    z-index: 999;
    position: absolute;
    color: white;
    padding: 0 1em;
    line-height: 2em;
    height: 2em;
  }

  .gl-cell-item-wrapper.gl-selected > .gl-component-item-breadcrumbs, .gl-cell-item-wrapper.gl-selected > .gl-component-item-hover-title, .gl-cell-item-wrapper.gl-selected > .gl-component-item-toolbar {
    display: block;
  }

  .gl-ide-layout-stage .gl-cell-item-wrapper:hover > .gl-component-item-hover-title, .gl-ide-layout-stage .gl-container-item-wrapper:hover > .gl-component-item-hover-title {
    display: block;
  }

  .gl-component-item-breadcrumbs .crumbs {
    display: inline-block;
    padding: 0 0.5em;
    cursor: pointer;
  }

  .gl-component-item-breadcrumbs .crumbs-link {
    display: inline-block;
  }

  .gl-dnd-handle-cell-item {
    cursor: move;
  }

  .gl-ide-layout-stage .gl-component-item-toolbar button {
    background-color: #178df7;
    border-color: #178df7;
    color: white;
  }

  .gl-ide-layout-stage .gl-component-item-toolbar button:hover {
    color: #3facff;
  }

  .gl-container-item-wrapper.gl-selected > .gl-component-item-breadcrumbs, .gl-container-item-wrapper.gl-selected > .gl-component-item-hover-title, .gl-container-item-wrapper.gl-selected > .gl-component-item-toolbar {
    display: block;
  }

  .gl-dnd-slot-wrapper {
    display: inline-block;
  }

  .gl-slot-item-wrapper {
    display: inline-block;
  }

  .gl-slot-item-wrapper.gl-selected > .gl-component-item-breadcrumbs, .gl-slot-item-wrapper.gl-selected > .gl-component-item-hover-title, .gl-slot-item-wrapper.gl-selected > .gl-component-item-toolbar {
    display: inline-block;
    top: 3.5em
  }

  /*.gl-slot-item-wrapper.gl-selected .gl-component-wrapper {*/
  /*border: solid 1px #178df7;*/
  /*}*/

  .gl-dnd-slot-placeholder, .gl-dnd-panel-placeholder, .gl-dnd-placeholder {
    display: block;
    background-color: rgba(161, 222, 255, 0.35);
    min-height: 2.4em;
    line-height: 2.4em;
    color: #2185d0;
    font-style: italic;
    text-align: center;
    vertical-align: middle;

  }

  .gl-dnd-panel-placeholder {
    /*min-height: 4em;*/
  }

  .gl-dnd-slot-placeholder {
    display: inline-block;
    min-width: 4em;
    line-height: 2.4em;
  }

  /*.gl-dnd-more-than-one-child {*/
    /*display: none;*/
  /*}*/

  /*.gl-dnd-only-one-child {*/
    /*display: none;*/
  /*}*/

  .gl-dnd-ghost + .gl-dnd-only-one-child {
    display: block;
  }

  .gl-component-wrapper:hover {
    border: solid 1px #178df7;
  }

  .gl-selected > div > .gl-component-hidden-placeholder {
    border: solid 1px #178df7;
  }

  .gl-selected > .gl-component-wrapper {
    border: solid 1px #178df7;
  }

  .gl-component-hidden-placeholder {
    text-align: center;
    font-size: 3em;
    background-color: #f0f0f0;
  }

  .gl-dnd-item-handle {
    cursor: move;
  }

  .gl-dnd-ghost {
    border-top: solid 2px red !important;
  }

  /*.gl-dnd-ghost .gl-component-item-hover-title, .gl-dnd-ghost .gl-component-item-toolbar, .gl-dnd-ghost .gl-component-wrapper {*/
  /*display: none !important;*/
  /*}*/

  .gl-dnd-ghost > * {
    display: none !important;
  }

  /*.gl-container-wrapper:hover * {*/
  /*pointer-events: none;*/
  /*}*/
</style>

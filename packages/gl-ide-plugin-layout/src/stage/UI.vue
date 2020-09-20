<template>
  <div class="gl-ide-layout-stage"
       style="height: 760px;overflow-x: hidden;padding-left: 0.5em;padding-right: 1em;padding-top: 1.75em">
    <GlIdePluginLayoutStageUIItem :rows="ideStore.editingFile.sourceContent.opts.layout.rows"
                                  :componentRefs="ideStore.editingFile.sourceContent._componentRefs"
                                  :events="ideStore.editingFile.sourceContent.events"
                                  :bindEvents="ideStore.editingFile.sourceContent._bindEvents"
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

  .gl-dnd-col {
    padding: 0.5em;
  }

  .gl-dnd-card-toolbar {
    position: absolute;
    top: -16px;
    display: none;
    text-align: center;
    width: 100%;
  }

  .gl-dnd-col:hover > .gl-dnd-card-toolbar {
    display: block;
  }

  .gl-ide-layout-stage .gl-dnd-row-handle {
    /*border: 1px solid #f0f0f0;*/
    /*margin-bottom: 0.1em;*/
    /*cursor: move;*/
  }

  .gl-ide-layout-stage .gl-dnd-col-wrapper {
    min-height: 2em;
  }

  .gl-ide-layout-stage .gl-dnd-col-wrapper:hover {
    /*background-color: #91d5ff;*/
    /*background-color: #ffffff;*/
    /*box-shadow: 0 0 5px #1e62a3;*/
    /*border: 1px dotted #1e62a3;*/
  }

  /*.gl-ide-layout-stage .gl-dnd-row-handle.sortable-chosen{*/
  /*background-color: rgb(107, 209, 255);*/
  /*}*/

  /*.gl-ide-layout-stage .gl-dnd-row-toolbar {*/
    /*position: absolute;*/
    /*right: -0.5em;*/
    /*display: none;*/
  /*}*/

  /*.gl-ide-layout-stage .gl-dnd-row-toolbar i {*/
  /*font-size: 1.5em;*/
  /*line-height: 1.5em;*/
  /*cursor: pointer;*/
  /*}*/

  /*.gl-ide-layout-stage .gl-dnd-row-handle:hover .gl-dnd-row-toolbar {*/
    /*display: inline-block;*/
  /*}*/

  .gl-ide-layout-stage .gl-dnd-row-handle:hover {
    /*box-shadow: 0 0 4px #ffca11;*/
  }

  .gl-ide-layout-stage .gl-dnd-row-handle > div > div {
    /*background-color: rgba(161, 222, 255, 0.35);*/
    /*text-align: center;*/
  }

  .gl-dnd-placeholder{
    display: block;
    background-color: rgba(161, 222, 255, 0.35);
    min-height:2em;
  }

  /*.gl-ide-layout-stage .gl-dnd-col-item-toolbar, .gl-ide-layout-stage .gl-dnd-col-item-hover-title {*/
  /*padding: 0 1em;*/
  /*line-height: 2em;*/
  /*height: 2em;*/
  /*background-color: #e5e5e5*/
  /*}*/


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

  .gl-dnd-row.gl-selected .gl-dnd-row-toolbar {
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


  .gl-ide-layout-stage .gl-dnd-col-toolbar {
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

  .gl-dnd-col.gl-selected .gl-dnd-col-toolbar {
    display: block;
  }

  .gl-ide-layout-stage .gl-dnd-col-toolbar button {
    background-color: #b91fbc;
    border-color: #b91fbc;
    color: white;
  }

  .gl-ide-layout-stage .gl-dnd-col-toolbar button:hover {
    color: #b91fbc;
  }

  .gl-dnd-col.gl-selected {
    border: solid 1px #b91fbc;
  }

  .gl-ide-layout-stage .gl-dnd-col-item-hover-title, .gl-ide-layout-stage .gl-dnd-col-item-breadcrumbs, .gl-ide-layout-stage .gl-dnd-col-item-toolbar {
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

  .gl-col-item-wrapper.gl-selected .gl-dnd-col-item-breadcrumbs, .gl-col-item-wrapper.gl-selected .gl-dnd-col-item-hover-title, .gl-col-item-wrapper.gl-selected .gl-dnd-col-item-toolbar {
    display: block;
  }

  .gl-ide-layout-stage .gl-col-item-wrapper:hover .gl-dnd-col-item-hover-title {
    display: block;
  }

  .gl-dnd-col-item-breadcrumbs .crumbs {
    display: inline-block;
    padding: 0 0.5em;
    cursor: pointer;
  }

  .gl-dnd-col-item-breadcrumbs .crumbs-link {
    display: inline-block;
  }

  .gl-dnd-col-item-handle {
    cursor: move;
  }

  .gl-ide-layout-stage .gl-dnd-col-item-toolbar button {
    background-color: #178df7;
    border-color: #178df7;
    color: white;
  }

  .gl-ide-layout-stage .gl-dnd-col-item-toolbar button:hover{
    color: #3facff;
  }

  .gl-component-wrapper:hover {
    border: solid 1px #178df7;
  }

  .gl-col-item-wrapper.gl-selected .gl-component-wrapper{
    border: solid 1px #178df7;
  }


</style>

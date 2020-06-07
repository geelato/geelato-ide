<template>
  <div class="gl-ide-layout-stage"
       style="height: 760px;overflow-x: hidden;padding-left: 0.5em;padding-right: 1em;padding-top: 1.5em">
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
      return {
      }
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
    border: 1px solid #f0f0f0;
    margin-bottom: 0.1em;
    cursor: move;
  }

  .gl-ide-layout-stage .gl-dnd-col-wrapper {
    min-height: 2em;
  }

  .gl-ide-layout-stage .gl-dnd-col-wrapper:hover {
    /*background-color: #91d5ff;*/
    /*background-color: #ffffff;*/
    box-shadow: 0 0 5px #1e62a3;
    /*border: 1px dotted #1e62a3;*/
  }

  /*.gl-ide-layout-stage .gl-dnd-row-handle.sortable-chosen{*/
  /*background-color: rgb(107, 209, 255);*/
  /*}*/

  .gl-ide-layout-stage .gl-dnd-row-toolbar {
    position: absolute;
    right: -0.5em;
    display: none;
  }

  .gl-ide-layout-stage .gl-dnd-row-toolbar i {
    font-size: 1.5em;
    line-height: 1.5em;
    cursor: pointer;
  }

  .gl-ide-layout-stage .gl-dnd-row-handle:hover .gl-dnd-row-toolbar {
    display: inline-block;
  }

  .gl-ide-layout-stage .gl-dnd-col-toolbar {
    padding: 0 1em;
    line-height: 2em;
    height: 2em;
    background-color: #e5e5e5
  }

  .gl-ide-layout-stage .gl-dnd-col-toolbar button {
    background-color: #e5e5e5;
    border-color: #e5e5e5
  }

  .gl-ide-layout-stage .gl-dnd-row-handle:hover {
    box-shadow: 0 0 4px #ffca11;
  }

  .gl-ide-layout-stage .gl-dnd-row-handle > div > div {
    background-color: rgba(161, 222, 255, 0.35);
    /*text-align: center;*/
  }


</style>

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
      return {}
    },
    created() {
      // this.$gl.bus.$on(events.ide_setting_update, this.onSettingUpdate)
    },
    destroyed(){
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
    /*background-color: rgba(114,218,255,1);*/
  }

  /*.gl-dnd-card-toolbar:hover{*/
  /*background-color: rgba(114,218,255,1);*/
  /*}*/

  .gl-dnd-col:hover > .gl-dnd-card-toolbar {
    display: block;
  }
</style>

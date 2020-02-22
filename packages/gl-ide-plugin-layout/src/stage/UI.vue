<template>
  <div class="gl-ide-layout-stage" style="height: 760px;overflow-x: hidden;padding-left: 0.5em;padding-right: 1em">
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
    mounted() {
      console.log('geelato-ide >  GlIdePluginLayoutStageUI > mounted()', this.ideStore.editingFile.sourceContent)
    },
    methods: {
      commit() {
      }
    }
  }
</script>

<style>
</style>

<template>
  <div class="gl-ide-layout-stage" style="height: 760px;overflow-x: hidden;padding-left: 0.5em;padding-right: 1em">
    <GlIdePluginLayoutStageItem :rows="ideStore.editingFile.sourceContent.opts.layout.rows"
                                :componentRefs="ideStore.editingFile.sourceContent._componentRefs"
                                :events="ideStore.editingFile.sourceContent.events"
                                :bindEvents="ideStore.editingFile.sourceContent._bindEvents"
                                :gutter="ideStore.editingFile.sourceContent.opts.layout.gutter"
                                :treeNodes="ideStore.editingFile.objectTree"
    ></GlIdePluginLayoutStageItem>
  </div>
</template>

<script>
  import GlIdePluginLayoutStageItem from './Item'

  export default {
    name: "GlIdePluginLayoutStage",
    components: {GlIdePluginLayoutStageItem},
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
      console.log('geelato-ide >  GlIdePluginLayoutStage > mounted()', this.ideStore.editingFile.sourceContent)
    },
    methods: {
      commit() {
      }
    }
  }
</script>

<style>
</style>

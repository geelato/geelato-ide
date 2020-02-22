<template>
  <div class="gl-ide-layout-stage" style="height: 760px;overflow-x: hidden;padding-left: 0.5em;padding-right: 1em">
    <gl-ide-stage-code :content="ideStore.editingFile.sourceContent" :opts="{readOnly:true}" :layout="layout"></gl-ide-stage-code>
  </div>
</template>
<script>
  export default {
    name: "GlIdePluginLayoutStageSrc",
    components: {},
    props: {
      ideStore: {
        type: Object,
        required: true
      },
      layout: {
        type: Object,
        default() {
          return {
            width: 1024,
            height: 600
          }
        }
      },
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

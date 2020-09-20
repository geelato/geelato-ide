<template>
  <div class="gl-ide-layout-stage" style="height: 760px;overflow-x: hidden">
    <gl-ide-stage-code v-if="refreshFlag" :content="ideStore.editingFile.sourceContent" :opts="{readOnly:true}"
                       :layout="layout"></gl-ide-stage-code>
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
      activeKey: Number
    },
    data() {
      return {
        refreshFlag: true
      }
    },
    watch: {
      activeKey: function (val, oval) {
        this.refreshFlag = false
        console.log('geelato-ide > GlIdePluginLayoutStageUI > activeKey() > refreshFlag:', val, oval)
        console.log('geelato-ide > GlIdePluginLayoutStageUI > activeKey() > sourceContent:', this.ideStore.editingFile.sourceContent)
        this.$nextTick(function () {
          this.refreshFlag = true
        })
      }
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

<template>
  <div :size="size" :style="stageStyle">
    <a-tabs defaultActiveKey="1" :size="size" :style="{'min-height':`${height}px`,'max-height':`${height}px`}">
      <!--*******************************************************************************-->
      <!--******************************* 1、树 ****************************************-->
      <!--*******************************************************************************-->
      <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="eye"/>
        预览
      </span>
        <gl-tree ref="tree" :opts="config"></gl-tree>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import mixin from '../../mixin-designer'

  export default {
    name: "GlIdePluginTreeDesignerStage",
    components: {},
    mixins: [mixin],
    props: {
      opts: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        config: this.opts
      }
    },
    computed: {},
    mounted: function () {
    },
    methods: {},
  }
</script>

<style scoped>
  .column-properties {
    font-weight: 700;
    background-color: #d3d3d3 !important;
  }

  th.column-properties {
    font-weight: 700;
    background-color: #FFFFFF !important;
  }

  .column-name {
    background-color: #d9f8ff !important;
  }
</style>

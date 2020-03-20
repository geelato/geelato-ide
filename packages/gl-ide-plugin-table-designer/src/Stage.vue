<template>
  <div :size="size" style="padding: 2em" :style="{'min-height':`${height}px`,'max-height':`${height}px`}">
    <gl-table ref="table" :opts="config" :query="{em:'platform_user'}"></gl-table>
  </div>
</template>

<script>
  import mixin from '../../mixin-designer'

  export default {
    name: "GlIdePluginTableDesignerStage",
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

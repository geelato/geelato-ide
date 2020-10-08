<template>
  <div :size="size" :style="stageStyle">

    日jjjj
  </div>
</template>

<script>
  import mixin from '../../mixin-designer'

  export default {
    name: "GlIdePluginSegmentDesignerStage",
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
</style>

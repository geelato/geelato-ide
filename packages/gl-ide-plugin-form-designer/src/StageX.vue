<template>
  <div>
    <a-tabs defaultActiveKey="1" :size="size" :style="{'min-height':`${height}px`,'max-height':`${height}px`}">
      <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="picture"/>
        界面
      </span>
        aaass
      </a-tab-pane>
      <!--<a-tab-pane key="2">-->
      <!--<span slot="tab">-->
      <!--<a-icon type="android"/>-->
      <!--布局-->
      <!--</span>-->
      <!--Tab 2-->
      <!--</a-tab-pane>-->
    </a-tabs>
  </div>
</template>

<script>
  import mixin from './mixin'

  export default {
    name: "Stage",
    components: {},
    mixins: [mixin],
    opts: {
      type: Object,
      required: false
    },
    mounted() {
      console.log('this.opts> ', this.opts)
    }
  }
</script>

<style scoped>

</style>

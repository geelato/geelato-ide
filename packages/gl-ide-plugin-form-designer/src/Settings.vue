<template>
  <div>
    <a-tabs defaultActiveKey="1" :size="size" :style="{'min-height':`${height}px`,'max-height':`${height}px`}">
      <a-tab-pane key="1">
      <span slot="tab">
        <!--<a-icon type="info-circle"/>-->
        表单
      </span>
        Tab 1
      </a-tab-pane>
      <a-tab-pane key="2">
      <span slot="tab">
        <!--<a-icon type="edit"/>-->
        字段
      </span>
        Tab 2
      </a-tab-pane>
      <a-tab-pane key="3">
      <span slot="tab">
        <!--<a-icon type="border"/>-->
        单元格
      </span>
        Tab 2
      </a-tab-pane>
      <a-tab-pane key="4">
      <span slot="tab">
        <!--<a-icon type="android"/>-->
        标题
      </span>
        Tab 2
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import mixin from './mixin'
  export default {
    name: "Settings",
    mixins: [mixin]
  }
</script>

<style scoped>

</style>

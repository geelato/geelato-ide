<template>
  <div style="width:100%;overflow-y: scroll">
    <a-row>
      <a-col :span="4" style="border-right: 1px solid #F2F2F2">
        <sidebar :size="size" :height="height"></sidebar>
      </a-col>
      <a-col :span="14" style="border-right: 1px solid #F2F2F2">
        <stage :size="size" :height="height" :opts="{form:formTemplateData}"></stage>
      </a-col>
      <a-col :span="6">
        <settings :size="size" :height="height"></settings>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Sidebar from './Sidebar'
  import Stage from './Stage'
  import Settings from './Settings'
  import formTemplateData from './formTemplateData.js'

  export default {
    name: "gl-ide-plugin-form-designer",
    components: {Sidebar, Stage, Settings},
    data() {
      return {
        height: window.innerHeight * .80,
        size: 'small',
        formTemplateData: formTemplateData
      }
    },
    created() {
      // window.resize(() => {
      //   this.height = window.innerHeight * .80
      // })
    }
  }
</script>

<style scoped>
  .ant-tabs-tab, .ant-tabs-bar {
    margin: 0
  }
</style>

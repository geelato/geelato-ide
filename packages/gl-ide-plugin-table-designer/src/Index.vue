<template>
  <div style="width:100%;overflow-y: scroll">
    <a-row>
      <a-col :span="18" style="border-right: 1px solid #F2F2F2">
        <stage v-if="refreshToggleFlag" :size="size" :height="height" :opts="templateData"></stage>
      </a-col>
      <a-col :span="6">
        <settings :size="size" :height="height" :opts="templateData" @change="onChange"></settings>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Sidebar from './Sidebar'
  import Stage from './Stage'
  import Settings from './Settings'
  import templateData from './DataTemplate.js'

  export default {
    name: "GlIdePluginTableDesigner",
    components: {Sidebar, Stage, Settings},
    data() {
      return {
        refreshToggleFlag: true,
        height: window.innerHeight * .80,
        size: 'default',
        templateData: {}
      }
    },
    created() {
      // 设置初始化值，确保所有值都可双向绑定
      // templateData.showPagination = (templateData.showPagination === undefined ? true : templateData.showPagination)

      for (let i in templateData.table.columns) {
        let column = templateData.table.columns[i]
        column.needTotal = (column.needTotal === undefined ? false : column.needTotal)
        column.sorter = (column.sorter === undefined ? false : column.sorter)
      }
      this.templateData = JSON.parse(JSON.stringify(templateData))
    },
    methods: {
      refreshStage() {
        let that = this
        that.refreshToggleFlag = false
        that.$nextTick(function () {
          that.refreshToggleFlag = true
        })
      },
      onChange(e) {
        if (e.needRefreshStage) {
          this.refreshStage()
        }
      }

    }
  }
</script>

<style scoped>
  .ant-tabs-tab, .ant-tabs-bar {
    margin: 0
  }
</style>

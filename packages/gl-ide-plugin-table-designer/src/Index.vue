<template>
  <div style="width:100%;">
    <a-row>
      <a-col :span="18" style="border-right: 1px solid #F2F2F2">
        <stage v-if="refreshToggleFlag" :size="size" :height="height" :tabPanelStyle="tabPanelStyle"
               :opts="templateData"></stage>
      </a-col>
      <a-col :span="6">
        <settings :size="size" :height="height" :tabPanelStyle="tabPanelStyle" :opts="templateData"
                  @change="onChange"></settings>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Stage from './Stage'
  import Settings from './Settings'
  import templateData from './DataTemplate.js'

  export default {
    name: "GlIdePluginTableDesigner",
    components: {Stage, Settings},
    data() {
      return {
        refreshToggleFlag: true,
        size: 'default',
        templateData: {},
        height: window.innerHeight * .85,
        tabPanelStyle: {
          'height': '100%',
          'min-height': window.innerHeight * .85 - 48 + 'px',
          'max-height': window.innerHeight * .85 - 48 + 'px',
          'overflow-y': "scroll"
        }
      }
    },
    watch: {
      // height() {
      //   return window.innerHeight * .85
      // },
      // tabPanelStyle() {
      //   return {
      //     'max-height': window.innerHeight * .85 - 16 - 24,
      //     'overflow-y': "scroll"
      //   }
      // }
    },
    created() {
      // 设置初始化值，确保所有值都可双向绑定
      // templateData.pagination = (templateData.pagination === undefined ? {position: 'auto'} : templateData.pagination)
      templateData.table.showHeader = (templateData.table.showHeader === undefined ? true : templateData.table.showHeader)
      templateData.table.show = (templateData.table.show === undefined ? true : templateData.table.show)

      for (let i in templateData.query.mix.properties) {
        let property = templateData.query.mix.properties[i]
        property.props = (property.props === undefined ? {} : property.props)
      }

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

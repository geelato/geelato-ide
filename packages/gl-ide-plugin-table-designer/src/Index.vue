<template>
  <div style="width:100%;">
    <a-row>
      <a-col :span="17" style="border-right: 1px solid #F2F2F2">
        <stage v-if="refreshToggleFlag" :size="size" :height="height" :tabPanelStyle="tabPanelStyle"
               :opts="cardBind"></stage>
      </a-col>
      <a-col :span="7">
        <settings :size="size" :height="height" :tabPanelStyle="tabPanelStyle" :opts="cardBind"
                  @change="onChange"></settings>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Stage from './Stage'
  import Settings from './Settings'

  export default {
    name: "GlIdePluginTableDesigner",
    components: {Stage, Settings},
    props: {
      opts: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        refreshToggleFlag: true,
        size: 'default',
        cardBind: {},
        height: window.innerHeight * .85,
        tabPanelStyle: {
          'height': '100%',
          'min-height': window.innerHeight * .85 - 48 + 'px',
          'max-height': window.innerHeight * .85 - 48 + 'px',
          'overflow-y': "scroll"
        }
      }
    },
    watch: {},
    created() {
      // 设置初始化值，确保所有值都可双向绑定
      this.opts.table.showHeader = (this.opts.table.showHeader === undefined ? true : this.opts.table.showHeader)
      this.opts.table.show = (this.opts.table.show === undefined ? true : this.opts.table.show)

      for (let i in this.opts.query.mix.properties) {
        let property = this.opts.query.mix.properties[i]
        property.props = (property.props === undefined ? {} : property.props)
      }

      for (let i in this.opts.table.columns) {
        let column = this.opts.table.columns[i]
        column.needTotal = (column.needTotal === undefined ? false : column.needTotal)
        column.sorter = (column.sorter === undefined ? false : column.sorter)
        // 列格式化辅助字段
        column.customRenderString = (column.customRenderString === undefined ? '' : column.customRenderString)
        // if (column.customRenderString) {
        //   try {
        //     column.customRender = eval(column.customRenderString)
        //   } catch (e) {
        //     console.error('gl-ide > gl-ide-plugin-table-designer > The format of column.customRenderString is incorrect:', column.customRenderString + '.', e)
        //   }
        // } else {
        //   column.customRender = undefined
        // }
      }
      this.cardBind = this.opts
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

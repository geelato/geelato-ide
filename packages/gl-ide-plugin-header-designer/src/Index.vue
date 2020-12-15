<template>
  <div style="width:100%;">
    <table class="gl-table">
      <tr class="gl-table-row gl-table-row-header">
        <th class="gl-table-cell" style="width: 40%">项</th>
        <th class="gl-table-cell">值</th>
      </tr>
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          标题：
        </td>
        <td class="gl-table-cell">
          <a-input v-model="config.title" style="width: 99%"/>
        </td>
      </tr>
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          <a-icon type="info-circle" title=""/>
          颜色：
        </td>
        <td class="gl-table-cell">
          <a-input-search placeholder="选择并绑定实体" v-model="config.entity" @search="openSelectEntityList">
            <a-button type="primary" slot="enterButton">
              <a-icon type="select"/>
              选择
            </a-button>
          </a-input-search>
        </td>
      </tr>
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          是否展示查询栏：
        </td>
        <td class="gl-table-cell">
          <a-switch :defaultChecked="config.query.show"
                    @change="config.query.show=!config.query.show;onChange()"></a-switch>
        </td>
      </tr>
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          是否展示操作栏：
        </td>
        <td class="gl-table-cell">
          <a-switch :defaultChecked="config.toolbar.show"
                    @change="config.toolbar.show=!config.toolbar.show;onChange(true)"></a-switch>
        </td>
      </tr>
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          每页默认展示多少行：
        </td>
        <td class="gl-table-cell">
          <a-input-number v-model="config.table.pageSize" style="width: 5em"></a-input-number>
        </td>
      </tr>
      <!--<tr class="gl-table-row">-->
      <!--<td class="gl-table-cell gl-table-cell-sub-label">是否展示表头：</td>-->
      <!--<td class="gl-table-cell">-->
      <!--<a-switch :defaultChecked="config.table.showHeader"-->
      <!--@change="config.table.showHeader=!config.table.showHeader;onChange(true)"/>-->
      <!--</td>-->
      <!--</tr>-->
    </table>
  </div>
</template>

<script>

  export default {
    name: "GlIdePluginHeaderDesigner",
    components: {},
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

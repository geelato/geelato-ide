<template>
  <div class="gl-ide-plugin-x-designer-settings">
    <div v-if="config">
      <div class="gl-title">
        <a-icon type="setting"/>
        外观
      </div>
      <table class="gl-table">
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            主题：
          </td>
          <td class="gl-table-cell">
            <a-radio-group :value="1" size="small">
              <a-radio-button :value="1">默认</a-radio-button>
            </a-radio-group>
          </td>
        </tr>
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            显示边框：
          </td>
          <td class="gl-table-cell">
            <a-switch v-model="card.showBorder"></a-switch>
          </td>
        </tr>
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            显示模式：
          </td>
          <td class="gl-table-cell">
            <a-select v-model="card.displayMode" :allowClear="true" style="min-width: 99%">
              <a-select-option v-for="displayModeOption in selectionDisplayMode" :key="displayModeOption.value"
                               :value="displayModeOption.value"
                               :title="displayModeOption.title">
                {{displayModeOption.title}}
              </a-select-option>
            </a-select>
          </td>
        </tr>
      </table>

      <div class="gl-title">
        <a-icon type="setting"/>
        数据
      </div>
      <table class="gl-table">
        <tr class="gl-table-row" v-for="(cardItem,cardItemIndex) in card.items" :key="cardItemIndex">
          <td class="gl-table-cell gl-table-cell-sub-label">
            标题-{{cardItemIndex}}：
          </td>
          <td class="gl-table-cell">
            <a-input v-model="cardItem.title" style="width: 98%"/>
          </td>
        </tr>
      </table>

      <div class="gl-title">
        <a-icon type="setting"/>
        工具栏
      </div>
      <!--<table class="gl-table">-->

      <!--<tr class="gl-table-row">-->
      <!--<td class="gl-table-cell gl-table-cell-sub-label">-->
      <!--<a-icon type="info-circle" title="若选择是，该工具体会合并到弹出窗口页面下方的工具栏中。"/>-->
      <!--加入弹窗工具栏：-->
      <!--</td>-->
      <!--<td class="gl-table-cell">-->
      <!--<a-switch></a-switch>-->
      <!--</td>-->
      <!--</tr>-->
      <!--</table>-->
    </div>
    <a-alert v-else
             message="未选择卡片"
             description="请将鼠标移动到左边的设计界面上，点击相应的【卡片设置】按钮。"
             type="info"
             showIcon
    />
  </div>
</template>

<script>


  export default {
    name: "GlIdePluginLayoutCardSettings",
    components: {},
    props: {
      config: {
        type: Object
      }
    },
    watch: {
      card: {
        handler(val, oval) {
          this.emit()
        },
        deep: true
      }
    },
    data() {
      return {
        card: {
          showBorder: this.config && this.config.showBorder,
          displayMode: this.config && this.config.displayMode || 'Default',
          // 依据不同的displayMode，opts内容有所不同
          opts: {},
          items: this.config && this.config.items
        },
        selectionDisplayMode: [{title: '默认(Default)', value: 'Default'}, {title: '标签页(Tabs)', value: 'Tabs'}, {
          title: '折叠面板(Collapse)',
          value: 'Collapse'
        }]
      }
    },
    created() {
    },
    destroyed() {
      this.emit()
    },
    methods: {
      emit() {
        this.$emit('update', {value: this.card})
      }
    }

  }
</script>

<style scoped>
</style>

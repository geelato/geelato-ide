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
        标题
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
      <div class="gl-title" v-if="card.displayMode==='Tabs'">
        <a-icon type="setting"/>
        标签页（Tabs）设置
      </div>
      <table class="gl-table" v-if="card.displayMode==='Tabs'">
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            显示位置：
          </td>
          <td class="gl-table-cell">
            <a-radio-group v-model="card.opts.tabPosition" size="small">
              <a-radio-button value="top">上</a-radio-button>
              <a-radio-button value="bottom">下</a-radio-button>
              <a-radio-button value="left">左</a-radio-button>
              <a-radio-button value="right">右</a-radio-button>
            </a-radio-group>
          </td>
        </tr>
      </table>
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
    updated() {
      console.log('updated config..........', this.config)
      this.card.showBorder = this.config && this.config.showBorder
      this.card.displayMode = this.config && this.config.displayMode || 'Default'
      this.card.items = this.config && this.config.items
    },
    mounted() {
      console.log('mounted config..........', this.config)
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

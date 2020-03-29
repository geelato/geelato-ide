<template>
  <div style="width:100%;">
    <div class="gl-ide-plugin-x-designer-settings">
      <div v-if="config">
        <div class="gl-title">
          <a-icon type="setting"/>
          外观
        </div>
        <table class="gl-table">
          <tr class="gl-table-row">
            <td class="gl-table-cell gl-table-cell-sub-label">
              页面来源：
            </td>
            <td class="gl-table-cell">
              <a-radio-group v-model="config.src" size="small">
                <a-radio-button value="platform" @click="()=>{config.src='platform'}">平台页面</a-radio-button>
                <a-radio-button value="external" @click="()=>{config.src='external'}">外部页面</a-radio-button>
              </a-radio-group>
            </td>
          </tr>
          <tr class="gl-table-row" v-show="config.src==='external'">
            <td class="gl-table-cell gl-table-cell-sub-label">
              外部地址：
            </td>
            <td class="gl-table-cell">
              <input v-model="config.url" style="width: 100%" placeholder="例如：https://www.geelato.org"/>
            </td>
          </tr>
          <tr class="gl-table-row" v-show="config.src==='platform'">
            <td class="gl-table-cell gl-table-cell-sub-label">平台页面：</td>
            <td class="gl-table-cell">
              <a-tree-select
                  style="width: 100%"
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="treeData"
                  placeholder="Please select"
                  treeDefaultExpandAll
                  v-model="config.extendId"
              >
            <span style="color: #08c" slot="title" slot-scope="{key, value}" v-if="key='0-0-1'">
              {{value}}
            </span>
              </a-tree-select>
            </td>
          </tr>
          <tr class="gl-table-row">
            <td class="gl-table-cell gl-table-cell-sub-label">
              页面模式：
            </td>
            <td class="gl-table-cell">
              <a-radio-group v-model="config.sizeMode" size="small">
                <a-radio-button value="auto" @click="()=>{config.sizeMode='auto'}">自适用</a-radio-button>
                <a-radio-button value="fixed" @click="()=>{config.sizeMode='fixed'}">指定大小</a-radio-button>
              </a-radio-group>
            </td>
          </tr>
          <tr class="gl-table-row" v-if="config.sizeMode==='fixed'">
            <td class="gl-table-cell gl-table-cell-sub-label">
              页面宽度：
            </td>
            <td class="gl-table-cell">
              <input v-model="config.width" placehodler="例如：1024px" style="width: 100%"/>
            </td>
          </tr>
          <tr class="gl-table-row" v-if="config.sizeMode==='fixed'">
            <td class="gl-table-cell gl-table-cell-sub-label">
              页面高度：
            </td>
            <td class="gl-table-cell">
              <input v-model="config.height" placehodler="例如：600px" style="width: 100%"/>
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
  </div>
</template>

<script>
  import utils from '../../../runtime/utils.js'
  import pageLoaderConfig from '../../gl-ide-plugin-cards/src/data/page_loader'

  export default {
    name: "GlIdePluginPageLoaderDesigner",
    components: {},
    props: {
      opts: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        config: this.opts,
        treeData: []
      }
    },
    watch: {},
    mounted() {
      // 初始化默认值，补充默认属性
      for (let key in pageLoaderConfig) {
        this.$set(this.config, key, this.config[key] || pageLoaderConfig[key])
      }
      console.log('this.config>', this.config)
      this.loadPageTreeData()
    },
    methods: {
      loadPageTreeData() {
        const that = this
        // loadPageTreeData
        that.$gl.api.query('platform_tree_node', 'id,parent,text,type,icon,flag', {treeId: that.$ide.store.editingProject.id}).then(function (res) {
          console.log('gl-ide-plugin-layout > OpenModal > loadPageTreeData() > res:', res)
          that.treeData = utils.listToAntTree(res.data, that.$ide.store.editingProject.id, true)
          console.log('gl-ide-plugin-layout > OpenModal > loadPageTreeData() > treeData:', that.treeData)
        })
      }
    }
  }
</script>

<style scoped>
</style>

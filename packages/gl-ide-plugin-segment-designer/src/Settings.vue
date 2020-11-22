<template>
  <div class="gl-ide-plugin-designer-settings">
    <a-tabs defaultActiveKey="1" :size="size" :style="{'min-height':`${height}px`,'max-height':`${height}px`}">
      <!--*******************************************************************************-->
      <!--******************************* 1、表 ****************************************-->
      <!--*******************************************************************************-->
      <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="profile"/>
        表
      </span>
        <div :style="tabPanelStyle">

        </div>
      </a-tab-pane>
      <!--*******************************************************************************-->
      <!--******************************* 2、结果列 ****************************************-->
      <!--*******************************************************************************-->
      <a-tab-pane key="2">
      <span slot="tab">
        <a-icon type="border"/>
        结果列
      </span>
        <div :style="tabPanelStyle">

        </div>
      </a-tab-pane>
      <!--*******************************************************************************-->
      <!--******************************* 3、查询列 ****************************************-->
      <!--*******************************************************************************-->
      <a-tab-pane key="3">
      <span slot="tab">
        <a-icon type="search"/>
        查询列
      </span>
        <div :style="tabPanelStyle">

        </div>
      </a-tab-pane>
      <!--*******************************************************************************-->
      <!--******************************* 4、行操作 ****************************************-->
      <!--*******************************************************************************-->
      <a-tab-pane key="4">
      <span slot="tab">
        <a-icon type="thunderbolt"/>
        操作
      </span>
        <div :style="tabPanelStyle">
          <h4 style="margin: 0.5em 1em">工具栏</h4>

        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import mixin from '../../mixin-designer'
  import ideConfig from '../../gl-ide/src/data/ideSelectItems.js'
  import SelectEntityList from '../../components/gl-data-source/src/SelectEntityList'

  export default {
    name: "GlIdePluginSegmentDesignerSettings",
    components: {},
    mixins: [mixin],
    props: {
      opts: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        config: this.opts,
        currentEntityColumns: [],
        dict: ideConfig.copDict,
        cops: ideConfig.cops,
        controls: ideConfig.controls,
        btnTypes: ideConfig.btnTypes
      }
    },
    computed: {},
    mounted() {
      let that = this
      // 初始化
      that.$gl.api.query('platform_dev_table', 'id,tableName,tableComment', {tableName: this.config.entity}).then(function (res) {
        that.loadEntityMeta({tableId: res.data[0].id})
      })
      this.generateGid()
    },
    methods: {
      onClone(original) {
        console.log('onClone() > original;', original)
      },
      onMove(evt, originalEvent) {
        console.log('onClone() > evt, originalEvent;', evt, originalEvent)
      },
      /**
       * 初始化时，为列、操作创建gid
       */
      generateGid() {

      },
      onChange(needRefreshStage = false, data) {
        this.$emit('change', {needRefreshStage: needRefreshStage, data: data})
      },
      openSelectEntityList() {
        this.$gl.ui.openModal(this, {
          title: '选择实体',
          width: '1000px',
          height: '480px',
          body: {
            type: 'static',
            component: SelectEntityList,
            props: {}
          },
          actions: [{
            fn: 'close',
            ctx: 'modal',
            text: '取消'
          }],
          on: [{
            fn: 'selectItem',
            ctx: 'content',
            then: {
              fn: 'onEntitySelected',
              ctx: 'opener',
              then: {
                fn: 'close',
                ctx: 'modal'
              },
              dataMapping: {
                id: '$ctx.item.id',
                name: '$ctx.item.title'
              }
            }
          }]
        })
      },
      onEntitySelected(params, data) {
        this.config.entity = data.name
        this.loadEntityMeta({tableId: data.id})
      },
      loadEntityMeta(kvConditions) {
        let that = this
        that.$gl.api.query('platform_dev_column', 'id,title,fieldName,name,description', kvConditions).then(function (res) {
          that.currentEntityColumns = res.data
        })
      },
      isOperateColumn(col) {
        return col.scopedSlots && col.scopedSlots.customRender === 'action'
      }
    }
  }
</script>

<style>

</style>

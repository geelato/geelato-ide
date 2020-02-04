<template>
  <div class="gl-ide-plugin-x-designer-settings">
    <a-tabs defaultActiveKey="2" :size="size" :style="{'min-height':`${height}px`,'max-height':`${height}px`}">
      <a-tab-pane key="1">
      <span slot="tab">
        <!--<a-icon type="info-circle"/>-->
        表单
      </span>
        <div>
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
          </table>
          <div class="gl-title">
            <a-icon type="setting"/>
            数据
          </div>
          <table class="gl-table">
          </table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2">
      <span slot="tab">
        <!--<a-icon type="edit"/>-->
        字段
      </span>
        <a-alert v-if="!fieldConfig.field" style="text-align: center" message="请先点击选择左边字段" type="info" class="gl-card-gutter"/>
        <div v-if="fieldConfig.field">
          <div class="gl-title">
            <a-icon type="setting"/>
            外观
          </div>
          <table class="gl-table">
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                字段名：
              </td>
              <td class="gl-table-cell">
                <input v-model="fieldConfig.title" style="width: 99%"/>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                <a-icon type="info-circle" title=""/>
                控件类型：
              </td>
              <td class="gl-table-cell">
                <a-select v-model="fieldConfig.control" :allowClear="true" style="min-width: 99%">
                  <a-select-option v-for="(controlItem,controlItemIndex) in controlTypes" :key="controlItemIndex"
                                   :value="controlItem.control"
                                   :title="controlItem.title">
                    <a-icon :type="controlItem.icon"/>&nbsp;&nbsp;{{controlItem.title}}
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
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                <a-icon type="info-circle" title="绑定数据库的字段，才可以存储到后台。"/>
                绑定数据库字段：
              </td>
              <td class="gl-table-cell">
                <div style="line-height: 2em;margin-left: 0.5em">实体：</div>
                <a-input-search placeholder="选择并绑定实体" v-model="fieldConfig.entity" @search="openSelectEntityList">
                  <a-button type="primary" slot="enterButton">
                    <a-icon type="select"/>
                    选择
                  </a-button>
                </a-input-search>
                <div style="line-height: 2em;margin-left: 0.5em">字段：</div>
                <!--:style="{color:!containField()?'':'red'}"-->
                <a-select v-model="fieldConfig.field" :allowClear="true" style="min-width: 99%">
                  <a-select-option v-for="colMeta in currentEntityColumns" :key="colMeta.fieldName"
                                   :title="colMeta.title">
                    {{colMeta.fieldName}}&nbsp;({{colMeta.title}})
                  </a-select-option>
                </a-select>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                保存时是否排除该字段：
              </td>
              <td class="gl-table-cell">
                <a-switch :defaultChecked="fieldConfig.isServerSaveIgnore"></a-switch>
              </td>
            </tr>
            <tr class="gl-table-row" v-if="freshFlag&&isContainDataItems(fieldConfig)">
              <td class="gl-table-cell gl-table-cell-sub-label">
                {{getControlType(fieldConfig.control).title}}项：
              </td>
              <td class="gl-table-cell">
                <select-settings :dataItems="fieldConfig.data"></select-settings>
              </td>
            </tr>
          </table>
          <div class="gl-title">
            <a-icon type="setting"/>
            验证、权限规则
          </div>
          <table class="gl-table">
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                是否必填：
              </td>
              <td class="gl-table-cell">
                <a-switch :defaultChecked="fieldConfig.rules.required"></a-switch>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                是否唯一：
              </td>
              <td class="gl-table-cell">
                <a-switch :defaultChecked="fieldConfig.rules.unique"></a-switch>
              </td>
            </tr>
          </table>
          <div class="gl-title">
            <a-icon type="setting"/>
            提示、描述、说明
          </div>
          <table class="gl-table">
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                占位符：
              </td>
              <td class="gl-table-cell">
                <input v-model="fieldConfig.props.placeholder" style="width: 99%"/>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                提示描述：
              </td>
              <td class="gl-table-cell">
                <textarea v-model="fieldConfig.tips" style="width: 99%" rows="5"></textarea>
              </td>
            </tr>
          </table>
        </div>
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
  import mixin from '../mixin'
  import controlTypes from '../data/controlTypes'
  import SelectEntityList from '../../../gl-ide/src/select/SelectEntityList'
  import SelectSettings from './SelectSettings'


  export default {
    name: "Settings",
    components: {SelectSettings},
    mixins: [mixin],
    data() {
      return {
        fieldConfig: {
          title: '',
          control: '',
          field: '',
          isServerSaveIgnore: false,
          props: {},
          rules: {
            required: false
          },
          data: []
        },
        freshFlag: true,
        currentEntityColumns: [],
        toSelectEntityNames: [],
        // 用于设计
        controlTypes: controlTypes
      }
    },
    created() {
      // 侦听舞台字段的选择（包括添加）事件
      this.$gl.bus.$on('gl-ide-plugin-form-designer.stage.fieldSelect', this.onFieldSelect)
    },
    destroyed() {
      this.$gl.bus.$off('gl-ide-plugin-form-designer.stage.fieldSelect', this.onFieldSelect)
    },
    methods: {
      /**
       * 初始化字段默认信息
       * @param item 字段
       */
      onFieldSelect(item, bindEntityNames) {
        for (let key in bindEntityNames) {
          this.toSelectEntityNames.push({
            text: key,
            value: bindEntityNames[key]
          })
        }
        console.log(JSON.stringify(item), bindEntityNames, this.toSelectEntityNames)
        if (item.rules == undefined) {
          // item.rules = {}
          this.$set(item, 'rules', {})
        }
        if (item.props == undefined) {
          // item.props = {}
          this.$set(item, 'props', {})
        }
        if (this.isContainDataItems(item) && (item.data === undefined || item.data.length === 0)) {
          // item.data = [{text: '选项一', value: 0}]
          this.$set(item, 'data', [{text: '选项一', value: 0}])
          // item.props.defaultActiveIndex = item.props.defaultActiveIndex || 0
          this.$set(item.props, 'defaultActiveIndex', item.props.defaultActiveIndex || 0)
        }

        // 对于无实体的，从当前表单已配置的实体中，默认选择第一项
        if (!item.entity && this.toSelectEntityNames.length > 0) {
          // this.$set(item, 'entity', this.toSelectEntityNames[0].key)
          item.entity = this.toSelectEntityNames[0].value
        }
        this.fieldConfig = item

        // 通过实体加载字段下拉项数据
        this.loadEntityMetaByEntityName(this.fieldConfig.entity)
        this.freshFlag = false
        this.$nextTick(function () {
          this.freshFlag = true
        })
        console.log(JSON.stringify(item))
      },
      getControlType(control) {
        return this.controlTypes.find(function (controlType) {
          return controlType.control === control
        })
      },
      isContainDataItems(item) {
        return item.control === 'select'
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
        this.fieldConfig.entity = data.name
        this.loadEntityMeta({tableId: data.id})
      },
      loadEntityMetaByEntityName(entityName) {
        let that = this
        that.$gl.api.query('platform_dev_table', 'id,title,description', {
          entityName: entityName,
          delStatus: 0,
          enableStatus: 1
        }).then(function (res) {
          that.loadEntityMeta({tableId: res.data[0].id})
        })
      },
      loadEntityMeta(kvConditions) {
        let that = this
        that.$gl.api.query('platform_dev_column', 'id,title,fieldName,name,description', kvConditions).then(function (res) {
          that.currentEntityColumns = res.data
        })
      },
      containField() {
        let found = this.currentEntityColumns.find(function (item) {
          return item.fieldName === this.fieldConfig.field
        })
        return found ? true : false
      }
    }

  }
</script>

<style scoped>
  .gl-table-cell-sub-label {
    /*重置该样式*/
    vertical-align: middle;
    width: 40%;
  }
</style>

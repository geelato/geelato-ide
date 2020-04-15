<template>
  <div class="gl-ide-plugin-x-designer-settings">
    <a-tabs :activeKey="activeTabKey" @change="(key)=>{activeTabKey=key}" :size="size"
            :style="{'min-height':`${height}px`,'max-height':`${height}px`}">
      <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="profile"/>
        表单
      </span>
        <div :style="tabPanelStyle">
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
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                默认实体：
              </td>
              <td class="gl-table-cell">
                <a-select v-model="opts.defaultEntity" :allowClear="true" style="min-width: 99%">
                  <a-select-option v-for="entityItem in toSelectEntityNames" :key="entityItem.value"
                                   :value="entityItem.value"
                                   :title="entityItem.text">
                    {{entityItem.value}}
                  </a-select-option>
                </a-select>
              </td>
            </tr>
          </table>

          <div class="gl-title">
            <a-icon type="setting"/>
            工具栏
          </div>
          <table class="gl-table">
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                是否显示：
              </td>
              <td class="gl-table-cell">
                <a-switch v-model="toolbar.show"></a-switch>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                <a-icon type="info-circle" title="若选择是，该工具体会合并到弹出窗口页面下方的工具栏中。"/>
                加入弹窗工具栏：
              </td>
              <td class="gl-table-cell">
                <a-switch></a-switch>
              </td>
            </tr>
          </table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2">
      <span slot="tab">
        <a-icon type="profile"/>
        单元格
      </span>
        <div :style="tabPanelStyle">
          <div class="gl-title">
            <a-icon type="setting"/>
            外观
          </div>
          <table class="gl-table">
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                背景色：
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
            布局
          </div>
          <table class="gl-table">
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                所在行布局：
              </td>
              <!--:tipFormatter="(item)=>item+1"-->
              <td class="gl-table-cell">
                <a-slider
                    range
                    :marks="marks"
                    :min="0"
                    :max="24"
                    :step="1"
                    v-model="rowLayoutSliderValue"
                    @change="onRowLayoutChange"
                    @afterChange="onAfterRowLayoutChange"
                />
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                单元格布局：
              </td>
              <td class="gl-table-cell">
                <a-slider
                    range
                    :marks="marks"
                    :min="0"
                    :max="24"
                    :step="1"
                    v-model="colLayoutSliderValue"
                    @change="onColLayoutChange"
                    @afterChange="onAfterColLayoutChange"
                />
              </td>
            </tr>
          </table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3">
      <span slot="tab">
        <a-icon type="edit"/>
        字段
      </span>
        <div :style="tabPanelStyle">
          <a-alert v-if="!fieldConfig.field" style="text-align: center" message="请先点击选择左边字段" type="info"
                   class="gl-card-gutter"/>
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
                  绑定数据：
                </td>
                <td class="gl-table-cell">
                  <div style="line-height: 2em;margin-left: 0.5em">先选择实体：</div>
                  <!--<a-input-search placeholder="选择并绑定实体" v-model="fieldConfig.entity" @search="openSelectEntityList"-->
                  <!--readOnly>-->
                  <!--<a-button type="primary" slot="enterButton">-->
                  <!--<a-icon type="select"/>-->
                  <!--选择-->
                  <!--</a-button>-->
                  <!--</a-input-search>-->
                  <a-select v-model="fieldConfig.entity" :allowClear="true" style="min-width: 99%" v-if="refreshFlag"
                            @change="onChangeSelectEntity">
                    <div slot="dropdownRender" slot-scope="menu">
                      <gl-v-nodes :vnodes="menu"/>
                      <a-divider style="margin: 4px 0;"/>
                      <div style="padding: 8px; cursor: pointer;" @click="openSelectEntityList">
                        <a-icon type="plus"/>
                        添加
                      </div>
                    </div>
                    <a-select-option v-for="entityItem in toSelectEntityNames" :key="entityItem.value"
                                     :value="entityItem.value"
                                     :title="entityItem.text">
                      {{entityItem.value}}
                    </a-select-option>
                  </a-select>
                  <div style="line-height: 2em;margin-left: 0.5em">再绑定字段：</div>
                  <!--:style="{color:!containField()?'':'red'}"-->
                  <a-select v-model="fieldConfig.field" :allowClear="true" style="min-width: 99%" v-if="refreshFlag"
                            @change="forceFresh">
                    <a-select-option v-for="(colMeta,colMetaIndex) in currentEntityColumns" :key="colMetaIndex"
                                     :value="colMeta.fieldName" :title="colMeta.title">
                      <span v-if="!colMeta.nullable" class="gl-required" style="font-weight: bold">*</span>{{colMeta.fieldName}}&nbsp;({{colMeta.title}})
                    </a-select-option>
                  </a-select>
                  <div style="margin: 0.2em">
                    <a-switch v-model="fieldConfig.isServerSaveIgnore"></a-switch>
                    保存时是否排除该字段
                  </div>
                </td>
              </tr>
              <!--<tr class="gl-table-row">-->
              <!--<td class="gl-table-cell gl-table-cell-sub-label">-->
              <!--是否排除：-->
              <!--</td>-->
              <!--<td class="gl-table-cell">-->
              <!--<a-switch v-model="fieldConfig.isServerSaveIgnore"></a-switch>-->
              <!--保存时是否排除该字段-->
              <!--</td>-->
              <!--</tr>-->
              <tr class="gl-table-row" v-if="freshFlag&&isContainDataItems(fieldConfig)">
                <td class="gl-table-cell gl-table-cell-sub-label">
                  {{getControlType(fieldConfig.control).title}}项：
                </td>
                <td class="gl-table-cell">
                  <gl-data-source :dataItems="fieldConfig.data" :dsKey="fieldConfig.dsName" :dsMap="opts.ds"
                                  @update="onDataSourceUpdate"></gl-data-source>
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
                  <a-switch v-model="fieldConfig.rules.required"></a-switch>
                </td>
              </tr>
              <tr class="gl-table-row">
                <td class="gl-table-cell gl-table-cell-sub-label">
                  是否唯一：
                </td>
                <td class="gl-table-cell">
                  <a-switch v-model="fieldConfig.rules.unique"></a-switch>
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
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import mixin from '../../../mixin-designer'
  import controlTypes from '../data/controlTypes'
  import SelectEntityList from '../../../components/gl-data-source/src/SelectEntityList'
  import GlDataSource from "../../../components/gl-data-source/src/Index";


  export default {
    name: "Settings",
    components: {
      GlDataSource, GlVNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      }
    },
    mixins: [mixin],
    props: {
      opts: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        // defaultEntity: '',
        // toolbar
        // {
        //   show: false,
        //     actions: [{
        //   gid: this.$gl.utils.uuid(8),
        //   text: '保存',
        //   type: 'primary',
        //   fn: 'save',
        //   show: 'true',
        //   icon: '',
        //   ctx: 'self'
        // }]
        // }
        toolbar: this.opts.toolbar,
        activeTabKey: '2',
        fieldConfig: {
          title: '',
          control: '',
          field: '',
          isServerSaveIgnore: false,
          props: {},
          rules: {
            required: false
          },
          data: [],
          dsName: ''
        },
        freshFlag: true,
        currentEntityColumns: [],
        toSelectEntityNames: [],
        currentRowLayout: {},
        currentColLayout: {},
        // 用于设计
        controlTypes: controlTypes,
        refreshFlag: true,
        cacheEntityMeta: {},
        rowLayoutSliderValue: [],
        colLayoutSliderValue: [],
        marks: {0: '0', 8: '8', 16: '16', 24: '24'}

      }
    },
    watch: {
      'opts.defaultEntity': function (val) {
        // 同步更改默认的id字段的实体
        this.$set(this.opts.properties.id, 'entity', val)
      }
    },
    created() {
      // 侦听舞台字段的选择（包括添加）事件
      this.$gl.bus.$on('gl-ide-plugin-form-designer.stage.fieldSelect', this.onFieldSelect)
      this.$gl.bus.$on('gl-ide-plugin-form-designer.stage.colSelect', this.onColSelect)
    },
    destroyed() {
      this.$gl.bus.$off('gl-ide-plugin-form-designer.stage.fieldSelect', this.onFieldSelect)
      this.$gl.bus.$off('gl-ide-plugin-form-designer.stage.colSelect', this.onColSelect)
    },
    methods: {
      forceFresh() {
        this.refreshFlag = false
        this.$nextTick(function () {
          this.refreshFlag = true
        })
      },
      addToSelectEntityNames({text, value}) {
        let containsItems = this.toSelectEntityNames.filter((item) => {
          return item.value === value
        })
        if (containsItems.length === 0) {
          this.toSelectEntityNames.push({
            text: text,
            value: value
          })
        }
      },
      /**
       * 初始化字段默认信息
       * @param item 字段
       * @param bindEntityNames 当前已绑定的实体，格式：{}
       */
      onFieldSelect(item, bindEntityNames) {
        this.activeTabKey = '3'
        for (let key in bindEntityNames) {
          this.addToSelectEntityNames({key: key, value: bindEntityNames[key]})
        }
        console.log(JSON.stringify(item), bindEntityNames, 'toSelectEntityNames: ', this.toSelectEntityNames)
        if (item.rules === undefined) {
          this.$set(item, 'rules', {required: undefined, unique: undefined})
          // this.$set(item.rules, 'required', undefined)
          // this.$set(item.rules, 'unique', undefined)
        }
        if (item.props === undefined) {
          this.$set(item, 'props', {placeholder: undefined})
          // this.$set(item.props, 'placeholder', undefined)
        }
        if (item.isServerSaveIgnore === undefined) {
          item.isServerSaveIgnore = false
        }
        // data
        if (this.isContainDataItems(item) && (item.data === undefined || item.data.length === 0)) {
          // item.data = [{text: '选项一', value: 0}]
          this.$set(item, 'data', [{text: '选项一', value: 0}])
          // item.props.defaultActiveIndex = item.props.defaultActiveIndex || 0
          this.$set(item.props, 'defaultActiveIndex', item.props.defaultActiveIndex || 0)
        }
        if (item.dsName === undefined) {
          this.$set(item, 'dsName', '')
        }

        // 对于无实体的，从当前表单已配置的实体中，默认选择第一项
        if (!item.entity && this.toSelectEntityNames.length > 0) {
          // this.$set(item, 'entity', this.toSelectEntityNames[0].key)
          this.$set(item, 'entity', this.toSelectEntityNames[0].value)
          // item.entity = this.toSelectEntityNames[0].value
        }
        this.fieldConfig = item

        // 通过实体加载字段下拉项数据
        this.loadFieldMetaByEntityName(this.fieldConfig.entity)
        this.freshFlag = false
        this.$nextTick(function () {
          this.freshFlag = true
        })
        console.log(JSON.stringify(item))
      },
      /**
       * 选中单元格
       * @param row
       * @param col
       * @param colIndex
       */
      onColSelect(row, col, colIndex) {
        let that = this
        this.activeTabKey = '2'
        this.currentColLayout = col
        that.colLayoutSliderValue.splice(0, that.colLayoutSliderValue.length)
        that.colLayoutSliderValue.push(col.items[0].fieldSpan.label)
        that.colLayoutSliderValue.push(col.items[0].fieldSpan.control + col.items[0].fieldSpan.label)
        this.onRowSelect(row)
      },
      onRowSelect(row) {
        let that = this
        this.activeTabKey = '2'
        this.currentRowLayout = row
        that.rowLayoutSliderValue.splice(0, that.rowLayoutSliderValue.length)
        let lastSpan = 0
        row.cols.forEach(colItem => {
          console.log(colItem, colItem.span, lastSpan)
          that.rowLayoutSliderValue.push(colItem.span + lastSpan)
          lastSpan = that.rowLayoutSliderValue[that.rowLayoutSliderValue.length - 1]
        })
      },
      onRowLayoutChange() {
        console.log('before')
      },
      onAfterRowLayoutChange() {
        console.log('after')
        let that = this
        let lastValue = 0
        that.rowLayoutSliderValue.forEach((sliderItemValue, index) => {
          that.currentRowLayout.cols[index].span = sliderItemValue - lastValue
          lastValue = sliderItemValue
        })
        console.log(that.currentRowLayout)
      },
      onColLayoutChange() {
        console.log('before')
      },
      onAfterColLayoutChange() {
        let that = this
        console.log('after col', that.colLayoutSliderValue)
        this.$set(that.currentColLayout.items[0].fieldSpan, 'label', that.colLayoutSliderValue[0])
        this.$set(that.currentColLayout.items[0].fieldSpan, 'control', that.colLayoutSliderValue[1] - that.colLayoutSliderValue[0])
        console.log(that.currentColLayout)
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
      onChangeSelectEntity(data) {
        this.loadFieldMetaByEntityName(data);
        this.forceFresh()
      },
      onEntitySelected(params, data) {
        this.fieldConfig.entity = data.name
        this.addToSelectEntityNames({text: data.title, value: data.name})
        this.loadFieldMeta({tableId: data.id, '@order': 'fieldName|+'})
      },
      loadFieldMetaByEntityName(entityName) {
        let that = this
        that.$gl.api.query('platform_dev_table', 'id,title,description', {
          entityName: entityName,
          delStatus: 0,
          enableStatus: 1
        }).then(function (res) {
          that.loadFieldMeta({tableId: res.data[0].id, '@order': 'fieldName|+'})
        })
      },
      loadFieldMeta(kvConditions) {
        let that = this
        that.$gl.api.query('platform_dev_column', 'id,nullable,title,fieldName,name,description', kvConditions).then(function (res) {
          that.currentEntityColumns = res.data
        })
      },
      containField() {
        let found = this.currentEntityColumns.find(function (item) {
          return item.fieldName === this.fieldConfig.field
        })
        return found ? true : false
      },
      changeTab(key) {
        console.log('key>', key)
        this.activeTabKey = key
      },
      onDataSourceUpdate({dsItem, dsKey, dsMap}) {
        console.log('gl-ide-plugin-form-designer > Settings > onDataSourceUpdate() > dsItem, dsKey, dsMap:', dsItem, dsKey, dsMap)
        this.$set(this.fieldConfig, 'dsName', dsKey)
        this.$set(this.opts, 'dsName', dsMap)
      }
    }

  }
</script>

<style scoped>
  .gl-table-cell-sub-label {
    /*重置该样式*/
    vertical-align: middle;
    width: 30%;
  }
</style>

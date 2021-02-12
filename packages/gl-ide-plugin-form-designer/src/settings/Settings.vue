<template>
  <div class="gl-ide-plugin-designer-settings">
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
                默认（主）实体：
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
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                属性绑定：
              </td>
              <td class="gl-table-cell">
                <table class="gl-table">
                  <tr class="gl-table-row">
                    <th class="gl-table-cell" style="width: 4em">属性</th>
                    <th class="gl-table-cell">实体</th>
                    <th class="gl-table-cell" style="width: 6em">字段</th>
                  </tr>
                  <tr class="gl-table-row" v-for="p in opts.properties">
                    <td class="gl-table-cell" :title="p.title">{{p.title}}</td>
                    <td class="gl-table-cell" :title="p.entity">
                      {{p.entity}}
                      <!--<a-select v-model="p.entity" :allowClear="true" style="min-width: 99%">-->
                      <!--<a-select-option v-for="entityItem in toSelectEntityNames" :key="entityItem.value"-->
                      <!--:value="entityItem.value"-->
                      <!--:title="entityItem.text">-->
                      <!--{{entityItem.value}}-->
                      <!--</a-select-option>-->
                      <!--</a-select>-->
                    </td>
                    <td class="gl-table-cell" :title="p.field">{{p.field}}</td>
                  </tr>
                </table>
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
                行布局：
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
                字段布局：
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
          <gl-setting-control v-if="fieldConfig.field" :opts="fieldConfig"
                              :toSelectEntityNames="toSelectEntityNames" :dsMap="opts.ds"
                              @dataSourceUpdate="onDataSourceUpdate"></gl-setting-control>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import mixin from '../../../mixin-designer'
  import controlTypes from '../../../components/gl-setting-control/src/data/formControlTypes'

  export default {
    name: "Settings",
    components: {},
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
        //   gid: this.$gl.utils.uuid(16),
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
        let property = this.opts.properties[this.opts.pk]
        if (!property) {
          // 对于一些旧的配置数据，不存在pk属性，则采用以下方式获取property
          for (let key in this.opts.properties) {
            property = this.opts.properties[key]
            if (property.field === 'id') {
              break;
            }
          }
        }
        this.$set(property, 'entity', val)
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
        console.log('onFieldSelect() > bindEntityNames:', bindEntityNames)
        console.log('onFieldSelect() > toSelectEntityNames: ', this.toSelectEntityNames)
        console.log('onFieldSelect() > item:', JSON.stringify(item))
        if (item.rules === undefined) {
          this.$set(item, 'rules', {required: undefined, unique: undefined})
        }
        if (item.props === undefined) {
          this.$set(item, 'props', {placeholder: undefined})
        }
        if (item.isServerSaveIgnore === undefined) {
          item.isServerSaveIgnore = false
        }
        // data
        if (this.isContainDataItems(item) && (item.data === undefined || item.data.length === 0)) {
          this.$set(item, 'data', [{text: '选项一', value: 0}])
          this.$set(item.props, 'defaultActiveIndex', item.props.defaultActiveIndex || 0)
        }
        if (item.dsName === undefined) {
          this.$set(item, 'dsName', '')
        }

        // 对于无实体的，从当前表单已配置的实体中，默认选择第一项
        if (!item.entity && this.toSelectEntityNames.length > 0) {
          this.$set(item, 'entity', this.toSelectEntityNames[0].value)
        }
        this.fieldConfig = item

        // 通过实体加载字段下拉项数据
        // this.loadFieldMetaByEntityName(this.fieldConfig.entity)
        // this.refreshFlag = false
        // this.$nextTick(function () {
        //   this.refreshFlag = true
        // })
        // console.log(JSON.stringify(item))
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
        row.cols.forEach(cellItem => {
          console.log(cellItem, cellItem.span, lastSpan)
          that.rowLayoutSliderValue.push(cellItem.span + lastSpan)
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
        console.log('currentRowLayout:', that.currentRowLayout)
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
        this.$set(this.opts, 'ds', dsMap)
      },
      isContainDataItems(item) {
        return item.control === 'Select'
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

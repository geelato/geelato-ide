<template>
  <div class="gl-ide-plugin-x-designer-settings">
    <a-tabs defaultActiveKey="1" :size="size" :style="{'min-height':`${height}px`,'max-height':`${height}px`}">
      <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="profile"/>
        表
      </span>
        <div :style="tabPanelStyle">
          <table class="gl-table">
            <tr class="gl-table-row gl-table-row-header">
              <th class="gl-table-cell" style="width: 40%">项</th>
              <th class="gl-table-cell">值</th>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                表格标题：
              </td>
              <td class="gl-table-cell">
                <input v-model="config.title" style="width: 99%"/>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                <a-icon type="info-circle" title="绑定实体之后，列才能绑定对应的字段"/>
                绑定数据实体：
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
                          @change="config.toolbar.show=!config.toolbar.show;onChange()"></a-switch>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">是否展示表头：</td>
              <td class="gl-table-cell">
                <a-switch :defaultChecked="config.table.showHeader"
                          @change="config.table.showHeader=!config.table.showHeader;onChange(true)"/>
              </td>
            </tr>
          </table>
        </div>
        {{tabPanelStyle}}
      </a-tab-pane>
      <!--*******************************************************************************-->
      <!--******************************* 结果列 ****************************************-->
      <!--*******************************************************************************-->
      <a-tab-pane key="2">
      <span slot="tab">
        <a-icon type="border"/>
        结果列
      </span>
        <div :style="tabPanelStyle">
          <table class="gl-table">
            <tr class="gl-table-row gl-table-row-header">
              <th class="gl-table-cell">列名</th>
              <th class="gl-table-cell">数据库字段</th>
              <th class="gl-table-cell">设置</th>
            </tr>
            <template v-for="(col,colIndex) in config.table.columns">
              <tr class="gl-table-row" :key="colIndex">
                <td class="gl-table-cell"><input v-model="col.title" style="width: 99%"/></td>
                <td class="gl-table-cell">
                  <a-select v-model="col.dataIndex" :allowClear="true" v-if="!isOperateColumn(col)"
                            style="min-width: 99%">
                    <a-select-option v-for="(colMeta,colMetaIndex) in currentEntityColumns" :key="colMeta.name">
                      {{colMeta.name}}
                    </a-select-option>
                  </a-select>
                </td>
                <td class="gl-table-cell">
                  <a-button class="gl-mini-btn" v-if="currentColIndex!==colIndex" @click="currentColIndex = colIndex">
                    <a-icon type="eye"/>
                  </a-button>
                  <a-button class="gl-mini-btn" v-if="currentColIndex===colIndex" @click="currentColIndex = -1">
                    <a-icon type="eye-invisible"/>
                  </a-button>
                  <a-button class="gl-mini-btn" v-if="colIndex!==0"
                            @click="$gl.utils.moveup(config.table.columns,colIndex)">
                    <a-icon type="arrow-up"/>
                  </a-button>
                  <a-button class="gl-mini-btn" v-if="colIndex!==config.table.columns.length-1"
                            @click="$gl.utils.movedown(config.table.columns,colIndex)">
                    <a-icon type="arrow-down"/>
                  </a-button>
                  <!-- 操作列不可删除 、id列不可删除-->
                  <a-button class="gl-mini-btn" v-if="!isOperateColumn(col)"
                            @click="$gl.utils.remove(config.table.columns,colIndex)">
                    <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
                  </a-button>
                </td>
              </tr>
              <tr v-if="currentColIndex===colIndex">
                <td colspan="3" style="padding:0.2em;">
                  <table class="gl-table" style="border: 1px solid">
                    <tr class="gl-table-row">
                      <td class="gl-table-cell gl-table-cell-sub-label">内容对齐：</td>
                      <td class="gl-table-cell">
                        <a-radio-group v-model="col.align" size="small">
                          <a-radio-button value="left">居左</a-radio-button>
                          <a-radio-button value="center">居中</a-radio-button>
                          <a-radio-button value="right">居右</a-radio-button>
                        </a-radio-group>
                      </td>
                    </tr>
                    <tr class="gl-table-row">
                      <td class="gl-table-cell gl-table-cell-sub-label">值格式化：</td>
                      <td class="gl-table-cell">
                        <input v-model="col._format" style="width: 99%"/>
                      </td>
                    </tr>
                    <tr class="gl-table-row">
                      <td class="gl-table-cell gl-table-cell-sub-label">可排序：</td>
                      <td class="gl-table-cell">
                        <a-switch :defaultChecked="col.sorter" @change="col.sorter=!col.sorter;onChange(col)"/>
                      </td>
                    </tr>
                    <tr class="gl-table-row">
                      <td class="gl-table-cell gl-table-cell-sub-label">
                        <a-icon type="info-circle" title="可以不填，默认为1，当为0时，则不显示列头"/>
                        列头占列数：
                      </td>
                      <td class="gl-table-cell">
                        <a-input-number :min="0" :max="config.table.columns.length" v-model="col.colSpan"
                                        style="width: 4em"/>
                      </td>
                    </tr>
                    <tr class="gl-table-row">
                      <td class="gl-table-cell gl-table-cell-sub-label">固定列：</td>
                      <td class="gl-table-cell">
                        <a-radio-group v-model="col.fixed" size="small">
                          <a-radio-button value="left">左固定</a-radio-button>
                          <a-radio-button value="">不固定</a-radio-button>
                          <a-radio-button value="right">右固定</a-radio-button>
                        </a-radio-group>
                      </td>
                    </tr>
                    <tr class="gl-table-row">
                      <td class="gl-table-cell gl-table-cell-sub-label">是否统计：</td>
                      <td class="gl-table-cell">
                        <!--<a-switch :checked="col.needTotal" @change="col.needTotal=!col.needTotal"/>-->
                        <a-switch :defaultChecked="col.needTotal"
                                  @change="col.needTotal=!col.needTotal;onChange(true)"/>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </template>
            <tr class="gl-table-row">
              <td colspan="3">
                <a-button size="small" block @click="config.table.columns.push([{title:'',dataIndex:''}])"
                          style="line-height: 1.499em">
                  <a-icon type="plus" size="small"/>
                  添加结果列
                </a-button>
              </td>
            </tr>
          </table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3">
      <span slot="tab">
        <a-icon type="search"/>
        查询列
      </span>
        <div :style="tabPanelStyle">
          <table class="gl-table">
            <tr class="gl-table-row gl-table-row-header">
              <th class="gl-table-cell" style="width: 40%">项</th>
              <th class="gl-table-cell">值</th>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                每行展示几项：
              </td>
              <td class="gl-table-cell">
                <a-radio-group v-model="config.query.mix.layout.fieldPerRow" size="small" @change="onChange()">
                  <a-radio-button :value="2">2</a-radio-button>
                  <a-radio-button :value="3">3</a-radio-button>
                  <a-radio-button :value="4">4</a-radio-button>
                  <a-radio-button :value="6">6</a-radio-button>
                </a-radio-group>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                <a-icon type="info-circle" title="两个查询控件之间的横向距离，可以不设置，默认为48。"/>
                每项间格象素：
              </td>
              <td class="gl-table-cell">
                <a-input-number v-model="config.query.mix.layout.gutter" :min="1" :max="200"></a-input-number>
              </td>
            </tr>
          </table>
          <table class="gl-table">
            <tr class="gl-table-row gl-table-row-header">
              <th class="gl-table-cell" style="width: 20%">列名</th>
              <th class="gl-table-cell" style="width: 25%">数据库字段</th>
              <th class="gl-table-cell" style="width: 22%">比较符</th>
              <th class="gl-table-cell">设置</th>
            </tr>
            <template v-for="(property,propertyColIndex) in config.query.mix.properties">
              <tr class="gl-table-row" :key="propertyColIndex">
                <td class="gl-table-cell"><input v-model="property.title" style="width: 99%"/></td>
                <td class="gl-table-cell">
                  <a-select v-model="property.field" :allowClear="true"
                            style="min-width: 99%">
                    <a-select-option v-for="(colMeta,colMetaIndex) in currentEntityColumns" :key="colMeta.name">
                      {{colMeta.name}}
                    </a-select-option>
                  </a-select>
                </td>
                <td class="gl-table-cell">
                  <a-select v-model="property.cop" :allowClear="true"
                            style="min-width: 99%">
                    <a-select-option v-for="cop in cops" :key="cop.value">
                      {{cop.text}}
                    </a-select-option>
                  </a-select>
                </td>
                <td class="gl-table-cell">
                  <a-button class="gl-mini-btn" v-if="currentQueryIndex!==propertyColIndex"
                            @click="currentQueryIndex = propertyColIndex">
                    <a-icon type="eye"/>
                  </a-button>
                  <a-button class="gl-mini-btn" v-if="currentQueryIndex===propertyColIndex"
                            @click="currentQueryIndex = -1">
                    <a-icon type="eye-invisible"/>
                  </a-button>
                  <a-button class="gl-mini-btn" v-if="propertyColIndex!==0"
                            @click="$gl.utils.moveup(config.query.mix.properties,propertyColIndex)">
                    <a-icon type="arrow-up"/>
                  </a-button>
                  <a-button class="gl-mini-btn" v-if="propertyColIndex!==config.query.mix.properties.length-1"
                            @click="$gl.utils.movedown(config.query.mix.properties,propertyColIndex)">
                    <a-icon type="arrow-down"/>
                  </a-button>
                  <a-button class="gl-mini-btn"
                            @click="$gl.utils.remove(config.query.mix.properties,propertyColIndex)">
                    <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
                  </a-button>
                </td>
              </tr>
              <tr class="gl-table-row" v-if="currentQueryIndex===propertyColIndex">
                <td colspan="4" style="padding:0.2em;">
                  <table class="gl-table" style="border: 1px solid">
                    <tr class="gl-table-row">
                      <td class="gl-table-cell gl-table-cell-sub-label">控件类型：</td>
                      <td class="gl-table-cell">
                        <a-select v-model="property.control" :allowClear="false"
                                  style="min-width: 99%">
                          <a-select-option v-for="control in controls" :key="control.value">
                            {{control.text}}
                          </a-select-option>
                        </a-select>
                      </td>
                    </tr>
                    <tr class="gl-table-row">
                      <td class="gl-table-cell gl-table-cell-sub-label">占位符：</td>
                      <td class="gl-table-cell">
                        <input v-model="property.props.placeholder" style="width: 99%"/>
                      </td>
                    </tr>
                    <tr class="gl-table-row">
                      <td class="gl-table-cell gl-table-cell-sub-label">默认值：</td>
                      <td class="gl-table-cell">
                        <input v-model="property.props.defaultValue" style="width: 99%"/>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </template>
            <tr class="gl-table-row">
              <td colspan="4">
                <a-button size="small" block
                          @click="config.query.mix.properties.push({field: '',title: '',cop: 'eq',control: 'input',lop: 'and',props: {placeholder: '', defaultValue: ''}},)"
                          style="line-height: 1.499em">
                  <a-icon type="plus" size="small"/>
                  添加查询条件
                </a-button>
              </td>
            </tr>
          </table>
        </div>
      </a-tab-pane>
      <!--*******************************************************************************-->
      <!--******************************* 行操作 ****************************************-->
      <!--*******************************************************************************-->
      <a-tab-pane key="4">
      <span slot="tab">
        <a-icon type="thunderbolt"/>
        行操作
      </span>
        <div :style="tabPanelStyle">
          <table class="gl-table">
            <tr class="gl-table-row gl-table-row-header">
              <th class="gl-table-cell" style="width: 35%">按钮名称</th>
              <th class="gl-table-cell" style="width: 25%">类型</th>
              <th class="gl-table-cell">设置</th>
            </tr>
            <template v-for="(rowAction,rowActionIndex) in config.table.rowAction.actions">
              <tr class="gl-table-row" :key="rowActionIndex">
                <td class="gl-table-cell"><input v-model="rowAction.text" style="width: 99%"/></td>
                <td class="gl-table-cell">
                  <a-select v-model="rowAction.type" :allowClear="true"
                            style="min-width: 99%">
                    <a-select-option v-for="btnType in btnTypes" :key="btnType.value">
                      {{btnType.text}}
                    </a-select-option>
                  </a-select>
                </td>
                <td class="gl-table-cell">
                  <a-button class="gl-mini-btn" v-if="currentRowActionIndex!==rowActionIndex"
                            @click="currentRowActionIndex = rowActionIndex">
                    <a-icon type="eye"/>
                  </a-button>
                  <a-button class="gl-mini-btn" v-if="currentRowActionIndex===rowActionIndex"
                            @click="currentRowActionIndex = -1">
                    <a-icon type="eye-invisible"/>
                  </a-button>
                  <a-button class="gl-mini-btn" v-if="rowActionIndex!==0"
                            @click="$gl.utils.moveup(config.table.rowAction.actions,rowActionIndex)">
                    <a-icon type="arrow-up"/>
                  </a-button>
                  <a-button class="gl-mini-btn" v-if="rowActionIndex!==config.table.rowAction.actions.length-1"
                            @click="$gl.utils.movedown(config.table.rowAction.actions,rowActionIndex)">
                    <a-icon type="arrow-down"/>
                  </a-button>
                  <a-button class="gl-mini-btn"
                            @click="$gl.utils.remove(config.table.rowAction.actions,rowActionIndex)">
                    <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
                  </a-button>
                </td>
              </tr>
              <!--<tr class="gl-table-row" v-if="currentRowActionIndex===rowActionIndex">-->
              <!--<td colspan="3" style="padding:0.2em;">-->
              <!--<table class="gl-table" style="border: 1px solid">-->
              <!--<tr class="gl-table-row">-->
              <!--<td class="gl-table-cell gl-table-cell-sub-label">控件类型：</td>-->
              <!--<td class="gl-table-cell">-->
              <!--<a-select v-model="property.control" :allowClear="false"-->
              <!--style="min-width: 99%">-->
              <!--<a-select-option v-for="control in controls" :key="control.value">-->
              <!--{{control.text}}-->
              <!--</a-select-option>-->
              <!--</a-select>-->
              <!--</td>-->
              <!--</tr>-->
              <!--<tr class="gl-table-row">-->
              <!--<td class="gl-table-cell gl-table-cell-sub-label">占位符：</td>-->
              <!--<td class="gl-table-cell">-->
              <!--<input v-model="property.props.placeholder" style="width: 99%"/>-->
              <!--</td>-->
              <!--</tr>-->
              <!--<tr class="gl-table-row">-->
              <!--<td class="gl-table-cell gl-table-cell-sub-label">默认值：</td>-->
              <!--<td class="gl-table-cell">-->
              <!--<input v-model="property.props.defaultValue" style="width: 99%"/>-->
              <!--</td>-->
              <!--</tr>-->
              <!--</table>-->
              <!--</td>-->
              <!--</tr>-->
            </template>
            <tr class="gl-table-row">
              <td colspan="3">
                <a-button size="small" block
                          @click="config.table.rowAction.actions.push({text: '操作',icon: 'plus',type: 'primary',fn: 'openModal',ctx: 'this',params: {}})"
                          style="line-height: 1.499em">
                  <a-icon type="plus" size="small"/>
                  添加行操作按钮
                </a-button>
              </td>
            </tr>
          </table>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import mixin from '../../mixin-x-designer'
  import Checkbox from "ant-design-vue/es/vc-checkbox/src/Checkbox";
  import Table from "ant-design-vue/es/table/Table";
  import SelectEntityList from './SelectEntityList'

  export default {
    name: "Settings",
    components: {Table, Checkbox, SelectEntityList},
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
        currentColIndex: -1,
        currentQueryIndex: -1,
        currentRowActionIndex: -1,
        currentEntityColumns: [],
        dict: {
          eq: '等于',
          neq: '不等于',
          lt: '小于',
          lte: '小于等于',
          gt: '大于',
          gte: '大于等于',
          sw: '开头包括',
          ew: '结尾包括',
          contains: '包括'
        },
        cops: [
          {text: '等于', value: 'eq'},
          {text: '不等于', value: 'neq'},
          {text: '小于', value: 'lt'},
          {text: '小于等于', value: 'lte'},
          {text: '大于', value: 'gt'},
          {text: '大于等于', value: 'gte'},
          {text: '开头包括', value: 'sw'},
          {text: '结尾包括', value: 'ew'},
          {text: '包括', value: 'contains'}
        ],
        controls: [
          {text: '文本', icon: '', value: 'input'},
          {text: '日期', icon: '', value: 'date'},
          {text: '时间', icon: '', value: 'time'},
          {text: '复选', icon: '', value: 'checkbox'},
          {text: '下拉', icon: '', value: 'select'}
        ],
        btnTypes: [
          {text: '主按钮', value: 'primary'},
          {text: '次按钮', value: ''},
          {text: '虚线按钮', value: 'dashed'},
          {text: '危险按钮', value: 'danger'},
          {text: '链接按钮', value: 'link'},
        ]
      }
    },
    computed: {},
    mounted() {
      let that = this
      // 初始化
      that.$gl.api.query('platform_dev_table', {tableName: this.config.entity}, 'id,tableName,tableComment').then(function (res) {
        that.loadEntityMeta({tableId: res.data[0].id})
      })
    },
    methods: {
      onChange(needRefreshStage = false, data) {
        this.$emit('change', {needRefreshStage: needRefreshStage, data: data})
      },
      convertCop(cop) {
        return this.dict[cop]
      },
      convertLop(o) {
        return o === 'or' ? '或' : '且'
      },
      getPlaceholder(item) {
        if (item.placeholder) {
          return item.placeholder
        } else {
          console.log(item.cop, this.dict[item.cop])
          return this.convertCop(item.cop)
        }
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
        that.$gl.api.query('platform_dev_column', kvConditions, 'id,title,name,description').then(function (res) {
          that.currentEntityColumns = res.data
        })
      },
      isOperateColumn(col) {
        return col.scopedSlots && col.scopedSlots.customRender === 'action'
      },

    }
  }
</script>

<style>

</style>

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
                <a-input v-model="config.title" style="width: 99%"/>
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
                是否展示工具栏：
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
                <!--<a-input-number v-model="config.table.pageSize" style="width: 5em"></a-input-number>-->
                <a-radio-group v-model="config.table.pageSize" size="small">
                  <a-radio-button :value="10">10</a-radio-button>
                  <a-radio-button :value="20">20</a-radio-button>
                  <a-radio-button :value="30">30</a-radio-button>
                  <a-radio-button :value="40">40</a-radio-button>
                </a-radio-group>
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
          <table class="gl-table">
            <tr class="gl-table-row gl-table-row-header">
              <th class="gl-table-cell" style="width: 25%">列名</th>
              <th class="gl-table-cell" style="width: 45%">数据库字段</th>
              <th class="gl-table-cell">设置</th>
            </tr>
            <gl-draggable
                :list="config.table.columns"
                animation="700"
                handle=".gl-dnd-action-row-handle"
                group='columns'
                :sort="true"
                element="tbody"
                @clone="onClone"
                @move="onMove"
            >
              <template v-for="(col,colIndex) in config.table.columns">
                <tr>
                  <td colspan="3" style="border: 0">
                    <table style="width: 100%;">
                      <tr class="gl-table-row" :key="col.gid">
                        <td class="gl-table-cell" style="width: 25%;border-top: 0;border-left:0"><a-input
                            v-model="col.title" style="width: 99%"/></td>
                        <td class="gl-table-cell" style="width: 45%;border-top: 0;border-left:0">
                          <a-select v-model="col.dataIndex" :allowClear="true" v-if="!isOperateColumn(col)"
                                    style="min-width: 99%">
                            <a-select-option v-for="colMeta in currentEntityColumns" :key="colMeta.fieldName"
                                             :title="colMeta.title">
                              {{colMeta.fieldName}}&nbsp;({{colMeta.title}})
                            </a-select-option>
                          </a-select>
                        </td>
                        <td class="gl-table-cell" style="border-top: 0;border-left:0">
                          <a-button class="gl-mini-btn" v-if="currentColIndex!==colIndex"
                                    @click="currentColIndex = colIndex"
                                    title="显示更多设置">
                            <a-icon type="setting"/>
                          </a-button>
                          <a-button class="gl-mini-btn" v-if="currentColIndex===colIndex" @click="currentColIndex = -1"
                                    title="隐藏更多设置">
                            <a-icon type="eye-invisible"/>
                          </a-button>
                          <!-- 操作列不可删除 、id列不可删除-->
                          <a-button class="gl-mini-btn" v-if="!isOperateColumn(col)"
                                    @click="config.table.columns.splice(colIndex,1)">
                            <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
                          </a-button>
                          <a-button class="gl-mini-btn gl-dnd-action-row-handle">
                            <a-icon type="drag"/>
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
                              <td class="gl-table-cell gl-table-cell-sub-label">
                                <a-icon type="info-circle" title="未设置该值转换格式时，直接以数据库查询的结果进行展示。"/>
                                值格式化：
                              </td>
                              <td class="gl-table-cell">
                                <div>
                          <textarea v-model="col.customRenderString" style="width: 99%"
                                    @change="changeColumnCustomRender(col)" placeholder="鼠标移上来展示示例" rows="4"/>
                                </div>
                                <div class="gl-ide-designer-tips">
                                  填写示例1，展示固定的字段内容：<br>
                                  () =>'内容'<br>
                                  填写示例2，判断并展示不同的内容：<br>
                                  (text) => text === 1 ? 'A' : 'B'<br>
                                  填写示例3，结合其它列进行展示：<br>
                                  (record) => record.loginName+'_'+record.sex
                                </div>
                                <!--<a-input-search placeholder="更新查看值效果" v-model="col.customRenderString"-->
                                <!--@search="changeColumnCustomRender()">-->
                                <!--<a-button type="primary" slot="enterButton">-->
                                <!--<a-icon type="reload"/>-->
                                <!--更新-->
                                <!--</a-button>-->
                                <!--</a-input-search>-->
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
                              <td class="gl-table-cell gl-table-cell-sub-label">
                                <a-icon type="info-circle" title="操作栏可见时才生效"/>
                                是否统计：
                              </td>
                              <td class="gl-table-cell">
                                <!--<a-switch :checked="col.needTotal" @change="col.needTotal=!col.needTotal"/>-->
                                <a-switch :defaultChecked="col.needTotal"
                                          @change="col.needTotal=!col.needTotal;onChange(true)"/>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </template>
            </gl-draggable>
            <tr class="gl-table-row">
              <td colspan="3">
                <a-button size="small" block
                          @click="config.table.columns.push({gid:$gl.utils.uuid(16),title:'',dataIndex:''})"
                          style="line-height: 1.499em">
                  <a-icon type="plus" size="small"/>
                  添加结果列
                </a-button>
              </td>
            </tr>
          </table>
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
              <th class="gl-table-cell" style="width: 32%">数据库字段</th>
              <th class="gl-table-cell" style="width: 22%">比较符</th>
              <th class="gl-table-cell">设置</th>
            </tr>
            <gl-draggable
                :list="config.query.mix.properties"
                animation="700"
                handle=".gl-dnd-action-row-handle"
                :group="{ name: 'queryProperties',  put: true }"
                :sort="true"
                element="tbody"
            >
              <template v-for="(property,propertyIndex) in config.query.mix.properties">
                <tr>
                  <td colspan="4" style="border: 0">
                    <table style="width: 100%;">
                      <tr v-if="property" class="gl-table-row"
                          :key="propertyIndex">
                        <td class="gl-table-cell" style="width: 20%;border-left: 0;border-top: 0"><a-input
                            v-model="property.title" style="width: 99%"/></td>
                        <td class="gl-table-cell" style="width: 32%;border-left: 0;border-top: 0">
                          <a-select v-model="property.field" :allowClear="true" style="min-width: 99%">
                            <a-select-option v-for="colMeta in currentEntityColumns" :key="colMeta.fieldName"
                                             :title="colMeta.title">
                              {{colMeta.fieldName}}&nbsp;({{colMeta.title}})
                            </a-select-option>
                          </a-select>
                        </td>
                        <td class="gl-table-cell" style="width: 22%;border-left: 0;border-top: 0">
                          <a-select v-model="property.cop" style="min-width: 99%">
                            <a-select-option v-for="cop in cops" :key="cop.value" :title="cop.text">
                              {{cop.text}}
                            </a-select-option>
                          </a-select>
                        </td>
                        <td class="gl-table-cell" style="border-left: 0;border-top: 0">
                          <a-button class="gl-mini-btn" v-if="currentQueryIndex!==propertyIndex"
                                    @click="currentQueryIndex = propertyIndex" title="显示更多设置">
                            <a-icon type="setting"/>
                          </a-button>
                          <a-button class="gl-mini-btn" v-if="currentQueryIndex===propertyIndex"
                                    @click="currentQueryIndex = -1" title="隐藏更多设置">
                            <a-icon type="eye-invisible"/>
                          </a-button>
                          <a-button class="gl-mini-btn gl-dnd-action-row-handle">
                            <a-icon type="drag"/>
                          </a-button>
                          <a-button class="gl-mini-btn"
                                    @click="$gl.utils.remove(config.query.mix.properties,propertyIndex)">
                            <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
                          </a-button>
                        </td>
                      </tr>
                      <tr class="gl-table-row" v-if="property&&currentQueryIndex===propertyIndex">
                        <td colspan="4" style="padding:0.2em;">
                          <table class="gl-table" style="border: 1px solid">
                            <tr class="gl-table-row">
                              <td class="gl-table-cell gl-table-cell-sub-label">是否展示：</td>
                              <td class="gl-table-cell">
                                <a-switch v-model="property.show" />
                              </td>
                            </tr>
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
                                <a-input v-model="property.props.placeholder" style="width: 99%"/>
                              </td>
                            </tr>
                            <tr class="gl-table-row">
                              <td class="gl-table-cell gl-table-cell-sub-label">默认值：</td>
                              <td class="gl-table-cell">
                                <a-input v-model="property.props.defaultValue" style="width: 99%"/>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </template>
            </gl-draggable>
            <tr class="gl-table-row">
              <td colspan="4">
                <a-button size="small" block
                          @click="config.query.mix.properties.push({gid:$gl.utils.uuid(16),field: '',title: '',cop: 'eq',control: 'input',lop: 'and',props: {placeholder: '', defaultValue: ''}},)"
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
      <!--******************************* 4、行操作 ****************************************-->
      <!--*******************************************************************************-->
      <a-tab-pane key="4">
      <span slot="tab">
        <a-icon type="thunderbolt"/>
        操作
      </span>
        <div :style="tabPanelStyle">
          <h4 style="margin: 0.5em 1em">工具栏</h4>
          <table class="gl-table">
            <tr class="gl-table-row gl-table-row-header">
              <th class="gl-table-cell" style="width: 20%">按钮名称</th>
              <th class="gl-table-cell" style="width: 25%">类型</th>
              <th class="gl-table-cell" style="width: 20%">图标</th>
              <th class="gl-table-cell">设置</th>
            </tr>
            <gl-draggable
                :list="config.toolbar.actions"
                animation="700"
                handle=".gl-dnd-action-row-handle"
                group='toolbarActions'
                :sort="true"
                element="tbody"
            >
              <tr v-for="(toolbarAction,toolbarActionIndex) in config.toolbar.actions" class="gl-table-row"
                  :key="toolbarAction.gid">
                <td class="gl-table-cell"><a-input v-model="toolbarAction.title" style="width: 99%"/></td>
                <td class="gl-table-cell">
                  <a-select v-model="toolbarAction.type" :allowClear="true"
                            style="min-width: 99%">
                    <a-select-option v-for="btnType in btnTypes" :key="btnType.value">
                      {{btnType.text}}
                    </a-select-option>
                  </a-select>
                </td>
                <td class="gl-table-cell"><a-input v-model="toolbarAction.icon" style="width: 99%"/></td>
                <td class="gl-table-cell">
                  <a-button class="gl-mini-btn"
                            @click="$gl.utils.remove(config.toolbar.actions,toolbarActionIndex)">
                    <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
                  </a-button>
                  <a-button class="gl-mini-btn gl-dnd-action-row-handle">
                    <a-icon type="drag"/>
                  </a-button>
                </td>
              </tr>
            </gl-draggable>
            <tr class="gl-table-row">
              <td colspan="4">
                <a-button size="small" block
                          @click="config.toolbar.actions.push({gid:$gl.utils.uuid(16),control:'button',title: '操作',icon: 'plus',type: 'primary',fn: 'openModal',ctx: 'this',params: {}})"
                          style="line-height: 1.499em">
                  <a-icon type="plus" size="small"/>
                  添加工具栏按钮
                </a-button>
              </td>
            </tr>
          </table>
          <h4 style="margin: 0.5em 1em">操作栏</h4>
          <table class="gl-table">
            <thead>
            <tr class="gl-table-row gl-table-row-header">
              <th class="gl-table-cell" style="width: 65%">按钮名称</th>
              <!--<th class="gl-table-cell" style="width: 25%">类型</th>-->
              <th class="gl-table-cell">设置</th>
            </tr>
            </thead>
            <gl-draggable
                :list="config.table.rowAction.actions"
                animation="700"
                handle=".gl-dnd-action-row-handle"
                group='rowActions'
                :sort="true"
                element="tbody"
            >
              <tr v-for="(rowAction,rowActionIndex) in config.table.rowAction.actions" class="gl-table-row"
                  :key="rowAction.gid">
                <td class="gl-table-cell">
                  <a-input v-model="rowAction.title" style="width: 99%"/>
                </td>
                <td class="gl-table-cell">
                  <a-button class="gl-mini-btn"
                            @click="$gl.utils.remove(config.table.rowAction.actions,rowActionIndex)">
                    <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
                  </a-button>
                  <a-button class="gl-mini-btn gl-dnd-action-row-handle">
                    <a-icon type="drag"/>
                  </a-button>
                </td>
              </tr>
            </gl-draggable>
            <tr class="gl-table-row">
              <td colspan="2">
                <a-button size="small" block
                          @click="config.table.rowAction.actions.push({gid:$gl.utils.uuid(16),control:'button',title: '操作',icon: 'plus',type: 'primary',fn: 'openModal',ctx: 'this',params: {}})"
                          style="line-height: 1.499em">
                  <a-icon type="plus" size="small"/>
                  添加操作栏按钮
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
  import mixin from '../../mixin-designer'
  import ideConfig from '../../gl-ide/src/data/ideSelectItems.js'
  import SelectEntityList from '../../components/gl-data-source/src/SelectEntityList'

  export default {
    name: "GlIdePluginTableDesignerSettings",
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
        currentColIndex: -1,
        currentQueryIndex: -1,
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
        console.log('gl-ide > gl-ide-plugin-table-designer > Settings > generateGid()')
        const that = this
        that.config.query.mix.properties.forEach(function (property) {
          property.gid = property.gid || that.$gl.utils.uuid(16)
          that.$set(property, 'show', property.show === undefined ? true : property.show)
        })
        that.config.table.columns.forEach(function (col) {
          col.gid = col.gid || that.$gl.utils.uuid(16)
        })
        that.config.table.rowAction.actions.forEach(function (action) {
          action.gid = action.gid || that.$gl.utils.uuid(16)
          console.log('gl-ide > gl-ide-plugin-table-designer > Settings > generateGid() > rowAction: ', action)
        })
        that.config.toolbar.actions.forEach(function (action) {
          action.gid = action.gid || that.$gl.utils.uuid(16)
        })
      },
      onChange(needRefreshStage = false, data) {
        this.$emit('change', {needRefreshStage: needRefreshStage, data: data})
      },
      changeColumnCustomRender(col) {
        console.log('args', col)
        try {
          this.onChange(true)
        } catch (e) {
          console.error(e)
        }
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

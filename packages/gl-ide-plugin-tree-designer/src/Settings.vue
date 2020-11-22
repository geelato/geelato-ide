<template>
  <div>
    <a-tabs defaultActiveKey="1" :size="size" :style="{'min-height':`${height}px`,'max-height':`${height}px`}">
      <!--*******************************************************************************-->
      <!--******************************* 1、树 ****************************************-->
      <!--*******************************************************************************-->
      <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="cluster"/>
        树设置
      </span>
        <div :style="tabPanelStyle">
          <div class="gl-title">
            <a-icon type="setting"/>
            外观
          </div>
          <table class="gl-table">
            <!--<tr class="gl-table-row gl-table-row-header">-->
            <!--<th class="gl-table-cell" style="width: 40%">项</th>-->
            <!--<th class="gl-table-cell">值</th>-->
            <!--</tr>-->
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                树标题：
              </td>
              <td class="gl-table-cell">
                <input v-model="config.title" style="width: 99%"/>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                显示连线：
              </td>
              <td class="gl-table-cell">
                <a-switch :defaultChecked="config.showLine" @change="config.showLine=!config.showLine"/>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                显示图标：
              </td>
              <td class="gl-table-cell">
                <a-switch :defaultChecked="config.showIcon" @change="config.showIcon=!config.showIcon"/>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                显示复选框：
              </td>
              <td class="gl-table-cell">
                <a-switch :defaultChecked="config.checkable" @change="config.checkable=!config.checkable"/>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">
                是否可拖动：
              </td>
              <td class="gl-table-cell">
                <a-switch :defaultChecked="config.draggable" @change="config.draggable=!config.draggable"/>
              </td>
            </tr>
          </table>
          <div class="gl-title">
            <a-icon type="setting"/>
            数据源
          </div>
          <table class="gl-table">
            <tr class="gl-table-row">
              <!--// 0:多实体层叠构建，1：单树型实体构建，2：SQL查询构建，3：服务查询构建-->
              <td class="gl-table-cell gl-table-cell-sub-label">
                <a-icon type="info-circle" title="0:多实体层叠构建，1：单树型实体构建"/>
                树构建（获取）方式：
              </td>
              <td class="gl-table-cell">
                <a-radio-group v-model="config.buildMode" size="small" @change="onChange($event)">
                  <a-radio-button :value=0>多实体层叠构建</a-radio-button>
                  <a-radio-button :value=1>单树型实体构建</a-radio-button>
                </a-radio-group>
              </td>
            </tr>
            <template v-if="config.buildMode===0">
              <tr class="gl-table-row">
                <!--// 0:多实体层叠构建，1：单树型实体构建，2：SQL查询构建，3：服务查询构建-->
                <td class="gl-table-cell">
                  <gl-tree-node ref="glTreeNode" :treeNodes="config.tree" @clickNode="openNode" style="margin-left:0em"
                                @removeNode="onRemoveNode" :currentNode="currentTreeNode"></gl-tree-node>
                  <div v-if="config.tree.length===0" style="text-align: center">
                    <a-button @click="createNode">
                      <a-icon type="plus-circle"/>
                      创建节点
                    </a-button>
                  </div>
                </td>
                <td class="gl-table-cell" style="padding: 0.5em">
                  <!--{{treeNode}}-->
                  <!--<gl-data-source :dataItems="fieldConfig.data" :dsKey="fieldConfig.dsName" :dsMap="opts.ds"-->
                  <!--@update="onDataSourceUpdate"></gl-data-source>-->
                  <template v-if="refreshFlag&&(currentTreeNode.data||currentTreeNode.dsName)">
                    <gl-data-source
                        :dataItems="currentTreeNode.data"
                        :dsKey="currentTreeNode.dsName"
                        :dsMap="config.ds"
                        :dataAlias="{text:'title',value:'key'}"
                        :controlConfigMeta="controlConfigMeta"
                        dsType="treeNode"
                    ></gl-data-source>
                    <div class="gl-title-sub">
                      是否叶子节点
                    </div>
                    <a-switch :defaultChecked="currentTreeNode.isLeaf"
                              @change="currentTreeNode.isLeaf=!currentTreeNode.isLeaf"/>

                  </template>
                  <div v-else>
                    请先选择节点
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="2">
                  <a-alert type="info" message="暂未支持" style="text-align: center"></a-alert>
                </td>
              </tr>
            </template>
          </table>
        </div>
      </a-tab-pane>
      <!--*******************************************************************************-->
      <!--******************************* 2、右键菜单****************************************-->
      <!--*******************************************************************************-->
      <a-tab-pane key="2">
      <span slot="tab">
        <a-icon type="menu-fold"/>
        右键菜单设置
      </span>
        <div :style="tabPanelStyle">
          <table class="gl-table">
            <tr class="gl-table-row gl-table-row-header">
              <th class="gl-table-cell" style="width: 25%">标题</th>
              <th class="gl-table-cell" style="width: 45%">图标</th>
              <th class="gl-table-cell">设置</th>
            </tr>
            <gl-draggable
                :list="config.menuAction.actions"
                animation="700"
                handle=".gl-dnd-action-row-handle"
                group='columns'
                :sort="true"
                element="tbody"
                @clone="onClone"
                @move="onMove"
            >
              <template v-for="(action,actionIndex) in config.menuAction.actions">
                <tr>
                  <td colspan="3" style="border: 0">
                    <table style="width: 100%;">
                      <tr class="gl-table-row" :key="action.gid">
                        <td class="gl-table-cell" style="width: 25%;border-top: 0;border-left:0"><input
                            v-model="action.title" style="width: 99%"/></td>
                        <td class="gl-table-cell" style="width: 45%;border-top: 0;border-left:0">
                          <input style="width: 98%" v-model="action.icon"/>
                        </td>
                        <td class="gl-table-cell" style="border-top: 0;border-left:0">
                          <a-button class="gl-mini-btn" v-if="currentActionIndex!==actionIndex"
                                    @click="currentActionIndex = actionIndex"
                                    title="显示更多设置">
                            <a-icon type="setting"/>
                          </a-button>
                          <a-button class="gl-mini-btn" v-if="currentActionIndex===actionIndex"
                                    @click="currentActionIndex = -1"
                                    title="隐藏更多设置">
                            <a-icon type="eye-invisible"/>
                          </a-button>
                          <!-- 操作列不可删除 、id列不可删除-->
                          <a-button class="gl-mini-btn" v-if="!isOperateColumn(action)"
                                    @click="config.menuAction.actions.splice(actionIndex,1)">
                            <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
                          </a-button>
                          <a-button class="gl-mini-btn gl-dnd-action-row-handle">
                            <a-icon type="drag"/>
                          </a-button>
                        </td>
                      </tr>
                      <!--<tr v-if="currentActionIndex===actionIndex">-->
                      <!--<td colspan="3" style="padding:0.2em;">-->
                      <!--<table class="gl-table" style="border: 1px solid">-->
                      <!--<tr class="gl-table-row">-->
                      <!--<td class="gl-table-cell gl-table-cell-sub-label">内容对齐：</td>-->
                      <!--<td class="gl-table-cell">-->
                      <!--<a-radio-group v-model="action.align" size="small">-->
                      <!--<a-radio-button value="left">居左</a-radio-button>-->
                      <!--<a-radio-button value="center">居中</a-radio-button>-->
                      <!--<a-radio-button value="right">居右</a-radio-button>-->
                      <!--</a-radio-group>-->
                      <!--</td>-->
                      <!--</tr>-->
                      <!--<tr class="gl-table-row">-->
                      <!--<td class="gl-table-cell gl-table-cell-sub-label">-->
                      <!--<a-icon type="info-circle" title="未设置该值转换格式时，直接以数据库查询的结果进行展示。"/>-->
                      <!--值格式化：-->
                      <!--</td>-->
                      <!--<td class="gl-table-cell">-->
                      <!--<div>-->
                      <!--<textarea v-model="action.customRenderString" style="width: 99%"-->
                      <!--@change="changeColumnCustomRender(action)" placeholder="鼠标移上来展示示例" rows="4"/>-->
                      <!--</div>-->
                      <!--<div class="gl-ide-designer-tips">-->
                      <!--填写示例1，展示固定的字段内容：<br>-->
                      <!--() =>'内容'<br>-->
                      <!--填写示例2，判断并展示不同的内容：<br>-->
                      <!--(text) => text === 1 ? 'A' : 'B'<br>-->
                      <!--填写示例3，结合其它列进行展示：<br>-->
                      <!--(record) => record.loginName+'_'+record.sex-->
                      <!--</div>-->
                      <!--&lt;!&ndash;<a-input-search placeholder="更新查看值效果" v-model="action.customRenderString"&ndash;&gt;-->
                      <!--&lt;!&ndash;@search="changeColumnCustomRender()">&ndash;&gt;-->
                      <!--&lt;!&ndash;<a-button type="primary" slot="enterButton">&ndash;&gt;-->
                      <!--&lt;!&ndash;<a-icon type="reload"/>&ndash;&gt;-->
                      <!--&lt;!&ndash;更新&ndash;&gt;-->
                      <!--&lt;!&ndash;</a-button>&ndash;&gt;-->
                      <!--&lt;!&ndash;</a-input-search>&ndash;&gt;-->
                      <!--</td>-->
                      <!--</tr>-->
                      <!--<tr class="gl-table-row">-->
                      <!--<td class="gl-table-cell gl-table-cell-sub-label">可排序：</td>-->
                      <!--<td class="gl-table-cell">-->
                      <!--<a-switch :defaultChecked="action.sorter" @change="action.sorter=!action.sorter;onChange(action)"/>-->
                      <!--</td>-->
                      <!--</tr>-->
                      <!--<tr class="gl-table-row">-->
                      <!--<td class="gl-table-cell gl-table-cell-sub-label">-->
                      <!--<a-icon type="info-circle" title="可以不填，默认为1，当为0时，则不显示列头"/>-->
                      <!--列头占列数：-->
                      <!--</td>-->
                      <!--<td class="gl-table-cell">-->
                      <!--<a-input-number :min="0" :max="config.menuAction.actions.length" v-model="action.colSpan"-->
                      <!--style="width: 4em"/>-->
                      <!--</td>-->
                      <!--</tr>-->
                      <!--<tr class="gl-table-row">-->
                      <!--<td class="gl-table-cell gl-table-cell-sub-label">固定列：</td>-->
                      <!--<td class="gl-table-cell">-->
                      <!--<a-radio-group v-model="action.fixed" size="small">-->
                      <!--<a-radio-button value="left">左固定</a-radio-button>-->
                      <!--<a-radio-button value="">不固定</a-radio-button>-->
                      <!--<a-radio-button value="right">右固定</a-radio-button>-->
                      <!--</a-radio-group>-->
                      <!--</td>-->
                      <!--</tr>-->
                      <!--<tr class="gl-table-row">-->
                      <!--<td class="gl-table-cell gl-table-cell-sub-label">-->
                      <!--<a-icon type="info-circle" title="操作栏可见时才生效"/>-->
                      <!--是否统计：-->
                      <!--</td>-->
                      <!--<td class="gl-table-cell">-->
                      <!--&lt;!&ndash;<a-switch :checked="action.needTotal" @change="action.needTotal=!action.needTotal"/>&ndash;&gt;-->
                      <!--<a-switch :defaultChecked="action.needTotal"-->
                      <!--@change="action.needTotal=!action.needTotal;onChange(true)"/>-->
                      <!--</td>-->
                      <!--</tr>-->
                      <!--</table>-->
                      <!--</td>-->
                      <!--</tr>-->
                    </table>
                  </td>
                </tr>
              </template>
            </gl-draggable>
            <tr class="gl-table-row">
              <td colspan="3">
                <a-button size="small" block
                          @click="config.menuAction.actions.push({gid:$gl.utils.uuid(16),title:'',title:'操作',icon:''})"
                          style="line-height: 1.499em">
                  <a-icon type="plus" size="small"/>
                  添加菜单项
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
  import GlDataSource from "../../components/gl-data-source/src/Index";
  import GlTreeNode from './GlTreeNode'

  export default {
    name: "GlIdePluginTreeDesignerSettings",
    components: {
      GlDataSource, GlTreeNode
    },
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
        currentActionIndex: -1,
        currentEntityColumns: [],
        currentTreeNode: {},
        dict: ideConfig.copDict,
        cops: ideConfig.cops,
        controls: ideConfig.controls,
        btnTypes: ideConfig.btnTypes,
        refreshFlag: true,
        // 在设计时，树控件需要用到的字段
        controlConfigMeta: [
          {title: '节点名称', name: 'title', required: true},
          {title: '节点值', name: 'key', required: true},
          {title: '节点图标', name: 'icon', required: false}
        ]
      }
    },
    computed: {},
    mounted() {
      let that = this
      // 初始化
      // that.$gl.api.query('platform_dev_table', 'id,tableName,tableComment', {tableName: this.config.entity}).then(function (res) {
      //   that.loadEntityMeta({tableId: res.data[0].id})
      // })
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
        console.log('gl-ide > gl-ide-plugin-tree-designer > Settings > generateGid()')
        const that = this
        that.config.menuAction.actions.forEach(function (col) {
          col.gid = col.gid || that.$gl.utils.uuid(16)
        })
      },
      onChange(e) {
        console.log('change>', this.config.buildMode, e, e.target.value)
        // this.$emit('change', {needRefreshStage: needRefreshStage, data: data})
      },
      changeColumnCustomRender(col) {
        console.log('args', col)
        try {
          this.onChange(true)
        } catch (e) {
          console.error(e)
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
      },
      openNode(treeNode) {
        console.log('treeNode', treeNode)
        this.currentTreeNode = treeNode
        this.refreshFlag = false
        this.$nextTick(function () {
          this.refreshFlag = true
        })
      },
      onRemoveNode(node) {
        if (this.currentTreeNode.gid === node.gid) {
          this.currentTreeNode = {}
        }
      },
      createNode() {
        // console.log('>', this.$refs.glTreeNode, this.$refs.glTreeNode.createNode())
        let newNode = this.$refs.glTreeNode.createNode()
        this.config.tree.push(newNode)
        this.currentTreeNode = newNode
      }
      // onDataSourceUpdate({dsItem, dsKey, dsMap}) {
      //   console.log('gl-ide-plugin-tree-designer > Settings > onDataSourceUpdate() > dsItem, dsKey, dsMap:', dsItem, dsKey, dsMap)
      //   this.$set(this.fieldConfig, 'dsName', dsKey)
      //   this.$set(this.opts, 'dsName', dsMap)
      // }
    }
  }
</script>

<style scoped>
</style>

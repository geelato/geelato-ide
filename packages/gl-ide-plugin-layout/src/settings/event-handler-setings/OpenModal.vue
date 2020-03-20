<template>
  <div>
    <table class="gl-table">
      <tbody v-if="designComponentName">
      <tr>
        <td class="gl-table-cell label" style="width: 30%">打开页面</td>
        <td class="gl-table-cell" colspan="3">
          <!--<input v-model="modalInfo.pageId" style="width: 100%"/>-->
          <a-tree-select
              style="width: 100%"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="treeData"
              placeholder="Please select"
              treeDefaultExpandAll
              v-model="modalInfo.pageId"
          >
            <span style="color: #08c" slot="title" slot-scope="{key, value}" v-if="key='0-0-1'">
              {{value}}
            </span>
          </a-tree-select>
        </td>
      </tr>
      <tr class="gl-table-row">
        <td class="gl-table-cell label" style="width: 20%">页面标题</td>
        <td class="gl-table-cell" colspan="3">
          <input v-model="modalInfo.title" style="width: 100%"/>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell label" style="width: 20%">页面宽度</td>
        <td class="gl-table-cell" style="width: 30%">
          <input v-model="modalInfo.width" placeholder="1200px" style="width: 98%"/>
        </td>
        <td class="gl-table-cell label" style="width: 20%">页面高度</td>
        <td class="gl-table-cell" style="width: 30%">
          <input v-model="modalInfo.height" placeholder="800px" style="width: 98%"/>
        </td>
      </tr>
      <tr>

      </tr>

      <tr>
        <td class="gl-table-cell label" style="width: 30%">页面接收参数</td>
        <td class="gl-table-cell" colspan="3">
          <table class="gl-table">
            <gl-draggable
                :list="modalInfo.paramMapping"
                handle=".gl-dnd-param-handle"
                group='columns'
                :sort="true"
                element="tbody"
            >
              <tr class="gl-table-row" v-for="(param,paramIndex) in modalInfo.paramMapping">
                <td style="width: 2em;text-align: center">{{paramIndex+1}}:</td>
                <td class="gl-table-cell" style="width: 75%">
                  <table class="gl-table">
                    <tr>
                      <td class="gl-table-cell label" style="font-weight: normal;width: 4em">
                        参数名
                      </td>
                      <td class="gl-table-cell">
                        <!--@change="$emit('doActionChange',$event,param,paramIndex)" :allowClear="true"-->
                        <a-select v-model="param.target.gid" style="width: 100%"
                                  @change="onChangeInParam($event,param)">
                          <a-select-opt-group v-for="optionData in inParamSelection"
                                              :label="optionData.title" :key="optionData.gid">
                            <a-select-option v-for="inParam in optionData.inParams" :key="inParam.gid"
                                             :value="inParam.gid">{{inParam.name+'-'+inParam.title}}
                            </a-select-option>
                          </a-select-opt-group>
                        </a-select>
                      </td>
                    </tr>
                    <tr>
                      <td class="gl-table-cell label" style="font-weight: normal">
                        参数值
                      </td>
                      <td class="gl-table-cell">
                        <a-select v-model="param.src.gid" style="width: 100%" @change="onChangeOutParam($event,param)">
                          <a-select-opt-group v-for="optionData in outParamSelection"
                                              :label="optionData.title" :key="optionData.gid">
                            <a-select-option v-for="outParam in optionData.outParams" :key="outParam.gid"
                                             :value="outParam.gid">{{outParam.name+'-'+outParam.title}}
                            </a-select-option>
                          </a-select-opt-group>
                        </a-select>
                      </td>
                    </tr>
                  </table>
                </td>
                <td class="gl-table-cell" style="padding-top: 1.5em">
                  <a-button class="gl-mini-btn" @click="modalInfo.paramMapping.splice(paramIndex,1)">
                    <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
                  </a-button>
                  <a-button class="gl-mini-btn gl-dnd-param-handle">
                    <a-icon type="swap"/>
                  </a-button>
                </td>
              </tr>
            </gl-draggable>
            <tr class="gl-table-row">
              <td colspan="3">
                <a-button size="small" block
                          @click="modalInfo.paramMapping.push({target: {gid: ''}, src: {gid: ''}, title: ''})"
                          style="line-height: 1.499em">
                  <a-icon type="plus" size="small"/>
                  添加参数
                </a-button>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!--<tr>-->
      <!--<td class="gl-table-cell label" style="width: 30%">按钮位置</td>-->
      <!--<td>-->
      <!--<a-radio-group v-model="modalInfo.actionAlign" size="small">-->
      <!--<a-radio-button value="left">左</a-radio-button>-->
      <!--<a-radio-button value="middle">中</a-radio-button>-->
      <!--<a-radio-button value="right">右</a-radio-button>-->
      <!--</a-radio-group>-->
      <!--</td>-->
      <!--</tr>-->
      </tbody>
    </table>

    <table class="gl-table">
      <tr class="gl-table-row gl-table-row-header">
        <th class="gl-table-cell" style="width: 35%">按钮名称</th>
        <th class="gl-table-cell" style="width: 25%">类型</th>
        <th class="gl-table-cell">设置</th>
      </tr>
      <template v-for="(action,actionIndex) in modalInfo.actions">
        <tr class="gl-table-row" :key="actionIndex">
          <!-- TODO change? -->
          <td class="gl-table-cell"><input v-model="action.text" style="width: 99%" @change="onActionUpdate()"/></td>
          <td class="gl-table-cell">
            <a-select v-model="action.type" :allowClear="true" @change="onActionUpdate()"
                      style="min-width: 99%">
              <a-select-option v-for="btnType in btnTypes" :key="btnType.value">
                {{btnType.text}}
              </a-select-option>
            </a-select>
          </td>
          <td class="gl-table-cell">
            <!--<a-button class="gl-mini-btn" v-if="currentActionIndex!==actionIndex"-->
            <!--@click="currentActionIndex = actionIndex" title="显示更多设置">-->
            <!--<a-icon type="eye"/>-->
            <!--</a-button>-->
            <!--<a-button class="gl-mini-btn" v-if="currentActionIndex===actionIndex"-->
            <!--@click="currentActionIndex = -1" title="隐藏更多设置">-->
            <!--<a-icon type="eye-invisible"/>-->
            <!--</a-button>-->
            <a-button class="gl-mini-btn" v-if="actionIndex!==0"
                      @click="$gl.utils.moveup(modalInfo.actions,actionIndex);onActionUpdate()">
              <a-icon type="arrow-up"/>
            </a-button>
            <a-button class="gl-mini-btn" v-if="actionIndex!==modalInfo.actions.length-1"
                      @click="$gl.utils.movedown(modalInfo.actions,actionIndex);onActionUpdate()">
              <a-icon type="arrow-down"/>
            </a-button>
            <a-button class="gl-mini-btn"
                      @click="$gl.utils.remove(modalInfo.actions,actionIndex);onActionUpdate()">
              <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
            </a-button>
          </td>
        </tr>
      </template>
      <tr class="gl-table-row">
        <td colspan="3">
          <a-button size="small" block
                    @click="modalInfo.actions.push({gid:$gl.utils.uuid(8),title: '操作',icon: 'plus',type: 'primary'});onActionUpdate()"
                    style="line-height: 1.499em">
            <a-icon type="plus" size="small"/>
            添加行操作按钮
          </a-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

  import ideConfig from '../../../../gl-ide/src/data/ideSelectItems.js'
  import utils from '../../../../utils.js'
  import cardsDefined from '../../../../gl-ide-plugin-cards/src/data/cards.js'

  export default {
    props: {
      params: {
        type: Object,
        default() {
          return {
            title: '',
            width: '',
            height: '',
            actions: [],
            paramMapping: []
          }
        }
      },
      designComponentName: {
        type: String
      }
    },
    data() {
      return {
        modalInfo: {
          gid: this.params.gid || this.$gl.utils.uuid(8),
          title: this.params.title,
          width: this.params.width,
          height: this.params.height,
          pageId: this.params.pageId,
          pageName: this.params.pageName,
          actionAlign: this.params.actionAlign,
          actions: this.params.actions,
          paramMapping: this.params.paramMapping
        },
        treeData: [],
        currentActionIndex: 0,
        btnTypes: ideConfig.btnTypes,
        formLayout: 'horizontal',
        // 输入参数选择项 [{cardItemId,inParams}]
        inParamSelection: [],
        outParamSelection: [],
        // 加载页面之后，刷新参数表
        refreshFlag: true
      };
    },
    watch: {
      'modalInfo.pageId': {
        handler(val, oval) {
          console.log('val:', val, ',oval:', oval)
          this.loadTargetPage(val)
          this.loadAndParseSourcePage()
        },
        immediate: true
      }
    },
    created() {
      this.loadPageTreeData()
    },
    mounted() {
      if (!this.modalInfo.paramMapping || !this.modalInfo.paramMapping.src || !this.modalInfo.paramMapping.src.gid) {
        this.modalInfo.paramMapping = []
      }
    },
    beforeDestroy() {
      console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > beforeDestroy() > result of modalInfo:', this.modalInfo)
      this.$emit('update', this.modalInfo)
    },
    methods: {
      forceFresh() {
        this.refreshFlag = false
        this.$nextTick(function () {
          this.refreshFlag = true
        })
      },
      getCardDefined(componentName) {
        let cardDefined = cardsDefined.items.find(cardDefined => cardDefined.component === componentName)
        if (!cardDefined) {
          console.error('gl-ide-plugin-layout > event-handler-settings > OpenModal > getCardDefined() > not found by componentName:', componentName)
        }
        return cardDefined
      },
      // 基于页面文件树节点id，加载需要打开页面的配置
      loadTargetPage(pageId) {
        if (!pageId) {
          console.warn('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadTargetPage() > pageId can not be ', pageId)
        }
        const that = this
        let condition = {extendId: pageId}
        that.$gl.api.query('platform_app_page', 'id,type,code,description,sourceContent', condition).then(function (res) {
          // console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadTargetPage() > query platform_app_page res:', res)
          if (res.data.length === 0) {
            that.$message.warn('从服务端获取不到该页面配置信息，可能该页面已删除！')
          } else {
            that.config = JSON.parse(res.data[0].sourceContent)
            that.parseTargetPage(that.config)
            that.forceFresh()
            console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadTargetPage() > config:', that.config)
          }
        }).catch(function (e) {
          console.error('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadTargetPage() > query platform_app_page e: ', e)
          that.$message.error('从服务端获取、解析页面配置信息失败！')
        })
      },
      parseTargetPage(page) {
        let that = this
        that.inParamSelection.splice(0, that.inParamSelection.length)
        page.opts.layout.rows.forEach(row => {
          row.cols.forEach(col => {
            col.items.forEach(cardItem => {
              let cardDefined = that.getCardDefined(cardItem.component)
              if (cardDefined.meta.inParam && cardDefined.meta.inParam.path) {
                console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > parseTargetPage() > forEach cardItem:', cardItem)
                console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > parseTargetPage() > get cardDefined:', cardDefined, ' by componentName:', cardItem.component)
                console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > parseTargetPage() > the cardDefined.meta.inParam.path:', cardDefined.meta.inParam.path)
                let inParams = utils.eval('$ctx.' + cardDefined.meta.inParam.path, cardItem.bind.opts)
                let newInParams = []
                for (let index in inParams) {
                  let inParam = inParams[index]
                  let newInParam = {}
                  newInParam.gid = inParam.gid
                  newInParam.name = inParam[cardDefined.meta.inParam.name]
                  newInParam.title = inParam[cardDefined.meta.inParam.title]
                  newInParam.title = newInParam.title === 'undefined' ? '' : (newInParam.title || '')
                  newInParams.push(newInParam)
                  console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > parseTargetPage() > push newInParam:', newInParam)
                }
                that.inParamSelection.push({
                  gid: cardItem.id,
                  component: cardItem.component,
                  title: cardItem.bind.opts.title,
                  inParams: newInParams
                })
              }
            })
          })
        })
        console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > parseTargetPage() > parse result of inParamSelection:', that.inParamSelection)
      },
      loadAndParseSourcePage() {
        let that = this
        that.outParamSelection.splice(0, that.outParamSelection.length)
        console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadAndParseSourcePage() > parsing sourcePage:', that.$ide.store.editingFile.sourceContent)

        that.$ide.store.editingFile.sourceContent.opts.layout.rows.forEach(row => {
          row.cols.forEach(col => {
            col.items.forEach(cardItem => {
              let cardDefined = that.getCardDefined(cardItem.component)
              console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadAndParseSourcePage() > forEach cardItem:', cardItem)
              console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadAndParseSourcePage() > get cardDefined:', cardDefined, ' by componentName:', cardItem.component)
              console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadAndParseSourcePage() > the cardDefined.meta.outParams:', cardDefined.meta.outParams)
              cardDefined.meta.outParams.forEach(outParamItem => {
                let outParams = utils.eval('$ctx.' + outParamItem.path, cardItem.bind.opts)
                let newOutParams = []
                for (let index in outParams) {
                  let outParam = outParams[index]
                  // 过滤掉无效的(name为空)，如操作列
                  if (outParam[outParamItem.name]) {
                    let newOutParam = {}
                    newOutParam.gid = outParam.gid
                    newOutParam.name = outParam[outParamItem.name]
                    newOutParam.title = outParam[outParamItem.title]
                    newOutParam.title = newOutParam.title === 'undefined' ? '' : (newOutParam.title || '')
                    newOutParam.dataCtx = outParamItem.dataCtx
                    newOutParams.push(newOutParam)
                    console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadAndParseSourcePage() > push newOutParam:', newOutParam)
                  }
                }
                that.outParamSelection.push({
                  gid: cardItem.id,
                  component: cardItem.component,
                  title: cardItem.bind.opts.title + '-' + outParamItem.group,
                  outParams: newOutParams
                })

              })
              console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadAndParseSourcePage() > parse result of outParamSelection:', that.outParamSelection)
            })
          })
        })
      },

      onPropertyUpdate(property, val, oval) {
        this.onUpdate()
      },
      onActionUpdate() {
        this.onUpdate()
      },
      onChangeInParam(data, currentParam) {
        let that = this
        let foundInParam = undefined
        that.inParamSelection.forEach(optionData => {
          if (optionData.inParams) {
            console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeInParam() > inParams: ', optionData.inParams)
            foundInParam = optionData.inParams.find(inParam => inParam.gid === data)
            if (foundInParam !== undefined) {
              currentParam.target.name = foundInParam.name
              currentParam.target.title = foundInParam.title
              return
            }
          }
        })
        console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeOutParam() > get data: ', data, ' and find inParam:', foundInParam)
        console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeOutParam() > set current select param and result: ', currentParam)
        return foundInParam
      },
      onChangeOutParam(data, currentParam) {
        let that = this
        let foundOutParam = undefined
        that.outParamSelection.forEach(optionData => {
          if (optionData.outParams) {
            console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeOutParam() > outParams: ', optionData.outParams)
            foundOutParam = optionData.outParams.find(outParam => outParam.gid === data)
            if (foundOutParam !== undefined) {
              currentParam.src.name = foundOutParam.name
              currentParam.src.title = foundOutParam.title
              return
            }
          }
        })

        console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeOutParam() > get data: ', data, ' and find outParam:', foundOutParam)
        console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeOutParam() > set current select param and result: ', currentParam)
        return foundOutParam
      },
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
  .ant-form-item {
    margin-bottom: 4px;
  }
</style>

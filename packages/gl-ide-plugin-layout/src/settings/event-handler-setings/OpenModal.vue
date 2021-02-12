<template>
  <div>
    <table class="gl-table">
      <tbody v-if="designComponentName">
      <tr>
        <td class="gl-table-cell label" style="width: 25%">打开页面</td>
        <td class="gl-table-cell" colspan="3">
          <!--<a-input v-model="modalInfo.pageId" style="width: 100%"/>-->
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
          <a-input v-model="modalInfo.title" style="width: 100%"/>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell label" style="width: 20%">页面宽度</td>
        <td class="gl-table-cell" style="width: 30%">
          <a-input v-model="modalInfo.width" placeholder="1200px" style="width: 98%"/>
        </td>
        <td class="gl-table-cell label" style="width: 20%">页面高度</td>
        <td class="gl-table-cell" style="width: 30%">
          <a-input v-model="modalInfo.height" placeholder="800px" style="width: 98%"/>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell label" style="width: 30%">页面接收参数</td>
        <td class="gl-table-cell" colspan="3">
          <table class="gl-table">
            <gl-draggable
                :list="modalInfo.paramMapping"
                animation="700"
                handle=".gl-dnd-param-handle"
                group='columns'
                :sort="true"
                element="tbody"
            >
              <tr class="gl-table-row" v-for="(paramMappingItem,paramIndex) in modalInfo.paramMapping">
                <td style="width: 2em;text-align: center">{{paramIndex+1}}:</td>
                <td class="gl-table-cell" style="width: 75%">
                  <table class="gl-table">
                    <tr>
                      <td class="gl-table-cell label" style="font-weight: normal;width: 4em">
                        参数名
                      </td>
                      <td class="gl-table-cell">
                        <a-select v-model="paramMappingItem.target.gid" style="width: 100%"
                                  @change="onChangeInParam($event,paramMappingItem)">
                          <a-select-opt-group v-for="(optionData,optionDataIndex) in inParamSelection"
                                              :label="optionData.title" :key="optionData.gid+'_'+optionDataIndex">
                            <template v-if="optionData.items">
                              <a-select-opt-group v-for="(subOptionData,subOptionDataIndex) in optionData.items"
                                                  :label="subOptionData.title"
                                                  :key="subOptionData.gid+'_'+subOptionDataIndex"
                                                  style="padding-left: 1em">
                                <a-select-option v-for="inParam in subOptionData.inParams"
                                                 :key="subOptionData.gid+'.'+inParam.gid"
                                                 :value="subOptionData.gid+'.'+inParam.gid">
                                  {{inParam.name+'-'+inParam.title}}
                                </a-select-option>
                              </a-select-opt-group>
                            </template>
                            <template v-else>
                              <a-select-option v-for="(inParam,inParamIndex) in optionData.inParams"
                                               :key="inParam.gid+'_'+inParamIndex"
                                               :value="optionData.gid+'.'+inParam.gid">
                                {{inParam.title+' ('+inParam.name+')'}}
                              </a-select-option>
                            </template>
                          </a-select-opt-group>
                        </a-select>
                      </td>
                    </tr>
                    <tr>
                      <td class="gl-table-cell label" style="font-weight: normal">
                        值来源
                      </td>
                      <td class="gl-table-cell">
                        <a-select v-model="paramMappingItem.src.gid" style="width: 100%"
                                  @change="onChangeOutParam($event,paramMappingItem)">
                          <a-select-opt-group v-for="(optionData,optionDataIndex) in outParamSelection"
                                              :label="optionData.title" :key="optionData.gid+'_'+optionDataIndex">
                            <a-select-option v-for="(outParam,outParamIndex) in optionData.outParams"
                                             :key="outParam.gid+'_'+outParamIndex"
                                             :value="outParam.gid">{{outParam.title+' ('+outParam.name+')'}}
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
                    <a-icon type="drag"/>
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
  </div>
</template>

<script>

  import ideConfig from '../../../../gl-ide/src/data/ideSelectItems.js'
  import utils from '../../../../../runtime/utils.js'
  import cardsDefined from '../../../../gl-ide-plugin-cards/src/data/index.js'
  import mixin from './common/mixin'

  export default {
    mixins: [mixin],
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
      }
    },
    data() {
      return {
        modalInfo: {
          gid: this.params.gid || this.$gl.utils.uuid(16),
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
          this.loadTargetPage(val, this.inParamSelection)
          this.loadAndParseSourcePage()
        },
        immediate: true
      }
    },
    created() {
      this.loadPageTreeData()
    },
    mounted() {
      if (!this.modalInfo.paramMapping || !this.modalInfo.paramMapping.length) {
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
        let cardDefined = cardsDefined.items.find(cardDefined => cardDefined.componentName === componentName)
        if (!cardDefined) {
          console.error('gl-ide-plugin-layout > event-handler-settings > OpenModal > getCardDefined() > not found by componentName:', componentName, cardsDefined.items)
        }
        return cardDefined
      },
      // 基于页面文件树节点id，加载需要打开页面的配置
      loadTargetPage(extendId, inParamSelection) {
        if (!extendId) {
          console.warn('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadTargetPage() > extendId can not be ', extendId)
        }
        const that = this
        let condition = {extendId: extendId}
        that.$gl.api.query('platform_app_page', 'id,type,code,description,sourceContent', condition).then(function (res) {
          // console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadTargetPage() > query platform_app_page res:', res)
          if (res.data.length === 0) {
            that.$message.warn('从服务端获取不到该页面配置信息，可能该页面已删除！')
          } else {
            that.config = JSON.parse(res.data[0].sourceContent)
            that.parseTargetPage(that.config, inParamSelection)
            that.forceFresh()
            console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadTargetPage() > config:', that.config)
          }
        }).catch(function (e) {
          console.error('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadTargetPage() > query platform_app_page e: ', e)
          that.$message.error('从服务端获取、解析页面配置信息失败！')
        })
      },
      parseTargetPage(page, inParamSelection) {
        let that = this
        inParamSelection.splice(0, inParamSelection.length)
        page.opts.layout.rows.forEach(row => {
          row.cols.forEach(col => {
            col.items.forEach(cardItem => {
              cardItem.componentName = cardItem.componentName||cardItem.component
              // 如果是引用页面cardItem.component为GlPage，需再进一步加载页面进行解析
              if (cardItem.componentName === 'GlPage') {
                let option = {
                  gid: cardItem.gid,
                  componentName: cardItem.componentName,
                  title: cardItem.title || '引用页面',
                  inParams: [],
                  // 子页面
                  items: []
                }
                inParamSelection.push(option)
                that.loadTargetPage(cardItem.bind.opts.extendId, option.items)
              } else {
                let cardDefined = that.getCardDefined(cardItem.componentName||cardItem.component)
                if (cardDefined.meta.inParam && cardDefined.meta.inParam.path) {
                  console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > parseTargetPage() > forEach cardItem:', cardItem)
                  console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > parseTargetPage() > get cardDefined:', cardDefined, ' by componentName:', cardItem.componentName)
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
                  inParamSelection.push({
                    gid: cardItem.gid,
                    componentName: cardItem.componentName,
                    title: cardItem.title,
                    inParams: newInParams
                  })
                }
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
              cardItem.componentName = cardItem.componentName||cardItem.component
              let cardDefined = that.getCardDefined(cardItem.componentName)
              // TODO 如果是引用页页面，需获取引用页面内的页面
              console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadAndParseSourcePage() > forEach cardItem:', cardItem)
              console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadAndParseSourcePage() > get cardDefined:', cardDefined, ' by componentName:', cardItem.componentName)
              console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > loadAndParseSourcePage() > the cardDefined.meta.outParams:', cardDefined.meta.outParams)
              cardDefined.meta.outParams.forEach(outParamItem => {
                // 输出参数元数据定义
                let outParams = {}
                // 如果outParamItem定义了meta，则优先于path，以meta中定义的元数据为准
                if (outParamItem.meta) {
                  outParams = outParamItem.meta
                } else {
                  outParams = utils.eval('$ctx.' + outParamItem.path, cardItem.bind.opts)
                }
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
                  gid: cardItem.gid,
                  componentName: cardItem.componentName,
                  title: outParamItem.group + (cardItem.bind.opts.title ? ' (' + cardItem.bind.opts.title + ')' : ''),
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
      /**
       *
       * @param data 即选中项的gid
       * @param currentParam
       * @return {undefined}
       */
      onChangeInParam(data, currentParam) {
        let that = this
        let foundInParam = undefined

        // 递归查找
        function findInParam(inParamSelection, gid) {
          inParamSelection.forEach(optionData => {
              if (!foundInParam) {
                // 带有引用页面
                if (optionData.items && optionData.items.length > 0) {
                  console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeInParam() > find inParams in ref page, optionData:', optionData)
                  findInParam(optionData.items, gid)
                } else if (optionData.inParams) {
                  console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeInParam() > find inParams, optionData:', optionData)
                  foundInParam = optionData.inParams.find(inParam => inParam.gid === gid)
                  if (foundInParam !== undefined) {
                    currentParam.target.cardItemGid = optionData.gid
                    currentParam.target.name = foundInParam.name
                    currentParam.target.title = foundInParam.title
                    console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeInParam() > found inParam:', foundInParam, 'by gid:', gid)
                    return
                  } else {
                    console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeInParam() > not found')
                  }
                }
              }
            }
          )
        }

        let gid = data.substring(data.lastIndexOf('.') + 1)
        findInParam(that.inParamSelection, gid)

        // console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeInParam() > find inParam in inParamSelection:', this.inParamSelection)
        // console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeInParam() > found inParam:', foundInParam, 'by gid:', gid)
        console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeInParam() > set current select param and result: ', currentParam)
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
              currentParam.src.dataCtx = foundOutParam.dataCtx
              return
            }
          }
        })

        console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeOutParam() > find outParam in outParamSelection:', this.outParamSelection)
        console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeOutParam() > found outParam:', foundOutParam, 'by gid:', data)
        console.log('gl-ide-plugin-layout > event-handler-settings > OpenModal > onChangeOutParam() > set current select param and result: ', currentParam)
        return foundOutParam
      }
      ,
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

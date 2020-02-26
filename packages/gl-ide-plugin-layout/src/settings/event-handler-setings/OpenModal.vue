<template>
  <div>
    <table class="gl-table">
      <tbody v-if="designComponentName">
      <tr class="gl-table-row">
        <td class="gl-table-cell label" style="width: 20%">窗口标题</td>
        <td class="gl-table-cell" colspan="3">
          <input v-model="modalInfo.title" style="width: 100%"/>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell label" style="width: 20%">宽度</td>
        <td class="gl-table-cell" style="width: 30%">
          <input v-model="modalInfo.width"/>
        </td>
        <td class="gl-table-cell label" style="width: 20%">高度</td>
        <td class="gl-table-cell" style="width: 30%">
          <input v-model="modalInfo.height"/>
        </td>
      </tr>
      <tr>

      </tr>
      <tr>
        <td class="gl-table-cell label" style="width: 30%">页面</td>
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
      <tr>
        <td class="gl-table-cell label" style="width: 30%">参数</td>
        <td class="gl-table-cell" colspan="3">
          <table class="gl-table">
            <thead>
            <tr class="gl-table-row">
              <td style="width: 25%">参数名</td>
              <td style="width: 50%">参数值</td>
              <td></td>
            </tr>
            </thead>
            <gl-draggable
                :list="modalParams"
                handle=".gl-dnd-param-handle"
                group='columns'
                :sort="true"
                element="tbody"
            >
              <tr class="gl-table-row" v-for="(param,paramIndex) in modalParams">
                <td class="gl-table-cell label">
                  <input v-model="param.name" style="width: 100%"/>
                </td>
                <td class="gl-table-cell label">
                  <input v-model="param.value" style="width: 100%"/>
                </td>
                <td class="gl-table-cell">
                  <a-button class="gl-mini-btn" @click="modalParams.splice(paramIndex,1)">
                    <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
                  </a-button>
                  <a-button class="gl-mini-btn gl-dnd-param-handle">
                    <a-icon type="swap"/>
                  </a-button>

                  <!--<a-icon type="swap" style="color: #f5222d" title="移动行" class="gl-dnd-param-handle"/>-->
                  <!--<a-icon type="delete" theme="twoTone" twoToneColor="#f5222d" style="margin-left: 0.1em"-->
                  <!--@click="modalParams.splice(paramIndex,1)"-->
                  <!--title="删除参数"/>-->
                  <!--<a-icon type="delete" size="small" @click="modalParams.splice(paramIndex,1)"/>-->
                </td>
              </tr>
            </gl-draggable>
            <tr class="gl-table-row">
              <td colspan="3">
                <a-button size="small" block
                          @click="modalParams.push({gid:$gl.utils.uuid(8),title: '',name: '',value: undefined})"
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
      <!--<a-radio-group v-model="modalInfo.actionAlign" size="small" @change="onChange()">-->
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
  /* eslint-disable no-unused-vars */

  import ideConfig from '../../../../gl-ide/src/data/ideSelectItems.js'
  import utils from '../../../../utils.js'

  // const treeData = [
  //   {
  //     title: 'Node1',
  //     value: '0-0',
  //     key: '0-0',
  //     selectable: false,
  //     children: [
  //       {
  //         value: '0-0-1',
  //         key: '0-0-1',
  //         scopedSlots: {
  //           // custom title
  //           title: 'title',
  //         },
  //       },
  //       {
  //         title: 'Child Node2',
  //         value: '0-0-2',
  //         key: '0-0-2',
  //       },
  //     ],
  //   },
  //   {
  //     title: 'Node2',
  //     value: '0-1',
  //     key: '0-1',
  //     selectable: false
  //   },
  // ];

  export default {
    props: {
      params: {
        type: Object,
        default() {
          return {
            title: '',
            width: '',
            height: '',
            actions: []
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
          actions: this.params.actions
        },
        modalParams: [{gid: this.$gl.utils.uuid(8), name: '', title: '', value: undefined}],
        treeData: [],
        currentActionIndex: 0,
        btnTypes: ideConfig.btnTypes,
        formLayout: 'horizontal'
      };
    },
    created() {
      this.loadPageTreeData()
    },
    mounted() {

    },
    beforeDestroy() {
      console.log('this.modalInfo.actions>', this.modalInfo.actions)
      this.$emit('update', this.modalInfo)
    },
    methods: {
      onPropertyUpdate(property, val, oval) {
        this.onUpdate()
      },
      onActionUpdate() {
        this.onUpdate()
      },
      onChange(data) {
        console.log('change..........>', data)
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

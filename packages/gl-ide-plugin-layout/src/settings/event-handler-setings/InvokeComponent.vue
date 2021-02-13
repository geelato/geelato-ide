<template>
  <div>
    <table class="gl-table">
      <tbody v-if="selectedComponentName">
      <tr>
        <td class="gl-table-cell label" style="width: 20%">组件</td>
        <td class="gl-table-cell" style="padding: 0.5em">
          <!--<a-select v-model="selectedComponentKey" style="width: 100%">-->
          <!--<a-select-option v-for="obj in objectTree" :key="obj.key" :title="obj.title">-->
          <!--{{obj.title}}&nbsp;({{obj._component}})-->
          <!--</a-select-option>-->
          <!--</a-select>-->
          <!--<a-tree-->
              <!--showIcon-->
              <!--:treeData="treeData"-->
              <!--:defaultExpandAll=true-->
          <!--&gt;-->
          <!--:filterTreeNode="filterTreeNode"-->

          <a-tree-select
              v-model="params.InvokeComponent.refId"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="Please select"
              tree-default-expand-all
          >
          <!--<span slot="title" slot-scope="{ key, value }" style="color: #08c">-->
            <!--{{ value }}-->
          <!--</span>-->
          </a-tree-select>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell label" style="width: 20%">方法</td>
        <td class="gl-table-cell">
          <a-select v-model="params.InvokeComponent.fn.name" style="min-width: 99%"
                    @change="handleMethodChange($event,params.InvokeComponent.fn)">
            <a-select-option v-for="method in getMixMethods()" :key="method.name"
                             :title="method.title">
              {{method.title}}&nbsp;({{method.name}})
            </a-select-option>
          </a-select>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell label" style="width: 20%">说明</td>
        <td class="gl-table-cell" style="padding: 0.5em">
          <div v-if="params.InvokeComponent.fn.description" v-html="params.InvokeComponent.fn.description"></div>
          <div v-else>无</div>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell label">参数</td>
        <td class="gl-table-cell">
          <!--<table style="margin: 2px;width: 100%" v-if="fn.params&&fn.params.length>0">-->
          <!--<tr v-for="param in fn.params">-->
          <!--<td class="gl-table-cell label" style="width: 30%"><span><a-icon type="info-circle"-->
          <!--:title="param.description"/></span>{{param.title}}-->
          <!--</td>-->
          <!--<td class="gl-table-cell">-->
          <!--<a-input v-model="param.value" style="min-width: 99%" :placeholder="param.placeholder||param.name"-->
          <!--@change="updateSettings"/>-->
          <!--</td>-->
          <!--</tr>-->
          <!--</table>-->
          <!--<div style="width: 100%" v-else>-->
          <!--b-->
          <!--</div>-->
          <!--<gl-param-mapping :params="fn.params" @update="(value)=>{fn.params = value}"></gl-param-mapping>-->
          <gl-param-mapping :params="params.InvokeComponent.params"
                            @update="(value)=>{params.InvokeComponent.params = value}"></gl-param-mapping>

        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import componentsMeta from '../../../../gl-ide-plugin-cards/src/componentsMeta'
  import GlParamMapping from './common/ParamMapping'
  import mixin from './common/mixin'

  export default {
    components: {GlParamMapping},
    mixins: [mixin],
    props: {},
    data() {
      return {
        name: 'InvokeComponent',
        defaultConfig: {
          fn: {
            name: '',
            params: []
          },
          refId: ''
        },
        meta: {},
        /**
         *  所有控件默认的方法，不需要在每个控件中配置一次，与geelato-ui-ant的mixin对应
         */
        defaultMethods: [
          {
            name: '$_show',
            title: '显示',
            // 当前方法的输入参数
            params: [
              //   {
              //   name: 'entityName',
              //   title: '实体名称(英文)',
              //   value: '',
              //   description: '需要删除的实体'
              // }
            ],
            // 当前方法的返回结果
            return: [],
            description: ''
          },
          {
            name: '$_hide',
            title: '隐藏',
            // 当前方法的输入参数
            params: [],
            // 当前方法的返回结果
            return: [],
            description: ''
          },
          {
            name: '$_toggle',
            title: '切换显示',
            // 当前方法的输入参数
            params: [],
            // 当前方法的返回结果
            return: [],
            description: ''
          }
        ],
        selectedComponentKey: '',
        selectedComponentName: '',
        selectedComponentRefId: '',
        selectedMethodName: ''
      }
    },
    watch: {
      selectedComponentKey: {
        handler: function (val, oval) {
          let that = this
          if (val) {
            let obj = this.getObject()
            this.selectedComponentRefId = obj.key
            this.selectedComponentName = obj._component
            // 如果切换后的组件不存在该方法名时，将方法名清空
            if (this.getMixMethods().filter((m) => {
              return m.name === that.params.InvokeComponent.fn.name
            }).length === 0) {
              that.$set(that.params.InvokeComponent.fn, 'name', '')
            }
          }
        },
        immediate: true
      }
    },
    computed: {},
    created() {
      this.meta = componentsMeta
    },
    mounted() {
      this.init()
      this.selectedComponentName = this.designComponentName
      this.selectedComponentKey = this.params[this.name].refId
      console.log('objectTree>', this.objectTree)
      console.log('params>', this.params)
    },
    methods: {
      getMeta() {
        return this.meta[this.selectedComponentName]
      },
      /**
       * 混合了当前选中组件的方法及组件的默认方法defaultMethods
       * @return {*[]}
       */
      getMixMethods() {
        let methods = []
        Object.assign(methods, this.defaultMethods)
        return methods.concat(this.getMeta().methods)
      },
      getObject() {
        let that = this
        return that.objectTree.find((obj) => {
          return obj.key === that.selectedComponentKey
        })
      },
      /**
       * 过滤到非组件的部分
       * @param inputValue string
       * @param treeNode TreeNode
       */
      filterTreeNode(inputValue, treeNode) {
        return inputValue.indexOf('[组]') != -1
      },
      handleMethodChange(methodName, fn) {
        console.log('handleMethodChange()>', methodName, fn, this.selectedComponentName, this.getMixMethods())
        let method = this.getMixMethods().find(method => method.name === methodName)
        Object.assign(fn, JSON.parse(JSON.stringify(method)))
      }
    }
  }
</script>

<style scoped>
  .ant-form-item {
    margin-bottom: 4px;
  }
</style>

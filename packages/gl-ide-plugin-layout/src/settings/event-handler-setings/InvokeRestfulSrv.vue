<template>
  <div>
    <table class="gl-table">
      <tbody v-if="params.InvokeRestfulSrv">
      <tr>
        <td class="gl-table-cell label" style="width: 20%">服务地址</td>
        <td class="gl-table-cell" style="padding: 0.5em">
          <a-input v-model="params.InvokeRestfulSrv.srvUrl"></a-input>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell label" style="width: 20%">请求方法</td>
        <td class="gl-table-cell" style="padding: 0.5em">
          <a-radio-group v-model="params.InvokeRestfulSrv.method" size="small">
            <a-radio-button value="GET">GET</a-radio-button>
            <a-radio-button value="POST">POST</a-radio-button>
          </a-radio-group>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell label" style="width: 20%">请求参数</td>
        <td class="gl-table-cell">
          <gl-param-mapping :params="params.InvokeRestfulSrv.params"
                            @update="(value)=>{params.InvokeRestfulSrv.params = value}"></gl-param-mapping>

          <!--<table class="gl-table">-->
          <!--<tr>-->
          <!--<th>参数名</th>-->
          <!--<th>参数值</th>-->
          <!--</tr>-->
          <!--<tr v-for="(param,paramIndex) in params.InvokeRestfulSrv.params" :key="paramIndex">-->
          <!--<td class="gl-table-cell label">-->
          <!--<a-input v-model="param.name"></a-input>-->
          <!--</td>-->
          <!--<td class="gl-table-cel">-->
          <!--<a-input v-model="param.value"></a-input>-->
          <!--</td>-->
          <!--</tr>-->
          <!--<tfoot>-->
          <!--<tr>-->
          <!--<td colspan="2">-->
          <!--<a-button size="small" block @click="params.InvokeRestfulSrv.params.push({name:'',value:''})">-->
          <!--<a-icon type="plus"></a-icon>-->
          <!--添加-->
          <!--</a-button>-->
          <!--</td>-->
          <!--</tr>-->
          <!--</tfoot>-->
          <!--</table>-->
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell label" style="width: 20%">返回结果</td>
        <td class="gl-table-cell" style="padding: 0.5em">
          <span style="font-weight: 700">返回结果处理</span><br>
          编写Javascript函数体部分，通过$ctx.data可以获取返回的结果进行处理。<br>
          <a-textarea v-model="params.InvokeRestfulSrv.result.handler" :rows="8"></a-textarea>
          <br>
          <div style="padding: 0.4em 0">
            <span>处理后设置到：</span>
            <a-radio-group v-model="params.InvokeRestfulSrv.result.setVar.scope" size="small">
              <a-radio-button value="COMPONENT">当前组件变量</a-radio-button>
              <a-radio-button value="PAGE">当前页面变量</a-radio-button>
            </a-radio-group>
          </div>
          <a-input v-model="params.InvokeRestfulSrv.result.setVar.name" placeholder="写入变量名，如myVarA"></a-input>
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
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    components: {ATextarea, GlParamMapping},
    mixins: [mixin],
    props: {
      params: {
        type: Object,
        default() {
          return {
            InvokeRestfulSrv: JSON.parse(JSON.stringify(this.defaultConfig))
          }
        }
      }
    },
    data() {
      return {
        fnTemplate: `function(data){return data }`,
        defaultConfig: {
          srvUrl: '',
          method: 'POST',
          params: {},
          result: {handler: '', setVar: {scope: 'component', name: '', value: ''}}
        }
      }
    },
    watch: {},
    computed: {},
    created() {
    },
    mounted() {
      if (this.params && !this.params.InvokeRestfulSrv) {
        this.$set(this.params, 'InvokeRestfulSrv', JSON.parse(JSON.stringify(this.defaultConfig)))
      }
    },
    methods: {}
  }
</script>

<style scoped>
</style>

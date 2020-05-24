<!--
   数据源示例：
   {
      entity: 'platform_city',
      lazy: true,
      fields: 'name,code',
      resultMapping: {
        text: 'name',
        value: 'code'
      },
      // 带参数查询的数据源
      params: [
        // 该信息会自动加入计算属性中，当province的值变动时，该数据源会重新加载计算
        {name:'provinceCode',cop:'eq',value: '$ctx.form.province'}
      ],
      description: '这是一个下拉列表数据源，带参数'
    }
-->
<template>
  <table class="gl-table">
    <tbody>
    <tr class="gl-table-row">
      <td class="gl-table-cell">
        <div class="gl-title-sub"> 查询实体：</div>
        <gl-data-source-dynamic-select-entity :entityName="dsItem.entity" :toSelectEntityNames="toSelectEntityNames"
                                              :loadFieldMetaWhenMounted="true"
                                              :dataAlias="dataAlias"
                                              @updateEntity="onSelectEntity"
                                              @updateFieldMeta="onUpdateFieldMeta"></gl-data-source-dynamic-select-entity>
      </td>
    </tr>
    <tr class="gl-table-row">
      <td class="gl-table-cell">
        <div class="gl-title-sub"> 查询字段（基本）：</div>
        <table class="gl-table">
          <tr class="gl-table-row" style="text-align: center">
            <th style="width: 35%">绑定到控件属性</th>
            <th>查询的实体字段</th>
          </tr>
          <tr class="gl-table-row" v-for="column in controlConfigMeta">
            <td class="gl-table-cell gl-table-cell-sub-label" style="width: 30%">{{column.title}}（{{column.name}}）:
            </td>
            <td class="gl-table-cell" style="width: 70%">
              <a-select v-model="dsItem.resultMapping[column.name]" :allowClear="true" style="min-width: 99%"
                        v-if="refreshFlag"
                        @change="onChangeFields">
                <a-select-option v-for="(fieldMeta,colMetaIndex) in fieldMetas" :key="colMetaIndex"
                                 :value="fieldMeta.fieldName" :title="fieldMeta.title">
                  <span v-if="!fieldMeta.nullable" class="gl-required" style="font-weight: bold">*</span>{{fieldMeta.fieldName}}&nbsp;({{fieldMeta.title}})
                </a-select-option>
              </a-select>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr class="gl-table-row">
      <td class="gl-table-cell">
        <div class="gl-title-sub"> 查询条件：</div>
        <textarea style="width: 100%" rows="5" :value="JSON.stringify(dsItem)"></textarea>
        <table class="gl-table">
          <tr style="text-align: center">
            <th class="gl-table-cell" style="width: 35%">参数</th>
            <th class="gl-table-cell" style="width: 20%">比较</th>
            <th class="gl-table-cell">值</th>
            <th class="gl-table-cell" style="width: 5em"></th>
          </tr>
          <gl-draggable
              :list="dsItem.params"
              animation="700"
              handle=".gl-dnd-action-row-handle"
              :group="{ name: 'queryProperties',  put: true }"
              :sort="true"
              element="tbody"
          >
            <template class="gl-table-row" v-for="(param,paramIndex) in dsItem.params">
              <tr :key="paramIndex">
                <td class="gl-table-cell">
                  <a-select v-model="param.name" :allowClear="true" style="min-width: 99%"
                            v-if="refreshFlag"
                            @change="onChangeFields">
                    <a-select-option v-for="(fieldMeta,colMetaIndex) in fieldMetas" :key="colMetaIndex"
                                     :value="fieldMeta.fieldName" :title="fieldMeta.title">
                      <span v-if="!fieldMeta.nullable" class="gl-required" style="font-weight: bold">*</span>{{fieldMeta.fieldName}}&nbsp;({{fieldMeta.title}})
                    </a-select-option>
                  </a-select>
                  <!--<input v-model="param.name"/>-->
                </td>
                <td class="gl-table-cell">
                  <a-select v-model="param.cop" style="min-width: 99%">
                    <a-select-option v-for="cop in cops" :key="cop.value" :title="cop.text">
                      {{cop.text}}
                    </a-select-option>
                  </a-select>
                </td>
                <td class="gl-table-cell"><input v-model="param.value" style="width: 99%"/></td>
                <td class="gl-table-cell">
                  <a-button class="gl-mini-btn gl-dnd-action-row-handle">
                    <a-icon type="drag"/>
                  </a-button>
                  <a-button class="gl-mini-btn"
                            @click="dsItem.params.splice(propertyIndex,1)">
                    <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
                  </a-button>
                </td>
              </tr>
            </template>
          </gl-draggable>
        </table>

        <a-button size="small" block
                  @click="dsItem.params.push({name:'',value:''})"
                  style="line-height: 1.499em">
          <a-icon type="plus" size="small"/>
          添加查询条件
        </a-button>
      </td>
    </tr>
    <tr class="gl-table-row">
      <!--<td class="gl-table-cell gl-table-cell-sub-label">-->
      <!--初始：-->
      <!--</td>-->
      <td class="gl-table-cell">
        <div class="gl-title-sub"> 初始时加载数据：</div>
        <a-switch v-model="dsItem.lazy"></a-switch>
      </td>
    </tr>
    <tr class="gl-table-row">
      <!--<td class="gl-table-cell gl-table-cell-sub-label">-->
      <!--描述：-->
      <!--</td>-->
      <td class="gl-table-cell">
        <div class="gl-title-sub"> 描述：</div>
        <textarea v-model="dsItem.description" rows="4" style="width: 100%"></textarea>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  import GlDataSourceDynamicSelectEntity from "./DataSourceDynamicSelectEntity";
  import ideSelectItems from '../../../gl-ide/src/data/ideSelectItems'

  export default {
    name: "GlDataSourceDynamic",
    components: {GlDataSourceDynamicSelectEntity},
    props: {
      dsItem: {
        type: Object,
        required: true
      },
      dataAlias: {
        type: Object,
        default() {
          return {text: 'text', value: 'value'}
        }
      },
      // 按组件的类型，指定控件必需要用到的字段
      // 如对于树控件数据源，需要用到title,key，而对于select控件数据源，需要用到text,value
      // 默认按select控件数据源格式
      controlConfigMeta: {
        type: Array,
        default() {
          return [
            {title: '标题', name: 'text', required: true},
            {title: '值', name: 'value', required: true}
          ]
        }
      }
    },
    data() {
      return {
        refreshFlag: true,
        fieldMetas: [],
        toSelectEntityNames: [],
        cops: ideSelectItems.cops
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      forceFresh() {
        this.refreshFlag = false
        this.$nextTick(function () {
          this.refreshFlag = true
        })
      },
      init() {
        // 参数转换

        // 加载元数据
        if (this.dsItem.entity) {
          this.$gl.api.queryMeta(this.dsItem.entity)
        }
      },
      onChangeFields() {

        let ary = []
        for (let key in this.dsItem.resultMapping) {
          ary.push(this.dsItem.resultMapping[key])
        }
        console.log('xxxxx',ary.join(','))
        this.$set(this.dsItem, 'fields', ary.join(','))
        // this.dsItem.fields = ary.join(',')

        this.forceFresh()
      },
      onSelectEntity({entityName}) {
        console.log('onSelectEntity>>>>>>>>>>>>>>>>>>>>>', entityName)
        this.$set(this.dsItem, 'entity', entityName)
        this.entityName = entityName
        this.$emit('updateEntity', {
          entityName: entityName
        })
      },
      onUpdateFieldMeta(data) {
        console.log('onUpdateFieldMeta>>>>>>>>>>>>>>>>>>>>>', data)
        this.fieldMetas = data.fieldMetas
      }
    }
  }
</script>

<style scoped>
</style>

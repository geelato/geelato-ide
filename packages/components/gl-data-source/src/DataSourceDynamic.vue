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
      params: {
        // 该信息会自动加入计算属性中，当province的值变动时，该数据源会重新加载计算
        provinceCode: 'gs:$ctx.form.province'
      },
      description: '这是一个下拉列表数据源，带参数'
    }
-->
<template>
  <table class="gl-table">
    <tbody>
    <tr class="gl-table-row">
      <td class="gl-table-cell gl-table-cell-sub-label">
        查询实体：
      </td>
      <td class="gl-table-cell">
        <gl-data-source-dynamic-select-entity :entityName="dsItem.entity" :toSelectEntityNames="toSelectEntityNames"
                                              @updateEntity="onSelectEntity"
                                              @updateFieldMeta="onUpdateFieldMeta"></gl-data-source-dynamic-select-entity>
      </td>
    </tr>
    <tr class="gl-table-row">
      <td class="gl-table-cell gl-table-cell-sub-label">
        查询字段：
      </td>
      <td class="gl-table-cell">
        <div>标题字段：</div>
        <a-select v-model="dsItem.resultMapping.text" :allowClear="true" style="min-width: 99%" v-if="refreshFlag"
                  @change="forceFresh">
          <a-select-option v-for="(fieldMeta,colMetaIndex) in fieldMetas" :key="colMetaIndex"
                           :value="fieldMeta.fieldName" :title="fieldMeta.title">
            <span v-if="!fieldMeta.nullable" class="gl-required" style="font-weight: bold">*</span>{{fieldMeta.fieldName}}&nbsp;({{fieldMeta.title}})
          </a-select-option>
        </a-select>
        <div>值字段：</div>
        <a-select v-model="dsItem.resultMapping.value" :allowClear="true" style="min-width: 99%" v-if="refreshFlag"
                  @change="forceFresh">
          <a-select-option v-for="(fieldMeta,colMetaIndex) in fieldMetas" :key="colMetaIndex"
                           :value="fieldMeta.fieldName" :title="fieldMeta.title">
            <span v-if="!fieldMeta.nullable" class="gl-required" style="font-weight: bold">*</span>{{fieldMeta.fieldName}}&nbsp;({{fieldMeta.title}})
          </a-select-option>
        </a-select>
      </td>
    </tr>
    <tr class="gl-table-row">
      <td class="gl-table-cell gl-table-cell-sub-label">
        查询过滤：
      </td>
      <td class="gl-table-cell">
        <template class="gl-table-row" v-for="(param,paramIndex) in dsItem.params">
          <div :key="paramIndex">{{param.key}}&nbsp;</div>
          <input v-model="param.value"/>
        </template>
      </td>
    </tr>
    <tr class="gl-table-row">
      <td class="gl-table-cell gl-table-cell-sub-label">
        初始加载：
      </td>
      <td class="gl-table-cell">
        <a-switch v-model="dsItem.lazy"></a-switch>
      </td>
    </tr>
    <tr class="gl-table-row">
      <td class="gl-table-cell gl-table-cell-sub-label">
        描述：
      </td>
      <td class="gl-table-cell">
        <textarea v-model="dsItem.description" rows="4" style="width: 100%"></textarea>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  import GlDataSourceDynamicSelectEntity from "./DataSourceDynamicSelectEntity";

  export default {
    name: "GlDataSourceDynamic",
    components: {GlDataSourceDynamicSelectEntity},
    props: {
      dsItem: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        refreshFlag: true,
        fieldMetas: [],
        toSelectEntityNames: []
      }
    },
    mounted() {
      this.init()
    },
    // beforeDestroy() {
    //   this.$emit('update', this.dsItem)
    // },
    methods: {
      forceFresh() {
        this.refreshFlag = false
        this.$nextTick(function () {
          this.refreshFlag = true
        })
      },
      init() {
        // 参数转换

      },
      onchange() {
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

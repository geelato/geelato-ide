<template>
  <div>
    <div style="padding: 0.5em;text-align: center;border-bottom: 1px solid #ececec">
      <a-radio-group v-model="dataSourceType" size="small" @change="onChange">
        <a-radio-button value="static">来源静态数据</a-radio-button>
        <a-radio-button value="dynamic">来源动态数据</a-radio-button>
      </a-radio-group>
    </div>
    <div v-if="dataSourceType==='dynamic'&&dsItem.entity">
      <gl-data-source-dynamic :dsItem="dsItem" :controlConfigMeta="controlConfigMeta" @updateEntity="onUpdateEntity"
                              :dataAlias="dataAlias"></gl-data-source-dynamic>
    </div>
    <div v-else-if="dataSourceType==='static'">
      <gl-data-source-static v-if="dsType==='select'" :dataItems="dataItems"
                             :dataAlias="dataAlias"></gl-data-source-static>
      <gl-data-source-static-tree-node v-else-if="dsType==='treeNode'" :dataItems="dataItems"
                                       :dataAlias="dataAlias"></gl-data-source-static-tree-node>
    </div>
  </div>
</template>

<script>
  import GlDataSourceDynamic from './DataSourceDynamic'
  import GlDataSourceStatic from './DataSourceStatic'
  import GlDataSourceStaticTreeNode from './DataSourceStaticTreeNode'

  export default {
    name: "GlDataSource",
    components: {GlDataSourceStatic, GlDataSourceStaticTreeNode, GlDataSourceDynamic},
    props: {
      /**
       * 动态数据源名称
       */
      dsKey: {
        type: String,
      },
      /**
       * 当前上下文，可选的数据源集，key为数据源名称，value为数据源配置
       */
      dsMap: {
        type: Object,
        default() {
          return {}
        }
      },
      /**
       * 静态数据集合
       */
      dataItems: {
        type: Array
      },
      dataAlias: {
        type: Object,
        default() {
          return {text: 'text', value: 'value'}
        }
      },
      // 仅对于动态数据源有效，用于指定需配置哪些查询字段
      controlConfigMeta: {
        type: Array
      },
      // 数据源类型，默认为下拉数据源select，另可为treeNode
      dsType: {
        type: String,
        default() {
          return 'select'
        }
      }
    },
    data() {
      return {
        dataSourceType: 'static',
        dsItem: {}
      }
    },
    watch: {
      dsKey: function (val, oval) {
        // console.log('val', val, 'oval', oval)
        this.init()
      }
    },
    mounted() {
      console.log('gl-data-source > Index > mounted() > props', 'dsKey', this.dsKey, 'dsMap', this.dsMap, 'dataItems', this.dataItems)
      this.init()
    },
    updated() {
    },
    beforeDestroy() {

    },
    methods: {
      init() {
        // 若已有数据源，优先展示
        if (this.dsKey && this.dsMap[this.dsKey]) {
          this.dataSourceType = 'dynamic'
          let ds = this.dsMap[this.dsKey]
          // kv to array
          // let params = []
          // for (let key in ds.params) {
          //   params.push({key: key, value: ds.params[key]})
          // }
          this.dsItem = {
            entity: ds.entity,
            lazy: ds.lazy,
            fields: ds.fields,
            resultMapping: ds.resultMapping,
            params: ds.params,
            description: ds.description
          }
        } else {
          this.dataSourceType = 'static'
          // 参数转换
          this.dsItem = {
            entity: 'platform_demo_entity',
            lazy: false,
            fields: 'name,id',
            resultMapping: {
              text: 'name',
              value: 'id'
            },
            // 带参数查询的数据源
            params: [
              // {
              // 该信息会自动加入计算属性中，当province的值变动时，该数据源会重新加载计算
              // provinceCode: 'gs:$ctx.form.province'
              // }
            ],
            description: ''
          }
        }
        this.onChange()
      },
      onUpdateEntity({entityName}) {
        this.onChange()
      },
      onUpdateDynamic(dsItem) {

      },
      onChange() {
        // 从配置数据结构转成源码数据结构
        // array to kv
        // let params = {}
        // this.dsItem.params.forEach(param => params[param.key] = param.value)
        let updatedDsItem = {
          entity: this.dsItem.entity,
          lazy: this.dsItem.lazy,
          fields: this.dsItem.fields,
          resultMapping: this.dsItem.resultMapping,
          params: this.dsItem.params,
          description: this.dsItem.description
        }

        let dsKey
        // 在dynamic模式下
        if (this.dataSourceType === 'dynamic') {
          // 无dsKey，则创建一个
          dsKey = this.dsKey || this.$gl.utils.uuid(16)
          console.log('gl-data-source > Index > onChange() > add dsMap by key:', dsKey, ' and result:', this.dsMap)
          this.$set(this.dsMap, dsKey, updatedDsItem)
        } else {
          // this.$set(this.dsMap, dsKey, undefined)
          if (this.dsKey) {
            console.log('gl-data-source > Index > onChange() > delete dsMap by key:', this.dsKey, ' and result:', this.dsMap)
            delete this.dsMap[this.dsKey]
          }
        }
        console.log('gl-data-source > Index > onChange() > $emit {dsItem, dsKey, dsMap}:', updatedDsItem, dsKey, this.dsMap)

        this.$emit('update', {dsItem: updatedDsItem, dsKey: dsKey, dsMap: this.dsMap})
      }
    }
  }
</script>

<style scoped>
</style>

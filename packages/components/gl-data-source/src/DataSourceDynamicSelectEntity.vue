<template>
  <div>
    <a-select v-model="entityName" :allowClear="true" style="min-width: 99%" v-if="refreshFlag"
              @change="onChangeSelectEntity">
      <div slot="dropdownRender" slot-scope="menu">
        <gl-v-nodes :vnodes="menu"/>
        <a-divider style="margin: 4px 0;"/>
        <div style="padding: 8px; cursor: pointer;" @click="openSelectEntityList">
          <a-icon type="plus"/>
          添加
        </div>
      </div>
      {{dataAlias}}
      <a-select-option v-for="entityItem in toSelectEntityNames" :key="entityItem[dataAlias.value]"
                       :value="entityItem[dataAlias.value]"
                       :title="entityItem[dataAlias.text]">
        {{entityItem[dataAlias.value]}}
      </a-select-option>
    </a-select>
    <!--<div style="line-height: 2em;margin-left: 0.5em">再绑定字段：</div>-->
    <!--&lt;!&ndash;:style="{color:!containField()?'':'red'}"&ndash;&gt;-->
    <!--<a-select v-model="fieldConfig.field" :allowClear="true" style="min-width: 99%" v-if="refreshFlag"-->
    <!--@change="forceFresh">-->
    <!--<a-select-option v-for="(colMeta,colMetaIndex) in currentEntityColumns" :key="colMetaIndex"-->
    <!--:value="colMeta.fieldName" :title="colMeta.title">-->
    <!--<span v-if="!colMeta.nullable" class="gl-required" style="font-weight: bold">*</span>{{colMeta.fieldName}}&nbsp;({{colMeta.title}})-->
    <!--</a-select-option>-->
    <!--</a-select>-->
  </div>
</template>

<script>

  import SelectEntityList from './SelectEntityList'

  export default {
    name: "GlDataSourceDynamicSelectEntity",
    components: {
      GlVNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      }
    },
    props: {
      // 是否初始化时加载字段元数据，默认为false
      loadFieldMetaWhenMounted: {
        type: Boolean,
        default() {
          false
        }
      },
      entityName: {
        type: String,
        required: true
      },
      toSelectEntityNames: {
        type: Array,
        default() {
          []
        }
      },
      dataAlias: {
        type: Object,
        default() {
          return {text: 'text', value: 'value'}
        }
      }
    },
    data() {
      return {
        refreshFlag: true,
        currentEntityColumns: []
      }
    },
    mounted() {
      console.log('gl-data-source > GlDataSourceDynamicSelectEntity > mounted() > toSelectEntityNames:', this.toSelectEntityNames, this.loadFieldMetaWhenMounted)
      if (this.loadFieldMetaWhenMounted) {
        this.loadFieldMetaByEntityName(this.entityName)
      }
    },
    // destroyed() {
    //   this.$emit('update', {})
    // },
    methods: {

      onChangeSelectEntity(entityName) {
        this.$emit('updateEntity', {
          entityName: entityName
        })
        this.loadFieldMetaByEntityName(entityName);
        this.forceFresh()
      },
      onEntitySelected(params, data) {
        console.log('updateEntity....................', data.name)

        this.$emit('updateEntity', {
          entityName: data.name
        })
        this.addToSelectEntityNames({text: data.title, value: data.name})
        this.loadFieldMeta({tableId: data.id, '@order': 'fieldName|+'})
      },
      loadFieldMetaByEntityName(entityName) {
        let that = this
        that.$gl.api.query('platform_dev_table', 'id,title,description', {
          entityName: entityName,
          delStatus: 0,
          enableStatus: 1
        }).then(function (res) {
          that.loadFieldMeta({tableId: res.data[0].id, '@order': 'fieldName|+'})
        })
      },
      loadFieldMeta(kvConditions) {
        let that = this
        that.$gl.api.query('platform_dev_column', 'id,nullable,title,fieldName,name,description', kvConditions).then(function (res) {
          that.currentEntityColumns = res.data
          console.log('updateFieldMeta....................', res.data)
          that.$emit('updateFieldMeta', {
            fieldMetas: that.currentEntityColumns
          })
        })
      },
      addToSelectEntityNames({text, value}) {
        let containsItems = this.toSelectEntityNames.filter((item) => {
          return item.value === value
        })
        if (containsItems.length === 0) {
          this.toSelectEntityNames.push({
            text: text,
            value: value
          })
        }
      },
      forceFresh() {
        this.refreshFlag = false
        this.$nextTick(function () {
          this.refreshFlag = true
        })
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
      }
    }
  }
</script>

<style scoped>
</style>

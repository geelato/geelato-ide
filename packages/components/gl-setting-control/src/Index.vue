<template>
  <div v-if="opts&&opts.props" class="gl-setting-control">
    <div class="gl-title">
      <a-icon type="setting"/>
      外观
    </div>
    <table class="gl-table">
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          字段名：
        </td>
        <td class="gl-table-cell">
          <a-input v-model="opts.title" style="width: 99%">
            <a-icon slot="suffix" type="global" @click="$refs.titleI18n.show()"
                    :style="opts.titleI18n?iconActiveStyle:{}" v-show="refreshFlag"/>
          </a-input>
          <gl-setting-i18n ref="titleI18n" :i18nMap="i18nMap" :i18nKey="opts.titleI18n" :defaultLocaleValue="opts.title"
                           @change="(message)=>{$set(opts, 'title', message.zh)}"
                           @delete="(i18nKey)=>{delete opts.titleI18n;forceFresh()}"
                           @createKey="(i18nKey)=>{$set(opts, 'titleI18n', i18nKey)}"></gl-setting-i18n>
        </td>
      </tr>
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          <a-icon type="info-circle" title=""/>
          控件类型：
        </td>
        <td class="gl-table-cell">
          <a-select v-model="opts.control" :allowClear="true" style="min-width: 99%">
            <a-select-option v-for="(controlItem,controlItemIndex) in controlTypes" :key="controlItemIndex"
                             :value="controlItem.control"
                             :title="controlItem.title">
              <a-icon :type="controlItem.icon"/>&nbsp;&nbsp;{{controlItem.title}}
            </a-select-option>
          </a-select>
        </td>
      </tr>
    </table>
    <div class="gl-title">
      <a-icon type="setting"/>
      数据
    </div>
    <table class="gl-table">
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          <a-icon type="info-circle" title="绑定数据库的字段，才可以存储到后台。"/>
          绑定数据：
        </td>
        <td class="gl-table-cell">
          <div class="gl-title-sub">先选择实体：</div>
          <!--<a-input-search placeholder="选择并绑定实体" v-model="opts.entity" @search="openSelectEntityList"-->
          <!--readOnly>-->
          <!--<a-button type="primary" slot="enterButton">-->
          <!--<a-icon type="select"/>-->
          <!--选择-->
          <!--</a-button>-->
          <!--</a-input-search>-->
          <a-select v-model="opts.entity" :allowClear="true" style="min-width: 99%" v-if="refreshFlag"
                    @change='onChangeSelectEntity'>
            <div slot="dropdownRender" slot-scope="menu">
              <gl-v-nodes :vnodes="menu"/>
              <a-divider style="margin: 4px 0;"/>
              <div style="padding: 8px; cursor: pointer;" @click="openSelectEntityList">
                <a-icon type="plus"/>
                添加
              </div>
            </div>
            <a-select-option v-for="entityItem in currentEntityNames" :key="entityItem.value"
                             :value="entityItem.value"
                             :title="entityItem.text">
              {{entityItem.value}}
            </a-select-option>
          </a-select>
          <div class="gl-title-sub">再绑定字段：</div>
          <!--:style="{color:!isContainField()?'':'red'}"-->
          <a-select v-model="opts.field" :allowClear="true" style="min-width: 99%" v-if="refreshFlag"
                    @change="forceFresh">
            <a-select-option v-for="(colMeta,colMetaIndex) in currentEntityColumns" :key="colMetaIndex"
                             :value="colMeta.fieldName" :title="colMeta.title">
              <span v-if="!colMeta.nullable" class="gl-required" style="font-weight: bold">*</span>{{colMeta.fieldName}}&nbsp;({{colMeta.title}})
            </a-select-option>
          </a-select>
          <div style="margin: 0.2em">
            <a-switch v-model="opts.isServerSaveIgnore"></a-switch>
            <!--保存时是否排除该字段-->
            仅加载数据有效，不做保存
          </div>
        </td>
      </tr>
      <!--<tr class="gl-table-row">-->
      <!--<td class="gl-table-cell gl-table-cell-sub-label">-->
      <!--是否排除：-->
      <!--</td>-->
      <!--<td class="gl-table-cell">-->
      <!--<a-switch v-model="opts.isServerSaveIgnore"></a-switch>-->
      <!--保存时是否排除该字段-->
      <!--</td>-->
      <!--</tr>-->
      <tr class="gl-table-row" v-if="refreshFlag&&isContainDataItems(opts)">
        <td class="gl-table-cell gl-table-cell-sub-label">
          {{getControlType(opts.control).title}}项：
        </td>
        <td class="gl-table-cell">
          <gl-data-source :dataItems="opts.data" :dsKey="opts.dsName" :dsMap="dsMap"
                          @update="onDataSourceUpdate"
                          :defaultActiveIndex="opts.props.defaultActiveIndex"
                          @changeDefaultActiveIndex="onChangeDefaultActiveIndex"></gl-data-source>
        </td>
      </tr>
    </table>
    <div class="gl-title">
      <a-icon type="setting"/>
      验证、权限规则
    </div>
    <table class="gl-table" v-if="opts.rules">
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          是否必填：
        </td>
        <td class="gl-table-cell">
          <a-switch v-model="opts.rules.required"></a-switch>
        </td>
      </tr>
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          是否唯一：
        </td>
        <td class="gl-table-cell">
          <a-switch v-model="opts.rules.unique"></a-switch>
        </td>
      </tr>
    </table>
    <div class="gl-title">
      <a-icon type="setting"/>
      提示、描述、说明
    </div>
    <table class="gl-table">
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          占位符：
        </td>
        <td class="gl-table-cell">
          <a-input v-model="opts.props.placeholder" style="width: 99%">
            <a-icon slot="suffix" type="global" @click="$refs.placeholderI18n.show()"
                    :style="opts.props.placeholderI18n?iconActiveStyle:{}" v-show="refreshFlag"/>
          </a-input>
          <gl-setting-i18n ref="placeholderI18n" :i18nMap="i18nMap" :i18nKey="opts.props.placeholderI18n"
                           :defaultLocaleValue="opts.props.placeholder"
                           @change="(message)=>{$set(opts.props,'placeholder', message.zh)}"
                           @delete="(i18nKey)=>{delete opts.props.placeholderI18n;forceFresh()}"
                           @createKey="(i18nKey)=>{$set(opts.props, 'placeholderI18n', i18nKey)}"></gl-setting-i18n>
        </td>
      </tr>
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          提示描述：
        </td>
        <td class="gl-table-cell">
          <a-icon slot="suffix" type="global" style="position: relative;float: right;right: 1em;z-index: 99999;margin-top: 0.5em" @click="$refs.tipsI18n.show()"
                  :style="opts.tipsI18n?iconActiveStyle:{}" v-show="refreshFlag"/>
          <a-textarea v-model="opts.tips" style="width: 99%;padding-right: 2em" rows="5">
          </a-textarea>
          <gl-setting-i18n ref="tipsI18n" :i18nMap="i18nMap" :i18nKey="opts.tipsI18n" :defaultLocaleValue="opts.tips"
                           @change="(message)=>{$set(opts, 'tips', message.zh)}"
                           @delete="(i18nKey)=>{delete opts.tipsI18n;forceFresh()}"
                           @createKey="(i18nKey)=>{$set(opts, 'tipsI18n', i18nKey)}"></gl-setting-i18n>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

  import controlTypes from './data/allControlTypes'
  import SelectEntityList from '../../../components/gl-data-source/src/SelectEntityList'
  import GlDataSource from "../../../components/gl-data-source/src/Index";

  export default {
    name: 'GlSettingControl',
    components: {
      GlDataSource, GlVNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      }
    },
    props: {
      /**
       *  即property
       */
      opts: {
        type: Object
      },
      /**
       *  待绑定的实体
       */
      toSelectEntityNames: {
        type: Array,
        default() {
          return []
        }
      },
      /**
       *  数据源定义
       */
      dsMap: {
        type: Object,
        default() {
          return {}
        }
      },
      /**
       *  国际化方案
       */
      i18nMap: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        controlTypes: controlTypes,
        currentEntityNames: this.toSelectEntityNames,
        currentEntityColumns: [],
        refreshFlag: true,
        visibleTitleI18n: false,
        iconActiveStyle: {color: '#1890FF'}
      }
    },
    watch: {
      'opts.control': {
        handler: function (val, oval) {
          console.log('opts.control', val, oval)
          this.initConvertData()
        },
        immediate: true
      }
    },
    mounted() {
      console.log('gl-setting-control > opts:', this.opts)

      this.onChangeSelectEntity(this.opts.entity)
    },
    created() {
      this.initConvertData()
    },
    destroyed() {
    },
    methods: {
      // createKey($evnet) {
      //   console.log('createKey:', $evnet)
      //   this.$set(this.opts, 'titleI18n', $evnet)
      // },
      forceFresh() {
        this.refreshFlag = false
        this.$nextTick(function () {
          this.refreshFlag = true
        })
      },
      /**
       * 设置默认值、属性
       */
      initConvertData() {
        if (!this.opts.rules) {
          this.$set(this.opts, 'rules', {})
        }
        if (!this.opts.props) {
          this.$set(this.opts, 'props', {})
          this.$set(this.opts.props, 'placeholder', {placeholder: ''})
        }
        if (this.isContainDataItems(this.opts) && !this.opts.data) {
          this.$set(this.opts, 'data', [])
        }
      },
      reset() {
        if (!this.opts) {
          return
        }
      },
      addToSelectEntityNames({text, value}) {
        let containsItems = this.currentEntityNames.filter((item) => {
          return item.value === value
        })
        if (containsItems.length === 0) {
          this.currentEntityNames.push({
            text: text,
            value: value
          })
        }
      },
      getControlType(control) {
        return this.controlTypes.find(function (controlType) {
          return controlType.control === control
        })
      },
      onChangeSelectEntity(entityName) {
        this.loadFieldMetaByEntityName(entityName);
        this.forceFresh()
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
      },
      isContainField() {
        let found = this.currentEntityColumns.find(function (item) {
          return item.fieldName === this.opts.field
        })
        return found ? true : false
      },
      isContainDataItems(item) {
        console.log('gl-setting-control > isContainDataItems() > item:', item)
        return item.control === 'Select'
      },
      onDataSourceUpdate({dsItem, dsKey, dsMap}) {
        // console.log('gl-setting-control > onDataSourceUpdate() > dsItem, dsKey, dsMap:', dsItem, dsKey, dsMap)
        this.$set(this.opts, 'dsName', dsKey)
        console.log('gl-setting-control > onDataSourceUpdate() > control opts:', this.opts)
        this.$emit('dataSourceUpdate', {dsItem: dsItem, dsKey: dsKey, dsMap: dsMap})

      },
      onChangeDefaultActiveIndex(defaultActiveIndex) {
        this.$set(this.opts.props, 'defaultActiveIndex', defaultActiveIndex)
      },
      onEntitySelected(params, data) {
        this.$set(this.opts, 'entity', data.name)
        this.addToSelectEntityNames({text: data.title, value: data.name})
        this.loadFieldMeta({tableId: data.id, '@order': 'fieldName|+'})
      }
    }
  }
</script>

<style>
  .gl-setting-control-popover {
    margin-top: 24px !important;
    margin-right: 48px !important;;
  }
</style>

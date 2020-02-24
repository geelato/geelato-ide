<template>
  <div>
    <div class="gl-form-header"></div>
    <gl-draggable
        :list="rowItems"
        handle=".gl-dnd-form-row-handle"
        group='layoutItems'
        :sort="true"
        @add="onRowAdd"
        @end="onRowEnd"
        @clone="onRowClone"
        @change="onRowChange"
    >
      <a-row v-for="(row,rowIndex) in rowItems" :gutter="row.gutter||gutter" :key="row.gid"
             class="gl-dnd-form-row-handle-target">
        <a-col v-for="(col,colIndex) in row.cols" :span="col.span" :offset="col.offset" :key="colIndex" style="">
          <!--col.items为最后一级。未支持嵌套rows的场景，即不支持col.rows-->
          <a-row v-for="(item,itemIndex) in col.items" :key="itemIndex"
                 class="col">
            <a-col :span="item.fieldSpan.label" class="label">
              <gl-label v-if="item.fields[0]&&item.fields[0].field" :label="getProperty(item.fields[0].field).title"
                        :property="getProperty(item.fields[0].field)"></gl-label>
            </a-col>
            <a-col :span="item.fieldSpan.control" class="control">
              <div class="gl-dnd-form-col-toolbar">
                <!--<a-icon type="swap" style="color: #f5222d" title="移动字段" class="gl-dnd-control-handle"/>-->
                <a-icon type="delete" theme="twoTone" twoToneColor="#f5222d"
                        @click="removeControl(item,col,row,itemIndex,colIndex,rowIndex)" title="删除字段"/>
              </div>
              <!--<div class="form-control-mask gl-dnd-control-handle">&nbsp;</div>-->
              <gl-draggable
                  :list="item.fields"
                  handle=".gl-dnd-control-handle"
                  group='field'
                  :sort="false"
                  @add="onAddControl($event,item)"
                  @end="onRowEndControl($event,item)"
                  @change="onControlChange($event,item)"
                  @choose="onControlChoose($event,item)"
                  class="gl-dnd-form-col-wrapper"
              >
                <gl-control v-if="fieldItem.field" class="gl-dnd-control-handle "
                            v-for="(fieldItem,fieldItemIndex) in item.fields"
                            :ref="getProperty(fieldItem.field).gid" :form="form"
                            :property="getProperty(fieldItem.field)"
                            :key="fieldItemIndex"
                ></gl-control>
              </gl-draggable>
            </a-col>
          </a-row>
        </a-col>
        <div class="gl-dnd-form-row-toolbar">
          <div class="icons-list">
            <a-icon type="swap" style="color: #f5222d" title="移动行" class="gl-dnd-form-row-handle"/>
            <a-icon type="close-circle" theme="twoTone" twoToneColor="#f5222d" style="margin-left: 0.1em"
                    @click="removeRow(rowIndex)"
                    title="删除行"/>
          </div>
        </div>
      </a-row>
      <div v-if="!rowItems||rowItems.length===0" style="text-align: center;padding-top: 1em">
        从左边【布局】栏目中拖动布局行列到该区域，再从【组件】栏目拖动组件到布局行列中。
      </div>
    </gl-draggable>
    <div class="gl-form-toolbar" v-show="toolbar.show" style="text-align: center">
      <template v-for="(action,index) in toolbar.actions" v-if="action.gid=action.gid||$gl.utils.uuid(8)">
        <a-button :ref="action.gid" :type="action.type||'primary'" :icon="action.icon"
                  :key="index" v-if="action.show===undefined||action.show===''||rungs(action.show)">
          {{action.text||action.title}}
        </a-button>&nbsp;
      </template>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  import controlTypes from '../data/controlTypes'

  let GEELATO_SCRIPT_PREFIX = 'gs:'

  export default {
    name: "GlIdePluginFormDesignerStageUIItem",
    props: {
      rows: {
        type: Array,
        default() {
          return []
        }
      },
      properties: {
        type: Object,
        default() {
          return {}
        }
      },
      form: {
        type: Object,
        default() {
          return {}
        }
      },
      toolbar: {
        type: Object,
        default() {
          return {
            show: true,
            actions: [{
              gid: this.$gl.utils.uuid(8),
              text: '保存',
              type: 'primary',
              show: '',
              icon: ''
            }, {
              gid: this.$gl.utils.uuid(8),
              text: '取消',
              type: 'danger',
              show: '',
              icon: ''
            }]
          }
        }
      },
      gutter: {
        type: Number,
        default() {
          return 8
        }
      }
    },
    data() {
      return {
        rowItems: this.rows,
        controlTypes: controlTypes
      }
    },
    watch: {},
    created() {
      this.$gl.bus.$on('gl_ide_plugin_layout__modal_close', this.onClose)
    },
    beforeDestroy() {
      // 在关闭之前，统一通知更新修改后的行数据，设计过程不更新
      this.$emit('updateLayoutRows', this.rowItems)
    },
    destroyed() {
      this.$gl.bus.$off('gl_ide_plugin_layout__modal_close', this.onClose)
    },
    mounted() {
      if (this.toolbar && !this.toolbar.gid) {
        this.toolbar.gid = this.$gl.utils.uuid(8)
      }
      // 初始化rowId，若无则初始化id
      this.rowItems.forEach(row => {
        // row.cols.forEach(col => {
        //   col.items.forEach(item => {
        //     item.fields.forEach(field => {
        //       console.log('gl-ide-plugin-layout > stage > mounted() > field: ', field)
        //     })
        //   })
        // })
        row.gid = row.gid || this.$gl.utils.uuid(8)
      })
    },
    methods: {
      onRowEnd: function (args) {
        console.log('gl-ide-plugin-layout > stage > onRowEnd: ', args, this.properties)
      },
      onRowAdd: function (args) {
        console.log('gl-ide-plugin-layout > stage > onRowAdd: ', args, this.rowItems)
      },
      removeRow(rowIndex) {
        let that = this
        this.$confirm({
          title: '是否删除该行?',
          cancelText: '是',
          okText: '否',
          content: '',
          onOk() {
          },
          onCancel() {
            that.removePropertiesInRow(rowIndex)
            that.rowItems.splice(rowIndex, 1)
          },
        });
      },
      onRowChange(e) {
        // console.log('gl-ide-plugin-layout > stage > onRowChange: ', e)
        // this.$emit('updateLayoutRows', this.rowItems)
      },
      onRowClone(e) {
        console.log('gl-ide-plugin-layout > stage > onRowClone: ', e)
      },
      onAddControl: function (e, fieldItems) {

        console.log('gl-ide-plugin-form-designer > stage > onAddControl() > e: ', e, 'fieldItems:', fieldItems)
        let item = this.getCurrentControlItem(e, fieldItems)

        this.$gl.bus.$emit('gl-ide-plugin-form-designer.stage.fieldSelect', this.getProperty(item.field), this.getBindEntityNames())
        console.log('gl-ide-plugin-form-designer > stage > onAddControl() > item: ', item)
      },

      // 获取已引用的实体
      getBindEntityNames() {
        let bindEntityNames = {}
        for (let key in this.properties) {
          const property = this.properties[key]
          if (property.entity) {
            bindEntityNames[property.entity] = property.entity
          }
        }
        return bindEntityNames
      },

      onRowEndControl: function (e, fieldItems) {
        // console.log('gl-ide-plugin-form-designer > stage > onRowEndControl() > e: ', e)
        // console.log('gl-ide-plugin-form-designer > stage > onRowEndControl() > fieldItems: ', fieldItems)
        // let item = this.getCurrentControlItem(e, fieldItems)
        // console.log('gl-ide-plugin-form-designer > stage > onRowEndControl() > item: ', item)
        // console.log('gl-ide-plugin-form-designer > stage > onRowEndControl() > rowItems: ', this.rowItems)
        // this.$emit('updateLayoutRows', this.rowItems)
      },

      onControlChange(e, fieldItems) {
        // 新增加或拖动，都会产生e.added
        // console.log('gl-ide-plugin-form-designer > stage > onControlChange() > e: ', e, 'fieldItems: ', fieldItems)
        // if (e.added) {
          // this.$emit('updateLayoutRows', this.rowItems)
        // }
      },
      onControlChoose(e, fieldItems) {
        console.log('gl-ide-plugin-layout > stage > onControlChoose: ', e)
        let item = this.getCurrentControlItem(e, fieldItems)
        this.$gl.bus.$emit('gl-ide-plugin-form-designer.stage.fieldSelect', this.getProperty(item.field), this.getBindEntityNames())
      },
      removeControl(item, col, row) {
        let that = this
        that.$confirm({
          title: '是否删除该字段?',
          cancelText: '是',
          okText: '否',
          content: '',
          onOk() {
          },
          onCancel() {
            item.fields.forEach((fieldItem) => {
              console.log('gl-ide-plugin-form-designer > stage > removeControl() > 删除字段：', fieldItem.field, that.getProperty(fieldItem.field).gid)
              delete that.properties[that.getProperty(fieldItem.field).gid]
            })
            item.fields.splice(0, item.fields.length)
            console.log('gl-ide-plugin-form-designer > stage > removeControl() > item：', item, col, row)
          },
        });
      },
      getCurrentControlItem(e, fieldItems) {
        // console.log('getCurrentControlItem>', e, fieldItems)
        if (e.newIndex === undefined || e.newIndex === null) {
          // 无新增
          return fieldItems.fields[e.oldIndex]
        }
        return fieldItems.fields[fieldItems.fields.length === e.newIndex && e.newIndex > 0 ? e.newIndex - 1 : e.newIndex]
      },
      /**
       * 获取表单属性，若无属性，则直接创建
       * @param filedItem {field, control, title}
       * @return {*}
       */
      getProperty(field) {
        return this.properties[field]
      },
      getControlType(control) {
        return this.controlTypes.find(function (item) {
          return item.control === control
        })

      },
      removePropertiesInRow(rowIndex) {
        const that = this
        const row = that.rowItems[rowIndex]
        row.cols.forEach(function (col) {
          console.log('gl-ide-plugin-form-designer > removePropertiesInRow() > try delete property in col:', JSON.stringify(col))
          col.items.forEach((item) => {
            if (item.fields) {
              item.fields.forEach((fieldItem) => {
                console.log('gl-ide-plugin-form-designer > removePropertiesInRow() > delete property gid:', that.getProperty(fieldItem.field).gid, fieldItem)
                delete that.properties[that.getProperty(fieldItem.field).gid]
              })
            }
          })
        })
      },
      onClose() {
        // console.log('close>>>>>>>>>>>>>>>>')
        // removePropertiesInRow(rowIndex) {
        //   const that = this
        //   const row = that.rowItems[rowIndex]
        //   row.cols.forEach(function (col) {
        //     console.log('col>', JSON.stringify(col))
        //     delete that.properties[col.field]
        //   })
        // },
        // const that = this
        // that.rowItems.forEach(function (rowItem) {
        //   console.log('that.rows', that.rows)
        // })
      },
      /**
       * gs(geelato script)执行表达式，若非gs表达式则直接返回
       * @param str e.g. "gs:$ctx.table.selectedRowKeys.length > 0"
       */
      rungs(str) {
        let $ctx = this
        if (typeof str === 'string' && str.indexOf(GEELATO_SCRIPT_PREFIX) === 0) {
          return this.$gl.utils.eval(str.substring(3), $ctx)
        } else {
          return str
        }
      },
    }
  }
</script>

<style>
</style>

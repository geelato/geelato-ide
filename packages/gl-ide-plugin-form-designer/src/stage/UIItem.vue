<template>
  <div>
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
      <a-row v-for="(row,rowIndex) in rowItems" :gutter="row.gutter||gutter" :key="rowIndex"
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
                <a-icon type="delete" theme="twoTone" twoToneColor="#f5222d"
                        @click="removeControl(item,rowIndex,colIndex,itemIndex)" title="删除字段"/>
              </div>
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
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  import controlTypes from '../data/controlTypes'

  export default {
    name: "GlIdePluginLayoutStageUIItem",
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
    destroyed() {
      this.$gl.bus.$off('gl_ide_plugin_layout__modal_close', this.onClose)
    },
    mounted() {
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
        console.log('gl-ide-plugin-layout > stage > onRowChange: ', e)
        this.$emit('updateLayoutRows', this.rowItems)
      },
      onRowClone(e) {
        console.log('gl-ide-plugin-layout > stage > onRowClone: ', e)
      },
      onAddControl: function (e, fieldItems) {

        console.log('gl-ide-plugin-form-designer > stage > onAddControl() > e: ', e, 'fieldItems:', fieldItems)
        let item = this.getCurrentControlItem(e, fieldItems)
        // 获取已引用的实体
        let bindEntityNames = {}
        for (let key in this.properties) {
          const property = this.properties[key]
          if (property.entity) {
            bindEntityNames[property.entity] = property.entity
          }
        }

        this.$gl.bus.$emit('gl-ide-plugin-form-designer.stage.fieldSelect', this.getProperty(item.field), bindEntityNames)
        console.log('gl-ide-plugin-form-designer > stage > onAddControl() > item: ', item)
      },

      onRowEndControl: function (e, fieldItems) {
        // console.log('gl-ide-plugin-form-designer > stage > onRowEndControl() > e: ', e)
        // console.log('gl-ide-plugin-form-designer > stage > onRowEndControl() > fieldItems: ', fieldItems)
        // let item = this.getCurrentControlItem(e, fieldItems)
        // console.log('gl-ide-plugin-form-designer > stage > onRowEndControl() > item: ', item)
        console.log('gl-ide-plugin-form-designer > stage > onRowEndControl() > rowItems: ', this.rowItems)
        this.$emit('updateLayoutRows', this.rowItems)
      },

      onControlChange(e, fieldItems) {
        // 新增加或拖动，都会产生e.added
        console.log('gl-ide-plugin-form-designer > stage > onControlChange() > e: ', e, 'fieldItems: ', fieldItems)
        if (e.added) {
          this.$emit('updateLayoutRows', this.rowItems)
        }
      },
      onControlChoose(e, fieldItems) {
        console.log('gl-ide-plugin-layout > stage > onControlChoose: ', e)
        let item = this.getCurrentControlItem(e, fieldItems)
        this.$gl.bus.$emit('gl-ide-plugin-form-designer.stage.fieldSelect', this.getProperty(item.field))
      },
      removeControl(item) {
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
              console.log('删除字段：', fieldItem.field, that.getProperty(fieldItem.field).gid)
              delete that.properties[that.getProperty(fieldItem.field).gid]
            })
            item.fields.splice(0, item.fields.length)
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
          console.log('col>', JSON.stringify(col))
          col.items.forEach((item) => {
            if (item.fields) {
              item.fields.forEach((fieldItem) => {
                console.log('delete property gid>', fieldItem.gid)
                delete that.properties[fieldItem.gid]
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
      }
    }
  }
</script>

<style>
</style>

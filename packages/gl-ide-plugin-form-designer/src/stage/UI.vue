<template>
  <div class="gl-table-designer"
       style="height: 760px;overflow-x: hidden;padding-left: 0.5em;padding-right: 1em">
    <u-i-item :rows="rows"
              :properties="opts.properties"
              :form="form"
              :gutter="opts.layout.gutter"
              :toolbar="opts.toolbar"
              @updateLayoutRows="updateLayoutRows"
    ></u-i-item>
  </div>
</template>

<script>
  import UIItem from './UIItem'

  export default {
    name: "GlIdePluginFormDesignerStageUI",
    components: {UIItem},
    props: {
      opts: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        form: {},
        rows: []
      }
    },
    created() {
      this.rows = this.convertToSrcLayoutRows(this.opts.layout.rows)
      console.log('geelato-ide >  GlIdePluginFormDesignerStageUI > mounted() > this.opts:', this.opts)
      console.log('geelato-ide >  GlIdePluginFormDesignerStageUI > mounted() > this.rows:', this.rows)
    },
    mounted() {
    },
    methods: {
      /**
       * 转换为源码（设计）模式下的表单布局
       * @param rows
       * @return {Array}
       */
      convertToSrcLayoutRows(rows) {
        let that = this
        let newRows = []
        // 转换布局信息
        rows.forEach((row) => {
          let newRow = {
            cols: []
          }
          for (let i = 0; row.cols.length > i;) {
            let col = row.cols[i]
            if (col.rows) {
              newRow.cols.push({
                span: col.span,
                rows: that.convertToSrcLayoutRows(col.rows)
              })
              i++
            } else {
              let labelCol = row.cols[i]
              let controlCol = row.cols[i + 1]
              let x = 24 / (labelCol.span + controlCol.span)
              newRow.cols.push({
                span: labelCol.span + controlCol.span,
                // items对应一个格子中，有多组label、control的场景，以支持用户头像等需跨多行展示的场景
                // 目前items只有一项，只暂不支持用户头像需跨多行的场景
                items: [{
                  fields: [
                    {
                      title: labelCol.label,
                      field: controlCol.field
                    }
                  ],
                  fieldSpan: {label: labelCol.span * x, control: controlCol.span * x}
                }]
              })
              i += 2
            }
          }
          newRows.push(newRow)
        })
        return newRows
      },
      //
      convertToReleaseLayoutRows(rows) {
        let newRows = []
        rows.forEach((row) => {
          let newRow = {
            cols: []
          }
          row.cols.forEach((col) => {
            if (col.rows) {
              // 未支持col嵌套rows
              // this.convertToReleaseLayoutRows(col.rows)
            } else {
              col.items.forEach((item) => {
                if (item.fields && item.fields.length > 0) {
                  const x = col.span / 24
                  let fieldSpan = item.fieldSpan
                  let fieldItem = item.fields[0]
                  // {span: 4, label: true, field: 'avatar'}
                  // 第一个有效，只取第一个field，
                  newRow.cols.push({
                    span: fieldSpan.label * x,
                    label: true,
                    field: fieldItem.field
                  })
                  newRow.cols.push({
                    span: fieldSpan.control * x,
                    field: fieldItem.field
                  })
                } else {
                  const x = col.span / 24
                  let fieldSpan = item.fieldSpan
                  newRow.cols.push({
                    span: fieldSpan.label * x,
                    label: '',
                    field: ''
                  })
                  newRow.cols.push({
                    span: fieldSpan.control * x,
                    field: ''
                  })
                }
              })
            }
          })
          newRows.push(newRow)
        })
        console.log('convertToReleaseLayoutRows> after:', newRows)
        return newRows
      },
      updateLayoutRows(updatedRows) {
        // this.$set(this.opts.layout, 'rows', this.convertToReleaseLayoutRows(updatedRows))
        this.opts.layout.rows.splice(0, this.opts.layout.rows.length)
        this.convertToReleaseLayoutRows(updatedRows).forEach((row) => {
          this.opts.layout.rows.push(row)
        })
      }
    }
  }
</script>

<style>
</style>

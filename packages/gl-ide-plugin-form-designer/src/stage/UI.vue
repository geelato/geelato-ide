<template>
  <div class="gl-ide-layout-stage gl-table-designer"
       style="height: 760px;overflow-x: hidden;padding-left: 0.5em;padding-right: 1em">
    <u-i-item :rows="rows"
              :properties="opts.properties"
              :form="form"
              :componentRefs="{}"
              :events="{}"
              :bindEvents="{}"
              :gutter="opts.layout.gutter"
              :treeNodes="[]"
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
      console.log('geelato-ide >  GlIdePluginFormDesignerStageUI > mounted()', this.opts)
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
        let newRows = []
        // 转换布局信息
        rows.forEach((row) => {
          let newRow = {
            cols: []
          }
          for (let i = 0; row.cols.length > i; i += 2) {
            let labelCol = row.cols[i]
            let controlCol = row.cols[i + 1]
            console.log('row.cols>>>', row.cols)
            let x = 24 / (labelCol.span + controlCol.span)
            newRow.cols.push({
              span: labelCol.span + controlCol.span,
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
          }
          newRows.push(newRow)
        })
        return newRows
      }
    }
  }
</script>

<style>
</style>

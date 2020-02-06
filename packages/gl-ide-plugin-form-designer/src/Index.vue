<template>
  <div class="gl-ide-plugin-form-designer" style="width:100%;overflow-y: scroll">
    <a-row>
      <a-col :span="4" style="border-right: 1px solid #F2F2F2">
        <sidebar :size="size" :height="height" :opts="cardBind"></sidebar>
      </a-col>
      <a-col :span="14" style="border-right: 1px solid #F2F2F2;padding: 2em 2em">
        <div style="text-align: right;width: 100%;padding-right: 3em;line-height: 2em">
          <a @click="printSrc">打印当前配置</a>
        </div>
        <stage :size="size" :height="height" :opts="cardBind" style="padding-right: 3.5em;padding-top: 1em"></stage>
      </a-col>
      <a-col :span="6">
        <settings :size="size" :height="height"></settings>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Sidebar from './Sidebar'
  import Stage from './stage/UI'
  import Settings from './settings/Settings'

  export default {
    name: "GlIdePluginFormDesigner",
    components: {Sidebar, Stage, Settings},
    props: {
      opts: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        // height: window.innerHeight * .80,
        // size: 'small',
        refreshToggleFlag: true,
        size: 'default',
        cardBind: {},
        height: window.innerHeight * .85,
        tabPanelStyle: {
          'height': '100%',
          'min-height': window.innerHeight * .85 - 48 + 'px',
          'max-height': window.innerHeight * .85 - 48 + 'px',
          'overflow-y': "scroll"
        }
      }
    },
    created() {
      // window.resize(() => {
      //   this.height = window.innerHeight * .80
      // })
      // 设置初始化值，确保所有值都可双向绑定
      // this.opts.table.showHeader = (this.opts.table.showHeader === undefined ? true : this.opts.table.showHeader)
      // this.opts.table.show = (this.opts.table.show === undefined ? true : this.opts.table.show)
      //
      // for (let i in this.opts.query.mix.properties) {
      //   let property = this.opts.query.mix.properties[i]
      //   property.props = (property.props === undefined ? {} : property.props)
      // }
      //
      // for (let i in this.opts.table.columns) {
      //   let column = this.opts.table.columns[i]
      //   column.needTotal = (column.needTotal === undefined ? false : column.needTotal)
      //   column.sorter = (column.sorter === undefined ? false : column.sorter)
      //   // 列格式化辅助字段
      //   column.customRenderString = (column.customRenderString === undefined ? '' : column.customRenderString)
      //   // if (column.customRenderString) {
      //   //   try {
      //   //     column.customRender = eval(column.customRenderString)
      //   //   } catch (e) {
      //   //     console.error('gl-ide > gl-ide-plugin-table-designer > The format of column.customRenderString is incorrect:', column.customRenderString + '.', e)
      //   //   }
      //   // } else {
      //   //   column.customRender = undefined
      //   // }
      // }
      this.cardBind = this.opts
    },
    methods: {
      onFieldSelect(event) {
        console.log('event>', event)
      },
      printSrc() {
        console.log('当前表单配置：', this.opts)
      }
    }
  }
</script>

<style>
  .gl-ide-plugin-form-designer .gl-dnd-form-row-handle-target {
    border: 1px solid #f0f0f0;
    margin-bottom: 0.1em;
  }

  .gl-ide-plugin-form-designer .gl-dnd-form-row-handle {
    cursor: move;
  }

  .gl-ide-plugin-form-designer .gl-dnd-form-row-handle.sortable-chosen {
    background-color: rgb(107, 209, 255);
  }

  .gl-ide-plugin-form-designer .gl-dnd-form-row-wrapper {
    min-height: 2em;
  }

  .gl-ide-plugin-form-designer .gl-dnd-form-row-toolbar {
    position: absolute;
    right: -3.25em;
    display: none;
    font-size: 1em;
    line-height: 2.4em;
    min-height: 2.4em;
    padding: 0.2em 0.4em 0.2em 0;
    background-color: #ececec;
    border-radius:0 10px 10px 0
  }

  .gl-ide-plugin-form-designer .gl-dnd-form-row-toolbar i {
    font-size: 1.5em;
    line-height: 1.5em;
    cursor: pointer;
  }

  .gl-ide-plugin-form-designer .gl-dnd-form-row-handle-target:hover .gl-dnd-form-row-toolbar {
    display: inline-block;
  }

  .gl-ide-plugin-form-designer .gl-dnd-form-row-handle-target:hover {
    /*box-shadow: 0 0 1px #000 inset;*/
    box-shadow: 0 0 4px #6b6b6b;
  }

  .gl-ide-plugin-form-designer .gl-dnd-form-col-wrapper {
    min-height: 2.4em;
  }

  .gl-ide-plugin-form-designer .gl-dnd-form-col-toolbar {
    position: absolute;
    font-size: 1.5em;
    right: 0.5em;
    display: none;
    z-index: 1000;
  }

  .gl-ide-plugin-form-designer .control:hover .gl-dnd-form-col-toolbar {
    display: inline-block;
  }

  /*.gl-ide-plugin-form-designer .gl-dnd-form-col-toolbar i {*/
  /*color: red;*/
  /*}*/
  .gl-ide-plugin-form-designer .label {
    /*background-color: #eeeeee;*/
    text-align: right;
    padding-right: 1em;
    min-height: 2.4em;
  }

  .gl-ide-plugin-form-designer .label > div {
    vertical-align: middle;
    line-height: 2.4em;
  }

  .gl-ide-plugin-form-designer .control {
    min-height: 2em;
    background-color: rgb(217, 248, 255);
    padding: 0.2em;
  }

  .gl-ide-plugin-form-designer .control:hover {
    background-color: rgb(187, 231, 255);
  }

  .gl-ide-plugin-form-designer .col.ant-row {
    background-color: #eeeeee;
  }

  .gl-ide-plugin-form-designer .gl-control {
    min-height: 2em;
    line-height: 2em;
    cursor: move;
  }
</style>

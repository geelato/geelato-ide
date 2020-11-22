<template>
  <div class="gl-ide-data-meta-sidebar" :style="{width:`${layout.width-30}px`}">
    正在努力建设中
  </div>
</template>

<script>

  export default {
    name: "gl-ide-plugin-data-meta-sidebar",
    components: {},
    props: {
      layout: {
        type: Object,
        default() {
          return {
            width: 0,
            height: 0
          }
        }
      }
    },
    data() {
      return {
        chooseIndex: 0,
        gutter: 8,
        rows: [{
          title: '一行一列',
          cols: [
            {span: 24, offset: 0, items: []}
          ]
        }, {
          title: '一行两列',
          cols: [
            {span: 6, offset: 0, items: []}, {span: 18, offset: 0, items: []}
          ]
        }, {
          title: '一行两列',
          cols: [
            {span: 8, offset: 0, items: []}, {span: 16, offset: 0, items: []}
          ]
        }, {
          title: '一行两列',
          cols: [
            {span: 12, offset: 0, items: []}, {span: 12, offset: 0, items: []}
          ]
        }, {
          title: '一行两列',
          cols: [
            {span: 16, offset: 0, items: []}, {span: 8, offset: 0, items: []}
          ]
        }, {
          title: '一行两列',
          cols: [
            {span: 18, offset: 0, items: []}, {span: 6, offset: 0, items: []}
          ]
        }, {
          title: '一行三列',
          cols: [
            {span: 8, offset: 0, items: []}, {span: 8, offset: 0, items: []}, {span: 8, offset: 0, items: []}
          ]
        },
          {
            title: '一行四列',
            cols: [
              {span: 6, offset: 0, items: []}, {span: 6, offset: 0, items: []}, {
                span: 6,
                offset: 0,
                items: []
              }, {span: 6, offset: 0, items: []}
            ]
          }]
      }
    },
    methods: {
      onSelect(keys) {
        this.$gl.bus.$emit('project_file_selected', keys)
      },
      onExpand() {
      },
      onChange() {
      },
      onChoose(e) {
        console.log('gl-ide-plugin-layout > sidebar > onChoose: ', e)
        this.chooseIndex = e.oldIndex
      },
      clone() {
        return JSON.parse(JSON.stringify(this.rows[this.chooseIndex]))
      }
    }
  }
</script>

<style>
  .gl-placeholder {
    /*background-color: #d8d8d8;*/
  }

  .gl-ide-data-meta-sidebar .gl-dnd-row-handle {
    min-height: 2em;
  }

  .gl-ide-data-meta-sidebar .ant-row {
    border: 1px solid #f0f0f0;
    margin-bottom: 0.5em;
    cursor: move;
  }

  .gl-ide-data-meta-sidebar .ant-row:hover > div > div {
    background-color: rgb(107, 209, 255);
  }

  .gl-ide-data-meta-sidebar .ant-row > div > div {
    background-color: rgba(161, 222, 255, 0.35);
    text-align: center;
  }
</style>

<template>
  <div class="gl-ide-layout-sidebar" :style="{width:`${layout.width-30}px`}">
    <a-alert message="选择并拖放到右边界面" type="info" closeText="关闭" class="gl-card-gutter"/>
    <gl-draggable
        v-model="rows"
        handle=".gl-dnd-row-handle"
        :group="{ name: 'layoutItems', pull: 'clone', put: true }"
        ghost-class="ghost"
        :sort="false"
        @change="onChange"
    >
      <a-row :gutter="gutter" v-for="(row,rowIndex) in rows" :key="rowIndex" :title="row.title"
             class="gl-dnd-row-handle">
        <a-col v-for="(col,colIndex) in row.cols" :key="colIndex" :span="col.span">
          <div style="min-height: 2em">{{parseInt(col.span/24*100)}}%</div>
        </a-col>
      </a-row>
    </gl-draggable>
  </div>
</template>

<script>

  export default {
    name: "gl-ide-layout-sidebar",
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
        gutter: 8,
        rows: [{
          title: '一行一列',
          cols: [
            {span: 24, offset: 0,items: []}
          ]
        }, {
          title: '一行两列',
          cols: [
            {span: 6, offset: 0,items: []}, {span: 18, offset: 0,items: []}
          ]
        }, {
          title: '一行两列',
          cols: [
            {span: 8, offset: 0,items: []}, {span: 16, offset: 0,items: []}
          ]
        }, {
          title: '一行两列',
          cols: [
            {span: 12, offset: 0,items: []}, {span: 12, offset: 0,items: []}
          ]
        }, {
          title: '一行两列',
          cols: [
            {span: 16, offset: 0,items: []}, {span: 8, offset: 0,items: []}
          ]
        }, {
          title: '一行三列',
          cols: [
            {span: 8, offset: 0,items: []}, {span: 8, offset: 0,items: []}, {span: 8, offset: 0,items: []}
          ]
        },
          {
            title: '一行四列',
            cols: [
              {span: 6, offset: 0,items: []}, {span: 6, offset: 0,items: []}, {span: 6, offset: 0,items: []}, {span: 6, offset: 0,items: []}
            ]
          }]
      }
    },
    methods: {
      onSelect(keys) {
        console.log('Trigger Select', keys)
        this.$bus.$emit('project_file_selected', keys)
      },
      onExpand() {
        console.log('Trigger Expand');
      },
      onChange(e) {
        console.log('gl-ide-plugin-layout > sidebar > onChange: ', e)
      }
    }
  }
</script>

<style>
  .gl-placeholder {
    /*background-color: #d8d8d8;*/
  }

  .gl-ide-layout-sidebar .gl-dnd-row-handle {
    min-height: 2em;
  }

  .gl-ide-layout-sidebar .ant-row {
    border: 1px solid #f0f0f0;
    margin-bottom: 0.5em;
    cursor: move;
  }

  .gl-ide-layout-sidebar .ant-row:hover > div > div {
    background-color: rgb(107, 209, 255);
  }

  .gl-ide-layout-sidebar .ant-row > div > div {
    background-color: rgba(161, 222, 255, 0.35);
    text-align: center;
  }
</style>

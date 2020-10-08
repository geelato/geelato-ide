<template>
  <div class="gl-ide-layout-sidebar" :style="{width:`${layout.width-30}px`}">
    <!--<a-alert message="选择并拖放到右边界面" type="info" closeText="关闭" class="gl-card-gutter"/>-->
    <gl-draggable
        v-model="rows"
        handle=".gl-dnd-row-handle"
        :group="{ name: 'layoutItems', pull: 'clone', put: false }"
        ghost-class="ghost"
        :sort="false"
        @change="onChange"
        @choose="onChoose"
        :clone="clone"
    >
      <a-row :gutter="gutter" v-for="(row,rowIndex) in rows" :key="rowIndex" :title="row.title"
             class="gl-dnd-row-handle">
        <a-col v-for="(col,colIndex) in row.cols" :key="colIndex" :span="col.span">
          <div style="min-height: 2em">{{parseInt(col.span/24*100)}}%</div>
        </a-col>
      </a-row>
    </gl-draggable>
    <!--<gl-draggable-->
    <!--v-model="rows"-->
    <!--handle=".gl-dnd-row-handle"-->
    <!--:group="{ name: 'layoutItems', pull: 'clone', put: false }"-->
    <!--ghost-class="ghost"-->
    <!--:sort="false"-->
    <!--@change="onChange"-->
    <!--@clone="onClone"-->
    <!--&gt;-->
    <!--<a-row :gutter="gutter" v-for="(row,rowIndex) in rows" :key="rowIndex" :title="row.title"-->
    <!--class="gl-dnd-row-handle">-->
    <!--<a-col v-for="(col,colIndex) in row.cols" :key="colIndex" :span="col.span">-->
    <!--<div style="min-height: 2em">{{parseInt(col.span/24*100)}}%</div>-->
    <!--</a-col>-->
    <!--</a-row>-->
    <!--</gl-draggable>-->
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
      },
      arrayGroupBy(array, groupKey) {
        let groups = {}
        array.forEach(function (item) {
          groups[groupKey] = groups[groupKey] || []
          groups[groupKey].push(item)
        });
        // return Object.values(groups);
        let groupAry = []
        for (let key in groups) {
          groupAry.push({group: key, items: groups[key]})
        }
        return groupAry
      }
    }
  }
</script>

<style>
  /*.gl-placeholder {*/
  /*!*background-color: #d8d8d8;*!*/
  /*}*/

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

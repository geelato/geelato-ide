<template>
  <div class="gl-ide-plugin-form-designer-sidebar">
    <a-tabs defaultActiveKey="1" :size="size" :style="{'min-height':`${height}px`,'max-height':`${height}px`}">
      <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="edit"/>
        字段
      </span>
        <div class="toolbar-item-header">
          通用字段
        </div>
        <div style="padding: 8px">
          <gl-draggable
              @start="drag=true"
              @end="drag=false"
              :options="{group:{name:'field', pull:'clone', put:false },sort:false}">
            <div class="item toolbar-item" v-for="control in toolbar.controls" :data-control="control.value">
              <a-icon :type="control.icon"/>
              <div class="content" readonly>
                {{control.text}}
              </div>
            </div>
          </gl-draggable>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2">
      <span slot="tab">
        <a-icon type="layout"/>
        表单布局
      </span>
        <div class="gl-ide-layout-sidebar">
          <a-alert message="选择并拖放到右边界面" type="info" closeText="关闭" class="gl-card-gutter"/>
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
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import mixin from './mixin'

  export default {
    name: "Sidebar",
    mixins: [mixin],
    data() {
      return {
        items: [],
        toolbar: {
          layout: [
            [{'': [24], $title: '分组标题', $style: "background-color:#FFF"}],
            [{'': [4, 8]}],
            [{'': [4, 20]}],
            [{'': [4, 8]}, {'': [4, 8]}],
            [{'': [3, 5]}, {'': [3, 5]}, {'': [3, 5]}],
            [{'': [2, 4]}, {'': [2, 4]}, {'': [2, 4]}, {'': [2, 4]}]
          ],
          controls: [
            {value: 'input', text: '单行文本', icon: 'dash'},
            {value: 'textarea', text: '多行文本', icon: 'bars'},
            {value: 'checkbox', text: '单选', icon: 'minus-circle', opts: {type: 'radio'}},
            {value: 'checkbox', text: '复选', icon: 'check-square', opts: {type: 'checkbox'}},
            {value: 'date', text: '日期选择', icon: 'calendar', opts: {}},
            {value: 'time', text: '时间选择', icon: 'clock-circle', opts: {}},
            {value: 'dropdown', text: '下拉选择', icon: 'down-square', opts: {}},
            {value: 'rating', text: '评分', icon: 'star', opts: {}}
          ]
        },
        chooseIndex: 0,
        gutter: 8,
        rows: [{
          title: '一行一列（4-20）',
          cols: [
            {span: 24, offset: 0, items: [{fields: [], fieldSpan: {label: 4, control: 20}}]}
          ]
        }, {
          title: '一行两列（4-8 | 4-8）',
          cols: [
            {span: 12, offset: 0, items: [{fields: [], fieldSpan: {label: 8, control: 16}}]}, {
              span: 12,
              offset: 0,
              items: [{fields: [], fieldSpan: {label: 8, control: 16}}]
            }
          ]
        }, {
          title: '一行三列（2-6 | 2-6 | 2-6）',
          cols: [
            {span: 8, offset: 0, items: [{fields: [], fieldSpan: {label: 6, control: 18}}]}, {
              span: 8,
              offset: 0,
              items: [{fields: [], fieldSpan: {label: 6, control: 18}}]
            }, {span: 8, offset: 0, items: [{fields: [], fieldSpan: {label: 6, control: 18}}]}
          ]
        }
          // ,
          //   {
          //     title: '一行四列',
          //     cols: [
          //       {span: 6, offset: 0, items: []}, {span: 6, offset: 0, items: []}, {
          //         span: 6,
          //         offset: 0,
          //         items: []
          //       }, {span: 6, offset: 0, items: []}
          //     ]
          //   }
        ]
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

<style scoped>
  .item {
    margin: 0.125em 0.125em;
    padding: 0.125em 0.25em;
    float: left;
    width: 48%;
    cursor: move;
    background: #f4f6fc;
    border: 1px solid #f4f6fc;
    color: rgba(0, 0, 0, 1);
    border-radius: 0;
    line-height: 1.75em;
  }

  .toolbar-item-header {
    padding-left: 1em;
  }

  .toolbar-item .content {
    padding-left: 8px;
    display: inline-block;
  }

  /*table tr td .item {*/
  /*width: 15em !important;*/
  /*}*/

  .toolbar-item:hover {
    border: 1px dotted #2185d0;
  }
</style>

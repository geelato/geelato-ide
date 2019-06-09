<template>
  <div class="gl-ide-plugin-form-designer-sidebar">
    <a-tabs defaultActiveKey="1" :size="size" :style="{'min-height':`${height}px`,'max-height':`${height}px`}">
      <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="edit"/>
        字段
      </span>
        <div style="padding: 8px">
          <gl-draggable @start="drag=true" @end="drag=false"
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
        布局
      </span>
        Tab 2
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
        }
      }
    }
  }
</script>

<style scoped>
  .item {
    margin: 0.125em 0.125em;
    float: left;
    width: 7.5em;
    cursor: move;
    background: #f4f6fc;
    border: 1px solid #f4f6fc;
    color: rgba(0, 0, 0, 1);
    border-radius: 0
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

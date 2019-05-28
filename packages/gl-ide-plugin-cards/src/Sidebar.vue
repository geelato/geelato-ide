<template>
  <div :style="{width:`${layout.width-30}px`}">
    <a-alert message="选择并拖放到右边界面" type="info" closeText="关闭" class="gl-card-gutter"/>
    <!--<a-card title="列表组件" size="small" style="width: 240px;cursor: move" class="gl-card-gutter gl-compact">-->
    <!--<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" slot="cover"-->
    <!--style="max-height: 100px"/>-->
    <!--</a-card>-->
    <gl-draggable
        v-model="items"
        handle=".gl-dnd-handle"
        :group="{ name: 'card', pull: 'clone', put: false }"
        ghost-class="ghost"
        :sort="false"
    >
      <div class="gl-dnd-handle" style="width: 100%" v-for="(item,index) in items" :key="index">
        <div class="gl-card-header">{{item.title}}</div>
        <div class="gl-card-body"></div>
      </div>
    </gl-draggable>
    <a-button style="text-align: center" block>加载更多...</a-button>
  </div>
</template>

<script>
  import form from './data/form.js'
  import table from './data/table.js'

  export default {
    name: "gl-ide-plugin-sidebar-cards",
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
        items: [{
          title: '表单',
          component: 'gl-form',
          img: '',
          description: '',
          bind: {opts: form, query: {}}
        }, {
          title: '列表',
          component: 'gl-table',
          img: '',
          description: '',
          bind: {opts: table, query: {}}
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
    }
  }
</script>

<style scoped>
  .gl-card-header {
    padding: 0 0.5em;
    height: 2em;
    line-height: 2em;
    background-color: #e9e9e9;
    width: 100%;
    border: 1px solid #cacaca;
  }

  .gl-card-body {
    padding: 0.5em;
    width: 100%;
  }
</style>

<template>
  <div>
    <a-alert message="选择并拖放到右边界面" type="info" closeText="关闭" class="gl-card-gutter"/>
    <gl-draggable :list="items" handle=".gl-dnd-handle" :group="{ name: 'card', pull: 'clone', put: false }"
                  :sort="false" :clone="customClone">
      <div class="gl-dnd-handle" style="width: 100%;cursor: move" v-for="(item,index) in items" :key="index">
        <div class="gl-card-header">
          <a-icon :type="item.icon"/>
          {{item.title}}
        </div>
        <div class="gl-card-body"></div>
      </div>
    </gl-draggable>
    <!--<a-button style="text-align: center" block>加载更多...</a-button>-->
  </div>
</template>

<script>
  import utils from "../../utils";

  export default {
    name: "gl-ide-plugin-sidebar-fields",
    props: {},
    data() {
      return {
        items: [{
          title: '单行文本',
          icon: 'border',
          component: 'a-input',
          img: '',
          description: '',
          show: true,
          bind: {placeholder: 'basic use'}
        }, {
          title: '评分',
          component: 'a-rate',
          icon: 'star',
          img: '',
          description: '',
          show: true,
          bind: {value: 2}
        }],
        color: '#FFF'
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
      customClone(item) {
        let result = {
          id: utils.uuid(16)
        }
        Object.assign(result, item)
        return result
      }
    }
  }
</script>

<style scoped>

  .gl-card-header {
    padding: 0 0.5em;
    min-height: 2em;
    line-height: 2em;
    background-color: #e9e9e9;
    width: 100%;
    border: 1px solid #cacaca;
  }

  .gl-card-header:hover {
    background-color: rgb(107, 209, 255);
  }

  .gl-card-body {
    padding: 0.2em;
    width: 100%;
  }
</style>

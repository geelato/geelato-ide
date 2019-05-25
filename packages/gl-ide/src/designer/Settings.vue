<template>
  <div class="gl-designer-properties">
    <a-tabs @change="callback" size="small" class="gl-compact">
      <a-tab-pane v-for="(panel,index) in panels" :tab="panel.title||panel.name" :key="index">
        <component :is="panel.panelComponent" :opts="panel.content" :editingFile="editingFile"></component>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import mixin from '../../../mixin'

  export default {
    name: "gl-ide-properties",
    mixins: [mixin],
    props: {},
    data() {
      return {}
    },
    methods: {
      callback(key) {
        console.log(key)
      }
    }
  }
</script>

<style scoped>
  .ant-tabs-bar{
    margin: 0;
  }
</style>

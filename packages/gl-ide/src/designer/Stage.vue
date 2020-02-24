<template>
  <div class="gl-designer-stage" v-if="ideStore.refreshToggleFlag">
    <a-tabs @change="callback" size="small" class="gl-compact" v-if="ideStore.editingFile.id" :activeKey="activeKey">
      <a-tab-pane v-for="(panel,index) in ideStore.stagePanels" :tab="panel.title||panel.name" :key="index">
        <component :is="panel.component" v-bind="panel.opts" :ideStore="ideStore"
                   style="overflow-y: auto" :style="{'min-width':`${layout.width+40}px`}" :layout="layout"
                   :activeKey="activeKey"></component>
      </a-tab-pane>
    </a-tabs>
    <div v-else style="text-align: center;margin-top: 12em">
      未选择文件，双击左边文件打开。
    </div>
  </div>
</template>

<script>
  import mixin from '../../../mixin'

  export default {
    name: "GlDesignerStage",
    mixins: [mixin],
    props: {},
    data() {
      return {
        activeKey: 0
      }
    },
    updated() {
    },
    mounted() {
    },
    methods: {
      callback(key) {
        console.log('gl-ide > Stage > callback() > key: ', key, typeof key)
        this.activeKey = key
      },
    },
  }
</script>

<style>
</style>

<template>
  <div class="gl-designer-stage">
    <a-tabs @change="callback" size="small" class="gl-compact">
      <a-tab-pane v-for="(panel,index) in panels" :tab="panel.title||panel.name" :key="index">
        <component :is="panel.component" v-bind="panel.opts" :editingFile="editingFile"
                   style="overflow-y: auto"></component>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import mixin from '../../../mixin'

  export default {
    name: "gl-designer-stage",
    mixins: [mixin],
    props: {},
    data() {
      return {}
    },
    methods: {
      callback(key) {
        console.log('designer > Stage > callback key: ',key)
      },
    },
  }
</script>

<style>
</style>

<template>
  <div class="gl-designer-properties">
    <a-tabs @change="callback" size="small" class="gl-compact">
      <a-tab-pane v-for="(panel,index) in panels" :tab="panel.title" :key="index"
                  :style="{padding:`${panelPadding}px`}">
        <component :is="panel.component" v-bind="panel.opts" :editingFile="editingFile"
                   style="overflow-y: auto" :style="{width:`${layout.width-4}px`}"></component>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import mixin from '../../../mixin'
  import events from '../../../gl-ide-plugin-layout/src/events'

  export default {
    name: "gl-ide-properties",
    mixins: [mixin],
    props: {},
    data() {
      return {}
    },
    created() {
      this.$gl.bus.$on(events.card_open, this.onCardOpen)
    },
    methods: {
      onCardOpen(card) {
        console.log('onCardOpen >', card)
      },
      callback(key) {
        console.log(key)
      }
    }
  }
</script>

<style scoped>
  .ant-tabs-bar {
    margin: 0;
  }
</style>

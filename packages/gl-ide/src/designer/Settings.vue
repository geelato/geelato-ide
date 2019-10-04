<template>
  <div class="gl-designer-properties">
    <a-tabs @change="callback" size="small" class="gl-compact" v-if="ideStore.editingFile&&ideStore.editingFile.type">
      <a-tab-pane v-for="(panel,index) in ideStore.settingPanels" :tab="panel.title" :key="index"
                  :style="{padding:`${panelPadding}px`}">
        <component :is="panel.component" v-bind="panel.opts" :ideStore="ideStore"
                   style="overflow-y: auto" :style="{width:`${layout.width-4}px`}"></component>
      </a-tab-pane>
    </a-tabs>
    <div v-else style="text-align: center;margin-top: 12em">
      未选择文件，双击左边文件打开。
    </div>
  </div>
</template>

<script>
  import mixin from '../../../mixin'
  import events from '../../../gl-ide-plugin-layout/src/events'

  export default {
    name: "GlIdeProperties",
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

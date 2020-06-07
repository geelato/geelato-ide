<template>
  <div class="gl-designer-properties" v-if="ideStore.refreshToggleFlag">
    <a-tabs :activeKey="activeTabKey" @change="onChangeTabs" size="small" class="gl-compact"
            v-if="ideStore.editingFile&&ideStore.editingFile.type">
      <a-tab-pane v-for="(panel,index) in ideStore.settingPanels" :tab="panel.title" :key="index"
                  :style="{padding:`${panelPadding}px`}">
        <component :is="panel.component" v-bind="panel.opts" :ideStore="ideStore"
                   style="overflow-y: auto" :style="{width:`${layout.width-4}px`}" :config="setting.config"
                   @update="onUpdate"></component>
      </a-tab-pane>
    </a-tabs>
    <div v-else style="text-align: center;margin-top: 12em">
      未选择文件，双击左边文件打开。
    </div>
  </div>
</template>

<script>
  import mixin from '../../../mixin'
  import events from '../events'
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    name: "GlIdeSettings",
    components: {ATextarea},
    mixins: [mixin],
    props: {},
    data() {
      return {
        activeTabKey: 1,
        currentPanelName: '',
        setting: {}
      }
    },
    created() {
      this.$gl.bus.$on(events.ide_setting_open, this.onOpenSetting)
    },
    beforeDestroy() {
      this.$gl.bus.$off(events.ide_setting_open, this.onOpenSetting)
      this.currentPanelName = ''
    },
    methods: {
      onOpenSetting(setting) {
        this.setting = setting
        console.log('gl-ide > Settings > onOpenSetting > setting:', setting)
        this.currentPanelName = setting.panelName
        this.activeTabKey = this.ideStore.settingPanels.findIndex(panel => panel.name === setting.panelName) || 0
      },
      onUpdate({value}) {
        Object.assign(this.setting.config, value)
        console.log('gl-ide > Settings > onUpdate > value:', value)
        console.log('gl-ide > Settings > onUpdate > this.setting:', this.setting)
      },
      onChangeTabs(key) {
        this.activeTabKey = key
        // console.log('this.$refs:', this.$refs, key)
        // let ref = this.$refs['panel' + key][0]
        // if (typeof ref.reset === "function") {
        //   ref.reset()
        // }
      }
    }
  }
</script>

<style scoped>
  .ant-tabs-bar {
    margin: 0;
  }
</style>

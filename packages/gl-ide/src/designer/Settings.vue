<template>
  <div class="gl-designer-properties" v-if="ideStore.refreshToggleFlag">
    <a-tabs :activeKey="activeTabKey" @change="onChangeTabs" size="small" class="gl-compact"
            v-if="ideStore.editingFile&&ideStore.editingFile.type">
      <a-tab-pane v-for="(panel,index) in ideStore.settingPanels" :tab="panel.title" :key="index"
                  :style="{padding:`${panelPadding}px`}">
        <template v-if="currentPanelName&&setting[currentPanelName]">
          <component :is="panel.component" v-bind="panel.opts"
                     :ideStore="ideStore"
                     style="overflow-y: auto" :style="{width:`${layout.width-4}px`}"
                     :config="setting[currentPanelName].config"
                     @update="onUpdate"></component>
        </template>
        <template v-else>
          <component :is="panel.component" v-bind="panel.opts"
                     :ideStore="ideStore"
                     style="overflow-y: auto" :style="{width:`${layout.width-4}px`}"></component>
        </template>
      </a-tab-pane>
    </a-tabs>
    <div v-else style="text-align: center;margin-top: 12em">
      请双击左边“应用结构”下的文件
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
        activeTabKey: 0,
        currentPanelName: '',
        setting: {}
      }
    },
    created() {
      this.$gl.bus.$on(events.ide_setting_open, this.onOpenSetting)
      this.$gl.bus.$on(events.ide_setting_update, this.onUpdateSetting)
    },
    beforeDestroy() {
      this.$gl.bus.$off(events.ide_setting_open, this.onOpenSetting)
      this.$gl.bus.$off(events.ide_setting_update, this.onUpdateSetting)
      this.currentPanelName = ''
    },
    watch: {
      'ideStore.refreshToggleFlag': function (val, oval) {
        this.reset()
      }
    },
    methods: {
      // 页面更改之后，重置
      reset() {
        this.activeTabKey = 0
        this.currentPanelName = ''
        this.setting = {}
      },
      onOpenSetting(setting) {
        console.log('gl-ide > Settings > onOpenSetting > setting:', setting)
        this.currentPanelName = setting.panelName
        this.$set(this.setting, setting.panelName, setting)
        this.activeTabKey = this.ideStore.settingPanels.findIndex(panel => panel.name === setting.panelName) || 0
      },
      /**
       * 只更新设置，不切换tab
       * @param setting
       */
      onUpdateSetting(setting) {
        console.log('gl-ide > Settings > onUpdateSetting > setting:', setting)
        this.$set(this.setting, setting.panelName, setting)
      },
      onUpdate({name, value}) {
        // console.log('gl-ide > Settings > onUpdate > name:', name)
        // console.log('gl-ide > Settings > onUpdate > currentPanelName:', this.currentPanelName)
        // console.log('gl-ide > Settings > onUpdate > value:', value)
        // console.log('gl-ide > Settings > onUpdate > this.setting:', this.setting)
        // // Object.assign(this.setting[name].config, value)
      },
      onChangeTabs(key) {
        this.activeTabKey = key
        this.currentPanelName = this.ideStore.settingPanels[key].name
        console.log('gl-ide > Settings > onChangeTabs > currentPanelName:', this.currentPanelName)
        this.$gl.bus.$emit(events.ide_setting_panel_switch, {panel: this.ideStore.settingPanels[key]})

      }
    }
  }
</script>

<style>
  /*.ant-tabs-bar {*/
  /*margin: 0;*/
  /*}*/

  .gl-designer-properties .ant-tabs-nav .ant-tabs-tab {
    margin: 0;
  }
</style>

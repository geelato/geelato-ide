<template>
  <div class="gl-designer">
    <designer-toolbar :style="{height:`${toolbar.height}px`}" :theme="$ide.theme"></designer-toolbar>
    <!--<div>-->
    <!--<designer-sidebar style="width:200px;display: inline-block"></designer-sidebar>-->
    <!--<designer-stage style="width: 100%;display: inline-block"></designer-stage>-->
    <!--<designer-settings style="width:200px;display: inline-block"></designer-settings>-->
    <!-- </div>-->
    <splitpanes class="default-theme"
                :style="{height:`${designer.height-toolbar.height-status.height}px`}">
        <span :splitpanes-size="sidebarsWidthPercent" :splitpanes-min="sidebarsMinWidthPercent">
          <designer-sidebar :layout="sidebar" :plugins="$ide.plugins" :leftToolbarWidth="sidebarLeftToolbarWidth"
                            :ideStore="ideStore" @switchPanel="switchSidebarPanel"
                            :fileTypes="$ide.fileTypes"></designer-sidebar>
      </span>
      <span :splitpanes-size="stageWidthPercent">
          <designer-stage ref="stage" :layout="stage" :plugins="$ide.plugins" :ideStore="ideStore"></designer-stage>
        </span>
      <span :splitpanes-size="settingsWidthPercent">
          <designer-settings :layout="settings" :plugins="$ide.plugins" :ideStore="ideStore"
                             v-if="refreshFlag"></designer-settings>
        </span>
    </splitpanes>
    <designer-status v-if="status.height!==0" :style="{height:`${status.height}px`}" :layout="status"
                     :plugins="$ide.plugins" :ideStore="ideStore"></designer-status>
  </div>
</template>

<script>
  import Splitpanes from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'

  import DesignerToolbar from './designer/Toolbar'
  import DesignerSidebar from './designer/Sidebar'
  import DesignerStage from './designer/Stage'
  import DesignerSettings from './designer/Settings'
  import DesignerStatus from './designer/Status'

  export default {
    name: "GlIde",
    components: {Splitpanes, DesignerToolbar, DesignerSidebar, DesignerStage, DesignerSettings, DesignerStatus},
    data() {
      return {
        refreshFlag: true,
        ideStore: this.$ide.store,
        stagePanels: [],
        designer: {
          height: 0,
          width: 0
        },
        toolbar: {
          height: 34,
          width: 0
        },
        sidebar: {
          height: 0,
          width: 280
        },
        sidebarLeftToolbarWidth: 22,
        stage: {
          height: 0,
          width: 0
        },
        settings: {
          height: 0,
          width: 300
        },
        status: {
          height: 0,
          width: 0
        }
      }
    },
    watch: {},
    computed: {
      sidebarsWidthPercent() {
        return this.sidebar.width / this.designer.width * 100
      },
      sidebarsMinWidthPercent() {
        return this.sidebarLeftToolbarWidth / this.designer.width * 100
      },
      stageWidthPercent() {
        return (this.designer.width - this.sidebar.width - this.settings.width) / this.designer.width * 100
      },
      settingsWidthPercent() {
        return this.settings.width / this.designer.width * 100
      }
    },
    created() {
      this.resize()
      this.$gl.bus.$on('project_file_selected', function (data) {
        console.log('project_file_selected > ', data)
      })
    },
    mounted() {
      const that = this
      window.onresize = () => {
        return (() => {
          that.resize()
        })()
      }
    },
    methods: {
      resize() {
        this.$set(this.designer, 'height', window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)
        this.$set(this.designer, 'width', window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)
        this.$set(this.sidebar, 'height', this.designer.height - this.toolbar.height - this.status.height)
        this.$set(this.stage, 'height', this.sidebar.height)
        this.$set(this.settings, 'height', this.sidebar.height)
      },
      switchSidebarPanel({showPanel}) {
        if (!showPanel) {
          console.log('showPanel>', showPanel)
          this.$set(this.sidebar, 'width', this.sidebarLeftToolbarWidth)
        }
      }
    }
  }
</script>

<style scoped>
  .gl-designer {
    margin: 0;
    padding: 0;
  }
</style>

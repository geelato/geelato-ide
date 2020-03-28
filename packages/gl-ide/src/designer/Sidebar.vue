<template>
  <div class="gl-designer-sidebar">
    <div class="leftToolBar" :style="{height:`${layout.height}px`,width:`${leftToolbar.width}px`}">
      <div class="leftToolBarBtn" v-for="(plugin,index) in pluginSidebars" :key="index"
           :class="{activated:selectedPanelTitle?(selectedPanelTitle===plugin.sidebar.title):index===0}"
           @click="onToolbarClick(plugin.sidebar.title)" readonly>
        <a-icon v-if="plugin.sidebar.icon" :type="plugin.sidebar.icon"/>{{plugin.sidebar.title}}
      </div>
    </div>
    <div class="rightPanel" :style="{padding:`${panelPadding}px`}" v-show="showPanel">
      <template v-for="(plugin,index) in pluginSidebars">
        <component v-show="selectedPanelTitle?(selectedPanelTitle===plugin.sidebar.title):index===0"
                   :is="plugin.sidebar.component"
                   :key="index" :style="{width:`${rightPanelWidth}px`}" :ideStore="ideStore" :fileTypes="fileTypes"></component>
      </template>
    </div>
  </div>
</template>

<script>
  import mixin from '../../../mixin'

  export default {
    name: "GlDesignerSidebar",
    mixins: [mixin],
    props: {
      layout: {
        type: Object,
        default() {
          return {
            width: 0,
            height: 0
          }
        }
      },
      leftToolbarWidth: {
        type: Number,
        default() {
          return 22
        }
      }
    },
    data() {
      return {
        showPanel: true,
        leftToolbar: {
          width: this.leftToolbarWidth
        },
        // rightPanel: {
        //   width: this.$el.$refs.rightPanel.clientWidth
        // },
        pluginSidebars: this.findPlugin('sidebar'),
        selectedPanelTitle: this.pluginSidebars && this.pluginSidebars.length > 0 ? this.pluginSidebars[0].sidebar.title : '',
      }
    },
    computed: {
      rightPanelWidth() {
        // 4px 为调节宽度，将面板的内容小一些，以便能放入sidebar内
        return this.layout.width - this.leftToolbar.width - this.panelPadding * 2 - 4
      }
    },
    mounted() {
      console.log('this.layout', this.layout, this.$el)
    },
    methods: {
      onToolbarClick(panelTitle) {
        // if (panelTitle === this.selectedPanelTitle) {
        //   this.showPanel = !this.showPanel
        //   this.$emit('switchPanel', {showPanel: this.showPanel})
        // }
        this.selectedPanelTitle = panelTitle
      }
    }
  }
</script>


<style scoped>
  .leftToolBar {
    /*width: 1.8em;*/
    line-height: 1.2em;
    background-color: #f0f0f0;
    display: inline-block;
    text-align: center;
    font-size: 12px;
    vertical-align: top;
  }

  .rightPanel {
    display: inline-block;
  }

  .leftToolBarBtn {
    background-color: #f0f0f0;
    padding: 1em 0.4em;
    font-weight: 600;
  }

  .leftToolBarBtn:hover {
    background-color: #d8d8d8;
    cursor: pointer;
  }

  .leftToolBarBtn.activated {
    background-color: #d8d8d8;
  }
</style>

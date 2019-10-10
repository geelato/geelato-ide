<template>
  <div class="gl-designer-toolbar" :style="{background: theme.background }" v-if="ideStore.refreshToggleFlag">
    <!--<img src="../../../../public/favicon.svg" style="width: 24px;height: 24px">-->
    <img src="../../../../public/logo_words.svg" style="width: 84px;height: 24px">
    <a-dropdown size="small">
      <a-menu slot="overlay">
        <a-menu-item size="small" key="1" style="font-size: 12px" @click="showProjectForm">
          <a-icon type="user"/>
          新建项目
        </a-menu-item>
        <a-menu-item size="small" key="2" style="font-size: 12px" @click="showProjectList">
          <a-icon type="user"/>
          打开项目
        </a-menu-item>
        <a-menu-item size="small" key="3" style="font-size: 12px">
          <a-icon type="user"/>
          关闭项目
        </a-menu-item>
      </a-menu>
      <a-button size="small" :style="{background: theme.background }">
        项目
        <!--<a-icon type="down"/>-->
      </a-button>
    </a-dropdown>
    <a-dropdown size="small">
      <a-menu slot="overlay">
        <a-menu-item size="small" key="1" style="font-size: 12px">
          <a-icon type="user"/>
          新建文件
        </a-menu-item>
        <a-menu-item size="small" key="2" style="font-size: 12px">
          <a-icon type="user"/>
          打开项目
        </a-menu-item>
        <a-menu-item size="small" key="3" style="font-size: 12px">
          <a-icon type="user"/>
          关闭项目
        </a-menu-item>
      </a-menu>
      <a-button size="small" :style="{background: theme.background }">
        文件
        <!--<a-icon type="down"/>-->
      </a-button>
    </a-dropdown>
    <a-button size="small" :style="{background: theme.background }">工具</a-button>
    <a-button size="small" :style="{background: theme.background }">插件</a-button>
    <a-button size="small" :style="{background: theme.background }">设置</a-button>
    <a-button size="small" :style="{background: theme.background }" @click="saveFile">保存</a-button>
    <a-button size="small" :style="{background: theme.background }" @click="preview"
              :disabled="!(this.ideStore.editingFile && this.ideStore.editingFile.id)">预览
      <!--<router-link target="_blank" to="/preview"></router-link>-->
    </a-button>

    <a-button size="small" :style="{background: theme.background }" style="float: right" v-if="islogined">
      <a-icon type="logout"/>
      退出
    </a-button>
    <a-button size="small" :style="{background: theme.background }" style="float: right" v-if="!islogined">
      <a-icon type="login"/>
      登录
    </a-button>
    <a-button size="small" :style="{background: theme.background }" href="https://www.geelato.org" target="_blank"
              style="float: right">
      <a-icon type="question-circle"/>
      帮助
    </a-button>
    <a-button size="small" :style="{background: theme.background }" @click="toggleFullScreen" style="float: right"
              title="按ESC键即可退出全屏">
      <template v-if="isFullscreen">
        <a-icon type="fullscreen-exit"/>
        退出全屏
      </template>
      <template v-else>
        <a-icon type="fullscreen"/>
        全屏
      </template>
    </a-button>
  </div>
</template>

<script>
  import mixin from '../../../mixin'
  import screenfull from 'screenfull'

  export default {
    name: "GlDesignerToolbar",
    mixins: [mixin],
    data() {
      return {
        isFullscreen: false,
        islogined: true,
      }
    },
    methods: {
      showProjectForm() {
        this.$gl.bus.$emit('gl-ide.designer.showProjectForm')
      },
      showProjectList() {
        this.$gl.bus.$emit('gl-ide.designer.showProjectList')
      },
      saveFile() {
        this.$gl.bus.$emit('gl-ide.designer.saveFile')
      },
      /**
       *  打开预览页面
       */
      preview() {
        if (this.ideStore.editingFile && this.ideStore.editingFile.id) {
          window.open(window.location.origin+"/#/preview/" + this.ideStore.editingFile.id, '_blank')
        }
      },
      callback(key) {
      },
      toggleFullScreen() {
        screenfull.toggle()
        this.isFullscreen = !this.isFullscreen
      }
    },
  }
</script>

<style scoped>

  .gl-designer-toolbar {
    padding: 4px 10px
  }

  .gl-designer-toolbar .gutter {
    /*padding-left: 4px;*/
  }

  .gl-designer-toolbar .ant-btn {
    font-weight: 600;
    margin-left: 1em;
    border: 0;
    /*color: white;*/
    /*box-shadow: 0;*/
  }

  .gl-designer-toolbar .ant-btn-sm {
    font-size: 12px;
  }

  /*.gl-designer-toolbar .ant-dropdown-menu-item{*/
  /*font-size: 10px !important;*/
  /*}*/

</style>

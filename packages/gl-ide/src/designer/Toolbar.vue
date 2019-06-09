<template>
  <div class="gl-designer-toolbar" :style="{background: theme.background }">
    <a-dropdown size="small">
      <a-menu slot="overlay">
        <a-menu-item size="small" key="1" style="font-size: 12px">
          <a-icon type="user"/>
          新建项目
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
    <a-button size="small" :style="{background: theme.background }">保存</a-button>

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
    name: "gl-designer-toolbar",
    mixins: [mixin],
    data() {
      return {
        isFullscreen: false,
        islogined: true
      }
    },
    props: {},
    methods: {
      callback(key) {
        console.log(key)
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

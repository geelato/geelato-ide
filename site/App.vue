<template>
  <div id="app">
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
</template>

<script>

  export default {
    name: 'app',
    components: {}
  }
</script>

<style>
  #app {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    /*-webkit-font-smoothing: antialiased;*/
    /*-moz-osx-font-smoothing: grayscale;*/
    /*text-align: center;*/
    /*color: #2c3e50;*/
    /*margin-top: 60px;*/
  }

  .splitpanes.default-theme .splitpanes__pane, .gl-table {
    background-color: #FFFFFF !important;
  }

  .gl-table.gl-table-as-list > div {
    margin: 1em;
  }

</style>

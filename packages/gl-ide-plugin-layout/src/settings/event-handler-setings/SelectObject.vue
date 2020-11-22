<template>
  <span class="gl-ide-designer-condition">
    <a-select style="width: 200px" :allowClear="true">
      <a-select-opt-group label="表单">
        <a-select-option value="name">用户.名称</a-select-option>
        <a-select-option value="age">用户.年龄</a-select-option>
      </a-select-opt-group>
      <!--<a-select-opt-group label="单元格">-->
        <!--<a-select-option value="name">用户.名称</a-select-option>-->
        <!--<a-select-option value="age">用户.年龄</a-select-option>-->
      <!--</a-select-opt-group>-->
    </a-select>
  </span>
</template>
<script>
  export default {
    props: {},
    data() {
      return {};
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style>
</style>

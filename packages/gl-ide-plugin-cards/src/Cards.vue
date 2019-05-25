<template>
  <div style="padding: 0.5em">
    <a-alert message="选择并拖放到右边界面" type="info" closeText="关闭" class="gl-card-gutter"/>
    <a-card title="列表组件" size="small" style="width: 240px;cursor: move" class="gl-card-gutter gl-compact">
      <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" slot="cover"
           style="max-height: 100px"/>
    </a-card>
    <a-button style="text-align: center" block>加载更多...</a-button>
  </div>
</template>

<script>
  export default {
    name: "gl-ide-plugin-sidebar-cards",
    methods: {
      onSelect(keys) {
        console.log('Trigger Select', keys)
        this.$bus.$emit('project_file_selected', keys)
      },
      onExpand() {
        console.log('Trigger Expand');
      },
    }
  }
</script>

<style>
</style>

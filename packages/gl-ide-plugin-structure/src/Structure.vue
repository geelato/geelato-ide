<template>
  <div>
    <a-directory-tree
        multiple
        defaultExpandAll
        @select="onSelect"
        @expand="onExpand"
    >
      <a-tree-node title="parent 0" key="0-0">
        <a-tree-node title="leaf 0-0" key="0-0-0" isLeaf/>
        <a-tree-node title="leaf 0-1" key="0-0-1" isLeaf/>
      </a-tree-node>
      <a-tree-node title="parent 1" key="0-1">
        <a-tree-node title="leaf 1-0" key="0-1-0" isLeaf/>
        <a-tree-node title="leaf 1-1" key="0-1-1" isLeaf/>
      </a-tree-node>
    </a-directory-tree>
  </div>
</template>

<script>
  export default {
    name: "gl-ide-plugin-sidebar-cards",
    methods: {
      onSelect(keys) {
        console.log('Trigger Select', keys)
        this.$gl.bus.$emit('project_file_selected', keys)
      },
      onExpand() {
        console.log('Trigger Expand');
      },
    }
  }
</script>

<style scoped>

</style>

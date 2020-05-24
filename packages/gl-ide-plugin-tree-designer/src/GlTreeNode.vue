<template>
  <div class="gl-tree-node">
    <template v-for="(treeNode,treeNodeIndex) in treeNodes">
      <div :key="treeNode.key">
        <div class="node-level" :class="{'gl-selected':treeNode.gid===currentNode.gid}"><span title="点击设置"
                                                                                              @click="onClick(treeNode)">
          <a-button type="link">
      层级{{(level?level+'-':level)+(treeNodeIndex+1)}}
    </a-button></span>
          <a-icon type="delete" style="float: right;display: inline-block;line-height: 2.4em;cursor: pointer"
                  theme="twoTone" two-tone-color="#eb2f96" @click="removeNode(treeNode,treeNodeIndex)"/>
          <a-icon title="添加同级节点" type="plus-circle" theme="twoTone"
                  style="float: right;display: inline-block;line-height: 2.4em;margin-right: 0.2em;cursor: pointer"
                  @click="addSameLevelNode(treeNode,treeNodeIndex)"/>
          <a-icon title="添加子级节点" type="plus-square" theme="twoTone"
                  style="float: right;display: inline-block;line-height: 2.4em;margin-right: 0.2em;cursor: pointer"
                  @click="addSubLevelNode(treeNode,treeNodeIndex)"/>
        </div>
      </div>
      <gl-tree-node :key="treeNode.key" v-if="treeNode.children" :treeNodes="treeNode.children"
                    :level="(level?level+'-':level)+(treeNodeIndex+1)"
                    @clickNode="$emit('clickNode',$event)"
                    @removeNode="$emit('removeNode', $event)"
                    :currentNode="currentNode"
      ></gl-tree-node>
    </template>
  </div>
</template>

<script>
  export default {
    name: "GlTreeNode",
    props: {
      treeNodes: {
        type: Array,
        required: true
      },
      level: {
        type: String,
        default() {
          return ''
        }
      },
      currentNode: {}
    },
    methods: {
      removeNode(treeNode, treeNodeIndex) {
        this.treeNodes.splice(treeNodeIndex, 1)
        this.$emit('removeNode', treeNode);
      },
      onClick(treeNode) {
        this.selectedNode = treeNode
        this.$emit('clickNode', treeNode)
      },
      addSameLevelNode(treeNode, treeNodeIndex) {
        const newNode = this.createNode()
        this.treeNodes.splice(treeNodeIndex, 0, newNode)
        this.selectedNode = newNode
        this.$emit('clickNode', newNode);
      },
      addSubLevelNode(treeNode, treeNodeIndex) {
        if (treeNode.children === undefined) {
          treeNode.children = []
        }
        const newNode = this.createNode()
        this.selectedNode = newNode
        treeNode.children.push(newNode)
        this.$emit('clickNode', newNode);
      },
      createNode() {
        return {
          gid: this.$gl.utils.uuid(8),
          data: [
            {title: '节点', key: Math.random() * 100000000}
          ],
          isLeaf: false,
          children: []
        }
      }
    }
  }
</script>

<style scoped>
  .node-level {
    border: 0;
    width: 100%;
    background-color: rgba(247, 247, 247, 0.5);
    display: inline-block;
    padding-right: 0.5em;
  }

  .node-level:hover {
    background-color: rgba(209, 209, 209, 0.3);
  }

  .node-level.gl-selected {
    background-color: rgba(209, 209, 209, 0.3);
  }

  .gl-tree-node {
    line-height: 2em;
    margin-left: 1em;
    margin-top: 2px;
    margin-bottom: 2px;
  }
</style>

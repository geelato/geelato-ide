<template>
  <div>
    <a-directory-tree ref="glTree"
                      :loadData="onLoadData"
                      :treeData="treeData"
                      @rightClick="onRightClick"
                      @select="onSelect"
                      @expand="onExpand"
    />
    <gl-context-menu ref="contextMenu" class="gl-context-menu"
                     :target="contextMenuTarget"
                     @update:show="(show) => contextMenuVisible = show">
      <a-menu mode="vertical" v-if="contextMenuVisible">
        <template v-for="(menuItem,index) in menuItems">
          <a-menu-item v-if="!menuItem.children" @click="onContextMenuItemClick(menuItem,index)" :key="index"
                       class="gl-context-menu-item">
            <a-icon :type="menuItem.icon"/>
            {{menuItem.label}}
          </a-menu-item>
        </template>
      </a-menu>
    </gl-context-menu>
    <a-button type="primary" @click="() => renameModalVisible = true">Vertically centered modal dialog</a-button>
    <a-modal
        title="Vertically centered modal dialog"
        centered
        v-model="renameModalVisible"
        @ok="() => renameModalVisible = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
  </div>
</template>

<script>
  export default {
    name: "gl-ide-plugin-sidebar-project",
    data() {
      return {
        treeData: [
          {title: 'Expand to load', key: '0'},
          {title: 'Expand to load', key: '1'},
          {title: 'Tree Node', key: '2', isLeaf: true},
        ],
        menuItems: [
          {
            label: '新建目录',
            icon: 'folder',
          },
          {
            label: '新建页面',
            icon: 'file',
          },
          {
            label: '新建接口',
            icon: 'api',
          },
          {
            label: '重命名',
            icon: 'edit',
          },
          {
            label: '删除',
            icon: 'delete',
          }
        ],
        renameModalVisible: false,
        contextMenuVisible: false,
        contextMenuTarget: null,
      }
    },
    methods: {
      onSelect(keys) {
        console.log('Trigger Select', keys)
        this.$bus.$emit('project_file_selected', keys)
      },
      onExpand() {
        console.log('Trigger Expand');
      },
      onLoadData(treeNode) {
        return new Promise((resolve) => {
          if (treeNode.dataRef.children) {
            resolve()
            return
          }
          setTimeout(() => {
            treeNode.dataRef.children = [
              {title: 'Child Node', key: `${treeNode.eventKey}-0`},
              {title: 'Child Node', key: `${treeNode.eventKey}-1`},
            ]
            this.treeData = [...this.treeData]
            resolve()
          }, 1000)
        })
      },
      onRightClick(info) {
        console.log('gl-tree > onRightClick: ', info)
        this.contextMenuTarget = this.$refs.glTree.$el
        this.$refs.contextMenu.open()
      },
      onContextMenuItemClick(e) {
        console.log('gl-tree > onContextMenuItemClick > e: ', e)
      }
    }
  }
</script>

<style scoped>

  .gl-context-menu .ant-menu-submenu-title, .gl-context-menu .ant-menu-submenu-item, .gl-context-menu-item {
    font-size: 12px !important;;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    margin-right: 2em !important;
    padding-right: 2em !important;
    line-height: 28px !important;
    height: 28px !important;
  }
</style>

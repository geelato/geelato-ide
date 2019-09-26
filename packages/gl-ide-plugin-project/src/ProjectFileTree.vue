<template>
  <div class="project-tree">
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */

  // import SimplePageDefinition from './SimplePageDefinition'

  export default {
    props: {
      fileTypes: {
        type: Object,
        default() {
          return {}
        }
      },
      editingFile: {
        type: Object,
        default() {
          return {}
        }
      },
      project: [Object]
    },
    data() {
      return {}
    },
    watch: {
      'project.id': function (val, oval) {
        let that = this
        let project = this.project
        let treeData = [{
          // id: project.id,
          text: project.name || '新项目',
          parent: '#',
          type: 'root'
        }]
        that.$gl.api.query('platform_tree_node', {treeId: project.id}, 'id,parent,text,type').then(function (res) {
          console.log('res>', res)
          that.newTree(treeData.concat(res.data.data))
        })
      }
    },
    mounted: function () {
    },
    methods: {
      newTree(treeData) {
        console.log('treeData>', treeData)
        let that = this
        $.jstree.defaults.contextmenu.select_node = false
        $.jstree.defaults.contextmenu.show_at_node = true
        let $tree = $(that.$el)
        // 如果已初始化则更新数据
        if ($tree.jstree(true).settings) {
          $tree.jstree(true).settings.core.data = treeData
          $tree.jstree(true).refresh()
        }
        let types = {
          default: {
            icon: 'iconfont icon-folder'
          },
          root: {
            icon: 'iconfont icon-folder'
          },
          plus: {
            icon: 'plus icon'
          },
          edit: {
//            icon: 'fa fa-edit icon-state-default icon-lg'
            icon: 'edit icon'
          },
          remove: {
            icon: 'remove icon'
          }
        }
        $.extend(types, that.fileTypes)
        $tree.jstree({
          core: {
            themes: {
              responsive: false
            },
            check_callback: function (operation, node, nodeParent, nodePosition, more) {
              // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
              // in case of 'rename_node' node_position is filled with the new node name
              if (operation === 'move_node') {
//              console.log('node_parent.original.type === "html5" >' + (nodeParent.original.type === 'html5') + '>', nodeParent.original)
                if (nodeParent.original && isFile(nodeParent.original.type)) {
                  // 不能移动到html5等文件节点下
                  return false
                } else if (!nodeParent.parent) {
                  // 必须有父节点，即限制只有一个根节点
                  return false
                }
              } else if (operation === 'delete_node') {
                if (node.parent === '#' || !node.parent) {
                  that.$message.warning('根节点不能删除！')
                  return false
                }
              }
              return true // allow all other operations
            },
            data: treeData
          },
          types: types,
          state: {},
          plugins: ['contextmenu', 'dnd', 'state', 'types'],
          contextmenu: {
            items: function (obj) {
              let disable = isFile(obj.type)
              let items = {
                create: {
                  // 解决第一下action，默认是false，移动之后才按_disabled生效的问题
                  separator_before: true,
                  label: createIconLabel('新建', 'plus'),
                  action: false,
                  _disabled: disable,
                  submenu: disable ? false : createSubmenuItems()
                },
                rename: {
                  label: createIconLabel('重命名', 'edit'),
                  _disabled: false,
                  action: function (data) {
                    console.log('rename>', data)
                    $.jstree.reference(data.reference).edit(data.reference, undefined, that.updateNode)
                  }
                },
                remove: {
                  label: createIconLabel('删除', 'remove'),
                  _disabled: function (data) {
                    let node = $.jstree.reference(data.reference).get_node(data.reference)
                    if (node.type === 'root') {
                      // node.parent === '#' || !node.parent
//                    alert('根节点不能删除！')
                      return true
                    }
                    return false
                  },
                  action: function (data) {
                    // TODO 删除成功，才删除前端节点
                    let node = $.jstree.reference(data.reference).get_node(data.reference)
                    console.log('removing node>', node)
                    that.removePage(node.id)
                    $.jstree.reference(data.reference).delete_node(data.reference)
                  }
                },
                ccp: null
              }
              return items
            }
          }
        })
        $tree.bind('dblclick.jstree', function (event) {
          // jstree的双击事件针对整个jstree对象，不区分是否为节点。这里对叶子节点的双击事件生效
          if (!$(event.target).parent().hasClass('jstree-leaf')) {
            return
          }
          let $node = $(event.target).closest('li')
          let data = getFileNodeData($node)
          // 且叶子节点为文件类型才生效
          if (data.type) {
            that.openPage(event, {node: data})
          }
        })
        $tree.jstree(true).open_all()

        function getFileNodeData($node) {
          for (let type in that.fileTypes) {
            let selector = '.' + that.fileTypes[type].icon.split(' ').join('.').replace(/\s+/g, '')
            let data = $.jstree.reference($tree).get_node($node.find(selector))
            if (data.type) {
              return data
            }
          }
          return {}
        }

        function isFile(type) {
          return !!that.fileTypes[type]
        }

        function createIconLabel(label, typeName) {
          let type = types[typeName]
          return '<span class="' + type.icon + '"></span>' + label
        }

        /**
         *  返回结果如：
         *  create_html5: createNode('普通页面', 'html5', function (nodeId) {
         *    that.newPage({id: nodeId, text: '普通页面', type: 'html5'})
         *  }),
         *  create_folder: createNode('目录', 'default')
         */
        function createSubmenuItems() {
          let items = {}
          // console.log('that.fileTypes>', that.fileTypes)
          for (let fileType in that.fileTypes) {
            let item = that.fileTypes[fileType]
            items['create_' + fileType] = createNode(item.name, fileType, function (nodeId) {
              that.newPage({id: nodeId, text: item.name, type: fileType})
            })
          }
          items.create_folder = createNode('目录', 'default')
          return items
        }

        function createNode(label, typeName, callback) {
          let type = types[typeName]
          return {
            label: createIconLabel(label, typeName),
            action: function (data) {
              let treeNode = {
                text: '新' + label,
                icon: type.icon,
                type: typeName,
                treeId: that.project.id
              }
              that.$gl.api.save('platform_tree_node', treeNode, '节点保存成功').then(function (res) {
                treeNode.id = res.data.data
                let $ref = $.jstree.reference(data.reference)
                let nodeId = $ref.create_node(data.reference, treeNode, 'last')
                $ref.deselect_all()
                $ref.select_node(nodeId)
                // TODO 这里无需用edit，改成弹出页面录入节点名称
                $ref.edit(nodeId, undefined, that.updateNode)
                // console.log('createNode callback', typeof callback === 'function', callback)
                if (typeof callback === 'function') {
                  callback(nodeId)
                }
              })
            }
          }
        }
      },
      newPage(data) {
        // this.editorStore.reset(new SimplePageDefinition({
        //   extendId: data.id,
        //   name: data.text,
        //   type: data.type,
        //   code: data.type + '_' + this.$gl.utils.uuid(8)
        // }))
        // console.log('newPage>that.editorStore1>', this.editorStore)
        this.savePage()
      },
      /**
       * 加入本地缓存
       * 保存到服务端
       * 记录保存更新状态
       */
      savePage: function () {
        let that = this
        console.log('that.editingFile>save>', that.editingFile)
//        editingFile.component = editingFile.component.outerHTML || editingFile.component
        that.$gl.api.save('platform_page_config', {
          id: that.editingFile.id,
          extendId: that.editingFile.extendId,
          type: that.editingFile.type,
          code: that.editingFile.code,
          description: that.editingFile.description,
          content: that.editingFile.content
        }).then(function (res) {
          that.editingFile.id = res.data.data
          that.$message.success('页面保存成功')
        }).catch(function (e) {
          that.$message.error('页面保存失败')
        })
      },
      /**
       * 新节点，则从模板中加载页面
       * 已有节点，从服务器中加载
       * @param item {node {id:xxx}} 页面id，对应页面实体的extend_id
       */
      openPage(event, item) {
        let that = this
        that.$gl.api.query('platform_page_config', {extendId: item.node.id}, 'id,type,code,description,content').then(function (res) {
//          that.editingFile.reset(res.data.data[0])
          console.log('res.data.data[0]>', res.data.data[0])
          // that.editorStore.reset(new SimplePageDefinition(res.data.data[0], true))
          // console.log('editingFile>', that.editingFile)
        }).catch(function (e) {
          console.error(e)
          that.$message.error('从服务端获取、解析信息失败！')
        })
      },
      /**
       *
       * @param event
       * @param nodeId 节点树id，对应页面实体的extend_id
       */
      removePage(nodeId) {
        let that = this
        // 两张表的删除，合在一个事务中
        that.$gl.api.delete('platform_page_config', {extendId: nodeId})
        that.$gl.api.delete('platform_tree_node', {id: nodeId})
      },
      loadCachePage: function (extendId) {
        let that = this
        console.log('loadCachePage extendId>' + extendId + '>', this.loadedPages[extendId])
        that.editingFile = this.loadedPages[extendId]
        that.editingFile.extendId = extendId
      },
      updateNode(node, status, cancelled) {
        if (cancelled) {
          return false
        }
        let that = this
        if (node.parent === '#') {
          // 如果是根节点，则更改项目名称
          let project = {id: node.id, name: node.text}
          that.$gl.api.save('platform_dev_project', project).then(function (res) {
            console.log('更新项目名称为' + node.text + ',更新返回：', res)
          })
        } else {
          // 如果是叶节点，则更改文件或目录名称
          let treeNode = {
            id: node.id,
            parent: node.parent,
            text: node.text,
            type: node.type,
            treeId: that.project.id
          }
          that.$gl.api.save('platform_tree_node', treeNode).then(function (res) {
            console.log('更新节点名称为“' + node.text + '”,更新返回：', res)
          })
        }
      }
    },
    components: {}
  }
</script>
<style scoped>

</style>

<template>
  <div class="project-tree">
  </div>
</template>

<script>
  import SimplePageDefinition from '../../../runtime/definition/SimplePageDefinition'
  import EditingFileParser from '../../../runtime/EditingFileParser'

  export default {
    props: {
      fileTypes: {
        type: Object,
        default() {
          return {}
        }
      },
      ideStore: {
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
          id: project.id,
          text: project.name || '新应用',
          parent: '#',
          type: 'root',
          icon: '',
          flag: ''
        }]
        that.$gl.api.query('platform_tree_node', 'id,parent,text,type,icon,flag data', {treeId: project.id}).then(function (res) {
          console.log('gl-ide-plugin-project-tree > watch() > project.id > res:', res)
          that.newTree(treeData.concat(res.data))
        })
      },
      'editingFile': function (val, oval) {
        console.log('editingFile > ', val, oval)
      }
    },
    mounted: function () {
      let that = this
      // 加载发现没有应用时，检查是否已创建有应用，若没有则弹出创建应用页面，若快已有，则弹出选择应用页面
      if (!this.project.id) {
        that.$gl.api.query('platform_app', 'id,name', {}).then(function (res) {
          if (res.data.length === 0) {
            that.$gl.bus.$emit('gl-ide.designer.showProjectForm')
          } else {
            that.$gl.bus.$emit('gl-ide.designer.showProjectList')
          }
        })
      }
    },
    methods: {
      newTree(treeData) {
        console.log('gl-ide-plugin-project-tree> newTree() > treeData:', treeData)
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
          page: {
            icon: 'iconfont icon-file'
          },
          plus: {
            icon: 'plus icon'
          },
          edit: {
            icon: 'edit icon'
          },
          remove: {
            icon: 'remove icon'
          }
        }
        $.extend(types, that.fileTypes)
        console.log('gl-ide-plugin-project-tree> newTree() > fileTypes>', that.fileTypes)
        console.log('gl-ide-plugin-project-tree> newTree() > types>', types)
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
            items: function (nodeItem) {
              console.log('isFile nodeItem>', nodeItem)
              let disable = isFile(nodeItem.type)
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
                asMenuItem: {
                  label: createIconLabel(isMenuItem(nodeItem) ? '设为非菜单项（普通页面）' : '设为菜单项（菜单页面）', 'edit', '若为菜单项，则在最终发布的应用菜单中进行展示'),
                  _disabled: function (data) {
                    let node = $.jstree.reference(data.reference).get_node(data.reference)
                    if (node.type === 'root') {
                      return true
                    }
                    return !disable
                  },
                  action: function (data) {
                    // let node = $.jstree.reference(data.reference).get_node(data.reference)
                    console.log('>>>>>', $('#' + nodeItem.li_attr.id + '_anchor'))
                    $('#' + nodeItem.li_attr.id + '_anchor').children('i').removeClass('gl-menuItem')
                    let isMenuNode = isMenuItem(nodeItem)
                    nodeItem.flag = isMenuNode ? '' : 'menuItem'
                    nodeItem.icon = isMenuNode ? 'iconfont icon-file' : 'iconfont icon-file gl-menuItem'
                    nodeItem.data = isMenuNode ? '' : 'gl-menuItem'
                    // $tree.jstree(true).refresh_node(nodeItem)
                    console.log('asMenuItem>', data, nodeItem)
                    // console.log('type:', $tree.jstree(true).get_type(nodeItem))
                    // $tree.jstree(true).set_type(nodeItem, isMenuNode ? '' : 'gl-menuItem')
                    // $tree.jstree(true).set_icon(nodeItem, isMenuNode ? 'iconfont icon-file' : 'iconfont icon-file gl-menuItem')

                    // $tree.jstree(true).rename_node(nodeItem, isMenuItem(nodeItem) ? nodeItem.text)
                    that.updateNode(nodeItem)

                    // $tree.jstree(true).refresh('#' + nodeItem.id)
                  }
                },
                ccp: null
              }

              // 添加应用菜单项


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
        $tree.bind('move_node.jstree', function (event, item) {
          console.log('>>>>>event:', event, 'item:', item)
          let treeNode = {
            id: item.node.id,
            parent: item.parent
          }
          that.$gl.api.save('platform_tree_node', treeNode).then(function (res) {
            console.log('更新节点parent.id为“' + treeNode.parent + '”,更新返回：', res)
          })
        })
        $tree.jstree(true).open_all()

        function getFileNodeData($node) {
          for (let type in that.fileTypes) {
            let selector = '.' + that.fileTypes[type].icon.split(' ').join('.').replace(/\s+/g, '')
            let data = $.jstree.reference($tree).get_node($node.find(selector))
            console.log('getFileNodeData> $node,selector,type,data', $node, selector, type, data)
            if (data.type) {
              return data
            }
          }
          return {}
        }

        function isFile(type) {
          return !!that.fileTypes[type]
        }

        // 如果是已加入发布应用菜单项，则从发布应用菜单项移除
        function isMenuItem(nodeItem) {
          console.log('isMenuItem item:', nodeItem)
          // return nodeItem.data === 'menuItem'
          return nodeItem.icon === 'iconfont icon-file gl-menuItem'
          // return $('#' + nodeItem.li_attr.id + '_anchor').children('i').hasClass('gl-menuItem')

        }

        function createIconLabel(label, typeName, title) {
          let type = types[typeName]
          return '<span class="' + type.icon + '" title="' + title + '"></span>' + label
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
                treeId: that.project.id,
                // 新增的节点默认不是应用的菜单menuItem
                flag: ''
              }
              that.$gl.api.save('platform_tree_node', treeNode, '节点保存成功').then(function (res) {
                console.log('gl-ide-plugin-project-tree> newTree() > createNode() > save node res:', res)

                treeNode.id = res.result
                let $ref = $.jstree.reference(data.reference)
                let nodeId = $ref.create_node(data.reference, treeNode, 'last')
                console.log('gl-ide-plugin-project-tree> newTree() > createNode() > nodeId:', nodeId)
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
        this.$ide.openFile(new SimplePageDefinition({
          appId: this.project.id,
          extendId: data.id,
          name: data.text,
          type: data.type,
          code: data.type + '_' + this.$gl.utils.uuid(16)
        }, true), this.savePage)
      },
      /**
       * 加入本地缓存
       * 保存到服务端
       * 记录保存更新状态
       */
      savePage: function () {
        let that = this
        console.log('geelato-ide > gl-ide-plugin-project > ProjectFileTree > savePage() > editingFile:', that.ideStore.editingFile)
        let editingFileParser = new EditingFileParser().init(this.$root)
        let editingFile = editingFileParser.convertSourceToSave(that.ideStore.editingFile)
        // let sourceContent = {
        //   component: that.ideStore.editingFile.sourceContent.component,
        //   opts: {
        //     layout: that.ideStore.editingFile.sourceContent.opts.layout,
        //     params: that.ideStore.editingFile.sourceContent.opts.params
        //   },
        //   events: that.ideStore.editingFile.sourceContent.events,
        // }
        that.$gl.api.save('platform_app_page', editingFile
          //   {
          //   id: that.ideStore.editingFile.id,
          //   extendId: that.ideStore.editingFile.extendId,
          //   type: that.ideStore.editingFile.type,
          //   code: that.ideStore.editingFile.code,
          //   description: that.ideStore.editingFile.description,
          //   sourceContent: sourceContent,
          //   previewContent: sourceContent,
          //   releaseContent: sourceContent
          // }
        ).then(function (res) {
          that.ideStore.editingFile.id = res.result
          // that.$ide.openDefaultFile({id: res.result})
          that.$message.success('页面保存成功')
        }).catch(function (e) {
          console.log('页面保存失败。', 'ideStore：', that.ideStore, e,)
          that.$message.error('页面保存失败')
        })
      },
      /**
       * 新节点，则从模板中加载页面
       * 已有节点，从服务器中加载
       * @param item {node {id:xxx}} 页面id，对应页面实体的extend_id
       */
      openPage(event, item) {
        console.log('item>', item)
        let that = this
        that.$gl.api.query('platform_app_page', 'id,type,code,description,sourceContent', {extendId: item.node.id}).then(function (res) {
          let fileData = {extendId: item.node.id, appId: that.project.id}
          Object.assign(fileData, res.data[0])
          that.$ide.openFile(fileData)
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
        // TODO 两张表的删除，合在一个事务中
        that.$gl.api.delete('platform_app_page', {extendId: nodeId})
        that.$gl.api.delete('platform_tree_node', {id: nodeId})
        this.$ide.openDefaultFile()
      },
      loadCachePage: function (extendId) {
        let that = this
        console.log('loadCachePage extendId>' + extendId + '>', this.loadedPages[extendId])
        that.ideStore.editingFile = this.loadedPages[extendId]
        that.ideStore.editingFile.extendId = extendId
      },
      updateNode(node, status, cancelled) {
        if (cancelled) {
          return false
        }
        let that = this
        if (node.parent === '#') {
          // 如果是根节点，则更改应用名称
          let project = {id: node.id, name: node.text}
          that.$gl.api.save('platform_app', project).then(function (res) {
            console.log('更新应用名称为' + node.text + ',更新返回：', res)
          })
        } else {
          // 如果是叶节点，则更改文件或目录名称
          let treeNode = {
            id: node.id,
            parent: node.parent,
            text: node.text,
            type: node.type,
            icon: node.icon,
            treeId: that.project.id,
            flag: node.flag
          }
          that.$gl.api.save('platform_tree_node', treeNode).then(function (res) {
            console.log('更新节点名称为“' + node.text + '”,更新返回：', res)
            console.log('更新节点图标为“' + node.icon + '”,更新返回：', res)
            const $tree = $(that.$el)
            $tree.jstree(true).set_icon(node, node.icon)
            // $tree.jstree(true).refresh_node(node)
          })
        }
      }
    },
    components: {}
  }
</script>
<style scoped>
</style>

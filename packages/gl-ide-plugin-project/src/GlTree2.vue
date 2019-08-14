<template>
  <div class="gl-tree">
  </div>
</template>

<script>
  /**
   * 通用的树节点
   * 内置连通后面的树节点表
   * 树节点表中指定对应的业务表
   */
  export default {
    props: {
      opts: {
        type: Object,
        default() {
          return {
            fieldMapping: {
              id: 'id',
              text: 'text',
              parent: 'parent',
              // e.g. root
              type: 'type',
              // icon: 'icon'
              treeId: 'treeId'
            },
            entityMapping: 'platform_dev_node',
            // 右键菜单
            contextmenu: {
              add: {enable: true, text: '新增'},
              rename: {enable: true, text: '重命名'},
              delete: {enable: true, text: '删除'}
            }
          }
        }
      },
      query: {
        type: Object
      },
      /**
       * 树对应业务实体名称
       */
      treeEntityName: {
        type: String,
        required: true
      },
      /**
       * 树对应业务实体主健字段名，默认为id
       */
      treeEntityPkField: {
        type: String,
        required: false,
        default() {
          return 'id'
        }
      },
      /**
       * 树对应业务实体名称字段名，默认为name
       */
      treeEntityNameField: {
        type: String,
        required: true,
        default() {
          return 'name'
        }
      },
      /**
       * 树对应业务实体某条记录的id，例如，对于项目文件树，该treeId的值为项目id，这样就可以通过项目id获取整个项目文件树。
       */
      treeId: {
        type: [Number, String],
        required: true
      },
      treeName: {
        type: [Number, String],
        required: true
      },
      /**
       *
       */
      fileTypes: {
        type: [Object],
        required: false,
        default() {
          return {
            file: {
              icon: "file icon",
              name: "文件",
              type: "file",
            }
          }
        }
      },
      /**
       * 节点对应业务实体名称
       */
      nodeEntityName: {
        type: String,
        required: true
      },
      /**
       * 节点对应业务实体主健字段名，默认为id
       */
      nodeEntityPkField: {
        type: String,
        required: false,
        default() {
          return 'id'
        }
      },
      /**
       * 节点对应业务实体名称字段名，默认为name
       */
      nodeEntityNameField: {
        type: String,
        required: true,
        default() {
          return 'name'
        }
      }
    },
    data() {
      return {
        fieldMapping: {
          id: 'id',
          text: 'text',
          parent: 'parent',
          type: 'type',
          icon: '',
          treeId: 'treeId'
        },
        entityMapping: 'platform_dev_node'
      }
    },
    watch: {
      'treeId': function (val, oval) {
        this.loadData()
      }
    },
    mounted: function () {
      this.Object.assign(this.fieldMapping, this.opts.fieldMapping)
      this.entityMapping = this.opts.entityMapping
      this.loadData()
    },
    methods: {
      loadData() {
        let that = this
        let treeData = [{
          id: that.treeId,
          text: that.treeName || '根',
          parent: '#',
          type: 'root'
        }]
        // e.g. 'id,parent,text,type'
        let fields = Object.values(this.fieldMapping).join(',')
        that.$api.query(that.entityMapping, {[this.fieldMapping.treeId]: that.treeId}, fields).then(function (res) {
          that.newTree(treeData.concat(res.data.data))
        })
      },
      newTree(treeData) {
        console.log('treeData>', treeData)
        let that = this
        $.jstree.defaults.contextmenu.select_node = false
        $.jstree.defaults.contextmenu.show_at_node = true
        let $tree = $(this.$el)
        // 如果已初始化则更新数据
        if ($tree.jstree(true).settings) {
          $tree.jstree(true).settings.core.data = treeData
          $tree.jstree(true).refresh()
        }
        let types = {
          default: {
            icon: 'folder icon'
          },
          root: {
            icon: 'folder icon'
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
                  // 不能移动到文件节点下
                  return false
                } else if (!nodeParent.parent) {
                  // 必须有父节点，即限制只有一个根节点
                  return false
                }
                // TODO 保存parent

              } else if (operation === 'delete_node') {
                if (node.parent === '#' || !node.parent) {
                  // that.$gl.ui.showMsg('根节点不能删除！', 'warning')
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
                    that.removeEntity(node.id)
                    $.jstree.reference(data.reference).delete_node(data.reference)
                  }
                },
                ccp: null
              }
              return items
            }
          }
        })
        $tree.bind('dblclick.jstree', function (event, node) {
          // jstree的双击事件针对整个jstree对象，不区分是否为节点。这里对叶子节点的双击事件生效
          if (!$(event.target).parent().hasClass('jstree-leaf')) {
            return
          }
          let $node = $(event.target).closest('li')
          console.log('gl-tree > Index > dblclick event >', event)
          console.log('gl-tree > Index > dblclick node >', node)

          // 且叶子节点为文件类型才生效
          let treeNode = getFileNodeData($node)
          if (treeNode.type) {
            console.log('gl-tree > Index > treeNode >', treeNode)
            let nodeEntity = {
              treeNodeId: treeNode.id,
              [that.nodeEntityNameField]: treeNode.text
            }
            that.$emit('dblclick', nodeEntity, treeNode)
          }
        })
        $tree.bind('activate_node.jstree', function (event, node) {
          console.log('gl-tree > Index > activate event >', event)
          console.log('gl-tree > Index > activate node >', node)
          let treeNode = {
            text: node.node.text,
            icon: node.node.icon,
            type: node.node.type,
            parent: node.node.parent,
            treeEntity: that.treeEntityName,
            treeId: that.treeId,
            extendEntity: that.nodeEntityName
          }
          // 且叶子节点为文件类型才生效
          if (treeNode.type) {
            let nodeEntity = {
              treeNodeId: node.node.id,
              [that.nodeEntityNameField]: treeNode.text
            }
            that.$emit('select', nodeEntity, treeNode)
          }
        })
        $tree.bind('move_node.jstree', function (e, data) {
          console.log('gl-tree > Index > move tree node: ', data);

          let treeNode = {
            id: data.node.id,
            parent: data.node.parent
          }
          that.$api.save(that.entityMapping, treeNode).then(function (res) {
            // 且叶子节点为文件类型才生效
            let nodeEntity = {
              treeNodeId: treeNode.id,
              [that.nodeEntityNameField]: treeNode.text
            }
            that.$emit('moved', nodeEntity, treeNode)
          })

          // jQuery.post("modulemng/dndmodule",
          //   {
          //     id: data.node.id,
          //     parent: data.parent,
          //     position: data.position
          //   }
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
         *    that.newEntity({id: nodeId, text: '普通页面', type: 'html5'})
         *  }),
         *  create_folder: createNode('目录', 'default')
         */
        function createSubmenuItems() {
          let items = {}
          for (let fileType in that.fileTypes) {
            let item = that.fileTypes[fileType]
            items['create_' + fileType] = createNode(item.name, fileType, function (node) {
              // that.newEntity({id: node, text: item.name, type: fileType})
            })
          }
          items.create_folder = createNode('目录', 'default')
          return items
        }

        function createNode(label, typeName) {
          let type = types[typeName]
          return {
            label: createIconLabel(label, typeName),
            action: function (data) {
              let $ref = $.jstree.reference(data.reference)
              let treeNode = {
                text: '新' + label,
                icon: type.icon,
                type: typeName,
                treeEntity: that.treeEntityName,
                treeId: that.treeId,
                parent: data.reference[0].parentElement.id,
                extendEntity: that.nodeEntityName
              }
              console.log('gl-tree > Index > createNode > jstree $ref: ', $ref)
              console.log('gl-tree > Index > createNode > data.reference: ', data.reference)
              console.log('gl-tree > Index > createNode > treeNode before save: ', treeNode)
              that.$api.save(that.entityMapping, treeNode).then(function (res) {
                treeNode.id = res.data
                let nodeId = $ref.create_node(data.reference, treeNode, 'last')
                $ref.deselect_all()
                $ref.select_node(nodeId)
                $ref.edit(nodeId, undefined, that.updateNode)
                let nodeEntity = {
                  treeNodeId: treeNode.id,
                  [that.nodeEntityNameField]: treeNode.text
                }
                that.$emit('created', nodeEntity, treeNode)
                // if ($.isFunction(callback)) callback(treeNode)
              })
            }
          }
        }
      },
      /**
       *
       * @param event
       * @param nodeId 节点树id，对应页面实体的extend_id
       */
      removeEntity(nodeId) {
        let that = this
        // 两张表的删除，合在一个事务中
        // that.$api.delete(that.treeEntityName, {extendId: nodeId})
        that.$api.delete(that.entityMapping, {id: nodeId})
      },
      moveNode() {
        // TODO 移动节点时，需更新node parent
      },
      updateNode(node, status, cancelled) {
        if (cancelled) {
          return false
        }
        let that = this
        if (node.parent === '#' && that.treeEntityName) {
          // 如果是根节点，则更改实体名称
          // 由于根节点是在前端构建的，后台不存在对应的节点，所以不需更新treeNode
          let entity = {}
          entity[that.treeEntityPkField] = node.id
          entity[that.treeEntityNameField] = node.text
          that.$api.save(that.treeEntityName, entity).then(function (res) {
            // console.log('更新名称为' + node.text + ',更新返回：', res)
          })
        } else {
          // 如果非根节点，则更改文件或目录名称
          let treeNode = {
            id: node.id,
            parent: node.parent,
            text: node.text,
            type: node.type,
            treeId: that.treeId
          }
          // TODO 若节点的extend_id值不为空，则需同时更新该节点对应业务实体相应的记录名称
          that.$api.save(that.entityMapping, treeNode).then(function (res) {
            let nodeEntity = {
              treeNodeId: treeNode.id,
              [that.nodeEntityNameField]: treeNode.text
            }
            that.$emit('updated', nodeEntity, treeNode)
            // console.log('更新节点名称为“' + node.text + '”,更新返回：', res)
          })
        }
      }
    },
    components: {}
  }
</script>
<style scoped>

</style>

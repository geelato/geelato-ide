export default {
  opts: {
    // 0:多实体层叠构建，1：单树型实体构建，2：SQL查询构建，3：服务查询构建
    buildMode: 0,
    tree: [{
      gid: 1,
      title: '数据库连接',
      dsName: 'platform_dev_db_connect',
      children: [
        {
          gid: 12,
          title: '数据表',
          data: [
            {title: '数据表', key: '1099255145619690408'}
          ],
          isLeaf: false,
          children: [
            {
              gid: 222,
              title: 'xxx',
              dsName: 'platform_dev_table',
              isLeaf: false,
              children: [
                {
                  gid: 121,
                  title: '数据列',
                  dsName: 'platform_dev_column',
                  isLeaf: true
                }
              ]
            }
          ],
        },
        {
          gid: 11,
          title: '组织用户',
          data: [
            {title: '用户', key: '1099255145619690407'},
          ],
          isLeaf: false,
          children: [
            {
              gid: 111,
              title: '用户',
              dsName: 'platform_user',
              isLeaf: true,
              defaultExpandIndex: 0
            }
          ]
        }
      ]
    }],
    'ds': {
      'platform_dev_db_connect': {
        'lazy': false,
        'resultMapping': {'title': 'dbName', 'key': 'id'},
        'fields': 'dbName,id',
        'params': [],
        'entity': 'platform_dev_db_connect'
      },
      'platform_dev_table': {
        'lazy': false,
        'resultMapping': {'title': 'tableName', 'key': 'id'},
        'fields': 'tableName,id',
        'params': [{name: 'connectId', value: '$ctx.$parent.dataRef.key'}],
        'order': 'tableName|+',
        'entity': 'platform_dev_table'
      },
      'platform_dev_column': {
        'lazy': false,
        'resultMapping': {'title': 'name', 'key': 'id'},
        'fields': 'name,id',
        'params': [{name: 'tableId', value: '$ctx.dataRef.key'}],
        'order': 'name|+',
        'entity': 'platform_dev_column'
      },
      'platform_user': {
        'lazy': false,
        'resultMapping': {'title': 'name', 'key': 'id'},
        'fields': 'name,id',
        'params': [],
        'entity': 'platform_user'
      }
    },
    showLine: true,
    showIcon: false,
    checkable: false,
    draggable: true,
    menuAction: {
      actions: [
        {
          'title': '新建目录',
          'icon': 'folder',
          'type': 'primary',
          'control': 'link',
          'ctx': 'this',
          'params': {},
          'gid': 'ebo4jfXi'
        },
        {
          gid: 'ebo4jf3i',
          title: '新建页面',
          icon: 'file',
          control: 'link'
        },
        {
          gid: 'ebo4jf32',
          title: '新建接口',
          icon: 'api',
          control: 'link'
        },
        {
          gid: 'rro4jf3i',
          title: '重命名',
          icon: 'edit',
          control: 'link'
        },
        {
          gid: 'ebooif3i',
          title: '删除',
          icon: 'delete',
          control: 'link'
        }
      ],
    },
    nodeAction: {
      actions: [{gid: 'SEIDKQE9', control: 'link', title: '树节点按钮'}]
    }
  },
  meta: {
    component: 'GlTree',
    designer: 'GlIdePluginTreeDesigner',
    title: '树设计器',
    objectTree: [
      {
        title: '树节点',
        path: 'nodeAction.actions'
      }, {
        title: '右键菜单项',
        path: 'menuAction.actions'
      }],
    // 该组件输入参数定义元数据
    inParam: {
      // path: 'query.mix.properties',
      // name: 'field',
      // title: 'title'
    },
    // 该组件的输出参数定义元数据
    outParams: [
      //   {
      //   group: '查询条件',
      //   type: Object,
      //   // 在设计配置页面中展示，选择参数
      //   name: 'field', title: 'title', path: 'query.mix.properties',
      //   // 在运行时获取参数值
      //   dataCtx: 'ctxLoader().currentQuery'
      // }, {
      //   group: '行记录（currentRow）',
      //   type: Object,
      //   name: 'dataIndex', title: 'title', path: 'table.columns',
      //   dataCtx: 'ctxLoader().currentRow'
      // }
    ],
    methods: [{name: 'refresh', title: '刷新', description: '刷新树'}],
    modalWidthPercent: .8
  }
}

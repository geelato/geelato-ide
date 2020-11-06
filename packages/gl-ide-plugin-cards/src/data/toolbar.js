export default {
  opts: {
    items: [
      {
        "icon": "border",
        "control": "button",
        "id": "jU018nadSMrpyW4O",
        "title": "按钮1"
      },
      {
        "icon": "border",
        "control": "button",
        "id": "XwiE8QV8K6yWiLHa",
        "title": "按钮2"
      }
    ]
  },
  meta: {
    component: 'GlToolbar',
    designer: 'GlIdePluginToolbarDesigner',
    title: '扩展项设计器',
    objectTree: [
      {
        title: '工具条',
        path: 'items'
      }],
    // 该组件输入参数定义元数据
    inParam: {
      path: 'items',
      name: 'field',
      title: 'title'
    },
    // 该组件的输出参数定义元数据
    outParams: [{
      group: '工具条',
      type: Object,
      // 在设计配置页面中展示，选择参数
      name: 'field', title: 'title', path: 'items',
      // 在运行时获取参数值
      dataCtx: 'ctxLoader().form'
    }],
    // methods: [{code: 'refresh', title: '刷新', description: '刷新列表'}],
    // 组件的接收参数
    props: [
      // {name: 'params', description: '输入查询条件数据，如[]'}
    ],
    methods: [
      // {
      //   name: 'deleteSelectedRowsByEntity',
      //   title: '删除所选的行',
      //   // 当前方法的输入参数
      //   params: [
      //     //   {
      //     //   name: 'entityName',
      //     //   title: '实体名称(英文)',
      //     //   placeholder:'不填时，为列表默认实体',
      //     //   value: '',
      //     //   description: '需要删除的实体'
      //     // }
      //   ],
      //   // 当前方法的返回结果
      //   return: [],
      //   description: '删除所选的记录。'
      // },
      // {
      //   name: 'deleteOneByEntity',
      //   title: '删除该行',
      //   // 当前方法的输入参数
      //   params: [
      //     //   {
      //     //   name: 'entityName',
      //     //   title: '实体名称(英文)',
      //     //   placeholder:'不填时，为列表默认实体',
      //     //   value: '',
      //     //   description: '需要删除的实体'
      //     // }
      //   ],
      //   // 当前方法的返回结果
      //   return: [],
      //   description: '删除该行记录，仅用于操作列按钮有效。'
      // },
      // {
      //   name: 'refresh',
      //   title: '刷新列表',
      //   // 当前方法的输入参数
      //   params: [],
      //   // 当前方法的返回结果
      //   return: [],
      //   description: '刷新列表。'
      // }
    ],
    data: [
      {}
    ]
  }
}

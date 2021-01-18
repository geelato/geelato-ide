
export default {
  opts: {
    title: '示例信息',
    entity: 'platform_demo_entity',
    query: {
      // 是否隐藏整个查询区域
      show: true,
      // null或''表示不展示tree过滤区域
      tree: null,
      // null或''表示不展示常用过滤器区域
      filter: null,
      // null或''表示不展示综合查询区域
      mix: {
        properties: [
          {
            field: 'name',
            title: '名称',
            cop: 'contains',
            control: 'input',
            lop: 'and',
            props: {placeholder: '名称', defaultValue: ''}
          },
          {
            field: 'type',
            title: '类型',
            cop: 'eq',
            control: 'select',
            data: [{text: '默认', value: 0}, {text: '类型一', value: 1}, {text: '类型二', value: 2}],
            // 增加指定选择项，如所有项、默认项，AddPreOptionText：为项的展示内容，AddPreOptionValue为项的展示值
            props: {AddPreOptionText: '全部', AddPreOptionValue: undefined, placeholder: '请选择'}
          }
        ],
        layout: {
          display: 'auto',
          // 取值 1~4、6
          fieldPerRow: 4
        }
      }
    },
    toolbar: {
      actions: [{
        title: '创建',
        control: 'button',
        icon: 'plus',
        type: 'primary',
        fn: 'openModal',
        ctx: 'this',
        params: {}
      },
        {
          control: 'button',
          title: '删除',
          icon: 'delete',
          type: 'danger',
          fn: 'openModal',
          ctx: 'this',
          params: {}
        }],
      css: {align: 'right'}
    },
    alert: null,
    showPagination: 'true',
    table: {
      // select: {field: 'id', title: '', type: 'checkbox'},
      rowAction: {
        actions: [{
          title: '修改',
          icon: 'plus',
          type: 'primary',
          control: 'link',
          fn: 'openModal',
          ctx: 'this',
          params: {}
        },
          {
            control: 'button',
            title: '删除',
            icon: 'plus',
            type: 'primary',
            fn: 'openModal',
            ctx: 'this',
            params: {}
          },
          {
            control: 'button',
            title: '详情',
            icon: 'plus',
            type: 'primary',
            fn: 'openModal',
            ctx: 'this',
            params: {}
          }]
      },
      columns: [
        {title: '#', dataIndex: 'id', scopedSlots: {customRender: 'serial'}},
        {title: '名称', dataIndex: 'name', sorter: true},
        {title: '编码', dataIndex: 'code', sorter: true},
        {
          title: '类型',
          dataIndex: 'type',
          sorter: true,
          customRenderString: `(text) => text == 2 ? '类型二' : (text == 1 ? '类型一' : '默认类型')`
        },
        {title: '描述', dataIndex: 'description'},
        {
          title: '操作',
          dataIndex: '',
          width: '150px',
          scopedSlots: {customRender: 'action'}
        }
      ],
      pageSize: 20,
      order: 'createAt|+'
    },
    stat: ''
  },
  meta: {
    componentName: 'GlTable',
    designer: 'GlIdePluginTableDesigner',
    title: '列表设计器',
    objectTree: [
      {
        title: '查询栏',
        path: 'query.mix.properties'
      }, {
        title: '工具栏',
        path: 'toolbar.actions'
      }, {
        title: '列操作',
        path: 'table.rowAction.actions'
      }],
    // 该组件输入参数定义元数据
    inParam: {
      path: 'query.mix.properties',
      name: 'field',
      title: 'title'
    },
    // 该组件的输出参数定义元数据
    outParams: [{
      group: '查询条件',
      type: Object,
      // 在设计配置页面中展示，选择参数
      name: 'field', title: 'title', path: 'query.mix.properties',
      // 在运行时获取参数值
      dataCtx: 'ctxLoader().currentQuery'
    }, {
      group: '行记录（currentRow）',
      type: Object,
      name: 'dataIndex', title: 'title', path: 'table.columns',
      dataCtx: 'ctxLoader().currentRow'
    }],
    // methods: [{code: 'refresh', title: '刷新', description: '刷新列表'}],
    // 组件的接收参数
    props: [
      {name: 'params', description: '输入查询条件数据，如{id:1}'}
    ],
    methods: [
      {
        name: 'deleteSelectedRowsByEntity',
        title: '删除所选的行',
        // 当前方法的输入参数
        params: [
          //   {
          //   name: 'entityName',
          //   title: '实体名称(英文)',
          //   placeholder:'不填时，为列表默认实体',
          //   value: '',
          //   description: '需要删除的实体'
          // }
        ],
        // 当前方法的返回结果
        return: [],
        description: '删除所选的记录。'
      },
      {
        name: 'deleteOneByEntity',
        title: '删除该行',
        // 当前方法的输入参数
        params: [
          //   {
          //   name: 'entityName',
          //   title: '实体名称(英文)',
          //   placeholder:'不填时，为列表默认实体',
          //   value: '',
          //   description: '需要删除的实体'
          // }
        ],
        // 当前方法的返回结果
        return: [],
        description: '删除该行记录，仅用于操作列按钮有效。'
      },
      {
        name: 'refresh',
        title: '刷新列表',
        // 当前方法的输入参数
        params: [],
        // 当前方法的返回结果
        return: [],
        description: '刷新列表。'
      }
    ],
    data: [
      {}
    ]
  }
}

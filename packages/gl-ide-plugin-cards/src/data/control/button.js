export default {
  opts: {
    field: '',
    control: 'Button',
    title: '按钮',
    icon: 'right',
    iconFirst: false
  },
  meta: {
    componentName: 'GlControl',
    designer: 'GlIdePluginControlDesigner',
    title: '控件设计器',
    objectTree: [],
    // 该组件输入参数定义元数据
    inParam: {
      // path: 'query.mix.properties',
      // name: 'field',
      // title: 'title'
    },
    // 该组件的输出参数定义元数据
    outParams: [],
    // methods: [{code: 'refresh', title: '刷新', description: '刷新列表'}],
    // 组件的接收参数
    props: [
      // {name: 'params', description: '输入查询条件数据，如{id:1}'}
    ],
    methods: [
      {
        name: 'getValue',
        title: '获取控件值',
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
        description: '获取控件值。'
      },
      {
        name: 'setValue',
        title: '设置控件值',
        // 当前方法的输入参数
        params: [
          {
            name: 'value',
            title: '控件值',
            placeholder: '',
            value: '',
            description: '设置控件值'
          }
        ],
        // 当前方法的返回结果
        return: [],
        description: ''
      }
    ],
    data: [
      {}
    ]
  }
}

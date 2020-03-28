export default {
  component: 'GlTable',
  // 组件的接收参数
  props: [
    {name: 'params', description: '输入查询条件数据，如{id:1}'}
  ],
  methods: [
    {
      name: 'deleteSelectedRowsByEntity',
      title: '删除所选的行',
      // 当前方法的输入参数
      params: [{
        name: 'entityName',
        title: '实体名称(英文)',
        placeholder:'不填时，为列表默认实体',
        value: '',
        description: '需要删除的实体'
      }],
      // 当前方法的返回结果
      return: [],
      description: '删除所选的记录。'
    },
    {
      name: 'deleteOneByEntity',
      title: '删除该行',
      // 当前方法的输入参数
      params: [{
        name: 'entityName',
        title: '实体名称(英文)',
        placeholder:'不填时，为列表默认实体',
        value: '',
        description: '需要删除的实体'
      }],
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

export default {
  component: 'GlForm',
  // 组件的接收参数
  props: [
    {name: 'query', description: '输入查询条件数据，如{id:1}'}
  ],
  methods: [
    {
      name: 'save',
      title: '保存',
      // 当前方法的输入参数
      params: [
        //   {
        //   name: 'entityName',
        //   title: '实体名称(英文)',
        //   value: '',
        //   description: '需要删除的实体'
        // }
      ],
      // 当前方法的返回结果
      return: [],
      description: '保存表单信息'
    }
  ],
  data: [
    {
      name: 'form',
      type: 'object',
      description: '当前表单值'
    }
  ]
}

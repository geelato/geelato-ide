export default {
  component: 'GlSegment',
  designer: 'GlIdePluginSegmentDesigner',
  title: 'UI片段编辑器',
  objectTree: [{title: 'UI片段', path: 'segments'}],
  // 该组件输入参数
  inParam: {
    // path: 'properties',
    // name: 'field',
    // title: 'title'
  },
  outParams: [
    //   {
    //   group: '表单',
    //   type: Object,
    //   // 在设计配置页面中展示，选择参数
    //   name: 'field', title: 'title', path: 'properties',
    //   // 在运行时获取参数值
    //   dataCtx: 'ctxLoader()'
    // }
  ],
  // 组件的接收参数
  props: [
    // {name: 'params', description: '输入查询条件数据，如{id:1}'}
  ],
  methods: [
    // {
    //   name: 'save',
    //   title: '保存',
    //   // 当前方法的输入参数
    //   params: [
    //     //   {
    //     //   name: 'entityName',
    //     //   title: '实体名称(英文)',
    //     //   value: '',
    //     //   description: '需要删除的实体'
    //     // }
    //   ],
    //   // 当前方法的返回结果
    //   return: [],
    //   description: '保存表单信息'
    // },
    {
      name: 'reset',
      title: '重置',
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
      description: '刷新'
    }
  ],
  data: [
    // {
    //   name: 'form',
    //   type: 'object',
    //   description: '当前表单值'
    // }
  ]
}

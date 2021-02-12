import utils from '../../../../runtime/utils'


export default {
  buildOpts: function () {
    let pk = utils.uuid(16)
    let code = utils.uuid(16)
    let name = utils.uuid(16)
    let description = utils.uuid(16)
    let type = utils.uuid(16)

    return {
      type: 'object',
      // 表单可绑定多实体，这是默认第一实体
      defaultEntity: 'platform_demo_entity',
      // 主键
      pk: pk,
      // update|create|read
      state: 'save',
      properties: {
        // 设置该id:{}，便于子实体中依赖该id
        [pk]: {
          gid: pk,
          // 主键字段默认为'id'
          field: 'id'
        },
        [name]: {
          gid: name,
          field: 'name',
          control: 'Input',
          title: '名称'
        },
        [code]: {
          gid: code,
          field: 'code',
          control: 'Input',
          title: '编码',
          rules: {
            required: true
          }
        },
        [type]: {
          gid: type,
          field: 'type',
          control: 'Select',
          title: '类型',
          // 若数据是动态生产成，可配置ds，基于ds加载的数据最终会设置到data中
          data: [{text: '默认', value: 0}, {text: '类型一', value: 1}, {text: '类型二', value: 2}
          ],
          props: {
            // defaultValue: '0'
          }
        },
        [description]: {
          gid: description,
          field: 'description',
          control: 'Textarea',
          title: '描述'
        }
      },
      layout: {
        type: 'table',
        rows: [{
          cols: [
            {span: 4, label: true, field: name}, {span: 8, field: name},
            {span: 4, label: true, field: code}, {span: 8, field: code}
          ]
        }, {
          // label为true时，展示的是property中title的内容，若需修改名称
          cols: [
            {span: 4, label: true, field: type}, {span: 20, field: type}
          ]
        }
          , {cols: [{span: 4, label: true, field: description}, {span: 20, field: description}]}
          // , {
          //   cols: [{
          //     span: 24, rows: [{cols: [{span: 4, label: true, field: 'content'}, {span: 20, field: 'content'}]}]
          //   }]
          // }, {
          //   cols: [{
          //     span: 24, rows: [{cols: [{span: 4, label: true, field: 'description'}, {span: 20, field: 'description'}]}]
          //   }]
          // }
        ],
        hidden: {}
      },
      toolbar: {
        show: true,
        actions: [{
          text: '保存',
          type: 'primary',
          fn: 'save',
          show: 'true',
          icon: '',
          ctx: 'self'
        }]
      },
      ds: {},
      vars: {},
      watch: {}
    }
  },
  meta: {
    componentName: 'GlForm',
    designer: 'GlIdePluginFormDesigner',
    title: '表单编辑器',
    objectTree: [{title: '表单控件', path: 'properties'}],
    // 该组件输入参数
    inParam: {
      path: 'properties',
      name: 'field',
      title: 'title'
    },
    outParams: [{
      group: '表单',
      type: Object,
      // 在设计配置页面中展示，选择参数
      name: 'field', title: 'title', path: 'properties',
      // 在运行时获取参数值
      dataCtx: '$_ctxLoader().form'
    }],
    // 组件的接收参数
    props: [
      {name: 'params', description: '输入查询条件数据，如{id:1}'}
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
      },
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
        description: '刷新表'
      }
    ],
    data: [
      {
        name: 'form',
        type: 'object',
        description: '当前表单值'
      }
    ]
  },
}

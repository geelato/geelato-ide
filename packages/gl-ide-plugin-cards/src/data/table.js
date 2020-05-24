import utils from '../../../../runtime/utils'
export default {
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
}

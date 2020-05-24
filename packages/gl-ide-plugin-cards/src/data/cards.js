import form from './form.js'
import table from './table.js'
import tree from './tree.js'
import header from './header.js'
import pageLoader from './page_loader.js'


export default {
  items: [{
    title: '列表',
    icon: 'table',
    component: 'GlTable',
    img: '',
    description: '',
    show: true,
    bind: {opts: table, params: {}},
    meta: {
      component: 'GlTable',
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
        group: '行记录（currentRowX）',
        type: Object,
        name: 'dataIndex', title: 'title', path: 'table.columns',
        dataCtx: 'ctxLoader().currentRow'
      }],
      methods: [{code: 'refresh', title: '刷新', description: '刷新列表'}],
    }
  },
    {
      title: '表单',
      icon: 'form',
      component: 'GlForm',
      img: '',
      description: '',
      show: true,
      // 初始化的模板数据
      bind: {opts: form, params: {}},
      meta: {
        component: 'GlForm',
        designer: 'GlIdePluginFormDesigner',
        title: '表单编辑器',
        objectTree: [{title: '表单控件', path: 'properties'}],
        // 该组件输入参数
        inParam: {
          path: 'properties',
          name: 'field',
          title: 'title'
        }
      }
    }, {
      title: '页面引用',
      icon: 'link',
      component: 'GlPage',
      img: '',
      description: '',
      show: true,
      bind: {opts: pageLoader, params: {}},
      meta: {component: 'GlPage', designer: 'GlIdePluginPageLoaderDesigner', title: '设置', modalWidthPercent: .5}
    },
    {
      title: '树',
      icon: 'cluster',
      component: 'GlTree',
      img: '',
      description: '',
      show: true,
      bind: {opts: tree, params: {}},
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
          //   group: '行记录（currentRowX）',
          //   type: Object,
          //   name: 'dataIndex', title: 'title', path: 'table.columns',
          //   dataCtx: 'ctxLoader().currentRow'
          // }
        ],
        methods: [{code: 'refresh', title: '刷新', description: '刷新树'}],
        modalWidthPercent: .8
      }
    },
    // {
    //   title: '工具条',
    //   icon: 'tool',
    //   component: 'GlToolbar',
    //   img: '',
    //   description: '',
    //   show: true,
    //   bind: {opts: {}, query: {}},
    //   meta: {component: 'GlToolbar', designer: 'GlIdePluginToolbarDesigner', title: '工具条设置'}
    // },
    {
      title: '标题',
      icon: 'bars',
      component: 'GlHeader',
      img: '',
      description: '',
      show: true,
      bind: header,
      meta: {
        component: 'GlHeader',
        designer: 'GlIdePluginHeaderDesigner',
        title: '标题设置',
        objectTree: [],
        inSettingPanel: true
      }
    }],
}

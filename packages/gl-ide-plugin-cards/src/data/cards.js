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
    bind: {opts: table.opts, params: {}},
    meta: table.meta
  },
    {
      title: '表单',
      icon: 'form',
      component: 'GlForm',
      img: '',
      description: '',
      show: true,
      // 初始化的模板数据
      bind: {opts: form.opts, params: {}},
      meta: form.meta
    }, {
      title: '页面引用',
      icon: 'link',
      component: 'GlPage',
      img: '',
      description: '',
      show: true,
      bind: {opts: pageLoader.opts, params: {}},
      meta: pageLoader.meta
    },
    {
      title: '树',
      icon: 'cluster',
      component: 'GlTree',
      img: '',
      description: '',
      show: true,
      bind: {opts: tree.opts, params: {}},
      meta: tree.opts
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
      meta: header.meta
    }],
}

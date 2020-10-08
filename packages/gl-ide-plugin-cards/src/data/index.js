import form from './form.js'
// import form2 from './form2.js'
import table from './table.js'
import tree from './tree.js'
import header from './header.js'
import pageLoader from './page_loader.js'


export default {
  items: [{
    group: '组件',
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
      group: '组件',
      title: '表单',
      icon: 'form',
      component: 'GlForm',
      img: '',
      description: '',
      show: true,
      // 初始化的模板数据
      bind: {opts: form.opts, params: {}},
      meta: form.meta
    },
    // {
    //   group: '组件',
    //   title: '表单2',
    //   icon: 'form',
    //   component: 'GlForm',
    //   img: '',
    //   description: '',
    //   show: true,
    //   // 初始化的模板数据
    //   bind: {opts: form2.opts, params: {}},
    //   meta: form2.meta
    // },
    {
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
      group: '组件',
      title: '树',
      icon: 'cluster',
      component: 'GlTree',
      img: '',
      description: '',
      show: true,
      bind: {opts: tree.opts, params: {}},
      meta: tree.meta
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
      group: '组件',
      title: '标题',
      icon: 'bars',
      component: 'GlHeader',
      img: '',
      description: '',
      show: true,
      bind: {opts: header.opts, params: {}},
      meta: header.meta
    }],
}

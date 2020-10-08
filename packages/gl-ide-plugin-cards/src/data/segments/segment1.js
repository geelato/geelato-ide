export default {
  name: '',
  opts: {
    "attrs": {},
    "name": "DIV",
    "style": {},
    "class": [],
    "items": [
      {
        "attrs": {},
        "name": "DIV",
        "style": { "zoom": "1", "display": "inline-block" },
        "class": ["gl-segment", "blue"],
        "items": [
          {
            "attrs": {
              "src": "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            },
            "name": "IMG",
            "style": { "margin-left": "1em" },
            "class": ["ant-avatar", "ant-avatar-sm", "ant-avatar-circle"],
            "items": [],
            "innerHTML": ""
          },
          {
            "attrs": {
              "src": "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            },
            "name": "IMG",
            "style": {
              "color": "red",
              "background-color": "red",
              "margin-left": "-1em",
              "margin-top": "-1.2em",
              "width": "10px",
              "height": "10px"
            },
            "class": ["ant-avatar", "ant-avatar-sm", "ant-avatar-circle"],
            "items": [],
            "innerHTML": ""
          },
          {
            "attrs": {},
            "name": "SPAN",
            "style": { "font-weight": "bold" },
            "class": [],
            "items": [],
            "innerHTML": "\n        alipay\n      "
          },
          {
            "attrs": { "aria-label": "图标: check-circle" },
            "name": "I",
            "style": { "color": "red" },
            "class": ["anticon", "anticon-check-circle"],
            "items": [],
            "innerHTML": "<svg viewBox=\"64 64 896 896\" data-icon=\"check-circle\" width=\"1em\" height=\"1em\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z\"></path><path d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"></path></svg>"
          },
          {
            "attrs": { "aria-label": "icon: down" },
            "name": "I",
            "style": { "float": "right", "margin-right": "1em" },
            "class": ["anticon", "anticon-down"],
            "items": [],
            "innerHTML": "<svg viewBox=\"64 64 896 896\" data-icon=\"down\" width=\"1em\" height=\"1em\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\" class=\"\"><path d=\"M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z\"></path></svg>"
          },
          {
            "attrs": {},
            "name": "SPAN",
            "style": {
              "font-weight": "bold",
              "float": "right",
              "margin-right": "1em"
            },
            "class": [],
            "items": [],
            "innerHTML": "\n        more\n      "
          },
          {
            "attrs": {},
            "name": "DIV",
            "style": { "margin": "0.5em 1em 1em 1.2em" },
            "class": [],
            "items": [],
            "innerHTML": "\n\t\t那是一种内在的东西， 他们到达不了，也无法触及的\n\t"
          },
          {
            "attrs": {},
            "name": "SPAN",
            "style": { "margin-left": "1.4em", "font-size": "0.85em" },
            "class": [],
            "items": [],
            "innerHTML": "\n        科学搬砖组\n      "
          },
          {
            "attrs": {},
            "name": "SPAN",
            "style": {
              "margin-right": "1em",
              "float": "right",
              "font-size": "0.85em"
            },
            "class": [],
            "items": [],
            "innerHTML": "\n        9:30\n      "
          }
        ],
        "innerHTML": "        "
      }
    ],
    "innerHTML": ""
  }
  ,
  meta: {
    component: 'GlSegment',
    designer: 'GlIdePluginSegmentDesigner',
    title: '编辑器',
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
}

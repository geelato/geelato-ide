let data = {
  "component": "",
  "opts": {
    "layout": {
      "gutter": 4,
      "rows": [
        {
          "title": "一行一列",
          "cols": [
            {
              "offset": 0,
              "items": [
                {
                  "component": "GlForm",
                  "img": "",
                  "bind": {
                    "opts": {
                      "layout": {
                        "hidden": {},
                        "type": "table",
                        "rows": [
                          {
                            "cols": [
                              { "field": "name", "label": true, "span": 4 },
                              { "field": "name", "span": 8 },
                              { "field": "code", "label": true, "span": 4 },
                              { "field": "code", "span": 8 }
                            ]
                          },
                          {
                            "cols": [
                              { "field": "HWu05hSM", "label": true, "span": 4 },
                              { "field": "HWu05hSM", "span": 8 },
                              { "field": "MI0RBStL", "label": true, "span": 4 },
                              { "field": "MI0RBStL", "span": 8 }
                            ]
                          },
                          {
                            "cols": [
                              { "field": "type", "label": true, "span": 4 },
                              { "field": "type", "span": 20 }
                            ]
                          },
                          {
                            "cols": [
                              { "field": "content", "label": true, "span": 4 },
                              { "field": "content", "span": 20 }
                            ]
                          }
                        ]
                      },
                      "watch": {},
                      "defaultEntity": "platform_demo_entity",
                      "state": "save",
                      "vars": {},
                      "type": "object",
                      "properties": {
                        "HWu05hSM": {
                          "gid": "HWu05hSM",
                          "field": "sex",
                          "data": [
                            { "text": "男", "value": "1" },
                            { "text": "女", "value": "2" }
                          ],
                          "isServerSaveIgnore": false,
                          "control": "select",
                          "rules": {},
                          "title": "性别",
                          "value": "",
                          "entity": "platform_user",
                          "props": {}
                        },
                        "code": {
                          "gid": "code",
                          "field": "loginName",
                          "isServerSaveIgnore": false,
                          "control": "input",
                          "rules": { "required": true },
                          "title": "登录名",
                          "value": "",
                          "entity": "platform_user",
                          "props": {}
                        },
                        "name": {
                          "gid": "name",
                          "field": "name",
                          "isServerSaveIgnore": false,
                          "control": "input",
                          "rules": { "required": true },
                          "title": "名称",
                          "value": "",
                          "entity": "platform_user",
                          "props": {}
                        },
                        "description": {
                          "gid": "description",
                          "field": "description",
                          "control": "textarea",
                          "title": "描述",
                          "value": "",
                          "entity": "platform_demo_entity",
                          "props": {}
                        },
                        "id": {
                          "gid": "id",
                          "field": "id",
                          "value": "",
                          "entity": "platform_demo_entity",
                          "props": {}
                        },
                        "MI0RBStL": {
                          "gid": "MI0RBStL",
                          "field": "source",
                          "data": [
                            { "text": "本地用户", "value": "1" },
                            { "text": "未指定", "value": "0" },
                            { "text": "系统同步", "value": "2" }
                          ],
                          "isServerSaveIgnore": false,
                          "control": "select",
                          "rules": { "required": true },
                          "title": "来源",
                          "value": "",
                          "entity": "platform_user",
                          "props": { "defaultActiveIndex": 0 }
                        },
                        "type": {
                          "gid": "type",
                          "data": [
                            { "text": "员工账号", "value": "0" },
                            { "text": "系统账号", "value": "1" },
                            { "text": "企业外人员", "value": "2" }
                          ],
                          "field": "type",
                          "isServerSaveIgnore": false,
                          "control": "select",
                          "rules": {},
                          "title": "类型",
                          "value": "0",
                          "entity": "platform_user",
                          "props": { "defaultValue": "0" }
                        },
                        "content": {
                          "gid": "content",
                          "field": "content",
                          "isServerSaveIgnore": false,
                          "control": "textarea",
                          "rules": { "required": true },
                          "title": "内容",
                          "value": "",
                          "entity": "platform_user",
                          "props": {}
                        }
                      },
                      "ds": {}
                    },
                    "query": {}
                  },
                  "meta": {
                    "component": "GlIdePluginFormDesigner",
                    "objectTree": [
                      { "path": "properties", "title": "表单控件" }
                    ],
                    "title": "表单编辑器"
                  },
                  "icon": "form",
                  "show": true,
                  "description": "",
                  "id": "H4OGTSuE9rczIOlX",
                  "title": "表单"
                }
              ],
              "span": 24
            }
          ]
        }
      ]
    }
  },
  "events": {},
  "_componentRefs": {
    "H4OGTSuE9rczIOlX": {
      "id": "H4OGTSuE9rczIOlX",
      "bind": {
        "opts": {
          "layout": {
            "hidden": {},
            "type": "table",
            "rows": [
              {
                "cols": [
                  { "field": "name", "label": true, "span": 4 },
                  { "field": "name", "span": 8 },
                  { "field": "code", "label": true, "span": 4 },
                  { "field": "code", "span": 8 }
                ]
              },
              {
                "cols": [
                  { "field": "HWu05hSM", "label": true, "span": 4 },
                  { "field": "HWu05hSM", "span": 8 },
                  { "field": "MI0RBStL", "label": true, "span": 4 },
                  { "field": "MI0RBStL", "span": 8 }
                ]
              },
              {
                "cols": [
                  { "field": "type", "label": true, "span": 4 },
                  { "field": "type", "span": 20 }
                ]
              },
              {
                "cols": [
                  { "field": "content", "label": true, "span": 4 },
                  { "field": "content", "span": 20 }
                ]
              }
            ]
          },
          "watch": {},
          "defaultEntity": "platform_demo_entity",
          "state": "save",
          "vars": {},
          "type": "object",
          "properties": {
            "HWu05hSM": {
              "gid": "HWu05hSM",
              "field": "sex",
              "data": [
                { "text": "男", "value": "1" },
                { "text": "女", "value": "2" }
              ],
              "isServerSaveIgnore": false,
              "control": "select",
              "rules": {},
              "title": "性别",
              "value": "",
              "entity": "platform_user",
              "props": {}
            },
            "code": {
              "gid": "code",
              "field": "loginName",
              "isServerSaveIgnore": false,
              "control": "input",
              "rules": { "required": true },
              "title": "登录名",
              "value": "",
              "entity": "platform_user",
              "props": {}
            },
            "name": {
              "gid": "name",
              "field": "name",
              "isServerSaveIgnore": false,
              "control": "input",
              "rules": { "required": true },
              "title": "名称",
              "value": "",
              "entity": "platform_user",
              "props": {}
            },
            "description": {
              "gid": "description",
              "field": "description",
              "control": "textarea",
              "title": "描述",
              "value": "",
              "entity": "platform_demo_entity",
              "props": {}
            },
            "id": {
              "gid": "id",
              "field": "id",
              "value": "",
              "entity": "platform_demo_entity",
              "props": {}
            },
            "MI0RBStL": {
              "gid": "MI0RBStL",
              "field": "source",
              "data": [
                { "text": "本地用户", "value": "1" },
                { "text": "未指定", "value": "0" },
                { "text": "系统同步", "value": "2" }
              ],
              "isServerSaveIgnore": false,
              "control": "select",
              "rules": { "required": true },
              "title": "来源",
              "value": "",
              "entity": "platform_user",
              "props": { "defaultActiveIndex": 0 }
            },
            "type": {
              "gid": "type",
              "data": [
                { "text": "员工账号", "value": "0" },
                { "text": "系统账号", "value": "1" },
                { "text": "企业外人员", "value": "2" }
              ],
              "field": "type",
              "isServerSaveIgnore": false,
              "control": "select",
              "rules": {},
              "title": "类型",
              "value": "0",
              "entity": "platform_user",
              "props": { "defaultValue": "0" }
            },
            "content": {
              "gid": "content",
              "field": "content",
              "isServerSaveIgnore": false,
              "control": "textarea",
              "rules": { "required": true },
              "title": "内容",
              "value": "",
              "entity": "platform_user",
              "props": {}
            }
          },
          "ds": {}
        },
        "query": {}
      },
      "meta": {
        "component": "GlIdePluginFormDesigner",
        "objectTree": [{ "path": "properties", "title": "表单控件" }],
        "title": "表单编辑器"
      }
    }
  },
  "_bindEvents": {}
}

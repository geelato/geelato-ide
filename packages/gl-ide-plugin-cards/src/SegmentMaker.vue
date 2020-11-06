<template>
  <div class="gl-segment-maker gl-compact"
       style="display: grid;grid-template-columns: 12fr 12fr;grid-template-areas: 'a b'">
    <div style="grid-area: a;">
      <div id="srcContainer" ref="srcContainer" :style="panelStyle"></div>
    </div>
    <div style="grid-area: b;">
      <div style="border-bottom: #e0e0e0 1px solid;width: 100%;padding: 10px 0 2px 5px;">
        <a-radio-group default-value="uiContainer" button-style="solid" v-model="currentOutput">
          <a-radio-button value="uiContainer">
            预览
          </a-radio-button>
          <a-radio-button value="jsonContainer">
            JSON
          </a-radio-button>
          <a-radio-button value="segmentTemplateInfo" @click="capture">
            模板信息
          </a-radio-button>
        </a-radio-group>
      </div>
      <div v-show="currentOutput==='uiContainer'">
        <!--<div ref="html" v-html="codeCopyString" @change="console.log('ssssssssssss')"></div>-->
        <a-slider style="margin: 0 0.5em" :tip-formatter="formatter" v-model="zoom" :min="0" :max="2" :step="0.01"/>
        <div id="uiContainer" ref="uiContainer" :style="{zoom:zoom}"></div>
      </div>
      <div v-show="currentOutput==='jsonContainer'">
        <div id="jsonContainer" ref="jsonContainer" :style="tabPanelStyle"></div>
      </div>
      <div v-show="currentOutput==='segmentTemplateInfo'">
        <div id="segmentTemplateInfo" ref="segmentTemplateInfo" :style="tabPanelStyle">
          <table class="gl-table">
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label" style="width: 25%">标题</td>
              <td>
                <a-input v-model="form.title"></a-input>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">类型</td>
              <td>
                <a-input v-model="form.type"></a-input>
              </td>
            </tr>
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">缩略图</td>
              <td class="gl-table-cell">
                <div id="snapshotContainer" ref="snapshotContainer" style="padding: 0.5em" :style="{zoom:zoom/2}">
                  正在生成缩略图
                </div>
              </td>
            </tr>
            <!--<tr class="gl-table-row">-->
            <!--<td class="gl-table-cell gl-table-cell-sub-label">原图</td>-->
            <!--<td class="gl-table-cell">-->
            <!--<a-input></a-input>-->
            <!--</td>-->
            <!--</tr>-->
            <tr class="gl-table-row">
              <td class="gl-table-cell gl-table-cell-sub-label">描述</td>
              <td class="gl-table-cell">
                <a-textarea rows="5"></a-textarea>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '../../mixin-designer'
  import Vue from 'vue';
  import * as monaco from 'monaco-editor'
  import prettier from 'prettier/standalone'
  import prettierBabylon from 'prettier/parser-babylon'
  // import prettierTypescript from 'prettier/parser-typescript'
  import html2canvas from 'html2canvas';

  export default {
    name: "GlSegmentMaker",
    mixins: [mixin],
    props: {
      opts: {
        type: Object,
        default: function () {
          return {}
        }
      },
      layout: {
        type: Object,
        default() {
          return {
            height: '600px'
          }
        }
      },
    },
    data() {
      return {
        editorOptions: {
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,        // 只读
          cursorStyle: 'line',        //光标样式
          glyphMargin: true,  //字形边缘
          useTabStops: false,
          accessibilityPageSize: 20,
          fontSize: 14,       //字体大小
          autoIndent: true, //自动布局
          automaticLayout: true, //自动布局
          formatOnPaste: true,
          formatOnType: true,
          //quickSuggestionsDelay: 500,   //代码提示延时
        },
        htmlEditor: undefined,
        jsonEditor: undefined,
        themeOption: [
          {
            value: 'vs',
            label: '默认'
          },
          {
            value: 'hc-black',
            label: '高亮'
          },
          {
            value: 'vs-dark',
            label: '深色'
          },
        ],
        theme: 'vs',
        codeCopyString: '',//内容备份
        codeCopyFormatString: '',
        zoom: 1,
        json: {},
        codeCopyJson: '',
        codeCopyFormatJson: '',
        currentOutput: 'uiContainer',
        form: {
          id: '',
          title: '',
          type: 'segmentTemplate',
          code: '',
          thumbnail: '',
          htmlContent: '',
          jsonContent: '',
          originalPicture: '',
          description: ''
        }
      }
    },
    computed: {
      uiContainerStyle() {
        let style = {zoom: this.zoom}
        Object.assign(style, this.tabPanelStyle)
        return style
      }
    },
    watch: {},
    mounted() {
      console.log('mounted>', this.opts)
      this.reset(this.opts)
    },
    methods: {
      reset(segment) {

        let that = this;
        if (segment && segment.data) {
          this.form.id = segment.data.id
          this.form.title = segment.data.title
          this.form.type = segment.data.type
          this.form.description = segment.data.description
        }
        // if (!that.$refs.srcContainer) {
        //   return
        // }
        // 清空子元素
        that.$refs.srcContainer.innerHTML = ''
        let options = {
          value: (segment.data ? segment.data.htmlContent : '') || that.codeCopyformatString,
          language: 'html',
          theme: that.theme
        }
        Object.assign(options, that.editorOptions)
        that.htmlEditor = monaco.editor.create(that.$refs.srcContainer, options)
        that.htmlEditor.onDidChangeModelContent(onSrcContentChange)
        that.$emit('onMounted', that.htmlEditor)
        onSrcContentChange()

        //编辑器创建完成回调
        function onSrcContentChange(event) {
          that.codeCopyString = that.htmlEditor.getValue()
          that.$emit('onCodeChange', that.htmlEditor.getValue(), event)

          that.$refs.uiContainer.innerHTML = ''

          try {
            let MyComponent = Vue.extend({
              template: '<div>' + that.codeCopyString + '</div>'
            })
            let component = new MyComponent().$mount();
            document.getElementById('uiContainer').appendChild(component.$el)
            that.json = that.parseElementToVNode(that.$refs.uiContainer.childNodes[0], that)
            that.updateJson()
          } catch (e) {
            console.error(e)
          }
        }
      },
      parseElementToVNode(node, that) {
        let tag = {attrs: {}}
        // console.log('node:', node.attributes)
        tag.name = node.nodeName
        tag.style = that.styleConvert(node.style ? node.style.cssText : '')
        tag.class = that.classConvert(node.className)
        for (let index in node.attributes) {
          let attribute = node.attributes[index]
          if (['class', 'style'].indexOf(attribute.nodeName) === -1) {
            tag.attrs[attribute.nodeName] = attribute.nodeValue
          }
        }
        tag.items = []
        tag.innerHTML = tag.innerHTML || ''
        for (let i = 0; i < node.childNodes.length; i++) {
          if (node.childNodes[i].nodeName === '#text') {
            tag.innerHTML += node.childNodes[i].wholeText
          } else if (node.childNodes[i].nodeName === 'svg') {
            tag.innerHTML += node.childNodes[i].outerHTML
          } else if (node.childNodes[i].nodeName === '#comment') {
            tag.innerHTML += ''
          } else {
            tag.items.push(that.parseElementToVNode(node.childNodes[i], that))
          }
        }
        return tag
      },
      updateJson() {
        let that = this
        that.$refs.jsonContainer.innerHTML = '';
        console.log('that.content>', that.json, typeof that.json)
        that.codeCopyJson = JSON.stringify(that.json, function (key, value) {
          // 去掉vue组件
          if (value && value._isVue) {
            return undefined
          }
          return value;
        });

        that.codeCopyFormatJson = prettier.format(that.codeCopyJson, {parser: "json", plugins: [prettierBabylon]})
        let options = {
          value: that.codeCopyFormatJson,
          language: 'json',
          theme: that.theme
        }
        Object.assign(options, that.editorOptions)
        that.jsonEditor = monaco.editor.create(that.$refs.jsonContainer, options);
        //编辑器创建完成回调
        that.jsonEditor.onDidChangeModelContent(function (event) {
          // //编辑器内容changge事件
          // that.codeCopyString = htmlEditor.getValue();
          // that.$emit('onCodeChange', htmlEditor.getValue(), event);
        });
      },

      styleConvert(cssText) {
        if (!cssText) {
          return {}
        }
        let style = {}
        let ary = cssText.trim().split(';')
        ary.forEach((cssTextSegment) => {
          if (cssTextSegment.trim().length > 0) {
            let styleKV = cssTextSegment.trim().split(':')
            let styleKey = styleKV[0].trim()
            let styleValue = styleKV[1].trim()
            if (styleKey === 'margin' || styleKey === 'padding') {
              styleValue.split(' ')
              // todo margin padding
              style[styleKey] = styleValue
            } else {
              style[styleKey] = styleValue
            }
          }
        })
        return style
      },
      classConvert(className) {
        // console.log('className>', className)
        return typeof className === 'string' && className.trim().length > 0 ? className.trim().split(' ') : []
      },
      capture(callback) {
        let that = this
        html2canvas(window.document.querySelector('#uiContainer'), {
          imageTimeout: 150000,
          useCORS: true
        }).then(function (canvas) {
          that.$refs.snapshotContainer.innerHTML = '';
          window.document.querySelector('#snapshotContainer').appendChild(canvas);
          // console.log('len:', canvas.toDataURL('image/png').length)
          // let ctx = canvas.getContext("2d");
          // ctx.scale(that.zoom, that.zoom)
          // console.log('canvas', canvas.getAttribute('width'), canvas)
          // console.log('ctx', ctx)
          // console.log('len:', canvas.toDataURL('image/png').length)
          that.$set(that.form, 'thumbnail', canvas.toDataURL('image/png'))
          if (typeof callback === 'function') {
            callback(canvas)
          }
        });
      },

      save(callback) {
        let that = this
        this.form.htmlContent = that.htmlEditor && that.htmlEditor.getValue() ? that.htmlEditor.getValue().trim() : ''
        this.form.jsonContent = that.jsonEditor && that.jsonEditor.getValue() ? that.jsonEditor.getValue().trim() : ''
        this.form.description = ''
        this.form.originalPicture = this.form.thumbnail
        //check form
        console.log('form:', this.form, this.$gl)

        if (!this.form.htmlContent) {
          // this.$notification.open({message: 'HTML不能为空！'})
          this.$message.error('HTML不能为空！')
        } else if (!this.form.jsonContent) {
          this.$message.error('JSON不能为空！')
        } else if (!this.form.title) {
          this.$message.error('模板信息标题不能为空！')
        } else if (!this.form.thumbnail) {
          this.$message.error('模板信息缩略图不能为空！')
        } else if (!this.form.originalPicture) {
          this.$message.error('模板信息原图不能为空！')
        } else {
          that.$gl.api.save('platform_app_segment', that.form).then(function (res) {
            that.$set(that.form, 'id', res.result)
            console.log('res', res, that.form)
            if (typeof callback === 'function') {
              callback()
            }
          })
        }
      },
      remove(callback) {
        let that = this
        if (!this.form.id) {
          this.$message.error('id不能为空！')
        } else {
          that.$gl.api.delete('platform_app_segment', {id: that.form.id}).then(function (res) {
            console.log('res', res, that.form)
            if (typeof callback === 'function') {
              callback()
            }
          })
        }
      },
      clearChildById(id) {
        let el = document.getElementById(id)
        let child = el.lastElementChild;
        while (child) {
          el.removeChild(child);
          child = el.lastElementChild;
        }
      },
      formatter(value) {
        return `${value * 100}%`
      },
      pasteThumbnail(e) {
        this.capture(function (canvas) {

        })
        console.log('sssss', e, e.target.childNodes)
      }
    }
  }
</script>
<style>
  /*.gl-segment-maker .margin-view-overlays, .gl-segment-maker .minimap-decorations-layer {*/
  /*background-color: rgb(238, 238, 238);*/
  /*}*/

  /*.gl-segment-maker {*/
  /*display: grid;*/
  /*grid-template-columns: 3fr 2fr;*/
  /*!*grid-template-rows: 100% 100%;*!*/
  /*grid-template-areas: 'a b' 'a c'*/
  /*}*/

  /*.gl-segment-maker .item {*/
  /*!*background-color: red;*!*/
  /*}*/

</style>

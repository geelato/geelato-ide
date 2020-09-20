<template>
  <div class="gl-segment-maker">
    <div class="item" style="grid-area: a;background-color: #e0e0e0">
      <div id="srcContainer" ref="srcContainer" :style="{height:layout.height}"></div>
    </div>
    <div class="item">
      <!--<div ref="html" v-html="codeCopyString" @change="console.log('ssssssssssss')"></div>-->
      <div ref="html" id="uiContainer"></div>
    </div>
    <div class="item">
      <div id="jsonContainer" ref="jsonContainer" :style="{height:layout.height}"></div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import * as monaco from 'monaco-editor'
  import prettier from 'prettier/standalone'
  import prettierBabylon from 'prettier/parser-babylon'
  // import prettierTypescript from 'prettier/parser-typescript'

  export default {
    name: "SegmentMaker",
    props: {
      language: {
        type: String,
        default: function () {
          return 'html'
        }
      },
      opts: {
        type: Object,
        default: function () {
          return {}
        }
      }
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
        jsonEditorOptions: {
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: true,        // 只读
          cursorStyle: 'line',        //光标样式
          glyphMargin: true,  //字形边缘
          useTabStops: false,
          fontSize: 14,       //字体大小
          autoIndent: true, //自动布局
          automaticLayout: true, //自动布局
          formatOnPaste: true,
          formatOnType: true,
          //quickSuggestionsDelay: 500,   //代码提示延时
        },
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
        layout: {
          width: '1024px',
          height: '600px'
        },
        message: '',
        json: {segment: {items: []}},
        codeCopyJson: '',
        codeCopyFormatJson: ''
      }
    },
    watch: {
      // 'ideStore.editingFile.id': function (val, oldVal) {
      //   // 若未有page信息，则返回
      //   if (!val) {
      //     return
      //   }
      //   this.reset()
      // }
    },
    mounted() {
      this.reset();
      let that = this
      window.onresize = () => {
        return (() => {
          that.reset()
        })()
      }
    },
    methods: {
      reset() {
        let that = this;
        if (!that.$refs.srcContainer) {
          return
        }
        that.$refs.srcContainer.innerHTML = '';
        let options = {
          value: that.codeCopyformatString,
          language: that.language,
          theme: that.theme
        }
        Object.assign(options, that.editorOptions, that.opts)
        that.monacoEditor = monaco.editor.create(that.$refs.srcContainer, options);
        that.$emit('onMounted', that.monacoEditor);
        //编辑器创建完成回调
        that.monacoEditor.onDidChangeModelContent(function (event) {
          //编辑器内容changge事件
          that.codeCopyString = that.monacoEditor.getValue();
          that.$emit('onCodeChange', that.monacoEditor.getValue(), event);


          // 清空子元素
          let uiContainer = document.getElementById('uiContainer')
          let child = uiContainer.lastElementChild;
          while (child) {
            uiContainer.removeChild(child);
            child = uiContainer.lastElementChild;
          }

          let MyComponent = Vue.extend({
            template: '<div>'+that.codeCopyString+'</div>'
          })
          let component = new MyComponent().$mount();
          document.getElementById('uiContainer').appendChild(component.$el);
          that.parseSrcToJson()
          that.updateJson()
        });
        //编辑器随窗口自适应
        window.addEventListener('resize', function () {
          // reset();
        })
      },
      parseSrcToJson() {
        let that = this
        this.json = {
          segment: {
            style: {},
            class: '',
            items: []
          }
        }
        let divs = this.$refs.html.getElementsByClassName('gl-segment')
        if (divs.length === 1) {
          let segment = divs[0]
          that.json.segment.style = that.styleConvert(segment.style.cssText)
          that.json.segment.class = that.classConvert(segment.className)
          for (let i = 0; i < segment.childNodes.length; i++) {
            let node = segment.childNodes[i]
            if (node.nodeName === 'DIV' && node.style.cssText) {
              this.json.segment.items.push({
                type: 'div',
                style: that.styleConvert(node.style.cssText),
                class: that.classConvert(node.className)
              })
            }
          }
        } else {
          this.message = '有且只有一个div的类为gl-segment'
        }
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
        Object.assign(options, that.jsonEditorOptions, that.opts)
        const monacoEditor = monaco.editor.create(that.$refs.jsonContainer, options);
        //编辑器创建完成回调
        monacoEditor.onDidChangeModelContent(function (event) {
          // //编辑器内容changge事件
          // that.codeCopyString = monacoEditor.getValue();
          // that.$emit('onCodeChange', monacoEditor.getValue(), event);
        });
      },

      styleConvert(cssText) {
        let style = {}
        let ary = cssText.trim().split(';')
        ary.forEach((cssTextSegment) => {
          if (cssTextSegment.trim().length > 0) {
            let styleKV = cssTextSegment.trim().split(':')
            // todo margin padding
            style[styleKV[0].trim()] = styleKV[1].trim()
          }
        })
        return style
      },
      classConvert(className) {
        return className
      }
    }
  }
</script>
<style>
  .gl-segment-maker {
    display: grid;
    grid-template-columns: 3fr 2fr;
    /*grid-template-rows: 100% 100%;*/
    grid-template-areas: 'a b' 'a c'
  }

  .gl-segment-maker .item {
    /*background-color: red;*/
  }

</style>

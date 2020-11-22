<!--
  基础代码组件
-->
<template>
  <div class="myEditor">
    <div id="container" ref="container" :style="{height:(layout.height-56)+`px`}"></div>
  </div>
</template>

<script>
  import * as monaco from 'monaco-editor'
  import prettier from 'prettier/standalone'
  import prettierBabylon from 'prettier/parser-babylon'
  // import prettierTypescript from 'prettier/parser-typescript'

  export default {
    name: "GlIdeStageCode",
    props: {
      content: {
        type: Object,
        default() {
          return {}
        }
      },
      // codes: {
      //   type: String,
      //   default: function () {
      //     return this.content.codes
      //   }
      // },
      language: {
        type: String,
        default: function () {
          return 'json'
        }
      },
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
            width: 1024,
            height: 600
          }
        }
      }
    },
    data() {
      return {
        editorOptions: {
          selectOnLineNumbers: true,
          roundedSelection: false,
          editable: true,        // 只读
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
      }
    },
    watch: {
      'ideStore.editingFile.id': function (val, oldVal) {
        // 若未有page信息，则返回
        if (!val) {
          return
        }
        this.reset()
      }
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
        if (!that.$refs.container) {
          return
        }
        that.$refs.container.innerHTML = '';
        console.log('that.content>', that.content, typeof that.content)
        that.codeCopyString = JSON.stringify(that.content, function (key, value) {
          // 去掉vue组件
          if (value && value._isVue) {
            return undefined
          }
          return value;
        });

        that.codeCopyformatString = prettier.format(that.codeCopyString, {parser: "json", plugins: [prettierBabylon]})
        let options = {
          value: that.codeCopyformatString,
          language: that.language,
          theme: that.theme
        }
        Object.assign(options, that.editorOptions, that.opts)
        that.monacoEditor = monaco.editor.create(that.$refs.container, options);
        that.$emit('onMounted', that.monacoEditor);//编辑器创建完成回调
        that.monacoEditor.onDidChangeModelContent(function (event) {//编辑器内容changge事件
          that.codeCopyString = that.monacoEditor.getValue();
          that.$emit('onCodeChange', that.monacoEditor.getValue(), event);
        });
        //编辑器随窗口自适应
        window.addEventListener('resize', function () {
          // reset();
        })
      },
      RunResult() {
        console.log(this.monacoEditor.getValue());
      },
      // eslint-disable-next-line no-unused-vars
      themeChange(val) {
        this.reset();
      }
    }
  }
</script>

<style scoped>
  #container {
    height: 100%;
    text-align: left;
  }
</style>

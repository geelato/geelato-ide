<template>
  <div class="myEditor">
    <div id="container" ref="container" style="height:600px"></div>
  </div>
</template>

<script>
  import * as monaco from 'monaco-editor'

  export default {
    name: "StageCode",
    props: {
      content: {
        type: Object,
        default() {
          return {opts: {codes: ''}}
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
      editorOptions: {
        type: Object,
        default: function () {
          return {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,        // 只读
            cursorStyle: 'line',        //光标样式
            automaticLayout: true, //自动布局
            glyphMargin: true,  //字形边缘
            useTabStops: false,
            fontSize: 14,       //字体大小
            autoIndent: true, //自动布局
            formatOnPaste: true,
            formatOnType: true,
            //quickSuggestionsDelay: 500,   //代码提示延时
          }
        }
      }
    },
    data() {
      return {
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
        codesCopy: null,//内容备份
      }
    },
    mounted() {
      this.initEditor();
      let that = this
      window.onresize = () => {
        return (() => {
          that.initEditor()
        })()
      }
    },
    methods: {
      initEditor() {
        let self = this;
        self.$refs.container.innerHTML = '';
        let options = {
          value: self.codesCopy || self.content.opts.codes,
          language: self.language,
          theme: self.theme
        }
        Object.assign(options, self.editorOptions)
        self.monacoEditor = monaco.editor.create(self.$refs.container, options);
        self.$emit('onMounted', self.monacoEditor);//编辑器创建完成回调
        self.monacoEditor.onDidChangeModelContent(function (event) {//编辑器内容changge事件
          self.codesCopy = self.monacoEditor.getValue();
          self.$emit('onCodeChange', self.monacoEditor.getValue(), event);
        });
        //编辑器随窗口自适应
        window.addEventListener('resize', function () {
          // initEditor();
        })
      },
      RunResult() {
        console.log(this.monacoEditor.getValue());
      },
      themeChange(val) {
        this.initEditor();
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

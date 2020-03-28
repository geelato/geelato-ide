<template>
  <div class="gl-ide-designer-condition">
    <div>设置参数：
      <span>
        <select-object style="display: inline-block"></select-object>
      </span>
      的值为下脚本的执行返回值。
    </div>
    <p></p>
    <script-block></script-block>
  </div>
</template>

<script>

  import SelectObject from './SelectObject'
  import ScriptBlock from './ScriptBlock'

  export default {
    components: {ScriptBlock,SelectObject},
    props: {
      params: {
        type: Object,
        default() {
          return {}
        }
      },
      designComponentName: {
        type: String
      }
    },
    data() {
      return {
        minHeight: '350px',
        ctx: {
          '系统': {'当前用户': 'user', '当前时间': 'date'},
          '表单': {'姓名': 'name', '年龄': 'age'},
          '逻辑': {'如果': 'if()', '且': '&&', '或': '||'},
          // '运算符': {'如果': 'if()', '且': '&&', '或': '||'},
          '函数': {'最大值': 'Math.max()', '最小值': 'Math.min()', '绝对值': 'Math.abs()', '日期格式化': ''}
        },
        expression: ''
      };
    },
    watch: {},
    created() {
    },
    mounted() {
    },
    beforeDestroy() {
      this.$emit('update', this.ctx)
    },
    methods: {
      addToExpression(key, name, value) {
        // this.expression += '$.' + key + '.' + name
        if (key === '函数' || key === '逻辑') {
          this.insertText(this.$refs.textarea, value)
        } else {
          this.insertText(this.$refs.textarea, '$.' + key + '.' + name)
        }
      },
      addSignToExpression(sign) {
        this.insertText(this.$refs.textarea, sign)
      },
      insertText(obj, str) {
        if (document.selection) {
          let selection = document.selection.createRange();
          selection.text = str;
        } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
          let startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            cursorPos = startPos,
            tmpStr = obj.value;
          obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
          cursorPos += str.length;
          obj.selectionStart = obj.selectionEnd = cursorPos;
        } else {
          obj.value += str;
        }
      },
      moveEnd(obj) {
        obj.focus();
        let len = obj.value.length;
        if (document.selection) {
          let sel = obj.createTextRange();
          sel.moveStart('character', len);
          sel.collapse();
          sel.select();
        } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
          obj.selectionStart = obj.selectionEnd = len;
        }
      }
    }
  }
</script>

<style>
  .gl-ide-designer-condition .ant-collapse-content-box {
    padding: 0 16px !important;
  }

  .gl-condition-container .ant-card-body {
    padding: 2px
  }

  .gl-ide-designer-condition-field {
    padding: 2px 0 0 1.5em;
    cursor: pointer;
  }
</style>

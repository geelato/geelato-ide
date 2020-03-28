<template>
  <div class="gl-ide-designer-condition">
    <a-row>
      <a-col :span="7" :style="{'min-height':minHeight}">
        <a-collapse defaultActiveKey="1" :bordered="false">
          <template v-slot:expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0"/>
          </template>
          <a-collapse-panel v-for="(item,key,index) in ctx" :header="key" :key="index" style="border: 0;margin: 0">
            <!--{{item}}-{{key}}-{{index}}-->
            <div class="gl-ide-designer-condition-field" v-for="(propertyValue,propertyName) in item"
                 @click="addToExpression(key,propertyName,propertyValue) ">{{propertyName}}
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-col>
      <a-col :span="17">
        <div style="padding: 2px">
          <a-button-group size="small">
            <a-button @click="addSignToExpression('+')">+</a-button>
            <a-button @click="addSignToExpression('-')">-</a-button>
            <a-button @click="addSignToExpression('*')">*</a-button>
            <a-button @click="addSignToExpression('/')">/</a-button>
            <a-button @click="addSignToExpression('==')">==</a-button>
            <a-button @click="addSignToExpression('!=')">!=</a-button>
            <a-button @click="addSignToExpression('>')">&gt;</a-button>
            <a-button @click="addSignToExpression('<')">&lt;</a-button>
            <a-button @click="addSignToExpression('>=')">&gt;=</a-button>
            <a-button @click="addSignToExpression('<=')">&lt;=</a-button>
            <a-button @click="addSignToExpression('()')">()</a-button>
            <!--<a-button @click="addSignToExpression('if(){}')">如果</a-button>-->
          </a-button-group>
          <!--<a-button-group size="small">-->
          <!--<a-button @click="addSignToExpression('Math.max()')" title="Math.max(x1,x2,x3,….xn)">最大值</a-button>-->
          <!--<a-button @click="addSignToExpression('Math.min()')" title="Math.max(x1,x2,x3,….xn)">最小值</a-button>-->
          <!--</a-button-group>-->
        </div>
        <a-textarea ref="textarea" v-model="expression" :style="{'min-height':minHeight}"></a-textarea>
      </a-col>
    </a-row>
  </div>
</template>

<script>

  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    components: {ATextarea},
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
          '系统变量': {'当前用户': 'user', '当前时间': 'date'},
          '表单属性': {'姓名': 'name', '年龄': 'age'},
          '条件逻辑': {'如果': 'if()', '与': '&&', '或': '||', '非': '!'},
          // '运算符': {'如果': 'if()', '且': '&&', '或': '||'},
          '数学函数': {'最大值': 'Math.max()', '最小值': 'Math.min()', '绝对值': 'Math.abs()'},
          '其它函数': {'日期格式化': ''}
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
        if (key === '数学函数' || key === '其它函数' || key === '条件逻辑') {
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

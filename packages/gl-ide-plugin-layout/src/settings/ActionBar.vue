<template>
  <div>
    <span @click="$emit('setCondition',doItem)">
      <a v-if="doItem.if">有条件</a>
      <a v-else>无条件</a>
      &nbsp;
    </span>
    <span>{{label}}&nbsp;&nbsp;</span>
    <span>
      <a-select :defaultValue="doItem.handler" style="width: 200px"
                @change="$emit('doActionChange',$event,doItem,doItemIndex)" :allowClear="true">
        <a-select-opt-group label="链接动作">
           <a-select-option value="OpenModal">弹出窗口（modal）</a-select-option>
          <a-select-option value="CloseModal">关闭窗口（modal）</a-select-option>
          <a-select-option value="OpenWin">打开新窗口（window）</a-select-option>
        </a-select-opt-group>
        <a-select-opt-group label="控件动作">
          <a-select-option value="InvokeCurrentComponent">调用当前控件方法</a-select-option>
          <a-select-option value="InvokeComponent">调用指定控件方法</a-select-option>
          <!--<a-select-option value="ShowAndHide">显示/隐藏</a-select-option>-->
          <a-select-option value="ReadAndWrite">只读/可写</a-select-option>
        </a-select-opt-group>
         <a-select-opt-group label="其它动作">
           <a-select-option value="ShowMessage">提醒消息</a-select-option>
          <a-select-option value="SetVars">设置变量值</a-select-option>
           <a-select-option value="ScriptBlock">执行代码块</a-select-option>
           <a-select-option value="InvokeRestfulSrv">调用服务（Restful）</a-select-option>
           <!--<a-select-option value="triggerEvent">触发事件</a-select-option>-->
        </a-select-opt-group>
      </a-select>
    </span>
    <span>
       <a-button @click="$emit('doActionSetting',doItem.handler,doItem,doItemIndex)" type="link" title="设置动作"><a-icon
           type="setting"/></a-button>
      <a-button v-if="isLastOne!==true" @click="addCallback" type="link" title="添加回调"><a-icon
          type="plus-circle"/></a-button>
      <a-button @click="$emit('doActionRemoved',doItem.handler,doItems,doItemIndex)" class="remove" type="link"
                style="color: red"
                title="删除动作"><a-icon type="close-circle"/></a-button>
     </span>
  </div>
</template>

<script>
  export default {
    name: "GlActionBar",
    props: {
      isLastOne: Boolean,
      label: String,
      doItems: Array,
      doItem: Object,
      doItemIndex: Number
    },
    methods: {
      addCallback() {
        if (!this.doItem.then) {
          this.doItem.then = []
        }
        this.doItem.then.push({handler: '', fn: '', params: {}, then: []})
        // this.doItems.push({handler: '', fn: '', params: {}})
        console.log('doItems>', this.doItems, this.doItem)
        this.$emit('doActionAdded', this.doItem.handler, this.doItems, this.doItemIndex)
      }
    }
  }
</script>

<style scoped>

  .remove {
    display: none;
  }

  .event-action:hover .remove {
    display: inline-block;
  }

  .ant-btn.ant-btn-link {
    padding: 0;
    margin: 0 5px;
  }
</style>

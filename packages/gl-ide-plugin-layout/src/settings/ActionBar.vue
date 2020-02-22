<template>
  <div>
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
          <a-select-option value="keyup.esc">显示/隐藏</a-select-option>
        </a-select-opt-group>
         <a-select-opt-group label="其它动作">
           <a-select-option value="ShowMessage">提醒消息</a-select-option>
          <a-select-option value="setVars">设置变量值</a-select-option>
          <a-select-option value="triggerEvent">触发事件</a-select-option>
        </a-select-opt-group>
      </a-select>
    </span>
    <span>
       <a-button @click="$emit('doActionSetting',doItem.handler,doItem,doItemIndex)" type="link" title="设置动作"><a-icon
           type="setting"/></a-button>
      <a-button v-if="isLastOne!==true" @click="addCallback" type="link" title="添加回调"><a-icon
          type="plus-circle"/></a-button>
      <a-button @click="$emit('doActionRemove',doItem.handler,doItems,doItemIndex)" class="remove" type="link"
                style="color: red"
                title="删除动作"><a-icon type="close-circle"/></a-button>
     </span>
  </div>
</template>

<script>
  export default {
    name: "ActionBar",
    props: {
      isLastOne: Boolean,
      label: String,
      doItems: Array,
      doItem: Object,
      doItemIndex: Number
    },
    methods: {
      addCallback() {
        // if (this.doItem.then === undefined) {
        //   this.doItem.then = []
        // }
        this.doItem.then.push({handler: '', fn: '', params: {}, then: []})
        // this.doItems.push({handler: '', fn: '', params: {}})
        console.log('doItems>', this.doItems, this.doItem)
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

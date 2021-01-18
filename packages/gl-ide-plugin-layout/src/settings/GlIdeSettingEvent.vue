<template>
  <div :style="style">
    <div style=" padding:0.5em">
      <a-row :gutter="8">
        <a-col :span="11">
          <div class="line">
            <div slot="title">
              <span @click="log()">对控件&nbsp;&nbsp;</span>
              <span style="background-color: #ffca11">{{currentControl.title}}</span>
              <span>&nbsp;&nbsp;进行设置。</span>
              <a-button type="link" title="添加场景" @click="addCase()" style="float: right">
                <a-icon type="plus-circle"/>
                场景
              </a-button>
            </div>
            <div class="line" v-for="(action,actionIndex) in currentActions" :key="actionIndex">
              <div>
                <span>当&nbsp;&nbsp;</span>
                <span>
                  <a-select v-model="action.on" style="width: 200px"
                            @change="handleChange($event,action,actionIndex)">
                    <a-select-opt-group label="鼠标">
                       <a-select-option value="click">单击</a-select-option>
                      <a-select-option value="dbclick">双击</a-select-option>
                      <a-select-option value="click.right">鼠标右击</a-select-option>
                    </a-select-opt-group>
                    <a-select-opt-group label="值">
                       <a-select-option value="change">值变化</a-select-option>
                    </a-select-opt-group>
                    <a-select-opt-group label="键盘">
                      <a-select-option value="keyup.enter">按键按下[enter]时</a-select-option>
                      <a-select-option value="keyup.esc">按键按下[esc]时</a-select-option>
                    </a-select-opt-group>
                     <a-select-opt-group label="外观">
                       <a-select-option value="mounted">载入时</a-select-option>
                       <a-select-option value="show">显示时</a-select-option>
                       <a-select-option value="hide">隐藏时</a-select-option>
                    </a-select-opt-group>
                  </a-select>
                </span>
                <span>&nbsp;&nbsp;且满足</span><a @click="onSetCondition">条件<span>（未设置）</span></a><span>时</span>
                <span style="float: right">
                  <a-button type="link" title="删除场景" class="remove" style="color: red"
                            @click="removeCase(actionIndex)"><a-icon
                      type="close-circle"/>场景</a-button>
                  <a-button type="link" title="触发动作" @click="action.do.push({handler:'',fn:'',params:{}})"><a-icon
                      type="plus-circle"/>动作</a-button>
                </span>
              </div>
              <div class="line event-action" v-for="(doItem,doItemIndex) in action.do"
                   :key="actionIndex+'_'+doItemIndex">
                <action-bar label="触发动作" :doItems="action.do" :doItem="doItem" :doItemIndex="doItemIndex"
                            @doActionSetting="doActionSetting" @doActionRemoved="doActionRemoved"
                            @doActionChange="doActionChange" @doActionAdded="doActionAdded"
                            @setCondition="onSetCondition"></action-bar>
                <div class="line" v-if="doItem.then" v-for="(thenItem,thenItemIndex) in doItem.then"
                     :key="actionIndex+'_'+doItemIndex+'_'+thenItemIndex">
                  <action-bar label="回调动作" :isLastOne="true" :doItems="doItem.then" :doItem="thenItem"
                              :doItemIndex="thenItemIndex"
                              @doActionSetting="doActionSetting" @doActionRemoved="doActionRemoved"
                              @doActionChange="doActionChange"></action-bar>
                </div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :span="13">
          <a-card title="条件设置" :bordered="false" v-if="currentEditingType==='condition'"
                  class="gl-condition-container">
            <script-block></script-block>
          </a-card>
          <a-card title="动作设置" :bordered="false" v-if="currentEditingType==='control'">
            <p>
              <component :is="currentDetailComponentName" v-bind="currentDoItem"
                         :designComponentName="currentComponent.meta.componentName"
                         :objectTree="ideStore.editingFile.objectTree"
                         @update="(params)=>currentDoItem.params = params"></component>
            </p>
          </a-card>
        </a-col>
      </a-row>
    </div>


  </div>
</template>

<script>
  import ActionBar from './ActionBar'
  import ScriptBlock from './event-handler-setings/ScriptBlock'
  import SetVars from './event-handler-setings/SetVars'
  import OpenModal from './event-handler-setings/OpenModal'
  import InvokeCurrentComponent from './event-handler-setings/InvokeCurrentComponent'
  import InvokeComponent from './event-handler-setings/InvokeComponent'
  import InvokeRestfulSrv from './event-handler-setings/InvokeRestfulSrv'
  import ShowMessage from './event-handler-setings/ShowMessage'
  import ShowNotification from './event-handler-setings/ShowNotification'
  import ShowAndHide from './event-handler-setings/ShowAndHide'
  import ReadAndWrite from './event-handler-setings/ReadAndWrite'
  import Empty from './event-handler-setings/Empty'

  let localComponents = {
    ActionBar,
    SetVars,
    ScriptBlock,
    OpenModal,
    ShowMessage,
    ShowNotification,
    ShowAndHide,
    ReadAndWrite,
    InvokeCurrentComponent,
    InvokeComponent,
    InvokeRestfulSrv,
    Empty
  }

  export default {
    name: "GlIdeSettingEvent",
    components: localComponents,
    props: {
      ideStore: {
        type: Object,
        required: true
      },
      currentComponent: {
        type: Object,
        default() {
          return {
            meta: {
              component: ""
            }
          }
        }
      },
      currentControl: {
        type: Object,
        default() {
          return {
            gid: '',
            title: '',
            component: ''
          }
        }
      },
      currentActions: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        // 当前选中操作的参数
        params: {},
        currentDoItem: {},
        currentDoItemIndex: -1,
        currentDetailComponentName: 'Empty',
        style: {'min-height': (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * .80 + 'px'},
        currentCondition: {},
        // control/condition/page
        currentEditingType: 'control'
      }
    },
    methods: {
      // scene
      addCase() {
        this.currentActions.push({
          on: '',
          if: '',
          do: [],
          ctx: 'this'
        })
      },
      removeCase(actionIndex) {
        this.currentActions.splice(actionIndex, 1)
      },
      handleChange(e, action, actionIndex) {
        console.log(e, action, actionIndex)
      },
      doActionChange($event, doItem, actionIndex) {
        console.log('gl-ide-plugin-layout > GlIdeSettingEvent > doActionChange() >  $event, doItem, actionIndex:', $event, doItem, actionIndex)
        doItem.handler = $event
        this.doActionSetting($event, doItem, actionIndex)
      },
      doActionSetting($event, doItem, doItemIndex) {
        this.currentEditingType = 'control'
        let that = this
        console.log('GlIdeSettingEvent > doActionSetting >', $event, doItem, doItemIndex)
        this.currentDoItem = doItem
        this.currentDoItemIndex = doItemIndex
        this.currentDetailComponentName = 'Empty'
        this.$nextTick(() => {
          that.currentDetailComponentName = that.hasDetailComponent($event) ? $event : 'Empty'
        })
      },
      doActionAdded($event, doItems, index) {
        this.$nextTick()
      },
      doActionRemoved($event, doItems, index) {
        console.log($event, doItems, index)
        console.log(this.currentDoItemIndex, doItems, index)
        if (index === this.currentDoItemIndex) {
          this.currentDoItemIndex = -1
          this.currentDoItem = {}
          this.currentDetailComponentName = 'Empty'
        }
        doItems.splice(index, 1)
        this.$nextTick()
      },
      onSetCondition(item) {
        console.log('gl-ide-plugin-layout > GlIdeSettingEvent > onSetCondition() > item:', item)

        this.currentEditingType = 'condition'
      },
      hasDetailComponent(name) {
        return !!localComponents[name]
      },
      showDetail() {
      },
      log() {
        console.log('log>', this)
      }
    }
  }
</script>

<style scoped>

  .line {
    padding: 0.25em 1em 0.25em 1em;
    line-height: 30px;
    background-color: rgba(114, 218, 255, 0.2);
  }

  .remove {
    display: none;
  }

  .event-action:hover .remove, .line:hover .remove {
    display: inline-block;
  }

  .ant-btn.ant-btn-link {
    padding: 0;
    margin: 0 5px;
  }

  .gl-condition-container .ant-card-body {
    padding: 0;
    border-left: 2px solid #F2F2F2;
  }
</style>

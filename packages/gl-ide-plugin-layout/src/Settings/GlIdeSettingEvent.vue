<template>
  <div :style="style">
    <div style=" padding:1em">
      <a-row :gutter="8">
        <a-col :span="12">
          <div class="line">
            <div slot="title">
              <span>对控件&nbsp;&nbsp;</span>
              <span style="background-color: #ffca11">{{currentControl.title}}</span>
              <span>&nbsp;&nbsp;进行设置。</span>
            </div>
            <div class="line" v-for="(action,actionIndex) in currentActions" :key="actionIndex">
              <div>
                <span>当&nbsp;&nbsp;</span>
                <span>
                  <a-select :defaultValue="action.on" style="width: 200px"
                            @change="handleChange($event,action,actionIndex)">
                    <a-select-opt-group label="鼠标">
                       <a-select-option value="click">单击</a-select-option>
                      <a-select-option value="dbclick">双击</a-select-option>
                      <a-select-option value="click.right">鼠标右击</a-select-option>
                    </a-select-opt-group>
                    <a-select-opt-group label="键盘">
                      <a-select-option value="keyup.enter">按键按下[enter]时</a-select-option>
                      <a-select-option value="keyup.esc">按键按下[esc]时</a-select-option>
                    </a-select-opt-group>
                     <a-select-opt-group label="外观">
                      <a-select-option value="show">显示时</a-select-option>
                      <a-select-option value="hide">隐藏时</a-select-option>
                    </a-select-opt-group>
                  </a-select>
                </span>
                <span>&nbsp;&nbsp;时</span>
                <span @click="action.do.push({handler:'',fn:'',params:{}})">
                  <a-button type="link" title="触发动作"><a-icon type="plus-circle"/></a-button>
                </span>
              </div>
              <div class="line event-action" v-for="(doItem,doItemIndex) in action.do"
                   :key="actionIndex+'_'+doItemIndex">
                <action-bar label="触发动作" :doItems="action.do" :doItem="doItem" :doItemIndex="doItemIndex"
                            @doActionSetting="doActionSetting" @doActionRemove="doActionRemove"
                            @doActionChange="doActionChange"></action-bar>
                <div class="line" v-if="doItem.then" v-for="(thenItem,thenItemIndex) in doItem.then"
                     :key="actionIndex+'_'+doItemIndex+'_'+thenItemIndex">
                  <action-bar label="回调动作" :doItems="doItem.then" :doItem="thenItem" :doItemIndex="thenItemIndex"
                              @doActionSetting="doActionSetting" @doActionRemove="doActionRemove"
                              @doActionChange="doActionChange"></action-bar>
                </div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <a-card title="动作详细设置" :bordered="false">
            <p>
              <component :is="currentDetailComponentName" v-bind="currentDoItem"
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
  import OpenModal from './event-detail/OpenModal'
  import ShowMessage from './event-detail/ShowMessage'
  import Empty from './event-detail/Empty'

  let localComponents = {ActionBar, OpenModal, ShowMessage, Empty}

  export default {
    name: "GlIdeSettingEvent",
    components: localComponents,
    props: {
      ideStore: {
        type: Object,
        required: true
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
      }
    },
    methods: {
      handleChange(e, action, actionIndex) {
        console.log(e, action, actionIndex)
      },
      doActionChange($event, doItem, actionIndex) {
        console.log('doActionChange>', $event, doItem, actionIndex)
        doItem.handler = $event
        this.doActionSetting($event, doItem, actionIndex)
      },
      doActionSetting($event, doItem, doItemIndex) {
        let that = this
        console.log($event, doItem, doItemIndex)
        this.currentDoItem = doItem
        this.currentDoItemIndex = doItemIndex
        this.currentDetailComponentName = 'Empty'
        this.$nextTick(() => {
          that.currentDetailComponentName = that.hasDetailComponent($event) ? $event : 'Empty'
        })
      },
      doActionRemove($event, doItems, index) {
        console.log($event, doItems, index)
        console.log(this.currentDoItemIndex, doItems, index)
        if (index === this.currentDoItemIndex) {
          this.currentDoItemIndex = -1
          this.currentDoItem = {}
          this.currentDetailComponentName = 'Empty'
        }
        doItems.splice(index, 1)
        // this.$gl.utils.remove(doItems, index)
      },
      hasDetailComponent(name) {
        return !!localComponents[name]
      },
      showDetail() {
      }
    }
  }
</script>

<style scoped>

  .line {
    padding: 0.25em 2em 0.25em 2em;
    line-height: 30px;
    background-color: rgba(114, 218, 255, 0.2);
  }

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

  /*.line + .line {*/
  /*padding: 0.5em 2em 0em 2em*/
  /*}*/
</style>

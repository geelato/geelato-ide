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
            <div class="line" v-for="(action,actionIndex) in actions" :key="actionIndex">
              <div>
                <span>当&nbsp;&nbsp;</span>
                <span>
                  <a-select :defaultValue="action.trigger" style="width: 200px"
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
                <span @click="action.do.push({fn:''})">
                  <a-button type="link"><a-icon type="plus-circle"/>触发动作</a-button>
                </span>
              </div>
              <div class="line trigger-action" v-for="(fnItem,fnIndex) in action.do" :key="actionIndex+'_'+fnIndex">
                <div>
                  <span>触发动作&nbsp;&nbsp;</span>
                  <span>
                    <a-select :defaultValue="fnItem.fn" style="width: 200px" @change="handleChange" :allowClear="true">
                      <a-select-opt-group label="链接动作">
                         <a-select-option value="OpenModal">弹出窗口（modal）</a-select-option>
                        <a-select-option value="closeModal">关闭窗口（modal）</a-select-option>
                        <a-select-option value="openWin">打开新窗口（window）</a-select-option>
                      </a-select-opt-group>
                      <a-select-opt-group label="控件动作">
                        <a-select-option value="keyup.enter">调用当前控件方法</a-select-option>
                        <a-select-option value="keyup.esc">显示/隐藏</a-select-option>
                      </a-select-opt-group>
                       <a-select-opt-group label="其它动作">
                        <a-select-option value="setVars">设置变量值</a-select-option>
                        <a-select-option value="triggerEvent">触发事件</a-select-option>
                      </a-select-opt-group>
                    </a-select>
                  </span>
                  <span @click="action.do.push({fn:''})">
                    <a-button type="link"><a-icon type="plus-circle"/>触发动作</a-button>
                   </span>
                  <span @click="action.do.splice(fnIndex,1)" class="remove">{{fnIndex}}
                    <a-button type="link" style="color: red"><a-icon type="close-circle"/>删除动作</a-button>
                  </span>
                </div>
                <div class="line" @mouseover="showDetail('aaa')">
                  <template>
                    <span>完毕回调&nbsp;&nbsp;</span>
                    <span>
                      <a-select defaultValue="OpenModal" style="width: 200px" @change="handleChange">
                        <a-select-opt-group label="链接动作">
                        <a-select-option value="empty">请选择</a-select-option>
                        </a-select-opt-group>
                        <a-select-opt-group label="链接动作">
                           <a-select-option value="OpenModal">弹出窗口（modal）</a-select-option>
                          <a-select-option value="closeModal">关闭窗口（modal）</a-select-option>
                          <a-select-option value="openWin">打开新窗口（window）</a-select-option>
                        </a-select-opt-group>
                        <a-select-opt-group label="控件动作">
                          <a-select-option value="keyup.enter">调用当前控件方法</a-select-option>
                          <a-select-option value="keyup.esc">显示/隐藏</a-select-option>
                        </a-select-opt-group>
                         <a-select-opt-group label="其它动作">
                          <a-select-option value="setVars">设置变量值</a-select-option>
                          <a-select-option value="triggerEvent">触发事件</a-select-option>
                        </a-select-opt-group>
                      </a-select>
                    </span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <a-card title="动作详细设置" :bordered="false">
            <p>
              <open-modal></open-modal>
            </p>
          </a-card>
        </a-col>
      </a-row>
    </div>


  </div>
</template>

<script>
  import OpenModal from './event-detail/OpenModal'

  export default {
    name: "GlIdeSettingEvent",
    components: {OpenModal},
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
      }
    },
    data() {
      return {
        actions: [{
          trigger: 'click',
          if: '',
          do: [
            {
              fn: 'OpenModal', params: {},
              dataMapping: {
                query: {tableSchema: '$ctx.code'}
              },
              actions: [{trigger: 'callback', do: [{fn: 'ShowMessage'}]}]
            }
          ],
          ctx: 'this',
          // opener、content、modal、handler，默认为handler

          params: {
            title: '编辑数据库连接信息',
            width: '1200px',
            height: '480px',
            body: {
              type: 'staticPage',
              component: 'GlForm',
              props: {},
            },
            actions: [{
              text: '保存',
              type: 'primary',
              fn: 'save',
              // opener、content、modal，默认为content
              ctx: 'content',
              params: {},
              then: {
                fn: 'close',
                ctx: 'modal',
                then: {
                  fn: 'refresh',
                  ctx: 'opener'
                }
              }
            }, {
              fn: 'close',
              text: '取消',
              ctx: 'modal'
            }]
          },
          // 输入数据的转换

        }],
        style: {'min-height': (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * .80 + 'px'},
      }
    },
    methods: {
      handleChange(e, action, actionIndex) {
        console.log(e, action, actionIndex)
      },
      showDetail(a) {
        console.log(a)
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

  .trigger-action:hover .remove {
    display: inline-block;
  }

  /*.line + .line {*/
  /*padding: 0.5em 2em 0em 2em*/
  /*}*/
</style>

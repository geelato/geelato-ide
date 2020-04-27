<template>
  <div class="gl-ide-plugin-form-designer" style="width:100%;min-height: 500px">
    <a-row>
      <a-col :span="4" style="border-right: 1px solid #F2F2F2;padding: 0.5em">
        <template v-for="blockGroup in blockGroups">
          <div>
            <span>{{blockGroup.title}}</span>
            <gl-draggable
                v-model="blockGroup.blocks"
                handle=".gl-dnd-block-handle"
                :group="{ name: 'blockItems', pull: 'clone', put: false }"
                ghost-class="ghost"
                :sort="false"
                @change="onChange"
                @choose="onChoose"
                :clone="clone"
            >
              <div class="gl-block-item gl-dnd-block-handle" :class="blockGroup.name"
                   v-for="block in blockGroup.blocks">
                {{block.title}}
              </div>
            </gl-draggable>
          </div>
        </template>
      </a-col>
      <a-col :span="20" style="border-right: 1px solid #F2F2F2;padding: 0.5em">
        <a-tabs @change="(key)=>{scriptText=getScriptText()}">
          <a-tab-pane key="1">
            <span slot="tab">
              <a-icon type="profile"/>
              设计
            </span>
            <div style="width: 100%;padding-right: 3em;line-height: 2em;min-height:38em;background-color: #ececec">
              <gl-draggable
                  :list="blockItems"
                  animation="700"
                  handle=".gl-dnd-block-handle"
                  group='blockItems'
                  :sort="true"
                  @add="onBlockAdd"
                  @end="onBlockEnd"
                  @clone="onBlockClone"
                  @change="onBlockChange"
                  style="min-height: 38em"
              >
                <div class="gl-dnd-block-handle" v-for="(block,blockIndex) in blockItems">
                  <a-icon type="close-square" theme="twoTone" twoToneColor="#d3000a" class="gl-dnd-block-handle-close"
                          title="删除" @click="blockItems.splice(blockIndex,1)"></a-icon>
                  <component :ref="'_'+block.name+'_'+blockIndex" :is="block.name"
                             :blockItems="block.items"></component>
                </div>
              </gl-draggable>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2">
          <span slot="tab">
            <a-icon type="profile"/>
            脚本
          </span>
            <div>
              {{scriptText}}
            </div>
          </a-tab-pane>
        </a-tabs>

      </a-col>
    </a-row>
  </div>
</template>

<script>
  import mixin from '../../../../mixin-designer'
  import ARow from "ant-design-vue/es/grid/Row";

  export default {
    name: "GlIdePluginFormDesignerLogicAndRuleSettings",
    components: {ARow},
    mixins: [mixin],
    props: {
      opts: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        blockGroups: [
          {
            name: 'logic', title: '逻辑', blocks: [
              {name: 'GlIfBlock', title: '如果', color: ''},
              {name: 'GlForBlock', title: '循环', color: ''}
            ]
          }, {
            name: 'expression', title: '表达式', blocks: [
              {name: 'GlConditionBlock', title: '条件', type: 'expression', color: ''},
              {name: 'GlSetValueBlock', title: '设值', type: 'expression', color: ''}
            ]
          }],
        chooseIndex: 0,
        blockItems: [],
        scriptText: ''
      }
    },
    created() {
    },
    updated() {
      // this.$refs.glBlockBarLink.style.height = (this.$refs.glBlockMain.offsetHeight) + 'px'
    },
    methods: {
      onChange() {
      },
      onChoose(e) {
        console.log('gl-ide-plugin-layout > sidebar > onChoose: ', e)
        this.chooseIndex = e.oldIndex
      },
      clone(block) {
        let blockItem = {items: []}
        Object.assign(blockItem, block)
        return JSON.parse(JSON.stringify(blockItem))
      },
      onBlockAdd(e) {
        console.log(this.getScriptText())
      },
      onBlockEnd(e) {
      },
      onBlockChange(e) {
      },
      onBlockClone(e) {
      },
      getScriptText() {
        let scriptText = ''
        // for (let key in this.$refs) {
        //   console.log('key:', key, key.startsWith('_'), this.$refs, this.$refs[key])
        //   if (key.startsWith('_')) {
        //     if (this.$refs[key].length !== undefined) {
        //       if (this.$refs[key].length > 0) {
        //         scriptText += this.$refs[key][0].getScriptText()
        //       }
        //     } else {
        //       scriptText += this.$refs[key].getScriptText()
        //     }
        //   }
        // }
        for (let index in this.blockItems) {
          let block = this.blockItems[index]
          let ref = this.$refs['_' + block.name + '_' + index]
          if (ref.length) {
            console.log('getSubScriptText > ref:', ref)
            scriptText += ref[0].getScriptText()
          } else {
            console.warn('getSubScriptText > ref:', ref)
          }
        }
        // console.log('getScriptText:', scriptText)
        return scriptText
      }
    }
  }
</script>

<style>
  .gl-dnd-block-handle {
    cursor: pointer;
    /*margin-top: 1px;*/
  }

  .gl-dnd-block-handle-close {
    position: absolute;
    font-size: 1.4em;
    /*top: 0.5em;*/
    /*left: 0.5em;*/
    display: none;
    /*float: left;*/
  }

  .gl-dnd-block-handle:hover .gl-dnd-block-handle-close {
    display: inline-block;
    /*float: right;*/
  }

  .gl-block-item {
    font-weight: bold;
    min-height: 3em;
    min-width: 4em;
    line-height: 4em;
    width: 48%;
    text-align: center;
    background-color: #e0e0e0;
    margin: 2px;
    display: inline-block;
  }

  /*.gl-condition:before {*/
  /*content: "";*/
  /*width: 0;*/
  /*height: 0;*/
  /*position: relative;*/
  /*!*top: 0;*!*/
  /*!*float: left;*!*/
  /*right: -1em;*/
  /*border-top: 1.2em solid transparent;*/
  /*border-bottom: 1.2em solid transparent;*/
  /*border-left: none;*/
  /*border-right: 1.5em #91d5ff solid;*/
  /*}*/

  /*.gl-condition:after {*/
  /*content: "";*/
  /*width: 0;*/
  /*height: 0;*/
  /*position: relative;*/
  /*!*top: 0;*!*/
  /*float: right;*/
  /*right: -2em;*/
  /*border-top: 1.2em solid transparent;*/
  /*border-bottom: 1.2em solid transparent;*/
  /*border-right: none;*/
  /*border-left: 1.5em #fff6c4 solid;*/
  /*}*/

  .gl-block-item:hover {
    border: solid 1px dodgerblue;
  }

  .gl-block-logic .gl-block-bar-link, .gl-block-logic .gl-block-bar-start, .gl-block-logic .gl-block-bar-end, .gl-block-item.logic {
    background-color: #ffc40d;
    padding: 0.2em;
  }

  .gl-block-bar-start {
    margin-top: 1px;
  }

  .gl-block-bar-start > .gl-block-title, .gl-block-bar-expression > .gl-block-title {
    font-weight: bold;
    margin: 0 0.5em 0 1.4em
  }

  .gl-block-main {
    padding: 0;
    margin: 0;
    /*line-height: 1em;*/
    border-left: 7px solid #ffc40d;
  }

  .gl-block-content, .gl-block-bar-link {
    display: inline-block;
  }

  .gl-block-content {
    border-radius: 0 10px 10px 0;
    min-height: 3em;
    min-width: 10em;
    background-color: #e0e0e0;
    vertical-align: top;
    margin: 0;
    padding: 0.2em;
  }

  .gl-block-bar-link {
    min-height: 3em;
    min-width: 1em
  }

  .gl-block-bar-start {
    border-radius: 0 10px 10px 0;
    min-height: 2.4em;
    min-width: 10em
  }

  .gl-block-bar-end {
    border-radius: 0 10px 10px 0;
    min-height: 2em;
    min-width: 8em
  }

  .gl-block-bar-expression {
    display: inline-block;
    background-color: #fff6c4;
    border-radius: 10px;
    min-height: 2em;
    min-width: 10em;
    padding: 0.2em 0.5em;
    margin: 0.2em;
  }

  .gl-block-bar-expression.gl-condition {
    border-radius: 6px;
    /*position: relative;*/
  }

  .gl-block-item.expression {
    background-color: #fff6c4;
  }
</style>

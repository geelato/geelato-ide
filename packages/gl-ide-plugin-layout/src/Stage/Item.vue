<template>
  <div>
    <gl-draggable
        :list="rowItems"
        handle=".gl-dnd-row-handle"
        group='layoutItems'
        :sort="true"
        @add="onRowAdd"
        @end="onEnd"
        @clone="onClone"
        @change="onRowChange"
    >
      <a-row v-for="(row,rowIndex) in rowItems" :gutter="row.gutter||gutter" :key="rowIndex" class="gl-dnd-row-handle">
        <a-col v-for="(col,colIndex) in row.cols" :span="col.span" :offset="col.offset" :key="colIndex" style="">
          <template v-if="col.card">
            <a-card :title="getCardConfig(col.card).title" style="margin-top: 8px">
              <component :ref="col.card" :is="getCardComponent(col.card)"
                         :opts="getCardConfig(col.card).opts"
                         :query="getCardConfig(col.card).query">
                正在加载...
              </component>
            </a-card>
          </template>
          <template v-else-if="col.rows">
            <GlIdePluginLayoutStageItem :rows="col.rows" :cardMap="cardMap"></GlIdePluginLayoutStageItem>
          </template>
          <template v-else>
            <gl-draggable
                :list="col.items"
                handle=".gl-dnd-col-handle"
                group='card'
                :sort="false"
                @add="onAddCol"
                @change="onColChange"
                @choose="onColChoose"
                class="gl-dnd-col-wrapper"
            >
              <div v-for="(colItem,colItemIndex) in col.items" :key="colItem.id" class="gl-dnd-col-handle">
                <div class="gl-dnd-col-toolbar">
                  <div style="text-align: left;display:inline" title="拖动卡片">
                    <a-icon :type="colItem.icon"/>
                    {{colItem.title}}
                  </div>&nbsp;
                  <div style="display:inline-block;float: right">
                    <a-button size="small" @click="onCardOpen(col,colItem,colItemIndex)"
                              title="设置"
                              style="background-color: #d8d8d8">
                      <a-icon type="setting" theme="filled"/>
                    </a-button>
                    <a-button size="small" v-if="colItem.show!==false" @click="colItem.show=false" title="隐藏"
                              style="background-color: #d8d8d8">
                      <a-icon type="eye-invisible"/>
                    </a-button>
                    <a-button size="small" v-if="colItem.show===false" @click="colItem.show=true" title="展示"
                              style="background-color: #d8d8d8">
                      <a-icon type="eye"/>
                    </a-button>
                    <a-button size="small" @click="onColDelete(col,colItem,colItemIndex)" type="danger"
                              title="删除" style="background-color: #d8d8d8">
                      <a-icon type="delete"></a-icon>
                    </a-button>
                  </div>
                </div>
                <!--class="gl-dnd-col-handle"-->
                <component v-show="colItem.show" :is="$globalVue.component(colItem.component)"
                           v-bind="colItem.bind"></component>
              </div>
            </gl-draggable>
          </template>
        </a-col>
        <div class="gl-dnd-row-toolbar" @click="removeRow(rowIndex)" title="删除行">
          <a-icon type="close-circle" theme="twoTone" twoToneColor="#f5222d"/>
        </div>
      </a-row>
    </gl-draggable>
  </div>
</template>

<script>
  import Vue from 'vue'
  import events from '../events'

  export default {
    name: "GlIdePluginLayoutStageItem",
    props: {
      cardMap: {
        type: Object,
        required: true
      },
      rows: {
        type: Array,
        default() {
          return []
        }
      },
      gutter: {
        type: Number,
        default() {
          return 8
        }
      }
    },
    data() {
      return {
        rowItems: this.rows,
        colItems: [],
        // {id:component}
        colCards: {},
      }
    },
    computed: {},
    methods: {
      getCardConfig(cardId) {
        return this.cardMap[cardId]
      },
      getCardComponent(cardId) {
        let card = this.getCardConfig(cardId)
        return Vue.component(card.type)
      },
      onEnd: function (e) {
        console.log('gl-ide-plugin-layout > stage > onEnd: ', e)
      },
      onRowAdd: function (e) {
        console.log('gl-ide-plugin-layout > stage > onRowAdd: ', e)
      },
      removeRow(rowIndex) {
        let that = this
        this.$confirm({
          title: '是否删除该行?',
          cancelText: '是',
          okText: '否',
          content: '',
          onOk() {
          },
          onCancel() {
            that.rowItems.splice(rowIndex, 1)
          },
        });
      },
      onRowChange(e) {
        console.log('gl-ide-plugin-layout > stage > onRowChange: ', e)
      },
      onClone(e) {
        console.log('gl-ide-plugin-layout > stage > onClone: ', e)
      },
      onAddCol: function (e) {
        console.log('gl-ide-plugin-layout > stage > onAddCol: ', e)
      },
      onColChange(e) {
        console.log('gl-ide-plugin-layout > stage > onColChange: ', e)
      },
      onColChoose(e) {
        console.log('gl-ide-plugin-layout > stage > onColChoose: ', e)
      },
      onCardOpen(col, item, index) {
        if (typeof item.onOpen === 'function') {
          item.onOpen({item: item, col: col, index: index})
        }
        this.$gl.bus.$emit(events.card_open, {col: col, item: item, index: index})
        console.log('gl-ide-plugin-layout > stage > onCardOpen: ', col, item, index)
      },
      onColDelete(col, item, index) {
        console.log('gl-ide-plugin-layout > stage > onColDelete: ', col, item, index)
        this.$confirm({
          title: '是否删除该卡片内容?',
          cancelText: '是',
          okText: '否',
          content: '',
          onOk() {
          },
          onCancel() {
            col.items.splice(index, 1);
          },
        });
      }
    }
  }
</script>

<style>
  .gl-ide-layout-stage .gl-dnd-row-handle {
    border: 1px solid #f0f0f0;
    margin-bottom: 0.1em;
    cursor: move;
  }

  .gl-ide-layout-stage .gl-dnd-row-handle.sortable-chosen {
    background-color: rgb(107, 209, 255);
  }

  .gl-dnd-col-wrapper {
    min-height: 2em;
  }

  .gl-dnd-row-toolbar {
    position: absolute;
    right: -0.5em;
    display: none;
  }

  .gl-dnd-row-toolbar i {
    font-size: 1.5em;
    line-height: 1.5em;
    cursor: pointer;
  }

  .gl-dnd-row-handle:hover .gl-dnd-row-toolbar {
    display: inline-block;
  }

  .gl-dnd-col-toolbar {
    padding: 0 1em;
    line-height: 2em;
    height: 2em;
    background-color: #D8D8D8
  }

  /*.gl-ide-layout-stage .gl-dnd-row-handle > div {*/
  /*!*padding: 0 1px !important;*!*/
  /*}*/

  /*.gl-ide-layout-stage .gl-dnd-row-handle:hover > div > div {*/
  /*!*background-color: rgba(255, 202, 17, 0.7);*!*/
  /*}*/

  .gl-ide-layout-stage .gl-dnd-row-handle:hover{
    /*box-shadow: 0 0 1px #000 inset;*/
    box-shadow: 0 0 4px #ffca11;
  }

  .gl-ide-layout-stage .gl-dnd-row-handle > div > div {
    background-color: rgba(161, 222, 255, 0.35);
    /*text-align: center;*/
  }

  .gl-ide-layout-stage .gl-dnd-row-handle > div > div:hover {
    /*background-color: rgba(211, 211, 211, 0.3);*/
    background-color: rgba(255, 202, 17, 0.35);
    /*border: 1px dotted #a5a5a5;*/
  }


</style>

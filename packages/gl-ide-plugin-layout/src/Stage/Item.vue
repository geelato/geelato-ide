<template>
  <div>
    <gl-draggable
        :list="rowItems"
        handle=".gl-dnd-handle-row"
        group='layoutItems'
        :sort="true"
        @add="onRowAdd"
        @end="onEnd"
        @clone="onClone"
        @change="onRowChange"
    >
      <a-row v-for="(row,rowIndex) in rowItems" :gutter="row.gutter||gutter" :key="rowIndex" class="gl-dnd-handle-row">
        <a-col v-for="(col,colIndex) in row.cols" :span="col.span" :offset="col.offset" :key="colIndex">
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
            <gl-ide-layout-stage-item :rows="col.rows" :cardMap="cardMap"></gl-ide-layout-stage-item>
          </template>
          <template v-else>
            <gl-draggable
                :list="col.items"
                handle=".gl-dnd-handle-col"
                group='card'
                :sort="false"
                @add="onAddCol"
                @change="onColChange"
            >
              <div style="min-height: 2em">
                <div v-for="(colItem,colItemIndex) in col.items" :key="colItem.id">
                  <div style="padding: 0 1em;line-height: 2em;height: 2em;background-color: #d8d8d8">
                    <div style="text-align: left;display:inline" class="gl-dnd-handle-col" title="拖动卡片">
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
                        <a-icon type="eye-invisible" />
                      </a-button>
                      <a-button size="small" v-if="colItem.show===false" @click="colItem.show=true" title="展示"
                                style="background-color: #d8d8d8">
                        <a-icon type="eye" />
                      </a-button>
                      <a-button size="small" @click="onColDelete(col,colItem,colItemIndex)" type="danger"
                                title="删除" style="background-color: #d8d8d8">
                        <a-icon type="delete"></a-icon>
                      </a-button>
                    </div>
                  </div>
                  <component v-show="colItem.show" :is="$globalVue.component(colItem.component)"
                             v-bind="colItem.bind" class="gl-dnd-handle-col"></component>
                </div>
              </div>
            </gl-draggable>
          </template>
        </a-col>
      </a-row>
    </gl-draggable>
  </div>
</template>

<script>
  import Vue from 'vue'
  import events from '../events'
  import utils from '../../../utils'

  export default {
    name: "gl-ide-layout-stage-item",
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
      onRowChange(e) {
        if (e.added && e.added.element) {
          // for (let i in e.added.element.cols) {
          //   let col = e.added.element.cols[i]
          //   // col.id = utils.uuid(16)
          //   col.items = []
          // }
          // e.added.element.title = 'sss'
        }
        console.log('gl-ide-plugin-layout > stage > onRowChange: ', e)
      },
      onClone(e) {
        console.log('gl-ide-plugin-layout > stage > onClone: ', e)
      },
      onAddCol: function (e) {
        console.log('gl-ide-plugin-layout > stage > onAddCol: ', e)
      },
      onColChange(e) {
        if (e.added && e.added.element) {
          // console.log('component> ', this.G.component('a-card'))
          // e.added.element.card = Vue.component(e.added.element.component)
          // e.added.element.id = utils.uuid(8)
          // // e.added.element.title = ''
        }
        console.log('gl-ide-plugin-layout > stage > onColChange: ', e)
      },
      onCardOpen(col, item, index) {
        if (typeof item.onOpen === 'function') {
          item.onOpen({item: item, col: col, index: index})
        }
        this.$bus.$emit(events.card_open, {col: col, item: item, index: index})
        console.log('gl-ide-plugin-layout > stage > onCardOpen: ', col, item, index)
      },
      onColDelete(col, item, index) {
        console.log('gl-ide-plugin-layout > stage > onColDelete: ', col, item, index)
        this.$confirm({
          title: '是否删除该卡片内容?',
          cancelText: '否',
          okText: '是',
          content: '',
          onOk() {
            col.items.splice(index, 1);
            // return new Promise((resolve, reject) => {
            //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            // }).catch(() => console.log('Oops errors!'));
          },
          onCancel() {
          },
        });
      }
    }
  }
</script>

<style>
  .gl-ide-layout-stage .ant-row {
    border: 1px solid #f0f0f0;
    margin-bottom: 0.1em;
    cursor: move;
  }

  .gl-ide-layout-stage .ant-row > div {
    /*padding: 0 1px !important;*/
  }

  .gl-ide-layout-stage .ant-row:hover > div > div {
    background-color: rgba(255, 202, 17, 0.7);
  }

  .gl-ide-layout-stage .ant-row > div > div:hover {
    background-color: rgba(255, 158, 11, 0.7);
  }

  .gl-ide-layout-stage .ant-row > div > div {
    background-color: rgba(161, 222, 255, 0.35);
    /*text-align: center;*/
  }

  /*.gl-ide-layout-stage .gl-card-header {*/
  /*line-height: 2em;*/
  /*height: 2em;*/
  /*width: 100%;*/
  /*background-color: silver;*/
  /*padding: 0 2em;*/
  /*text-align: right;*/
  /*}*/

</style>

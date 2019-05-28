<template>
  <div>
    <gl-draggable
        v-model="rowItems"
        handle=".gl-dnd-handle"
        group='layoutItems'
        ghost-class="ghost"
        :sort='true'
        @add="onRowAdd"
        @end="onEnd"
        @clone="onClone"
        @change="onRowChange"
    >
      <a-row v-for="(row,rowIndex) in rowItems" :gutter="row.gutter||gutter" :key="rowIndex">
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
                v-model="col.items"
                handle=".gl-dnd-handle"
                group='card'
                ghost-class="ghost"
                :sort="false"
                @add="onAddCol"
                @change="onColChange"
            >
              <div style="min-height: 2em">
                <div v-for="(colItem,colItemIndex) in col.items" :key="colItemIndex">
                  <component :is="$globalVue.component(colItem.component)" v-bind="colItem.bind"></component>
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
    }
  }
</script>

<style>
  .gl-ide-layout-stage .ant-row {
    border: 1px solid #f0f0f0;
    margin-bottom: 0.5em;
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
    background-color: rgba(161, 222, 255, 0.7);
    text-align: center;
  }
</style>

<template>
  <div class="gl-ide-preview">
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
          <GlIdePluginLayoutStageItem :rows="col.rows" :componentRefs="componentRefs"></GlIdePluginLayoutStageItem>
        </template>
        <template v-else>
          <div v-for="(colItem,colItemIndex) in col.items" :key="colItem.id" class="gl-dnd-col-handle">
            <component :is="$globalVue.component(colItem.component)"
                       v-bind="colItem.bind"></component>
          </div>
        </template>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Vue from 'vue'
  import events from '../events'

  export default {
    name: "GlIdePluginLayoutStageItem",
    props: {
      componentRefs: {
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
        return this.componentRefs[cardId]
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
        console.log('gl-ide-plugin-layout > stage > onAddCol: ', e, this.componentRefs)
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
    background-color: #e5e5e5
  }

  .gl-dnd-col-toolbar button {
    background-color: #e5e5e5;
    border-color: #e5e5e5
  }

  /*.gl-ide-layout-stage .gl-dnd-row-handle > div {*/
  /*!*padding: 0 1px !important;*!*/
  /*}*/

  /*.gl-ide-layout-stage .gl-dnd-row-handle:hover > div > div {*/
  /*!*background-color: rgba(255, 202, 17, 0.7);*!*/
  /*}*/

  .gl-ide-layout-stage .gl-dnd-row-handle:hover {
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

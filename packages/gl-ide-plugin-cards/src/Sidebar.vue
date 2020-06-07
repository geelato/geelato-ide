<template>
  <div class="gl-cards">
    <a-alert message="选择并拖放到右边界面" type="info" closeText="关闭" class="gl-card-gutter"/>
    <gl-draggable :list="items" handle=".gl-dnd-handle" :group="{ name: 'card', pull: 'clone', put: false }"
                  :sort="false" :clone="customClone">
      <div class="gl-card gl-dnd-handle" v-for="(item,index) in items" :key="index">
        <div class="gl-card-header">
          {{item.title}}
        </div>
        <div class="gl-card-body">
          <a-icon :type="item.icon"/>
        </div>
      </div>
    </gl-draggable>
  </div>
</template>

<script>
  import cards from './data/cards.js'
  import utils from "../../../runtime/utils";
  import events from '../../gl-ide-plugin-layout/src/events'

  export default {
    name: "gl-ide-plugin-sidebar-cards",
    components: {},
    props: {},
    data() {
      return {
        items: cards.items
      }
    },
    created() {
      this.$gl.bus.$on(events.card_open, this.onCardOpen)

    },
    methods: {
      customClone(item) {
        let result = {
          id: utils.uuid(16)
        }
        Object.assign(result, item)
        return JSON.parse(JSON.stringify(result))
      }
    }
  }
</script>

<style scoped>
  .gl-cards .gl-card {
    width: 48% !important;
  }

  .gl-card {
    width: 100%;
    margin: 0.15em;
    display: inline-block;
    cursor: move;
    background-color: #f0f0f0;
    border: 1px solid #d1d1d1;
  }

  .gl-card-header {
    padding: 0 .8em;
    min-height: 2em;
    line-height: 2em;
    background-color: #e9e9e9;
    width: 100%;
  }

  .gl-card-body {
    padding: 0.5em 0.2em;
    width: 100%;
    text-align: center;
  }

  .gl-card:hover {
    background-color: rgb(255, 255, 255);
  }

  .gl-card-body i {
    font-size: 3em;
    color: #6b6b6b;
  }
</style>

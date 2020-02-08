<template>
  <div>
    <a-alert message="选择并拖放到右边界面" type="info" closeText="关闭" class="gl-card-gutter"/>
    <gl-draggable :list="items" handle=".gl-dnd-handle" :group="{ name: 'card', pull: 'clone', put: false }"
                  :sort="false" :clone="customClone">
      <div class="gl-dnd-handle" style="width: 100%;cursor: move" v-for="(item,index) in items" :key="index">
        <div class="gl-card-header">
          <a-icon :type="item.icon"/>
          {{item.title}}
        </div>
        <div class="gl-card-body"></div>
      </div>
    </gl-draggable>
  </div>
</template>

<script>
  import cards from './data/cards.js'
  import utils from "../../utils";
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
  .gl-card-header {
    padding: 0 0.5em;
    min-height: 2em;
    line-height: 2em;
    background-color: #e9e9e9;
    width: 100%;
    border: 1px solid #cacaca;
  }

  .gl-card-header:hover {
    background-color: rgb(107, 209, 255);
  }

  .gl-card-body {
    padding: 0.2em;
    width: 100%;
  }


</style>

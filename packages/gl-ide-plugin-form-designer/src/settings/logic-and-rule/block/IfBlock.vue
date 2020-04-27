<template>
  <div class="gl-block-logic">
    <div class="gl-block-bar-start"><span class="gl-block-title">如果</span>
      <gl-condition-block style="display: inline-block" ref="condition"></gl-condition-block>
    </div>
    <div ref="glBlockMain" class="gl-block-main">
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
          class="gl-block-content"
          ref="glBlockContent"
      >
        <div class="gl-dnd-block-handle" v-for="(block,blockIndex) in blockItems">
          <a-icon type="close-square" theme="twoTone" twoToneColor="#d3000a" class="gl-dnd-block-handle-close"
                  title="删除" @click="blockItems.splice(blockIndex,1)"></a-icon>
          <component :ref="'_'+block.name+'_'+blockIndex" :is="block.name" :blockItems="block.items"
                     @resize="resize"></component>
        </div>
      </gl-draggable>
    </div>
    <div class="gl-block-bar-end"></div>
  </div>
</template>

<script>
  import mixin from './mixin'

  export default {
    name: "GlIfBlock",
    mixins: [mixin],
    props: {
      // blockItems: {
      //   type: Array,
      //   required: true
      // }
    },
    data() {
      return {
      }
    },
    methods: {
      getScriptText() {
        let scriptText = ''
        scriptText = 'if('
        scriptText += this.$refs.condition.getScriptText()
        scriptText += '){'
        scriptText += this.getSubScriptText()
        scriptText += '};'
        return scriptText
      }
    }
  }
</script>

<style scoped>

</style>

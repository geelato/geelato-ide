<template>
  <div class="gl-ide-plugin-form-designer" style="width:100%">
    <a-row>
      <a-col :span="7" style="border-right: 1px solid #F2F2F2">
        <sidebar :size="size" :opts="opts"></sidebar>
      </a-col>
      <a-col :span="17" style="border-right: 1px solid #F2F2F2;padding: 2em 2em">
        <div style="width: 100%;padding-right: 3em;line-height: 2em">
          <stage></stage>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Sidebar from './Sidebar'
  import Stage from './Stage'
  import mixin from '../../../../mixin-designer'

  export default {
    name: "GlIdePluginFormDesignerLogicAndRuleSettings",
    components: {Sidebar,Stage},
    mixins: [mixin],
    props: {
      opts: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
      onFieldSelect(event) {
        console.log('event>', event)
      }
    }
  }
</script>

<style>
</style>

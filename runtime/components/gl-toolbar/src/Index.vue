<template>
  <div class="gl-toolbar">
    <template v-for="(item,itemIndex) in opts.items">
      <gl-control :ref="item.gid" :property="item" :form="form" :key="itemIndex"
                  :style="opts.controlStyle||defaultControlStyle"></gl-control>
    </template>
  </div>
</template>

<script>
  import glui from "geelato-ui-ant";

  export default {
    name: 'GlToolbar',
    mixins: [glui.mixin],
    props: {
      opts: {
        type: Object,
        default() {
          return {
            items: []
          }
        }
      },
      gid: {
        type: String,
        default() {
          return this.$gl.utils.uuid(8)
        }
      },
      params: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        controlRefs: {},
        defaultControlStyle: {
          'margin-left': '0.5em'
        },
        form: {}
      }
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style>
  .gl-toolbar > .gl-control {
    width: auto;
  }
</style>

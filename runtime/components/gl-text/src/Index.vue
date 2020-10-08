<template>
  <div class="gl-text" :contenteditable="editable" @blur="editable=false" @dblclick="editable=true" @keyup="onChange"
       @click="onClick" :style="style">
    {{initHtml}}
  </div>
</template>

<script>

  export default {
    name: 'GlText',
    props: {
      opts: {
        type: Object,
        default() {
          return {}
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
      },
      value: {
        type: [String, Number]
      }
    },
    data() {
      return {
        initHtml: this.opts.html || this.value,
        html: this.opts.html,
        editable: false,
        style: {
          'padding-left': '0px',
          'padding-right': '0px',
          'padding-top': '0px',
          'padding-bottom': '0px',
          'margin-left': '0px',
          'margin-right': '0px',
          'margin-top': '0px',
          'margin-bottom': '0px'
        }
      }
    },
    mounted() {
    },
    methods: {
      onChange(e) {
        this.html = e.srcElement.initHtml
        this.$emit('input', e.srcElement.innerHTML)
      },
      onClick(e) {
        console.log('click', e)
        this.$gl.bus.$emit('gl_ide_setting_open', {
          panelName: 'GlIdePluginLayoutSegmentSettings',
          config: {style: this.style}
        })
        // this.$gl.$bus.$eimt('gl-text.click', {type: 'gl-text'})
      }
    }
  }
</script>

<style>
</style>

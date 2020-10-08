<template>
  <div class="gl-segments">
    <gl-tag  :opts="opts"></gl-tag>
  </div>
</template>

<script>

  export default {
    name: 'GlSegment',
    components: {},
    props: {
      opts: {
        type: Object,
        default() {
          return {
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
      }
    },
    watch: {
    },
    created() {
      console.log('opts>',this.opts)

    },
    destroyed() {
    },
    mounted() {
    },
    methods: {
      log(e){

      }
    }
  }
</script>

<style>

  .gl-segments .gl-segment:nth-child(n+2){
    border-left: 0px;
  }
  .gl-segments .gl-segment:nth-child(n+4){
    /*border-top: 0px;*/
  }


  .gl-segment {
  }

  .gl-segment{
    border: 1px solid var(--gl-color-dashed);
    padding: 14px;
  }

  .gl-segment.gl-basic{
    border:0px
  }

  .gl-segment:hover{
    box-shadow: 0 0 4px var(--gl-color-dashed);
  }
  .gl-segment> .item,.gl-segment-item{
    cursor: default;
    display: inline-block;
    vertical-align:top;
  }
  .gl-segment> .item.title,.gl-segment-item.gl-title{
    font-size:1.3em;font-weight:500;line-height: 24px
  }

  .gl-segment> .item.description,.gl-segment-item.gl-description{
    color: rgba(0,0,0,.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .gl-segment-item.gl-time{
    font-size: 0.8em;
  }

  .gl-segment-item:hover {
    /*border: solid 1px #178df7;*/
    box-shadow: 0 0
    2px #1e4885;
    /*border: 1px dotted #1e62a3;*/
  }
  /* Colored */
  .gl-segment:not(.inverted).blue{
    border-top: 2px solid #2185d0!important;
  }

  .gl-segment.inverted.blue{
    background-color: #2185d0!important;
    color: #fff!important;
  }

</style>

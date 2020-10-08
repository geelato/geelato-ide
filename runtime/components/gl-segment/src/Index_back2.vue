<template>
  <div class="gl-segments">
    <br>
    <div class="gl-segment blue" style="zoom:1;width: 33%;display: inline-block">
      <div class="gl-segment-item gl-time" style="margin-left: 1.4em;">
        总销售额
      </div>
      <div class="gl-segment-item gl-time" style="margin-right: 1em;float: right">
        <svg viewBox="64 64 896 896" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path></svg>
      </div>
      <div class="gl-segment-item" style="font-size: 1.5em;display: block;margin-left: 1em">
        ￥126,560
      </div>
      <div class="gl-segment-item" style="margin: 0.5em 0 0.5em 1.2em;display: block">
        周同比  12%  日同比 11%
      </div>

    </div>
    <br>
    <div class="gl-segment blue" style="zoom:1;width: 33%;display: inline-block">
      <div class="gl-segment-item" style="width:4em;text-align: center">
        <span class="ant-avatar ant-avatar-sm ant-avatar-circle ant-avatar-image">
          <img src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png">
        </span>
      </div>
      <div class="gl-segment-item gl-title">
        Alipay
      </div>
      <div class="gl-segment-item gl-description" style="margin: 0.5em 0 0.5em 1.2em;display: block">
        那是一种内在的东西， 他们到达不了，也无法触及的
      </div>
      <div class="gl-segment-item gl-time" style="margin-left: 1.4em;">
        科学搬砖组
      </div>
      <div class="gl-segment-item gl-time" style="margin-right: 1em;float: right">
        9:30
      </div>
    </div>
    <div class="gl-segment blue" style="zoom:1;width: 33%;display: inline-block">
      <div class="gl-segment-item" style="width:4em;text-align: center">
        <span class="ant-avatar ant-avatar-sm ant-avatar-circle ant-avatar-image">
          <img src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png">
        </span>
      </div>
      <div class="gl-segment-item gl-title">
        Alipay
      </div>
      <div class="gl-segment-item gl-description" style="margin: 0.5em 0 0.5em 1.2em;display: block">
        那是一种内在的东西， 他们到达不了，也无法触及的
      </div>
      <div class="gl-segment-item gl-time" style="margin-left: 1.4em;">
        科学搬砖组
      </div>
      <div class="gl-segment-item gl-time" style="margin-right: 1em;float: right">
        9:30
      </div>
    </div>
    <div class="gl-segment blue" style="zoom:1;width: 33%;display: inline-block">
      <div class="gl-segment-item" style="width:4em;text-align: center">
        <span class="ant-avatar ant-avatar-sm ant-avatar-circle ant-avatar-image">
          <img src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png">
        </span>
      </div>
      <div class="gl-segment-item gl-title">
        Alipayxx
      </div>
      <div class="gl-segment-item gl-description" style="margin: 0.5em 0 0.5em 1.2em;display: block">
        那是一种内在的东西， 他们到达不了，也无法触及的
      </div>
      <div class="gl-segment-item gl-time" style="margin-left: 1.4em;">
        科学搬砖组
      </div>
      <div class="gl-segment-item gl-time" style="margin-right: 1em;float: right">
        9:30
      </div>
    </div>
    <div class="gl-segment blue" style="zoom:1;width: 24em;display: inline-block">
      <div class="gl-segment-item" style="width:4em;text-align: center">
        <span class="ant-avatar ant-avatar-sm ant-avatar-circle ant-avatar-image">
          <img src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png">
        </span>
      </div>
      <div class="gl-text">
        Alipay
      </div>
      <div class="gl-segment-item gl-description" style="margin: 0.5em 0 0.5em 1.2em;display: block">
        那是一种内在的东西， 他们到达不了，也无法触及的
      </div>
      <div class="gl-segment-item gl-time" style="margin-left: 1.4em;">
        科学搬砖组
      </div>
      <div class="gl-segment-item gl-time" style="margin-right: 1em;float: right">
        9:30
      </div>
    </div>
    <br>
    <div class="gl-segment blue" style="zoom:1">
      <div class="gl-segment-item" style="line-height: 4em;width:4em;text-align: center">
        <span class="ant-avatar ant-avatar-lg ant-avatar-circle ant-avatar-image">
          <img src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png">
        </span>
      </div>
      <!--<div  @keyup="log">-->
        <!--{{initHtml}}-->
      <!--</div>-->
      <gl-text :opts="item" class="gl-segment-item text" style="font-size:1.3em;font-weight:500"></gl-text>
      <gl-text :opts="item2" class="gl-segment-item text" style="margin-top: -1.5em;margin-left: 4em;display: block"></gl-text>

      <!--<div class="gl-segment-item" style="margin-top: -1.5em;margin-left: 4em;display: block">-->
        <!--前端工程师 | Gelato.org-->
      <!--</div>-->
    </div>

    <script type="text/x-template" id="anchored-heading-template">
    xxxxxxxxxxxxxx
    </script>
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
        item:{
          initHtml:'早上好，Gelato，要不要打一把 DOTA',
          html:'早上好，Gelato，要不要打一把 DOTA'
        },
        item2:{
          initHtml:'前端工程师 | Gelato.org',
          html:'前端工程师 | Gelato.org'
        },
        items:[{title:'Alipay',description:''}]
      }
    },
    watch: {
    },
    created() {
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

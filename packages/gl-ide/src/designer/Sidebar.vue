<template>
  <div class="gl-designer-sidebar">
    <div class="leftBar" :style="{height:`${layout.height}px`}">
      <div class="leftBarBtn" v-for="(plugin,index) in findPlugin('sidebar')" :key="index"
           :class="{activated:selectedPane?(selectedPane===plugin.sidebar.title):index===0}"
           @click="selectedPane=plugin.sidebar.title">
        {{plugin.sidebar.title}}
      </div>
    </div>
    <div class="rightBar">
      <template v-for="(plugin,index) in findPlugin('sidebar')">
        <component v-if="selectedPane?(selectedPane===plugin.sidebar.title):index===0" :is="plugin.sidebar.component"
                   :key="index"></component>
      </template>
    </div>
  </div>
</template>

<script>
  import mixin from '../../../mixin'

  export default {
    name: "gl-designer-sidebar",
    mixins: [mixin],
    props: {
      layout: {
        type: Object,
        default() {
          return {
            width: 0,
            height: 0
          }
        }
      }
    },
    data() {
      return {
        selectedPane: '',
        leftPane: {
          width: 30
        },
        rightPane: {}
      }
    },
    mounted() {
      console.log('this.layout', this.layout, this.$el)
    }
  }
</script>


<style scoped>
  .leftBar {
    width: 1.8em;
    line-height: 1.2em;
    background-color: #f0f0f0;
    display: inline-block;
    text-align: center;
    font-size: 12px;
    vertical-align: top;
  }

  .rightBar {
    display: inline-block;
  }

  .leftBarBtn {
    background-color: #f0f0f0;
    padding: 1em 0.4em;
    font-weight: 600;
  }

  .leftBarBtn:hover {
    background-color: #d8d8d8;
    cursor: pointer;
  }

  .leftBarBtn.activated {
    background-color: #d8d8d8;
  }

  .rotate270 {
    transform: rotate(270deg);
    -ms-transform: rotate(270deg); /* Internet Explorer 9*/
    -moz-transform: rotate(270deg); /* Firefox */
    -webkit-transform: rotate(270deg); /* Safari 和 Chrome */
    -o-transform: rotate(270deg); /* Opera */
    filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
  }
</style>

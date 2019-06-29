<template>
  <div class="gl-ide-layout-stage" style="height: 620px;overflow-x: hidden;padding-left: 0.5em;padding-right: 1em">
    <gl-ide-layout-stage-item :rows="layout.rows" :cardMap="cardMap" :gutter="layout.gutter"></gl-ide-layout-stage-item>
  </div>
</template>

<script>
  import GlIdeLayoutStageItem from './Item'

  export default {
    name: "gl-ide-layout-stage",
    components: {GlIdeLayoutStageItem},
    props: {},
    data() {
      return {
        cardMap: {},
        layout: {
          gutter: 4,
          rows: [{
            title: '一行一列',
            cols: [
              {span: 24, offset: 0, items: []}
            ]
          }, {
            title: '一行两列',
            cols: [
              {span: 12, offset: 0, items: []}, {span: 12, offset: 0, items: []}
            ]
          }, {
            title: '一行两列',
            cols: [
              {span: 16, offset: 0, items: []}, {span: 8, offset: 0, items: []}
            ]
          }, {
            title: '一行三列',
            cols: [
              {span: 8, offset: 0, items: []}, {span: 8, offset: 0, items: []}, {span: 8, offset: 0, items: []}
            ]
          },
            {
              title: '一行四列',
              cols: [
                {span: 6, offset: 0, items: []}, {span: 6, offset: 0, items: []}, {
                  span: 6,
                  offset: 0,
                  items: []
                }, {span: 6, offset: 0, items: []}
              ]
            }]
        }
      }
    },
    methods: {
      onChange(e) {
        console.log('gl-ide-plugin-layout > stage > onChange: ', e)
      }
    }
  }
</script>

<style>
</style>

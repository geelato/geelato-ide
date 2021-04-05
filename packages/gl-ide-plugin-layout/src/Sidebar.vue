<template>
  <div class="gl-ide-layout-sidebar" :style="{width:`${layout.width-30}px`}">
    <!--<a-alert message="选择并拖放到右边界面" type="info" closeText="关闭" class="gl-card-gutter"/>-->
    <div class="gl-title">
      <a-icon type="appstore"/>
      栅格（放置容器或组件）
    </div>
    <gl-draggable
        v-model="rows"
        handle=".gl-dnd-row-handle"
        :group="{ name: 'layoutItems', pull: 'clone', put: false }"
        ghost-class="ghost"
        :sort="false"
        @change="onChange"
        @choose="onChoose"
        :clone="clone"
    >
      <a-row :gutter="gutter" v-for="(row,rowIndex) in rows" :key="rowIndex" :title="row.title"
             class="gl-dnd-row-handle">
        <a-col v-for="(col,colIndex) in row.cols" :key="colIndex" :span="col.span">
          <div class="item">{{parseInt(col.span/24*100)}}%</div>
        </a-col>
      </a-row>
    </gl-draggable>
    <div class="gl-title">
      <a-icon type="border"/>
      容器（放置到行列中）
    </div>

    <!--<div v-for="(container,containerIndex) in containers" :key="containerIndex" class="gl-container">-->
    <!--{{container.title}}-->
    <!--</div>-->
    <a-row :gutter="gutter" class="gl-container-row">
      <gl-draggable
          v-model="containers"
          handle=".gl-container-item"
          :group="{ name: 'card', pull: 'clone', put: false }"
          ghost-class="ghost"
          :sort="false"
          @choose="onChooseLayoutContainer"
          :clone="cloneLayoutContainer"
      >
        <a-col v-for="(container,containerIndex) in containers" :key="containerIndex"
               :title="container.title"
               :span="8">
          <!--<div style="min-height: 2em"  class="gl-dnd-row-handle">{{container.title}}</div>-->
          <div class="gl-container-item" v-if="containerIndex===0"
               style="display: flex; align-items: center; justify-content: center; width: 100%; flex: 0 0 64px;">
            <svg data-icon="index" aria-hidden="true" focusable="false" width="62" height="50" viewBox="0 0 62 50"
                 class="bem-Svg" style="display: block; transform: translate(0px, 0px);">
              <path opacity=".2" fill="currentColor" d="M14 10h34v34H14z"></path>
              <g fill="currentColor">
                <path
                    d="M14 10h2v4h-2zm32 0h2v4h-2zm-30 0h2v2h-2zm10 0h4v2h-4zm-6 0h4v2h-4zm12 0h4v2h-4zm-6 32h4v2h-4zm-6 0h4v2h-4zm12 0h4v2h-4zm6-32h4v2h-4zm0 32h4v2h-4z"></path>
                <path
                    d="M44 10h4v2h-4zm2 30h2v4h-2zm-32 0h2v4h-2zm0-18h2v4h-2zm0-6h2v4h-2zm32 6h2v4h-2zm-32 6h2v4h-2zm32 0h2v4h-2zm-32 6h2v4h-2zm32 0h2v4h-2zm0-18h2v4h-2zm-2 26h2v2h-2z"></path>
                <path d="M14 42h4v2h-4z"></path>
              </g>
              <path opacity=".4" d="M48 10v34H14V10h34m1-1H13v36h36V9z"></path>
            </svg>
          </div>

          <div class="gl-container-item" v-if="containerIndex===1"
               style="display: flex; align-items: center; justify-content: center; width: 100%; flex: 0 0 64px;padding-top: 5px;padding-left: 5px">
            <svg data-icon="index" aria-hidden="true" focusable="false" width="62" height="45" viewBox="0 0 62 45"
                 class="bem-Svg" style="display: block; transform: translate(0px, 0px);">
              <path fill="currentColor" d="M3 10h47v26H3z" opacity=".2"></path>
              <path fill="currentColor" d="M50 10v26H3V10h47m2-2H1v30h51V8z"></path>
              <path d="M10 22h32v2H10zm0-4h32v2H10zm0 8h15v2H10z" fill="currentColor"></path>
              <path opacity=".4"
                    d="M45 7V1.8c0-1-.8-1.8-1.8-1.8H31.8c-1 0-1.8.8-1.8 1.8 0-1-.8-1.8-1.8-1.8H16.8c-1 0-1.8.8-1.8 1.8 0-1-.8-1.8-1.8-1.8H1.8C.8 0 0 .8 0 1.8V39h53V7h-8zM31 1.8c0-.4.4-.8.8-.8h11.4c.4 0 .8.4.8.8V6H31V1.8zm-15 0c0-.4.4-.8.8-.8h11.4c.4 0 .8.4.8.8V6H16V1.8zm-15 0c0-.4.4-.8.8-.8h11.4c.4 0 .8.4.8.8V7H1V1.8zM52 38H1V8h51v30z"></path>
              <path fill="currentColor"
                    d="M13.2 1H1.8c-.4 0-.8.4-.8.8V8h13V1.8c0-.4-.4-.8-.8-.8zm15 0H16.8c-.4 0-.8.4-.8.8V6h13V1.8c0-.4-.4-.8-.8-.8zm15 0H31.8c-.4 0-.8.4-.8.8V6h13V1.8c0-.4-.4-.8-.8-.8z"></path>
            </svg>
          </div>

          <div class="gl-container-item" v-if="containerIndex===2"
               style="display: flex; align-items: center; justify-content: center; width: 100%; flex: 0 0 64px;">
            <svg data-icon="index" aria-hidden="true" focusable="false" width="62" height="50" viewBox="0 0 62 50"
                 class="bem-Svg" style="display: block; transform: translate(0px, 0px);">
              <path opacity=".2" fill="currentColor" d="M5 10h52v16H5z"></path>
              <g fill="currentColor">
                <path
                    d="M5 10h2v4H5zm50 0h2v4h-2zM7 10h2v2H7zm16 0h4v2h-4zm-6 0h4v2h-4zm-6 0h4v2h-4zm18 0h4v2h-4zm6 0h4v2h-4zm6 0h4v2h-4zM23 24h4v2h-4zm-6 0h4v2h-4zm-6 0h4v2h-4zm18 0h4v2h-4zm6 0h4v2h-4zm6 0h4v2h-4zm6-14h4v2h-4zm0 14h4v2h-4z"></path>
                <path d="M53 10h4v2h-4zm2 12h2v4h-2zM5 22h2v4H5zm0-6h2v4H5zm50 0h2v4h-2zm-2 8h2v2h-2z"></path>
                <path d="M5 24h4v2H5z"></path>
              </g>
              <g opacity=".3" fill="currentColor">
                <path
                    d="M5 29h2v4H5zm50 0h2v4h-2zM7 29h2v2H7zm16 0h4v2h-4zm-6 0h4v2h-4zm-6 0h4v2h-4zm18 0h4v2h-4zm6 0h4v2h-4zm6 0h4v2h-4zM23 43h4v2h-4zm-6 0h4v2h-4zm-6 0h4v2h-4zm18 0h4v2h-4zm6 0h4v2h-4zm6 0h4v2h-4zm6-14h4v2h-4zm0 14h4v2h-4z"></path>
                <path d="M53 29h4v2h-4zm2 12h2v4h-2zM5 41h2v4H5zm0-6h2v4H5zm50 0h2v4h-2zm-2 8h2v2h-2z"></path>
                <path d="M5 43h4v2H5z"></path>
              </g>
              <path opacity=".4" d="M57 10v16H5V10h52m1-1H4v18h54V9z"></path>
            </svg>
          </div>

        </a-col>
      </gl-draggable>
    </a-row>

  </div>
</template>

<script>

  export default {
    name: "gl-ide-layout-sidebar",
    components: {},
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
        chooseIndex: 0,
        gutter: 8,
        rows: [{
          title: '一行一列',
          cols: [
            {span: 24, offset: 0, items: []}
          ]
        }, {
          title: '一行两列',
          cols: [
            {span: 6, offset: 0, items: []}, {span: 18, offset: 0, items: []}
          ]
        }, {
          title: '一行两列',
          cols: [
            {span: 8, offset: 0, items: []}, {span: 16, offset: 0, items: []}
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
          title: '一行两列',
          cols: [
            {span: 18, offset: 0, items: []}, {span: 6, offset: 0, items: []}
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
          }
        ],
        chooseContainerIndex: 0,
        containers: [
          {
            title: '自由布局容器',
            activeKey: 0,
            type: 'Flow',
            items: [{title: 'Flow1', items: []}, {title: 'Flow2', items: []}],
            slots: [],
            opts: {}
          }, {
            title: '标签容器',
            activeKey: 0,
            type: 'Tabs',
            items: [{title: 'tab1', items: []}, {title: 'tab2', items: []}],
            slots: [],
            opts: {tabPosition: 'top', type: 'line', size: 'default'}
          }, {
            title: '折叠容器',
            activeKey: 0,
            type: 'Collapse',
            items: [{title: 'panel1', items: []}, {title: 'panel2', items: []}],
            slots: [],
            opts: {}
          }]
      }
    },
    methods: {
      onSelect(keys) {
        this.$gl.bus.$emit('project_file_selected', keys)
      },
      onExpand() {
      },
      onChange() {
      },
      onChoose(e) {
        console.log('gl-ide-plugin-layout > sidebar > onChoose: ', e)
        this.chooseIndex = e.oldIndex
      },
      clone() {
        return JSON.parse(JSON.stringify(this.rows[this.chooseIndex]))
      },
      onChooseLayoutContainer(e) {
        console.log('gl-ide-plugin-layout > sidebar > onChooseLayoutContainer: ', e)
        this.chooseContainerIndex = e.oldIndex
      },
      cloneLayoutContainer() {
        return JSON.parse(JSON.stringify(this.containers[this.chooseContainerIndex]))
      },
      arrayGroupBy(array, groupKey) {
        let groups = {}
        array.forEach(function (item) {
          groups[groupKey] = groups[groupKey] || []
          groups[groupKey].push(item)
        });
        // return Object.values(groups);
        let groupAry = []
        for (let key in groups) {
          groupAry.push({group: key, items: groups[key]})
        }
        return groupAry
      }
    }
  }
</script>

<style>
  /*.gl-placeholder {*/
  /*!*background-color: #d8d8d8;*!*/
  /*}*/
  .gl-ide-layout-sidebar .gl-title {
    margin: 0.5em 1em;
    font-weight: bold;
  }

  .gl-ide-layout-sidebar .gl-dnd-row-handle {
    min-height: 2em;
    cursor: move;
  }

  .gl-ide-layout-sidebar .ant-row {
    border: 1px solid #f0f0f0;
    margin-bottom: 0.5em;
  }

  .gl-ide-layout-sidebar .ant-row:hover > div > .item {
    background-color: rgb(107, 209, 255);
  }

  .gl-ide-layout-sidebar .ant-row > div > .item {
    min-height: 2em;
    background-color: rgba(161, 222, 255, 0.35);
    text-align: center;
  }

  .gl-ide-layout-sidebar .gl-container-row {
    border: 0;
  }

  .gl-ide-layout-sidebar .gl-container-item {
    border: #e0e0e0 solid 1px;
    min-height: 2em;
    background-color: rgba(161, 222, 255, 0.35);
    text-align: center;
  }

  .gl-ide-layout-sidebar .gl-container-item:hover {
    cursor: move;
  }
</style>

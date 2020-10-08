<template>
  <div class="gl-cards">
    <!--<a-alert message="选择并拖放到右边界面" type="info" closeText="关闭" class="gl-card-gutter"/>-->
    <!--:size="size" :style="{'min-height':`${height}px`,'max-height':`${height}px`}"-->
    <a-tabs defaultActiveKey="1" size="small" class="gl-compact">
      <!--*******************************************************************************-->
      <!--******************************* 1、组件 ****************************************-->
      <!--*******************************************************************************-->
      <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="control"/>
        组件
      </span>
        <gl-draggable :list="controlItems" handle=".gl-dnd-handle" :group="{ name: 'card', pull: 'clone', put: false }"
                      :sort="false" :clone="customClone">
          <div class="gl-card gl-dnd-handle" v-for="(item,index) in controlItems" :key="index">
            <div class="gl-card-header">
              {{item.title}}
            </div>
            <div class="gl-card-body">
              <a-icon :type="item.icon"/>
            </div>
          </div>
        </gl-draggable>
      </a-tab-pane>
      <!--*******************************************************************************-->
      <!--******************************* 2、模板片段 ****************************************-->
      <!--*******************************************************************************-->
      <a-tab-pane key="2">
      <span slot="tab">
        <a-icon type="code"/>
        UI片段
      </span>
        <div style="margin: 3px 1px 1px">
          <a-button size="small" block @click="modalVisible=true">
            <a-icon type="plus"></a-icon>
            新增模板
          </a-button>
        </div>
        <!--<gl-draggable :list="segmentItems" handle=".gl-dnd-handle" :group="{ name: 'card', pull: 'clone', put: false }"-->
        <!--:sort="false" :clone="customClone">-->
        <!--<div class="gl-card gl-dnd-handle" v-for="(item,index) in segmentItems" :key="index">-->
        <!--<div class="gl-card-header">-->
        <!--{{item.title}}-->
        <!--</div>-->
        <!--<div class="gl-card-body">-->
        <!--<a-icon :type="item.icon"/>-->
        <!--</div>-->
        <!--</div>-->
        <!--</gl-draggable>-->
        <gl-draggable :list="segmentTemplates" handle=".gl-dnd-handle"
                      :group="{ name: 'card', pull: 'clone', put: false }"
                      :sort="false" :clone="customClone">
          <div class="gl-card gl-dnd-handle" v-for="(item,index) in segmentTemplates" :key="index"
               @mousedown="popoverVisible=false" style="width: 100% !important;">
            <div class="gl-card-header">
              <span>{{item.title}}</span>
              <span style="float: right;cursor: pointer" @click="selectSegmentTemplate(item)"><a-icon
                  type="setting"></a-icon></span>
            </div>
            <div class="gl-card-body" style="text-align: center;background-color: #FFFFFF">
              <img width="200px" height="100px" :src="item.img">
            </div>
            <!--<img width="50%" height="50%" :src="item.img" style="position:absolute;left: 200px">-->
          </div>
        </gl-draggable>
        <div>
        </div>
        <a-popover placement="right" :visible="popoverVisible" @visibleChange="handleHoverChange">
        </a-popover>
      </a-tab-pane>
    </a-tabs>
    <div v-if="modalVisible">
      <a-modal style="padding: 0" :title="modalTitle" centered :width="modalWidth" v-model="modalVisible"
               @ok="() => modalVisible = false" @cancel="onCloseModal" okText="保存" cancelText="取消"
               :maskClosable="false">
        <gl-segment-maker :opts="currentEditingSegmentTemplate" ref="glSegmentMaker"></gl-segment-maker>
        <template slot="footer">
          <div style="text-align: center">
            <a-button type="primary" @click="onSaveTemplate">保存</a-button>
            <a-button type="danger" @click="onRemoveTemplate">
              删除
            </a-button>
            <a-button type="danger" @click="onCloseModal">
              关闭
            </a-button>
          </div>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
  import cards from './data/index.js'
  import segments from './data/segments/index.js'
  import segmentMeta from './data/segments/segmentMeta.js'

  import utils from "../../../runtime/utils";
  import events from '../../gl-ide-plugin-layout/src/events'
  import GlSegmentMaker from "./SegmentMaker";

  export default {
    name: "gl-ide-plugin-sidebar-cards",
    components: {GlSegmentMaker},
    props: {},
    data() {
      return {
        controlItems: cards.items,
        segmentItems: segments.items,
        color: '#FFF',
        modalVisible: false,
        modalTitle: 'UI片段模板制作',
        modalWidthPercent: .98,
        modalWidthPercentDefault: .98,
        segmentMakerLayout: {
          height: '800px'
        },
        segmentTemplates: [],
        currentEditingSegmentTemplate: {},
        popoverVisible: false
      }
    },
    computed: {
      modalWidth: function () {
        return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * this.modalWidthPercent
      }
    },
    created() {
      this.$gl.bus.$on(events.card_open, this.onCardOpen)

    },
    mounted() {
      this.loadSegmentTemplate()
      console.log('platform_app_segment')
    },
    methods: {
      handleHoverChange(visible) {
        this.popoverVisible = visible
      },
      loadSegmentTemplate() {
        let that = this
        let segmentTemplates = []
        this.$gl.api.queryByEntityDataReader({
          entity: 'platform_app_segment',
          fields: 'id,title,thumbnail,type,htmlContent,jsonContent',
          params: {}
        }).then(function (res) {
          if (res.data && res.data.length > 0) {
            segmentTemplates = []
            for (let i in res.data) {
              let dataItem = res.data[i]
              segmentTemplates.push({
                id: dataItem.id,
                group: dataItem.type,
                title: dataItem.title,
                icon: '',
                component: 'GlSegment',
                img: dataItem.thumbnail,
                description: dataItem.description,
                show: true,
                bind: {opts: JSON.parse(dataItem.jsonContent), params: {}},
                data: dataItem,
                meta: segmentMeta
              })
            }
          }
          that.$set(that, 'segmentTemplates', segmentTemplates)
        })
      },
      customClone(item) {
        let result = {
          id: utils.uuid(16)
        }
        Object.assign(result, item)
        return JSON.parse(JSON.stringify(result))
      },
      onCloseModal(e) {
        this.modalVisible = false
        this.modalWidthPercent = this.modalWidthPercentDefault
        this.$gl.bus.$emit('gl_ide_plugin_cards__modal_close')
      },
      selectSegmentTemplate(item) {
        this.modalVisible = true
        this.currentEditingSegmentTemplate = item
      },
      /**
       *  保存模板
       */
      onSaveTemplate() {
        let that = this
        that.$refs.glSegmentMaker.save(function () {
          that.loadSegmentTemplate()
          that.modalVisible = false
        })
      },
      onRemoveTemplate() {
        let that = this
        that.$refs.glSegmentMaker.remove(function () {
          that.loadSegmentTemplate()
          that.modalVisible = false
        })
      }
    }
  }
</script>

<style scoped>
  .gl-cards .gl-card {
    width: 48% !important;
  }

  .gl-card {
    width: 100%;
    margin: 0.15em;
    display: inline-block;
    cursor: move;
    background-color: #f0f0f0;
    border: 1px solid #d1d1d1;
  }

  .gl-card-header {
    padding: 0 .8em;
    min-height: 2em;
    line-height: 2em;
    background-color: #e9e9e9;
    width: 100%;
  }

  .gl-card-body {
    padding: 0.5em 0.2em;
    width: 100%;
    text-align: center;
  }

  .gl-card:hover {
    background-color: rgb(255, 255, 255);
  }

  .gl-card-body i {
    font-size: 3em;
    color: #6b6b6b;
  }

  .gl-card-body > .ant-popover-open {
  }

  .gl-segment-sign {
    min-height: 6em;
    width: 48%;
    border: 1px solid #d1d1d1;
    background-color: #f0f0f0;
  }
</style>

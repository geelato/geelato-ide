<template>
  <div>
    <a-alert message="选择并拖放到右边界面" type="info" closeText="关闭" class="gl-card-gutter"/>
    <gl-draggable :list="items" handle=".gl-dnd-handle" :group="{ name: 'card', pull: 'clone', put: false }"
                  :sort="false" :clone="customClone">
      <div class="gl-dnd-handle" style="width: 100%;cursor: move" v-for="(item,index) in items" :key="index">
        <div class="gl-card-header">
          <a-icon :type="item.icon"/>
          {{item.title}}
        </div>
        <div class="gl-card-body"></div>
      </div>
    </gl-draggable>
    <!--<a-button style="text-align: center" block>加载更多...</a-button>-->
    <div v-if="modalVisible">
      <!--<a-button type="primary" @click="() => modalVisible = true">Vertically centered modal dialog</a-button>-->
      <a-modal class="gl-card-designer"
               :title="modalTitle"
               centered
               :width=modalWidth
               v-model="modalVisible"
               @ok="() => modalVisible = false"
               :footer="null"
               okText="保存"
               cancelText="取消"
               :maskClosable="false"
      >
        <component :is="cardDesigner"></component>
      </a-modal>
    </div>
  </div>
</template>

<script>
  import form from './data/form.js'
  import table from './data/table.js'
  import utils from "../../utils";
  import events from '../../gl-ide-plugin-layout/src/events'

  export default {
    name: "gl-ide-plugin-sidebar-cards",
    components: {},
    props: {},
    data() {
      return {
        items: [{
          title: '表单',
          icon: 'form',
          component: 'GlForm',
          img: '',
          description: '',
          show: true,
          bind: {opts: form, query: {}},
          meta: {component: 'GlIdePluginFormDesigner', title: '表单编辑器'}
        }, {
          title: '列表',
          icon: 'table',
          component: 'GlTable',
          img: '',
          description: '',
          show: true,
          bind: {opts: table, query: {}},
          meta: {component: 'GlIdePluginTableDesigner', title: '列表编辑器'}
        }, {
          title: '页面引用',
          icon: 'link',
          component: 'GlPageLoader',
          img: '',
          description: '',
          show: true,
          bind: {opts: table, query: {}},
          meta: {component: 'GlIdePluginPageloaderDesigner', title: '设置'}
        }, {
          title: '工具条',
          icon: 'tool',
          component: 'GlToolbar',
          img: '',
          description: '',
          show: true,
          bind: {opts: table, query: {}},
          meta: {component: 'GlIdePluginToolbarDesigner', title: '工具条设置'}
        },
          {
            title: '标题',
            icon: 'bars',
            component: 'GlHeader',
            img: '',
            description: '',
            show: true,
            bind: {opts: table, query: {}},
            meta: {component: 'GlIdePluginHeaderDesigner', title: '工具条设置', inSettingPanel: true}
          }],
        color: '#FFF',
        modalTitle: '&nbsp;',
        modalVisible: false,
        modalWidth: (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * .98,
        cardDesigner: null
      }
    },
    created() {
      this.$gl.bus.$on(events.card_open, this.onCardOpen)

    },
    methods: {
      onCardOpen(args) {
        if (args.item.meta) {
          this.modalTitle = args.item.meta.title
          this.cardDesigner = this.$globalVue.component(args.item.meta.component)
        }
        this.modalVisible = true
      },
      onSelect(keys) {
        this.$gl.bus.$emit('project_file_selected', keys)
      },
      onExpand() {
        console.log('Trigger Expand');
      },
      customClone(item) {
        let result = {
          id: utils.uuid(16)
        }
        Object.assign(result, item)
        return result
      },
      setModal1Visible(modal1Visible) {
        this.modal1Visible = modal1Visible;
      }
    }
  }
</script>

<style scoped>
  .gl-card-header {
    padding: 0 0.5em;
    min-height: 2em;
    line-height: 2em;
    background-color: #e9e9e9;
    width: 100%;
    border: 1px solid #cacaca;
  }

  .gl-card-header:hover {
    background-color: rgb(107, 209, 255);
  }

  .gl-card-body {
    padding: 0.2em;
    width: 100%;
  }


</style>

<!--
  对象树，用户配置绑定事件
-->
<template>
  <div>
    <span style="padding-left: 2.4em">
        <a-icon type="file"/>
        当前页面
    </span>
    <a-tree
        showIcon
        :treeData="ideStore.editingFile.objectTree"
        @select="onSelect"
        @check="onCheck"
        :defaultExpandAll=true
    >

      <template slot="custom" slot-scope="{selected}">
        <a-icon :type="selected ? 'frown':'frown-o'"/>
      </template>
      <a-icon slot="tool" type="tool"/>
      <a-icon slot="form" type="form"/>
      <a-icon slot="table" type="table"/>
      <a-icon slot="bars" type="bars"/>
      <a-icon slot="link" type="link"/>
      <a-icon slot="folder" type="folder"/>
      <a-icon slot="cluster" type="cluster"/>
    </a-tree>
    <a-modal v-if="modalVisible" class="gl-card-designer" title="事件配置" centered :width=modalWidth v-model="modalVisible"
             @ok="() => modalVisible = false" @cancel="onCloseModal" okText="保存" cancelText="取消"
             :maskClosable="false">
      <gl-ide-setting-event :ideStore="ideStore" :currentControl="currentControl"
                            :currentActions="currentActions"
                            :currentComponent="currentComponent"></gl-ide-setting-event>
      <template slot="footer">
        <div style="text-align: center">
          <a-button type="danger" @click="onCloseModal">
            关闭
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  import EditingFileParser from '../../../../runtime/EditingFileParser'
  import GlIdeSettingEvent from './GlIdeSettingEvent'

  let actionsTemplate = [{
    on: 'click',
    if: '',
    do: [
      {
        handler: 'OpenModal',
        fn: '',
        ctx: '',
        params: {
          title: '',
          width: '1200px',
          height: '480px',
          body: {
            type: 'dynamic',
            component: '',
            props: {}
          }
        },
        then: []
      }
    ],
    ctx: 'this'
  }]

  export default {
    name: "GlIdeSettingObjectTree",
    components: {GlIdeSettingEvent},
    props: {
      ideStore: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        modalWidth: (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * .80,
        modalVisible: false,
        currentComponent: {},
        currentControl: {
          gid: '',
          title: '',
          component: ''
        },
        currentActions: [],
        // key:control gid,value:{eventHandler:event}
        controlBindEvents: {}
      };
    },
    watch: {},
    mounted() {
      this.editingFileParser = new EditingFileParser().init(this.$root)
    },
    methods: {
      onCloseModal() {
        this.modalVisible = false
        // bind actions
        this.editingFileParser.bindEvent(this.ideStore.editingFile.sourceContent._bindEvents, this.currentControl, this.currentActions)
        // TODO 暂不支持，需同时考虑在删除单元格内容时，怎么同步删除引用页面
        // this.generateObjectTreeNodeOfOpenModalAndBindEvent()
        console.log('gl-ide > gl-ide-plugin-layout > onCloseModal() > editingFile: ', this.ideStore.editingFile)
        console.log('gl-ide > gl-ide-plugin-layout > onCloseModal() > currentControl: ', this.currentControl)
        console.log('gl-ide > gl-ide-plugin-layout > onCloseModal() > bind currentActions: ', this.currentActions)
      },
      /**
       * 关闭时，解析配置的事件，找出引用的页面
       */
      generateObjectTreeNodeOfOpenModalAndBindEvent() {
        const that = this
        let events = this.ideStore.editingFile.sourceContent.events
        if (events) {
          for (let key in events) {
            // key如JxwPyhpL
            let actions = events[key]
            actions.forEach((action) => {
              action.do.filter((doItem) => doItem.handler === 'OpenModal').forEach((doItem) => {
                let groups = []
                // params: Object，示例
                // gid: "WONuaXfF"
                // actionAlign: "center"
                // width: "1200px"
                // title: "新建用户"
                // pageId: "1899791614608965867"
                // pageName: ""
                // height: "480px"
                // actions: Array(1)
                let findNode = that.ideStore.editingFile.objectTree.find(item => item.key === doItem.params.gid)
                let isExistNode = findNode !== undefined
                let node = findNode || {}
                node.title = '打开页面-' + doItem.params.title
                node.key = doItem.params.gid
                node.slots = {icon: 'table'}
                node.children = groups
                // action：Object，示例
                // gid: "aOEek7z0"
                // icon: "plus"
                // text: "保存"
                // type: "primary"
                doItem.params.actions.forEach((subPageAction) => {
                  groups.push({
                    title: subPageAction.text,
                    key: subPageAction.gid,
                    slots: {
                      icon: 'link',
                    }
                  })
                })
                console.log('node>', node, doItem)
                if (!isExistNode) {
                  that.ideStore.editingFile.objectTree.push(node)
                }
              })
            })
          }
        }

        // that.ideStore.editingFile.objectTree.push({
        //   title: '引用页面',
        //   key: 'dd',
        //   slots: {
        //     icon: 'table',
        //   }
        // })
      },
      onSelectPage() {

      },
      onSelect(selectedKeys, e) {
        let that = this
        let keys = e.node.dataRef.key.split('_$_')
        let componentKey = keys[0]
        let controlKey = keys[1]
        // let controlShortKey = keys[1]
        let item = that.ideStore.editingFile.sourceContent._componentRefs[componentKey]
        let controlComponent = item.component.$_getRefControlByGid(controlKey)
        this.currentComponent = item
        console.log('gl-ide-setting-object-tree> onSelect() > currentComponent:', item)
        console.log('gl-ide-setting-object-tree> onSelect() > controlKey:', controlKey)
        console.log('gl-ide-setting-object-tree> onSelect() > that.ideStore.editingFile.sourceContent:', that.ideStore.editingFile.sourceContent)

        if (controlComponent) {
          that.$set(that, 'currentControl', {
            gid: controlKey,
            title: e.node.$el.innerText,
            component: controlComponent
          })
          // console.log('that.ideStore.editingFile.sourceContent.events[controlKey]>', that.ideStore.editingFile.sourceContent.events[controlKey], that.ideStore.editingFile.sourceContent.events, controlKey)
          if (that.ideStore.editingFile.sourceContent.events[controlKey] === undefined) {
            that.ideStore.editingFile.sourceContent.events[controlKey] = JSON.parse(JSON.stringify(actionsTemplate))
          }
          that.$set(that, 'currentActions', that.ideStore.editingFile.sourceContent.events[controlKey])
          that.editingFileParser.clearEvent(that.ideStore.editingFile.sourceContent._bindEvents, that.currentControl, that.currentActions)
          that.modalVisible = true
          return
        } else {
          console.error('gl-ide-setting-object-tree> onSelect() > Not found.', item)
        }

        console.log('gl-ide-setting-object-tree> onSelect() > selectedKeys:', selectedKeys);
        console.log('gl-ide-setting-object-tree> onSelect() > e:', e);
        console.log('gl-ide-setting-object-tree> onSelect() > find component by gid:', that.currentControl.gid, that.currentControl.component)
      },
      onCheck(checkedKeys, info) {
        console.log('onCheck', checkedKeys, info);
      }
    },
  }
</script>

<style scoped>

</style>

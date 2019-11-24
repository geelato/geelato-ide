<template>
  <div>
    <a-tree
        showIcon
        :treeData="ideStore.editingFile.objectTree"
        @select="this.onSelect"
        @check="this.onCheck"
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
    </a-tree>
    <a-modal v-if="modalVisible" class="gl-card-designer" title="事件配置" centered :width=modalWidth v-model="modalVisible"
             @ok="() => modalVisible = false" @cancel="onCloseModal" okText="保存" cancelText="取消"
             :maskClosable="false">
      <gl-ide-setting-event :ideStore="ideStore" :currentControl="currentControl"
                            :currentActions="currentActions"></gl-ide-setting-event>
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
  import EditingFileParser from '../../../../runingtime/EditingFileParser'
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
        then: [{
          handler: 'ShowMessage',
          fn: '',
          ctx: '',
          params: {
            // info|success|error...
            method: 'info',
            // 提示内容
            content: '1200px',
            // 自动关闭的延时，单位秒。设为 0 时不自动关闭。
            duration: '10',
          }
        }]
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
        modalWidth: (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * .70,
        modalVisible: false,
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
        console.log('gl-ide > gl-ide-plugin-layout > onCloseModal() > bind currentActions: ', this.currentActions)
      },
      onSelect(selectedKeys, e) {
        let that = this
        let keys = e.node.dataRef.key.split('_$_')
        let componentKey = keys[0]
        let controlKey = keys[1]
        // let controlShortKey = keys[1]
        let item = that.ideStore.editingFile.sourceContent._componentRefs[componentKey]
        let controlComponent = item.component.$_getRefByGid(controlKey)
        console.log('that.ideStore.editingFile.sourceContent>', that.ideStore.editingFile.sourceContent)

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
          console.log('Not found.', item)
        }

        console.log('gl-ide-setting-object-tree> onSelect() selectedKeys:', selectedKeys);
        console.log('gl-ide-setting-object-tree> onSelect() e:', e);
        console.log('gl-ide-setting-object-tree> onSelect() > find component by gid:', that.currentControl.gid, that.currentControl.component)
      },
      onCheck(checkedKeys, info) {
        console.log('onCheck', checkedKeys, info);
      },

    },
  }
</script>

<style scoped>

</style>

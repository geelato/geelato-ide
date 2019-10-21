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
      <gl-ide-setting-event :ideStore="ideStore" :currentControl="currentControl"></gl-ide-setting-event>
      <template slot="footer">
        <div style="text-align: center">
          <!--<a-button type="primary" @click="saveCardComponent">暂存</a-button>-->
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
  import GlIdeSettingEvent from './GlIdeSettingEvent'

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
        }
      };
    },
    watch: {},
    mounted() {
    },
    methods: {
      onCloseModal() {
        this.modalVisible = false
      },
      onSelect(selectedKeys, e) {
        let that = this
        let key = e.node.dataRef.key
        Object.values(that.ideStore.editingFile.sourceContent.opts.componentRefs).forEach((item) => {
          let component = item.component.$_getRefByGid(key)
          if (component) {
            that.$set(that, 'currentControl', {
              gid: key,
              title: e.node.$el.innerText,
              component: component
            })
            that.modalVisible = true
            return
          } else {
            console.log('Not found.', item)
          }
        })
        console.log('gl-ide-setting-object-tree> onSelect() selectedKeys:', selectedKeys);
        console.log('gl-ide-setting-object-tree> onSelect() e:', e);
        console.log('gl-ide-setting-object-tree> onSelect() > find component by gid:', that.currentControl.gid, that.currentControl.component)
      },
      onCheck(checkedKeys, info) {
        console.log('onCheck', checkedKeys, info);
      }
      ,
    },
  }
</script>

<style scoped>

</style>

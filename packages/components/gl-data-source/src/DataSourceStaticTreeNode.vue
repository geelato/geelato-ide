<template>
  <div>
    <div v-for="(item,index) in items" :key="index">
      <div class="gl-title-sub"> 节点名称：</div>
      <input v-model="item[dataAlias.text]" style="width: 100%" placeholder="输入节点名称"/>
      <div class="gl-title-sub"> 节点Key：</div>
      {{item[dataAlias.value]}}
      <!--<a-input placeholder="选项值" :aria-readonly="true"/>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: "GlDataSourceStatic",
    props: {
      dataItems: {
        type: Array
      },
      dataAlias: {
        type: Object,
        default() {
          return {text: 'text', value: 'value'}
        }
      }
    },
    data() {
      return {
        items: this.dataItems,
        // dataType: 'number'
      }
    },
    mounted() {
    },
    methods: {
      // changeType() {
      //   this.dataType = this.isNumber() ? '' : 'number'
      // },
      // isNumber() {
      //   return this.dataType === 'number'
      // },
      add(item, index) {
        console.log('index>', index)
        this.items.splice(index + 1, 0, {text: '选项', value: this.items.length + 1})
      },
      remove(item, index) {
        if (this.items.length === 1) {
          this.$message.info('至少需保留一项。')
          return
        }
        this.items.splice(index, 1)
      }
    }
  }
</script>

<style scoped>
  .gl-select-item {
    margin: 0.25em 0;
    padding: 0.25em;
    background-color: #f7f7f7;
  }

  .icons-list > * {
    margin-left: 0.5em;
    cursor: pointer;
  }

  span {
    margin-left: 0.25em;
  }
</style>

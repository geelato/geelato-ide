<template>
  <div>
    <a-radio-group v-model="activeIndex" @change="onChangeDefaultActiveIndex">
      <gl-draggable
          v-model="items"
          animation="700"
          handle=".gl-dnd-select-handle"
          :group="{ name: 'select', pull: 'clone', put: true }"
          ghost-class="ghost"
          :sort="true"
          @start="drag=true"
          @end="drag=false"
      >
        <div v-for="(item,index) in items" :key="index" class="gl-select-item gl-dnd-select-handle">
        <span class="icons-list" style="margin: 0 0.5em 0 0">
          <a-icon type="drag" class=""/>
        </span>
          <span>
          <a-radio :value="index" title="默认选择项"></a-radio>
          <a-input v-model="item[dataAlias.text]" style="width: 7em" placeholder="显示内容" title="显示内容"/>
        </span>
          <span>
          <a-input-number v-model="item[dataAlias.value]" style="width: 5em" placeholder="选项值" title="选项值"/>
        </span>
          <span class="icons-list" style="float: right;line-height: 2.4em;margin-right: 0.5em;color: red">
          <a-icon type="delete" @click="remove(item,index)"/>
        </span>
        </div>
      </gl-draggable>
      <a-button block @click="add()" size="small" style="line-height: 1.499em">
        <a-icon type="plus" size="small"/>
        添加
      </a-button>
      <!--<a-switch :checked="dataType==='number'" @click='changeType'/>-->
      <!--是否数值类型-->
    </a-radio-group>
  </div>
</template>

<script>
  export default {
    name: "GlDataSourceStatic",
    props: {
      dataItems: {
        type: Array,
        required: true
      },
      dataAlias: {
        type: Object,
        default() {
          return {text: 'text', value: 'value'}
        }
      },
      defaultActiveIndex: {
        type: Number,
        default() {
          return 0
        }
      }
    },
    data() {
      return {
        activeIndex: this.defaultActiveIndex,
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
        if (index === undefined) {
          this.items.push({text: '选项', value: this.items.length + 1})
        } else {
          this.items.splice(index + 1, 0, {text: '选项', value: this.items.length + 1})
        }
      },
      remove(item, index) {
        // if (this.items.length === 1) {
        //   this.$message.info('至少需保留一项。')
        //   return
        // }
        if (index === this.activeIndex) {
          this.activeIndex = 0
        }
        this.items.splice(index, 1)
      },
      onChangeDefaultActiveIndex() {
        this.$emit('changeDefaultActiveIndex', this.activeIndex)
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

<template>
  <div>
    <gl-draggable
        v-model="items"
        handle=".gl-dnd-select-handle"
        :group="{ name: 'select', pull: 'clone', put: true }"
        ghost-class="ghost"
        :sort="true"
        @start="drag=true"
        @end="drag=false"
    >
      <div v-for="(item,index) in items" :key="index" class="gl-select-item gl-dnd-select-handle">
        <span>
          <input v-model="item.text" style="width: 6em" placeholder="选项内容"/>
        </span>
        <span>
          <input v-model="item.value" style="width: 4em" placeholder="选项值"/>
        </span>
        <span class="icons-list">
          <a-icon type="plus" @click="add(item,index)"/>
          <a-icon type="minus" @click="remove(item,index)"/>
          <a-icon type="swap" class=""/>
        </span>
      </div>
    </gl-draggable>
  </div>
</template>

<script>
  export default {
    name: "Select",
    props: {
      dataItems: {
        type: Array
      }
    },
    data() {
      return {
        items: this.dataItems
      }
    },
    mounted() {
    },
    methods: {
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

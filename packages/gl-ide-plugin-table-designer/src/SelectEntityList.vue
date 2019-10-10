<template>
  <div>
    <gl-list v-bind="config" @doAction="onListDoAction"></gl-list>
  </div>
</template>

<script>
  // import x from ''
  let config = {
    entityDataReader: {
      entity: 'platform_dev_table',
      fields: 'id,title,tableComment',
      withMeta: false,
      // key为组件内用到的字段名，右边为实体查询结果返回的字段
      // 当右边的字段不在fieldNames的范围内时，则该值为静态值，如以下的avatarUrl
      resultMapping: {
        // avatarUrl: `'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'`,
        title: `$ctx.title`,
        content: '',
        description: 'tableComment'
      },
      params: {
        checkState: '1'
      }
    }
  }
  export default {
    name: "SelectEntityList",
    data() {
      return {
        config: config
      }
    },
    methods: {
      onListDoAction(data) {
        this.$emit('doAction', data)
      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <div>
    <a-row :gutter="gutter" v-for="(row,rowIndex) in rows" :key="rowIndex" :title="row.title" class="gl-dnd-handle">
      <a-col v-for="(col,colIndex) in row.cols" :key="colIndex" :span="col.span">
        <div>{{col.span}}</div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: "gl-ide-layout-stage",
  }
</script>

<style scoped>

</style>

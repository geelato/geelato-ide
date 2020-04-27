<template>
  <div class="gl-block-bar-expression gl-condition">
    <span class="gl-block-title">条件</span>
    <span>
      <a-select v-model="expression.key" :allowClear="false" style="min-width: 6em" size="small">
        <a-select-option v-for="compareOperate in compareOperates" :key="compareOperate.value"
                         :value="compareOperate.value"
                         :title="compareOperate.title">
          {{compareOperate.title}}
        </a-select-option>
      </a-select>
    </span>
    <span style="margin: 0 0.3em;min-width: 6em">
      <a-select v-model="expression.compareOperate" :allowClear="false" size="small">
        <a-select-option v-for="compareOperate in compareOperates" :key="compareOperate.value"
                         :value="compareOperate.value"
                         :title="compareOperate.title">
          {{compareOperate.title}}
        </a-select-option>
      </a-select>
    </span>
    <span>
      <a-select v-model="expression.value" :allowClear="true" style="min-width: 6em" size="small">
        <a-select-option v-for="compareOperate in compareOperates" :key="compareOperate.value"
                         :value="compareOperate.value"
                         :title="compareOperate.title">
          {{compareOperate.title}}
        </a-select-option>
      </a-select>
    </span>
    <span>&nbsp;成立</span>
  </div>
</template>

<script>
  import mixin from './mixin'

  export default {
    name: "GlConditionBlock",
    mixins: [mixin],
    props: {
      blockItems: {
        type: Array,
        required: false
      }
    },
    data() {
      return {
        expression: {
          key: '未选择',
          compareOperate: '未选择',
          value: ''
        },
        //         eq("eq"), neq("neq"), lt("lt"), lte("lte"), gt("gt"), gte("gte"), startWith("startwith"), endWith("endwith"), contains("contains"), in("in");
        compareOperates: [{title: '小于等于', value: 'lte'}, {title: '小于', value: 'lt'}]
      }
    },
    methods: {
      getScriptText() {
        let scriptText = ''
        scriptText += this.expression.key
        scriptText += this.expression.compareOperate
        scriptText += this.expression.value
        return scriptText
      }
    }
  }
</script>

<style scoped>

</style>

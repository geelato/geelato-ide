<template>
  <div class="gl-ide-plugin-form-designer-sidebar" :style="tabPanelStyle">

    <a-collapse :defaultActiveKey="['1','2','3']" :bordered="false">
      <a-collapse-panel header="基础字段规则" key="1" style="border: 0;padding: 8px 8px 0">
        <template v-for="property in properties">
          <div class="item toolbar-item" style="width: 48%"
               :data-control="property.control" v-if="property.title">
            <!--<a-icon :type="property.icon"/>-->
            <div class="content" readonly>
              {{property.title}}
              <a-badge style="display: inline-block;float: right" count="4"
                       :numberStyle="{backgroundColor: '#fff', color: '#f5222d', boxShadow: '0 0 0 1px #f5222d inset'}"/>
            </div>
          </div>
        </template>
      </a-collapse-panel>
      <a-collapse-panel header="自定义业务规则" key="2" style="border: 0;padding: 8px 8px 0">
        <template v-for="(customRule,customRuleIndex) in customRules">
          <div class="item toolbar-item" style="width: 96%" :key="customRuleIndex">
            <!--<a-icon :type="property.icon"/>-->
            <div class="content" readonly>
              <span>
                {{customRuleIndex+1}}. {{customRule.title}}
              </span>
              <a-icon type="delete" style="float: right;line-height: 2em;color: red"></a-icon>
            </div>
          </div>
        </template>
        <div style="text-align: center;margin-top: 1em">
          <a-button>+ 自定义规则</a-button>
        </div>
      </a-collapse-panel>
      <a-collapse-panel header="规则库业务规则" key="3" style="border: 0;padding: 8px 8px 0">
        <template v-for="(libRule,libRuleIndex) in libRules">
          <div class="item toolbar-item" style="width: 96%" :key="libRuleIndex">
            <!--<a-icon :type="property.icon"/>-->
            <div class="content" readonly>
              <span>
                {{libRuleIndex+1}}. {{libRule.title}}
              </span>
              <a-icon type="delete" style="float: right;line-height: 2em;color: red"></a-icon>
            </div>
          </div>
        </template>
        <div style="text-align: center;margin-top: 1em">
          <a-button>+ 从规则库选择</a-button>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
  import mixin from '../../../../mixin-designer'
  import controlTypes from '../../data/controlTypes'

  export default {
    name: "GlIdePluginFormDesignerLogicAndRuleSidebar",
    mixins: [mixin],
    props: {
      opts: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        rules: [],
        properties: [],
        customRules: [{name: 'notExist', title: '用户不能同时存在于XXX', description: '', opts: {}}],
        libRules: [{name: '......', title: '......', description: '', opts: {}}]
      }
    },
    mounted() {
      let that = this
      if (that.opts.properties) {
        for (let key in that.opts.properties) {
          that.properties.push(that.opts.properties[key])
        }
      }
      console.log('............this.opts:', this.opts)
    },
    methods: {
      getRuleCount(property) {
        return property.rules && property.rules.keys.length || 0
      }
    }
  }
</script>

<style scoped>
  .item {
    margin: 0.125em 0.125em;
    padding: 0.125em 0.5em;
    float: left;
    width: 48%;
    cursor: pointer;
    background: #f4f6fc;
    border: 1px solid #f4f6fc;
    color: rgba(0, 0, 0, 1);
    border-radius: 0;
    line-height: 1.75em;
  }
</style>

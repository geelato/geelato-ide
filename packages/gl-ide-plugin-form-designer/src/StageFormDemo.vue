<template>
  <div>
    <a-tabs defaultActiveKey="1" :size="size" :style="{'min-height':`${height}px`,'max-height':`${height}px`}">
      <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="apple"/>
        字段
      </span>
        <div class="gl-form">
          <a-row>
            <a-col :span="12">
              <a-row>
                <a-col :span="8" class="gl-form-label">
                  <span class="gl-form-required">*</span>
                  用户名
                </a-col>
                <a-col :span="16" class="gl-form-control">
                  <a-input
                      v-decorator="[ 'username', {rules: [{ required: true, message: 'Please input your name' }]} ]"
                      placeholder="Please input your name"
                  />
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="8" class="gl-form-label">
                  <span class="gl-form-required">*</span>
                  姓名
                </a-col>
                <a-col :span="16" class="gl-form-control">
                  <a-input
                      v-decorator="[ 'lastname', {rules: [{ required: true, message: 'Please input your name' }]} ]"
                      placeholder="Please input your name"
                  />
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="12">
              <a-row>
                <a-col :span="8" class="gl-form-label gl-span-2">
                  <span class="gl-form-required">*</span>
                  描述
                </a-col>
                <a-col :span="16" class="gl-form-control gl-span-2">
                  <a-textarea></a-textarea>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="4" class="gl-form-label">
              <span class="gl-form-required">*</span>
              用户名
            </a-col>
            <a-col :span="8" class="gl-form-control">
              <a-input v-decorator="[ 'username', {rules: [{ required: true, message: 'Please input your name' }]} ]"
                       placeholder="Please input your name"
              />
            </a-col>
            <a-col :span="4" class="gl-form-label">密码</a-col>
            <a-col :span="8" class="gl-form-control">
              <a-input v-decorator="[ 'username', {rules: [{ required: true, message: 'Please input your name' }]} ]"
                       placeholder="Please input your name"
              />
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="4" class="gl-form-label">是否本地</a-col>
            <a-col :span="8" class="gl-form-control">
              <a-checkbox>是否本地</a-checkbox>
            </a-col>
            <a-col :span="4" class="gl-form-label">联系人</a-col>
            <a-col :span="8" class="gl-form-control">
              <a-input placeholder="Basic usage" v-model="userName" ref="userNameInput">
                <a-icon slot="prefix" type="user"/>
                <a-icon v-if="userName" slot="suffix" type="close-circle" @click="emitEmpty"/>
              </a-input>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="4" class="gl-form-label" style="height:5em;line-height: 5em">测试</a-col>
            <a-col :span="20" class="gl-form-control" style="height:5em;line-height: 5em">
              <a-textarea style="height: 5em"></a-textarea>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="4" class="gl-form-label">测试</a-col>
            <a-col :span="20" class="gl-form-control">
              <a-input defaultValue="mysite">
                <a-select slot="addonBefore" defaultValue="Http://" style="width: 90px">
                  <a-select-option value="Http://">Http://</a-select-option>
                  <a-select-option value="Https://">Https://</a-select-option>
                </a-select>
                <a-select slot="addonAfter" defaultValue=".com" style="width: 80px">
                  <a-select-option value=".com">.com</a-select-option>
                  <a-select-option value=".jp">.jp</a-select-option>
                  <a-select-option value=".cn">.cn</a-select-option>
                  <a-select-option value=".org">.org</a-select-option>
                </a-select>
              </a-input>
            </a-col>
          </a-row>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2">
      <span slot="tab">
        <a-icon type="android"/>
        布局
      </span>
        Tab 2
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import mixin from './mixin'
  import ARow from "ant-design-vue/es/grid/Row";
  import ATextarea from "ant-design-vue/es/input/TextArea";

  const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 4},
  };

  export default {
    name: "Stage",
    components: {ATextarea, ARow},
    mixins: [mixin],
    data() {
      return {
        checkNick: false,
        formItemLayout,
        formTailLayout,
        form: this.$form.createForm(this)
      }
    },
    methods: {
      check() {
        this.form.validateFields(
          (err) => {
            if (!err) {
              console.info('success');
            }
          },
        );
      },
      handleChange(e) {
        this.checkNick = e.target.checked;
        this.$nextTick(() => {
          this.form.validateFields(['nickname'], {force: true});
        });
      },
    }
  }
</script>

<style>

  .gl-form {
    border-bottom: silver 1px solid;
    border-right: silver 1px solid;
    margin-right: -4px;
    padding-right: -4px;
  }

  .gl-form-label, .gl-form-control {
    margin-top: -1px;
    margin-left: -1px;
    min-height: 2.2em;
    line-height: 2.2em;
    background-color: #f1f1f1;
    border-left: #d7d7d7 1px solid;
    border-top: #d7d7d7 1px solid;
    padding: 1px 2px;
  }

  .gl-form-label.gl-span-2, .gl-form-control.gl-span-2 {
    margin-top: -1px;
    margin-left: -2px;
    min-height: calc(4.4em + 2px);
    line-height: calc(4.4em + 2px);
  }

  .gl-form-control.gl-span-2 > textarea {
    min-height: 4.4em;
  }

  .gl-form-label {
    font-weight: 700;
    text-align: right;
    padding-right: 1em;
  }

  .gl-form-control {
    background-color: #FFFFFF;
  }

  .gl-form-control .ant-input {
    /*border: 0px;*/
  }

  .gl-form-control .ant-input-group-addon {
    /*border: 0px;*/
  }

  .gl-form-control textarea {
    vertical-align: top;
    /*padding: 0;*/
    /*margin: 0;*/
  }

  .gl-form .ant-checkbox-wrapper {
    padding-left: 8px;
  }

</style>

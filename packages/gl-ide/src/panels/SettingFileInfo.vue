<template>
  <div class="gl-content-wrapper">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="类型" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        {{editingFile.type}}
      </a-form-item>
      <a-form-item label="模板" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        {{editingFile.content.component||'无'}}
      </a-form-item>
      <a-form-item label="编码" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
        <a-input placeholder="英文字符，用于前端调用"
                 v-decorator="[ 'editingFile.code',  {rules: [{ required: true, message: '需填写编码' }]} ]"/>
      </a-form-item>
      <a-form-item label="描述" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
        <textarea rows="4" v-decorator="[ 'editingFile.description']" style="width: 100%"></textarea>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
  export default {
    name: 'gl-ide-setting-file-info',
    props: {
      editingFile: Object,
      default() {
        return {}
      }
    },
    data() {
      return {
        formLayout: 'horizontal',
        form: this.$form.createForm(this),
      }
    },
    watch: {
      // 'editingFile.id': {
      //   handler(val, oval) {
      //     console.log('setting', this.editingFile.code, this.editingFile.description, val, oval)
      //     // this.form.code = this.editingFile.code
      //     // this.form.description = this.editingFile.description
      //   },
      //   immediate: true,
      //   deep: true
      // }
    },
    mounted: function () {
      // this.form.code = this.editingFile.code
      // this.form.description = this.editingFile.description
    },
    methods: {
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      },
      handleSelectChange(value) {
        console.log(value);
        this.form.setFieldsValue({
          note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
        });
      },
    },
    components: {}
  }
</script>
<style scoped>
  .ant-form-item {
    /*background-color: #d8d8d8;*/
    margin-bottom: 5px;
  }

  .ant-form-item-control-wrapper, .ant-form-item-control {
    /*background-color: #ffffff;*/
  }
</style>


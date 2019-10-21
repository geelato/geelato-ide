<template>
  <div>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="窗口标题" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="['title', { rules: [{ required: true, message: 'Please input your note!' }] }]" />
      </a-form-item>
      <a-form-item label="窗口宽度" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input-number v-decorator="['width', { rules: [{ required: true, message: 'Please input your note!' }] }]" />&nbsp;px(像素)
      </a-form-item>
      <a-form-item label="窗口高度" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input-number v-decorator="['height', { rules: [{ required: true, message: 'Please input your note!' }] }]" />&nbsp;px(像素)
      </a-form-item>
      <a-form-item label="窗口宽度" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select
            v-decorator="[
          'width',
          { rules: [{ required: true, message: 'Please select your gender!' }] },
        ]"
            placeholder="Select a option and change input text above"
            @change="handleSelectChange"
        >
          <a-select-option value="male">
            male
          </a-select-option>
          <a-select-option value="female">
            female
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  export default {
    name: "GlIdeSettingEvent",
    props: {
      // ideStore: {
      //   type: Object,
      //   required: true
      // },
      // currentControl: {
      //   type: Object,
      //   default() {
      //     return {
      //       gid: '',
      //       title: '',
      //       component: ''
      //     }
      //   }
      // }
    },
    data() {
      return {
        formLayout: 'horizontal',
        form: this.$form.createForm(this, { name: 'coordinated' }),
      };
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
  }
</script>

<style scoped>
  .ant-form-item {
    margin-bottom: 4px;
  }
</style>

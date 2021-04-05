<template>
  <a-popover id="xxxxx" class="gl-setting-control-popover" v-model="visible" title="国际化文案"
             placement="leftTop"
             @ok="visible = false"
             trigger="click">
    <table slot="content" style="width: 100%">
      <tr style="margin: 0.5em">
        <td style="width: 4em;text-align: right;padding-right: 0.5em">中文</td>
        <td>
          <a-input style="width: 99%" v-model="message.zh" @change="updateI18n('zh')"></a-input>
        </td>
      </tr>
      <tr>
        <td style="width: 4em;text-align: right;padding-right: 0.5em">英文</td>
        <td style="padding-top: 0.2em">
          <a-input style="width: 99%" v-model="message.en" @change="updateI18n('en')"></a-input>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding-top: 0.5em">
          <span style="float: left;margin-left: 1.5em">
            KEY：{{i18nKey}}
          </span>
          <span @click="deleteI18n" style="float:right;color: red;cursor: pointer">
            <a-icon type="delete"/>删除
          </span>
        </td>
      </tr>
    </table>
  </a-popover>
</template>

<script>
  export default {
    name: "GlSettingI18n",
    props: {
      i18nKey: {
        type: String,
        default() {
          return this.$gl.utils.uuid(16)
        }
      },
      i18nMap: Object,
      defaultLocaleValue: String, Number
    },
    data() {
      return {
        message: {
          zh: this.defaultLocaleValue,
          en: this.defaultLocaleValue
        },
        visible: false
      }
    },
    watch: {
      i18nKey: {
        handler: function (val, oval) {

          this.resetMessage()
        },
        immediate: true
      }
    },
    mounted() {
      // console.log('defaultLocaleValue>', this.defaultLocaleValue)
      // console.log('i18nMap>', this.i18nMap)
      // this.resetMessage()
    },
    methods: {
      resetMessage() {
        this.message.zh = this.defaultLocaleValue
        this.message.en = this.i18nMap.en && this.i18nMap.en[this.i18nKey] || this.defaultLocaleValue
      },
      show() {
        this.$emit('createKey', this.i18nKey)
        this.resetMessage()
        this.visible = true
      },
      updateI18n(locale) {
        if (!this.i18nMap['zh-CN']) {
          this.$set(this.i18nMap, 'zh', {})
        }
        this.$set(this.i18nMap['zh-CN'], this.i18nKey, this.message.zh)
        if (!this.i18nMap['en-US']) {
          this.$set(this.i18nMap, 'en', {})
        }
        this.$set(this.i18nMap['en-US'], this.i18nKey, this.message.en)
        this.$emit('change', {locale: locale, zh: this.message.zh, en: this.message.en})
      },
      deleteI18n() {
        if (this.i18nMap['zh-CN'] && this.i18nMap['zh-CN'][this.i18nKey]) {
          delete this.i18nMap['zh-CN'][this.i18nKey]
        }
        if (this.i18nMap['en-US'] && this.i18nMap['en-US'][this.i18nKey]) {
          delete this.i18nMap['en-US'][this.i18nKey]
        }
        this.message = {
          zh: '',
          en: ''
        }
        this.visible = false
        this.$emit('delete', this.i18nKey)
      }
    }
  }
</script>

<style scoped>

</style>

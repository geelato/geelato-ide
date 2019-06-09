<template>
  <div>
    <a-tabs defaultActiveKey="1" :size="size" :style="{'min-height':`${height}px`,'max-height':`${height}px`}">
      <a-tab-pane key="1">
      <span slot="tab">
        <a-icon type="picture"/>
        界面
      </span>
        <div class="ui small compact form">
          <gl-draggable v-model="layout.data" element="table" class="gl-form gl-col-24"
                        :options="{group:{name:'layout'},chosenClass:'active'}"
                        @start="drag=true"
                        @add="addRow" @change="updateLayout" @choose="onChooseRow">
            <tr v-for="(row,rowIndex) in layout.data">
              <!--行数据为分组标题-->
              <template v-if="isGroupRow(row)">
                <td colspan="24" class="gl-form-group-title" :style="row[0].$style"
                    @mouseover.self="onRowOver($event,rowIndex)"
                    @mouseout.self="onRowOut($event,rowIndex)">
                    <span class="gl-designer-form-row-remove" title="删除当前行"
                          @click="removeRow(rowIndex)">
                      <i class="bordered inverted red remove small icon"></i>
                    </span>
                  <div v-html="row[0].$title||'&nbsp;'"></div>
                </td>
              </template>
              <!--行数据非分组标题-->
              <template v-else>
                <template v-for="(cell ,cellIndex) in row"
                          v-if="property=getProperty(Object.keys(cell)[0])">
                  <td :colspan="Object.values(cell)[0][0]" :rowspan="Object.values(cell)[0][2]" class="title"
                      @mouseover.self="onRowOver($event,rowIndex)"
                      @mouseout.self="onRowOut($event,rowIndex)">
                    <span v-if="cellIndex===0" class="gl-designer-form-row-remove" title="删除当前行"
                          @click="removeRow(rowIndex)">
                      <i class="bordered inverted red remove small icon"></i>
                    </span>
                    <!--<div class="ui red mini button gl-designer-form-row-remove">删行</div>-->
                    <span v-if="property.tips" :data-tooltip="property.tips">
                            <i class="info circle icon"></i>
                        </span>
                    <span class="gl-required">{{isRequired(property)?'*':''}}</span>
                    {{property.title||Object.keys(cell)[0]}}&nbsp;
                  </td>

                  <td class="gl-designer-form-field" :colspan="Object.values(cell)[0][1]"
                      :rowspan="Object.values(cell)[0][2]">
                    <gl-draggable :options="{group:{name:'field'},chosenClass:'active',sort:false}"
                               @start="onStartDragField($event,rowIndex,cellIndex,getProperty(Object.keys(cell)[0]).field)"
                               @end="drag=false"
                               @add="addField($event,rowIndex,cellIndex,getProperty(Object.keys(cell)[0]).field)"
                               @choose="onChooseField($event,rowIndex,cellIndex,Object.keys(cell)[0])"
                               @clone="onCloneField($event,rowIndex,cellIndex,getProperty(Object.keys(cell)[0]).field)">
                      <template v-if="property.control==='input'">
                        <a-input type="text" :placeholder="property.placeholder" :name="Object.keys(cell)[0]" readonly  />
                        <!--:readonly="property.readonly===true" :disabled="property.disabled===true"-->
                      </template>
                      <template v-else-if="property.control==='date'">
                        <div class="ui right icon input">
                          <a-input type="text" :placeholder="property.placeholder" :name="Object.keys(cell)[0]"
                                 readonly />
                          <i class="calendar alternate outline icon"></i>
                        </div>
                      </template>
                      <template v-else-if="property.control==='time'">
                        <div class="ui right icon input">
                          <input type="text" :placeholder="property.placeholder" :name="Object.keys(cell)[0]"
                                 readonly>
                          <i class="clock alternate outline icon"></i>
                        </div>
                      </template>
                      <template v-else-if="property.control==='textarea'">
                          <textarea rows="5" :placeholder="property.placeholder" :name="Object.keys(cell)[0]"
                                    readonly></textarea>
                      </template>
                      <template v-else-if="property.control==='checkbox'">
                        <a-checkbox :name="Object.keys(cell)[0]" readonly></a-checkbox>
                        {{property.placeholder}}
                      </template>
                      <template v-else-if=" property.control==='select'">
                        <a-select :defaultValue="property.value" v-model="form[getFieldNameByCell(cell)]"
                                  @change='$set(form,getFieldNameByCell(cell),$event);loadRefData(getFieldNameByCell(cell), "")'
                                  :ref="getFieldNameByCell(cell)"
                                  :readOnly="isReadonly(property)" :disabled="property.disabled===true">
                          <a-select-option v-for="(selectOption,selectOptionKey) in property.data" :key="selectOptionKey"
                                           :value="selectOption.value">{{selectOption.text}}
                          </a-select-option>
                        </a-select>
                      </template>
                      <template v-else-if=" property.control==='rating'">
                        <a-rate :value="3" :count="5" readonly/>
                      </template>
                      <template v-else-if="property.control==='email'">
                        <a-input type="email" :placeholder="property.placeholder" :name="Object.keys(cell)[0]" readonly  />
                      </template>
                      <template v-else-if="property.control==='password'">
                        <a-input type="password" :placeholder="property.placeholder" :name="Object.keys(cell)[0]"
                               readonly  />
                      </template>
                      <!--<template v-else>-->
                      <!--<input type="text" :placeholder="property.placeholder" :name="Object.keys(cell)[0]" readonly>-->
                      <!--</template>-->
                      <span class="gl-designer-form-field-remove" title="清空字段"
                            @click="removeField($event,rowIndex,cellIndex,Object.keys(cell)[0])">
                      <i class="bordered inverted red trash small icon"></i>
                    </span>
                      <!--这是一个占位元素，只有拖动到该元素上才有效-->
                      <div style="width: 100%;height: 3px;background-color:rgba(0,0,0,0)"></div>
                      <!--<div>{{control}}</div>-->
                    </gl-draggable>
                  </td>
                </template>
              </template>
            </tr>
          </gl-draggable>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2">
      <span slot="tab">
        <a-icon type="code"/>
        JSON
      </span>
        Tab 2
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import mixin from './mixin'
  import styleTemplate from './style.js'

  export default {
    name: "Stage",
    components: {},
    mixins: [mixin],
    props: {
      opts: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        // #以下表单默认示例配置
        defaultEntity: this.opts.form.defaultEntity,
        properties: this.opts.form.properties,
        layout: this.opts.form.layout,
        ds: this.opts.form.ds,
        vars: this.opts.form.vars,
        // **************以下编辑器配置**************
        template: {
          property: {
            control: 'input',
            title: '',
            // 是否禁用
            disabled: false,
            // 是否只读
            readonly: false,
            // 是否隐藏，hidden隐藏与否在layout中控制，故没有hidden这个配置
            placeholder: '',
            // 是否在服务端计算
            isComputeInServer: false,
            // 数据源
            ds: '',
            // 数据
            data: '',
            // 校验规则
            rules: [
              {
                type: 'empty',
                prompt: '请输入电话号码'
              }
            ],
            // 字段描述
            description: ''
          },
          options: [],
          style: styleTemplate
        },
        toolbar: {
          layout: [
            [{'': [24], $title: '分组标题', $style: "background-color:#FFF"}],
            [{'': [4, 8]}],
            [{'': [4, 20]}],
            [{'': [4, 8]}, {'': [4, 8]}],
            [{'': [3, 5]}, {'': [3, 5]}, {'': [3, 5]}],
            [{'': [2, 4]}, {'': [2, 4]}, {'': [2, 4]}, {'': [2, 4]}]
          ],
          controls: [
            {value: 'input', text: '单行文本', icon: 'keyboard outline'},
            {value: 'textarea', text: '多行文本', icon: 'keyboard outline'},
            {value: 'checkbox', text: '单选', icon: 'dot circle outline', opts: {type: 'radio'}},
            {value: 'checkbox', text: '复选', icon: 'check square outline', opts: {type: 'checkbox'}},
            {value: 'date', text: '日期选择', icon: 'calendar alternate outline', opts: {}},
            {value: 'time', text: '时间选择', icon: 'clock outline', opts: {}},
            {value: 'dropdown', text: '下拉选择', icon: 'caret square down outline', opts: {}},
            {value: 'rating', text: '评分', icon: 'star outline', opts: {}}
          ]
        },
        heightStyle: {
          'max-height': this.$parent.isModal ? 'calc(100vh - 15em)' : 'calc(100vh - 7em)',
          'min-height': this.$parent.isModal ? 'calc(100vh - 20em)' : 'calc(100vh - 7em)',
          'overflow-y': 'auto'
        },
        // **************以下编辑状态**************
        // 当前编辑的字段属性
        currentPropertyName: '',
        // 当前编辑的组信息
        currentGroup: '',
        hoverRowIndex: -1,
        hoverToolbarStyle: {
          top: '0px',
          left: '0px'
        },
        // 字段当前的数类型 ds or data
        currentDataSrouce: 'ds'
      }
    },
    computed: {
      config: function () {
        return {
          defaultEntity: this.defaultEntity,
          properties: this.properties,
          layout: this.layout,
          ds: this.ds,
          vars: this.vars
        }
      },
      configText: function () {
        return JSON.stringify(this.config)
      }
    },
    created: function () {
      console.log('opts>', this.opts)
    },
    mounted: function () {
      // this.spliter = Split(['.toolbar', '.stage', '.settings'], {
      //   sizes: [18.75, 56.25, 25],
      //   gutterSize: 4
      //   // minSize: 200
      // })
      this.initConvertData()
    },
    methods: {
      initConvertData() {
        for (let key in this.properties) {
          // 设置一些默认值，添加默认配置等
          let property = this.properties[key]
          // identifier 是 semantic ui form validate 需用到的属性
          property.identifier = key
          // 未设置实体时，默认为defaultEntity
          property.entity = property.entity || this.defaultEntity
          property.field = property.field || key
          // property.title = property.title || '标题'
          // !!!需采用vm.$set的方式来设置值，确保值变化可被检测 @see https://cn.vuejs.org/v2/guide/reactivity.html#检测变化的注意事项
          // this.$set(this.form, key, property.value === undefined ? '' : property.value)
          // this.form[key] = property.value === undefined ? '' : property.value
          // 依据字段类型，自动构建字段验证规则信息，基于semantic ui form validate
          if (property.control === 'email' && (!property.rules)) {
            property.rules = []
            this.properties[key].rules.push({type: 'email'})
          }
        }
      },
      getProperty(name) {
        if (!name || !this.properties[name]) {
          return {control: 'null', title: ' '}
        }
        return this.properties[name]
      },
      /**
       * 检查字段是否必填
       * @param property 字段配置信息
       * @returns {boolean}
       */
      isRequired(property) {
        if (!property.rules || property.rules.length === 0) {
          return false
        } else {
          return property.rules.filter(item => item.type === 'empty' || item.type === 'checked').length > 0
        }
      },
      getValue() {
      },
      onFieldDrag(a, b, c, d) {
        console.log('onFieldDrag>', a, 'B>', b, 'C>', c, 'D>', d)
      },
      addRow(evt) {
        if (this.isGroupRow(this.layout.data[evt.newIndex])) {
          this.editGroup(evt.newIndex)
        } else {
          this.currentGroup = ''
        }
        console.log('addRow>', evt, this.layout.data[evt.newIndex], evt.newIndex)
      },
      removeRow(rowIndex) {
        this.layout.data.splice(rowIndex, 1)
        console.log('removeRow>', this.layout.data)
      },
      onRowOver(evt, rowIndex) {
        this.hoverRowIndex = rowIndex
        console.log('onRowOver', evt, rowIndex)
      },
      onRowOut(evt, rowIndex) {
        this.hoverRowIndex = -1
        console.log('onRowOut', evt, rowIndex)
      },
      /**
       * 是否分组标题行
       * @param row
       * @returns {boolean}
       */
      isGroupRow(row) {
        // row data e.g.: [{'': [24],  $title: '',$style:''}]
        return row.length === 1 && row[0].$title !== undefined
      },
      onChooseRow(evt) {
        let row = this.layout.data[evt.oldIndex]
        if (this.isGroupRow(row)) {
          this.editGroup(evt.oldIndex)
        } else {
          this.currentGroup = ''
        }
      },
      editGroup(rowIndex) {
        this.currentGroup = {rowIndex: rowIndex, row: this.layout.data[rowIndex]}
        this.selectSettingTab('tab-group')
      },
      addField(evt, rowIndex, cellIndex, propertyName) {
        // if (evt.oldIndex > 0) {
        //   return false
        // }
        let cell = this.layout.data[rowIndex][cellIndex]
        // this.layout.data[rowIndex][cellIndex][propertyName] =
        if (propertyName === undefined) {
          this.currentPropertyName = 'p_' + this.$gl.utils.uuid(8)
          this.$set(this.properties, this.currentPropertyName, JSON.parse(JSON.stringify(this.template.property)))
          this.$set(this.properties[this.currentPropertyName], 'entity', this.defaultEntity)
          this.$set(this.properties[this.currentPropertyName], 'control', evt.item.dataset.control)
          // this.properties[this.currentPropertyName] = JSON.parse(JSON.stringify(this.template.property))
          // this.properties[this.currentPropertyName].entity = this.defaultEntity
          this.layout.data[rowIndex][cellIndex] = {}
          this.layout.data[rowIndex][cellIndex][this.currentPropertyName] = cell[""]
        } else {
          this.currentPropertyName = propertyName
        }
        evt.item.parentElement.removeChild(evt.item)
        console.log('addField', evt, this.layout.data)
        this.selectSettingTab('tab-field')
      },
      onChooseField(evt, rowIndex, cellIndex, propertyName) {
        // propertyName 对于新添加的字段，propertyName对应的field为空，即这里propertyName为空
        // let cell = this.layout.data[rowIndex][cellIndex]
        console.log('onChooseField', evt, rowIndex, cellIndex, propertyName, this.layout.data, this.properties)
        this.currentPropertyName = propertyName
        // this.selectSettingTab('tab-field')
      },
      removeField(evt, rowIndex, cellIndex, propertyName) {
        console.log('removeField>', evt, rowIndex, cellIndex, this.layout.data[rowIndex][cellIndex], propertyName)
        if (propertyName === undefined || '') {
          return
        } else {
          // 清除选中状态
          if (this.currentPropertyName === propertyName) {
            this.currentPropertyName = ''
          }
          // 删除属性
          delete this.properties[propertyName]
          // 清除布局内容
          let cell = this.layout.data[rowIndex][cellIndex]
          this.layout.data[rowIndex][cellIndex] = {}
          this.layout.data[rowIndex][cellIndex][''] = cell[propertyName]
        }
        this.$forceUpdate()
      },
      updateLayout(evt) {
        this.$forceUpdate()
      },
      onStartDragField(evt, rowIndex, cellIndex, propertyName) {
        console.log('onStartDragField', evt, rowIndex, cellIndex, propertyName)
        return false
      },
      onCloneField(evt, rowIndex, cellIndex, propertyName) {
        let origEl = evt.item;
        let cloneEl = evt.clone;
        console.log('onCloneField', evt, rowIndex, cellIndex, propertyName, origEl, cloneEl)
      },

      openTrSettings() {

      },
      openTdSettings() {

      },
      openControlSettings() {

      },
      getConfigText() {
        this.configText = JSON.stringify(this.config)
        return this.configText
      },
      selectSettingTab(tabName) {
        // this.$refs.settingsTabs.sui.tab('change tab', tabName);
      }
    },
  }
</script>

<style scoped>
  /*删除图标*/
  .gl-designer-form-row-remove, .gl-designer-form-field-remove {
    display: none;
    cursor: pointer;
    float: left;
    /*margin: 0px;*/
    /*padding: 1px;*/
  }

  tr:hover .gl-designer-form-row-remove {
    display: inline-block;
  }

  td:hover .gl-designer-form-field-remove {
    display: inline;
    float: right;
    /*!*margin-left: 20px;*!*/
    /*position: relative;*/
    /*left: 20px;*/
    /*top: -18px;*/
  }
</style>

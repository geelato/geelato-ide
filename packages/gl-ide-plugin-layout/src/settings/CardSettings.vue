<template>
  <div class="gl-ide-plugin-x-designer-settings">
    <div v-if="config">
      <div class="gl-title">
        <a-icon type="setting"/>
        外观
      </div>
      <table class="gl-table">
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            主题：
          </td>
          <td class="gl-table-cell">
            <a-radio-group :value="1" size="small">
              <a-radio-button :value="1">默认</a-radio-button>
            </a-radio-group>
          </td>
        </tr>
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            显示边框：
          </td>
          <td class="gl-table-cell">
            <a-switch v-model="card.showBorder"></a-switch>
          </td>
        </tr>
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            显示模式：
          </td>
          <td class="gl-table-cell">
            <a-select v-model="card.displayMode" :allowClear="true" style="min-width: 99%">
              <a-select-option v-for="displayModeOption in selectionDisplayMode" :key="displayModeOption.value"
                               :value="displayModeOption.value"
                               :title="displayModeOption.title">
                {{displayModeOption.title}}
              </a-select-option>
            </a-select>
          </td>
        </tr>
      </table>

      <div class="gl-title" v-if="card.items&&card.items.length>0">
        <a-icon type="setting"/>
        卡片内组件
      </div>
      <table class="gl-table">
        <tr class="gl-table-row" v-for="(cardItem,cardItemIndex) in card.items" :key="cardItemIndex">
          <td class="gl-table-cell gl-table-cell-sub-label">
            <a-icon :type="cardItem.icon"/>
            组件({{cardItemIndex+1}})：
          </td>
          <td class="gl-table-cell">
            <a-input v-model="cardItem.title" style="width: 98%">
              <a-select slot="addonAfter" default-value="asComponent" style="width: 100px"
                        v-model="cardItem.displayMode" @change="changeCardItemDisplayMode(card,cardItem)">
                <a-select-option value="slot">
                  作为插槽
                </a-select-option>
                <a-select-option value="component">
                  作为组件
                </a-select-option>
              </a-select>
            </a-input>
          </td>
        </tr>
      </table>
      <div class="gl-title" v-if="card.displayMode==='Tabs'">
        <a-icon type="setting"/>
        标签页（Tabs）设置
      </div>
      <table class="gl-table" v-if="card.displayMode==='Tabs'">
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            显示位置：
          </td>
          <td class="gl-table-cell">
            <a-radio-group v-model="card.opts.tabPosition" size="small">
              <a-radio-button value="top">上</a-radio-button>
              <a-radio-button value="bottom">下</a-radio-button>
              <a-radio-button value="left">左</a-radio-button>
              <a-radio-button value="right">右</a-radio-button>
            </a-radio-group>
          </td>
        </tr>

        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            扩展插槽：
          </td>
          <td class="gl-table-cell">
            <div v-for="(slot) in card.opts.slots">
              <a-input style="width: 98%" v-model="slot.name" readonly="true">
                <a-icon slot="addonBefore" type="api"/>
                <!--<a-icon slot="addonAfter" type="delete" theme="twoTone" twoToneColor="#eb2f96"-->
                <!--@click="$gl.utils.remove(card.opts.slots,slotIndex)"/>-->
              </a-input>
              <!--<a-button class="gl-mini-btn"-->
              <!--@click="$gl.utils.remove(card.opts.extraItems,extraItemIndex)">-->
              <!--<a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>-->
              <!--</a-button>-->
            </div>
            <!--<a-button @click="card.opts.slots.push({name:''})" block>-->
            <!--添加插槽-->
            <!--</a-button>-->
          </td>
        </tr>

        <!--<tr class="gl-table-row">-->
        <!--<td class="gl-table-cell gl-table-cell-sub-label">-->
        <!--操作扩展项：-->
        <!--</td>-->
        <!--<td class="gl-table-cell">-->
        <!--<div v-for="(extraItem,extraItemIndex) in card.opts.extraItems">-->
        <!--<a-input style="width: 98%" v-model="extraItem.title">-->
        <!--<a-icon slot="addonBefore" :type="extraItem.icon" title="扩展项类型"/>-->
        <!--<a-icon slot="addonAfter" type="delete" theme="twoTone" twoToneColor="#eb2f96"-->
        <!--@click="$gl.utils.remove(card.opts.extraItems,extraItemIndex)"/>-->
        <!--</a-input>-->
        <!--</div>-->
        <!--<div>-->
        <!--<a-select :allowClear="false" style="min-width: 70%" defaultValue="button" @change="selectControl">-->
        <!--<a-select-option v-for="control in controls" :key="control.value">-->
        <!--{{control.text}}-->
        <!--</a-select-option>-->
        <!--</a-select>-->
        <!--<a-button-->
        <!--@click="addCurrentControlToExtra(card.opts.extraItems)">-->
        <!--添加-->
        <!--</a-button>-->
        <!--</div>-->
        <!--</td>-->
        <!--</tr>-->
      </table>
      <!--===============设计辅助========================-->
      <div class="gl-title">
        <a-icon type="setting"/>
        设计辅助
      </div>
      <table class="gl-table">
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            显示组件ID：
          </td>
          <td class="gl-table-cell">
            <a-switch v-model="$ide.store.assist.showComponentId"></a-switch>
          </td>
        </tr>
      </table>
    </div>
    <a-alert v-else
             message="未选择卡片"
             description="请将鼠标移动到左边的设计界面上，点击相应的【卡片设置】按钮。"
             type="info"
             showIcon
    />
  </div>
</template>

<script>
  import ideConfig from '../../../gl-ide/src/data/ideSelectItems.js'

  export default {
    name: "GlIdePluginLayoutCardSettings",
    components: {},
    props: {
      ideStore: {
        type: Object
      },
      config: {
        type: Object
      }
    },
    data() {
      return {
        card: {
          showBorder: this.config && this.config.showBorder,
          displayMode: this.config && this.config.displayMode || 'Default',
          // 依据不同的displayMode，opts内容有所不同
          opts: {extraItems: []},
          items: this.config && this.config.items
        },
        selectionDisplayMode: [{title: '默认(Default)', value: 'Default'}, {title: '标签页(Tabs)', value: 'Tabs'}, {
          title: '折叠面板(Collapse)',
          value: 'Collapse'
        }],
        controls: ideConfig.controls,
        // 当前控件
        currentControl: {text: '按钮', icon: 'border', value: 'button'}
      }
    },
    watch: {
      card: {
        handler(val, oval) {
          this.emit()
        },
        deep: true
      }
    },
    updated() {
      this.reset()
    },
    mounted() {
      console.log('CardSettings mounted config...', this.config)
      this.reset()
    },
    created() {
    },
    destroyed() {
      this.emit()
    },
    methods: {
      reset() {
        console.log('CardSettings updated config...', this.config)
        this.$set(this.card, 'opts', this.config && this.config.opts || {})
        this.$set(this.card.opts, 'tabPosition', this.config.opts.tabPosition || 'top')
        this.$set(this.card.opts, 'slots', this.config.opts.slots || [])
        this.$set(this.card.opts, 'extraItems', this.config.opts.extraItems || [])
        this.$set(this.card, 'showBorder', this.config && this.config.showBorder)
        this.$set(this.card, 'displayMode', this.config && this.config.displayMode || 'Default')
        this.$set(this.card, 'items', this.config && this.config.items)
      },
      emit() {
        this.$emit('update', {value: this.card})
      },
      selectControl(value) {
        let foundControl = this.controls.find(control => {
          return control.value === value
        })
        this.currentControl = {
          value: foundControl.value,
          text: foundControl.text, // option.componentOptions.children[0].text
          icon: foundControl.icon
        }
      },
      addCurrentControlToExtra(extraItems) {
        console.log('CardSettings addCurrentControlToExtra...', extraItems)
        extraItems.push({
          id: this.$gl.utils.uuid(16),
          control: this.currentControl.value,
          title: this.currentControl.text,
          icon: this.currentControl.icon
        })
      },
      changeCardItemDisplayMode(card, cardItem) {
        if (cardItem.displayMode === 'slot') {
          // 加入
          let found = card.opts.slots.find(item => {
            return item.id === cardItem.id
          })
          if (!found) {
            card.opts.slots.push({
              name: cardItem.title,
              id: cardItem.id
            })
          }
        } else {
          // 删除
          card.opts.slots.forEach((item, index) => {
            if (item.id === cardItem.id) {
              card.opts.slots.splice(index, 1)
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
</style>

export default [
  {control: 'Input', title: '单行文本', icon: 'dash', opts:{}},
  {control: 'Textarea', title: '多行文本', icon: 'bars', opts:{}},
  {control: 'Radio', title: '单选', icon: 'minus-circle', opts: {type: 'Radio'}},
  {control: 'Checkbox', title: '复选', icon: 'check-square', opts: {type: 'Checkbox'}},
  {control: 'Date', title: '日期选择', icon: 'calendar', opts: {}},
  {control: 'Time', title: '时间选择', icon: 'clock-circle', opts: {}},
  {control: 'Select', title: '下拉选择', icon: 'down-square', opts: {data:[{text:'选项一',value:1},{text:'选项二',value:2}]}},
  {control: 'Rate', title: '评分', icon: 'star', opts: {}}
]

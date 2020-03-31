export default [
  {control: 'input', title: '单行文本', icon: 'dash', opts:{}},
  {control: 'textarea', title: '多行文本', icon: 'bars', opts:{}},
  {control: 'radio', title: '单选', icon: 'minus-circle', opts: {type: 'radio'}},
  {control: 'checkbox', title: '复选', icon: 'check-square', opts: {type: 'checkbox'}},
  {control: 'date', title: '日期选择', icon: 'calendar', opts: {}},
  {control: 'time', title: '时间选择', icon: 'clock-circle', opts: {}},
  {control: 'select', title: '下拉选择', icon: 'down-square', opts: {data:[{text:'选项一',value:1},{text:'选项二',value:2}]}},
  {control: 'rate', title: '评分', icon: 'star', opts: {}}
]

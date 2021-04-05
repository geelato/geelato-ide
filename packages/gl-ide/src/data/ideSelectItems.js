export default {
  copDict: {
    eq: '等于',
    neq: '不等于',
    lt: '小于',
    lte: '小于等于',
    gt: '大于',
    gte: '大于等于',
    sw: '开头包括',
    ew: '结尾包括',
    contains: '包括'
  },
  cops: [
    {text: '等于', value: 'eq'},
    {text: '不等于', value: 'neq'},
    {text: '小于', value: 'lt'},
    {text: '小于等于', value: 'lte'},
    {text: '大于', value: 'gt'},
    {text: '大于等于', value: 'gte'},
    {text: '开头包括', value: 'sw'},
    {text: '结尾包括', value: 'ew'},
    {text: '包括', value: 'contains'}
  ],
  controls: [
    {text: '文本', icon: 'dash', value: 'input'},
    {text: '日期', icon: 'calendar', value: 'date'},
    {text: '时间', icon: 'clock-circle', value: 'time'},
    {text: '复选', icon: 'check-square', value: 'checkbox'},
    {text: '下拉', icon: 'down-square', value: 'select'},
    {text: '标题', icon: 'font-size', value: 'title'},
    {text: '链接', icon: 'link', value: 'link'},
    {text: '按钮', icon: 'border', value: 'button'}
  ],
  btnTypes: [
    {text: '主按钮', value: 'primary'},
    {text: '次按钮', value: 'normal'},
    {text: '虚线按钮', value: 'dashed'},
    {text: '危险按钮', value: 'danger'},
    {text: '链接按钮', value: 'link'},
  ]
}

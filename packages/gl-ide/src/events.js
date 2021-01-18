/**
 *  事件命名规则：
 *  ide + [sidebar|stage|settings] + [component|object_tree_node|panel]+[update/remove/open]
 */
export default {
  // 打开ide的设置面板
  ide_setting_open: 'gl_ide_setting_open',
  // 更新ide的设置面板
  ide_setting_update: 'gl_ide_setting_update',
  // 切换面板
  ide_setting_panel_switch: 'ide_setting_panel_switch',
  // 更新对象树节点
  ide_setting_object_tree_node_update: 'ide_setting_object_tree_node_update',
  // 更新组件绑定事件的状态
  ide_setting_component_event_state_update: 'ide_setting_component_event_state_update',
  // 舞台组件删除
  ide_stage_component_delete: 'ide_stage_component_delete'

}

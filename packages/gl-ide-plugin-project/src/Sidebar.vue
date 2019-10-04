<template>
  <div>
    <project-file-tree ref="fileTree" :ideStore="ideStore" :fileTypes="fileTypes"
                       :project="project" @selectProject="showProjectList"></project-file-tree>
  </div>
</template>

<script>
  import ProjectFileTree from './ProjectFileTree.vue'
  import ProjectCreate from './ProjectCreate.vue'
  import ProjectList from './ProjectList.vue'
  import mixinGui from '../../mixin-gui'

  /**
   * 提项目结构管理、项目文件管理，对外提供通用的管理能力
   */
  export default {
    name: "gl-ide-plugin-sidebar-project",
    mixins: [mixinGui],
    props: {
      ideStore: Object,
      fileTypes: Object
    },
    data() {
      return {
        // 本地曾打开过的页面，缓存用
        loadedPages: {},
        projectId: '',
        project: {id: undefined, name: undefined}
      }
    },
    created() {
      // 默认加载，我的最近一个项目
      this.$gl.bus.$on('gl-ide.designer.showProjectForm', this.showProjectForm)
      // this.$gl.bus.$on('gl-ide.designer.openProject', this.onProjectSelected)
      this.$gl.bus.$on('gl-ide.designer.showProjectList', this.showProjectList)

    },
    mounted() {
    },
    beforeDestroy() {
      // 默认加载，我的最近一个项目
      this.$gl.bus.$off('gl-ide.designer.showProjectForm', this.showProjectForm)
      // this.$gl.bus.$on('gl-ide.designer.openProject', this.onProjectSelected)
      this.$gl.bus.$off('gl-ide.designer.showProjectList', this.showProjectList)
    },
    methods: {
      showProjectForm() {
        console.log('showProjectForm>bus')
        // // TODO 是否保存旧项目
        // let thisVue = this
        // // 重置，并通过数据驱动，各页面板进入初始状态
        // this.editorStore.reset()
        // thisVue.editorStore.project = {name: '新项目', tree: ''}
        // this.saveProject()
        // this.$emit('showProjectForm')
        this.$gl.ui.openModal(this, {
          title: '创建项目',
          width: '1000px',
          height: '480px',
          body: {
            type: 'static',
            component: ProjectCreate,
            props: {}
          },
          actions: [{
            fn: 'save',
            ctx: 'content',
            type: 'primary',
            text: '保存',
            then: {
              fn: 'onSaveProject',
              ctx: 'opener',
              then: {
                fn: 'close',
                ctx: 'modal'
              }
            }
          }, {
            fn: 'close',
            ctx: 'modal',
            text: '取消'
          }]
        })
        // this.project = {id: '', name: '新项目', tree: ''}
        console.log('this.project>', this.project)
      },
      showProjectList() {
        this.$gl.ui.openModal(this, {
          title: '选择项目',
          width: '800px',
          height: '480px',
          body: {
            type: 'staticPage',
            component: ProjectList,
            opts: {},
            query: {}
          },
          actions: [{
            fn: 'close',
            ctx: 'modal',
            text: '取消'
          }],
          on: [{
            fn: 'selectItem',
            ctx: 'content',
            then: {
              fn: 'onProjectSelected',
              ctx: 'opener',
              then: {
                fn: 'close',
                ctx: 'modal'
              },
              dataMapping: {
                id: '$ctx.item.id',
                name: '$ctx.item.name'
              }
            }
          }]
        })
      },
      onProjectSelected(params, project) {
        console.log('gl-ide-plugin-project > Sidebar.vue > project:', project)
        this.projectId = project.id
        this.project = project
      },
      saveProject: function () {
        let that = this
        that.$gl.api.save('platform_dev_project', that.project).then(function (res) {
          that.project.id = res.data
          that.projectId = res.data
        })
      },
      onSaveProject(params, data) {
        console.log('onSaveProject: ', params, data)
        this.projectId = data.id
        this.project = {id: this.projectId, name: data.name}
      }
    },
    components: {ProjectFileTree}
  }
</script>

<style scoped>

</style>

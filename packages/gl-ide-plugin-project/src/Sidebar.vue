<template>
  <div>
    <project-file-tree ref="fileTree" :editing-file="editingFile" :fileTypes="fileTypes"
                       :project="project"></project-file-tree>
  </div>
</template>

<script>
  import ProjectFileTree from './ProjectFileTree.vue'
  import ProjectCreate from './ProjectCreate.vue'

  /**
   * 提项目结构管理、项目文件管理，对外提供通用的管理能力
   */
  export default {
    name: "gl-ide-plugin-sidebar-project",
    props: {
      editingFile: Object,
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
    mounted() {
      // 默认加载，我的最近一个项目
      this.$bus.$on('designer.newProject', this.newProject)
      this.$bus.$on('designer.openProject', this.openProject)

    },
    methods: {
      newProject() {
        console.log('newProject>bus')
        // // TODO 是否保存旧项目
        // let thisVue = this
        // // 重置，并通过数据驱动，各页面板进入初始状态
        // this.editorStore.reset()
        // thisVue.editorStore.project = {name: '新项目', tree: ''}
        // this.saveProject()
        // this.$emit('newProject')
        this.$pageManager.openModal(this, {
          title: '创建项目',
          width: '1000px',
          height: '480px',
          body: {
            type: 'staticPage',
            component: ProjectCreate,
            opts: {},
            query: {}
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
      openProject(project) {
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
      onSaveProject(params, res, content) {
        console.log('onSaveProject: ', params, res, res.data.data)
        this.projectId = res.data.data
        this.project = {id: this.projectId, name: content.getValue('name')}
      }
    },
    components: {ProjectFileTree}
  }
</script>

<style scoped>

</style>

<template>
  <div>
    <project-file-tree ref="fileTree" :ideStore="ideStore" :fileTypes="fileTypes"
                       :project="project"></project-file-tree>
  </div>
</template>

<script>
  import ProjectFileTree from './ProjectFileTree.vue'
  import ProjectCreate from './ProjectCreate.vue'
  import ProjectList from './ProjectList.vue'
  import mixinGui from '../../mixin-gui'

  /**
   * 提应用结构管理、应用文件管理，对外提供通用的管理能力
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
      // 默认加载，我的最近一个应用
      this.$gl.bus.$on('gl-ide.designer.showProjectForm', this.showProjectForm)
      this.$gl.bus.$on('gl-ide.designer.showTemplateProjectForm', this.showTemplateProjectForm)
      this.$gl.bus.$on('gl-ide.designer.showProjectList', this.showProjectList)
      this.$gl.bus.$on('gl-ide.designer.saveFile', this.saveFile)
    },
    mounted() {
    },
    beforeDestroy() {
      // 默认加载，我的最近一个应用
      this.$gl.bus.$off('gl-ide.designer.showProjectForm', this.showProjectForm)
      this.$gl.bus.$off('gl-ide.designer.showProjectList', this.showProjectList)
    },
    methods: {
      showProjectForm() {
        //TODO 是否保存旧应用
        this.$gl.ui.openModal(this, {
          title: '创建应用',
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
              },
              dataMapping: {
                id: '$ctx.id',
                name: '$ctx.name'
              }
            }
          }, {
            fn: 'close',
            ctx: 'modal',
            text: '取消'
          }]
        })
        console.log('this.project>', this.project)
      },
      showTemplateProjectForm() {
        this.$gl.ui.openModal(this, {
          title: '选择创建模板应用',
          width: '1200px',
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
              fn: 'onTemplateProjectSelected',
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
      showProjectList() {
        this.$gl.ui.openModal(this, {
          title: '选择打开应用',
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
      onTemplateProjectSelected(params, project) {
        // 复制项目
        this.$message.info('正在努力实现中...')
      },
      saveProject: function () {
        let that = this
        that.$gl.api.save('platform_dev_project', that.project).then(function (res) {
          that.project.id = res.data
          that.projectId = res.data
        })
      },
      onSaveProject(params, data) {
        console.log('gl-ide > gl-ide-plugin-project > onSaveProject() > params,data: ', params, data)
        this.projectId = data.id
        this.project = {id: this.projectId, name: data.name}
      },
      saveFile() {
        this.$refs.fileTree.savePage()
      }
    },
    components: {ProjectFileTree}
  }
</script>

<style scoped>

</style>

<template>
    <el-container class="home">
        <el-aside class="home-aside">
            <el-scrollbar wrap-class="el-select-dropdown__wrap">
                <dir-tree ref="dirTree" />
                <slot name="pop"></slot>
            </el-scrollbar>
        </el-aside>
        <el-main>
            <library />
        </el-main>
    </el-container>
</template>

<script>
import Library from './src/Library'
import DirTree from './src/DirTree'
import Generator from '@/utils/Generator'
import { MessageBox, Message, Scrollbar } from 'element-ui'
import { 
    extname, 
    basename,
    formatter,
    readFileSync, 
    removeDirOrFile, 
    checkPostcssFromPackage } from '@/utils/utils'
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'Home',

    components: { DirTree, Library, ElScrollbar: Scrollbar},

    data() {
        return {
            generatorInstance: null
        }
    },

    computed: {
        ...mapState('Main', ['VUETEMPLATE']),

        treeInstanceLists() {
            return this.$refs['dirTree'].TREE;
        }
    },

    mounted() {
        // 进入创建项目页面
        this.$electron.ipcRenderer.on('createNewProject', this.enterCreateProject);

        this.$electron.ipcRenderer.on('remove-from-wrokspace', this.removeFromWrokspace);

        // 右击--生成页面
        this.$electron.ipcRenderer.on('generator-page', this.generatorPage);

        // 右击--进入拖拽区域
        this.$electron.ipcRenderer.on('enter-dragarea', this.parseFilesInContent);

        // 拖拽文件到app中
        this.$electron.ipcRenderer.on('draged-file', this.saveDirInLibrary);

        // 删除文件或文件夹
        this.$electron.ipcRenderer.on('remove-dir', this.removeDirectory);
        
    },

    methods: {
        ...mapMutations('Main', [
            'saveDrawComponents', 
            'setCacheDir',
            'deleteCacheDir'
        ]),

        enterCreateProject(event, url) {
            this.$router.push({ 
                path: '/createProject', 
                query: { root: url }
            });
        },

        async generatorPage(event, params) {
            if(!this.generatorInstance) {
                this.generatorInstance = new Generator();
            }  
            try {
                const {value} = await MessageBox.prompt('请输入文件名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /[^\\\/<>,+;'`!@#$%^&*()]*/g,
                    inputErrorMessage: '文件名格式不正确(不能存在特殊符号)'
                });

                this.treeInstanceLists[params.idx].append({
                    name: value,
                    root: params.root,
                    idx: params.idx,
                    path: params.path,
                    type: 'dir',
                    leaf: false
                }, params)
                
                // this.generatorInstance.create({
                //     frame: 'vue',
                //     dirName: value,
                //     targetPath: params.path,
                //     inject: this.VUETEMPLATE,
                //     stylePostfix: 'css'
                // });
            } catch (error) {
                console.log(error)
                Message({type: 'info', message: '你取消了此次操作'});
            }
        },

        /**
         * 解析vue文件中的内容，提取数据信息
         */
        parseFilesInContent(event, params) {
            const { path: url } = params;
            const matchReg = /<\s*slot\s*(name=\s*['|"]([\w]+)['|"]\s*)?>/g;
            if(/vue/g.test(extname(url))) {
                let slots = [];
                const fileTpl = readFileSync(url).toString();
                const matchSlots = fileTpl.match(matchReg);
                if(matchSlots) {
                    matchSlots.forEach(slot => {
                        let matchs = slot.match(/<\s*slot\s*(name=\s*['|"]([\w]+)['|"]\s*)?>/);
                        slots.push(matchs[2] ? matchs[2] : 'default');
                    });
                };

                this.saveDrawComponents({
                    pid: 0,
                    name: basename(url, '.vue'),
                    defaultName: 'placeholder-component',
                    slots
                });
            }else {
                Message({type: 'warning', message: '该文件不是一个组件'});
            }
        },

        saveDirInLibrary(event, url) { 
            this.setCacheDir(formatter(url));
        },

        /**
         * 将文件从工作区删除(逻辑删除)
         */
        removeFromWrokspace(event, params) {
            this.deleteCacheDir(params.path);
        },

        /**
         * 将文件从本地删除(物理删除)
         */
        removeDirectory(event, params) {
            //removeDirOrFile(params.path);
        }
    }
}
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>



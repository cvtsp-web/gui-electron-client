<template>
    <el-container class="home">
        <el-aside class="home-aside">
            <dir-tree />
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
import { MessageBox, Message } from 'element-ui'
import { checkPostcssFromPackage } from '@/utils/utils'

export default {
    name: 'Home',

    components: { DirTree, Library },

    data() {
        return {
            generatorInstance: null
        }
    },

    mounted() {
        this.$electron.ipcRenderer.on('createNewProject', (event, arg) => {
            this.$router.push({ 
                path: '/createProject', 
                query: { root: arg }
            });
        });

        this.$electron.ipcRenderer.on('generator-page', async (event, arg) => {
            // effect of path config
            this.generatorPage(arg);
        })
        
    },
    methods: {
        async generatorPage(params) {
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
                this.generatorInstance.create({
                    frame: 'vue',
                    dirName: value,
                    targetPath: params.path,
                    inject: [],
                    stylePostfix: 'css'
                });
            } catch (error) {
                console.error(error)
                Message({type: 'info', message: '你取消了此次操作'});
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>



<template>
    <div class="library">
        <!-- 标题提示 -->
        <el-alert :title="projectMessage" type="success" :closable="false" class="library-path">
            <el-popover
                placement="bottom"
                title="已下载的插件"
                width="200"
                trigger="click">
                <install-lists />
                <el-button 
                    circle 
                    size="mini"
                    icon="el-icon-download"
                    slot="reference"
                    style="position:absolute;top:5px;right:5px;" />
            </el-popover>
        </el-alert>

        <!-- 拖拽的展示区域 -->
        <div class="library-drag" ref="library">
            <library-drag-component :data="drawComponentLists" />
        </div>

        <!-- 可以拖拽的组件库 -->
        <el-scrollbar class="library-resources" wrap-class="el-select-dropdown__wrap">
            <el-card 
                style="width:100px;display:inline-block;margin: 0 5px" 
                v-for="(item, index) in cardLists" 
                :key="index"
                @click.native="openLibraryListHandler">
                <img :src="item.url" style="width:100%" />
                <span style="font-size:12px;">{{item.name}}</span>
            </el-card>
        </el-scrollbar>

        <library-detail-list :visible.sync="libraryvisible" :data="currentComponentLists" />
    </div>
</template>

<script>
import { Scrollbar, Alert, Card } from 'element-ui'
import { packageServer } from '@/utils/request'
import { asyncDownloadScript } from '@/utils/utils'
import InstallLists from './InstallLists'
import LibraryDragComponent from './LibraryDragComponent.js'
import LibraryDetailList from './LibraryDetailList'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
    components: { 
        ElScrollbar: Scrollbar, 
        ElAlert: Alert, 
        ElCard: Card,
        InstallLists,
        LibraryDetailList,
        LibraryDragComponent
    },

    data() {
        return {
            libraryvisible: false,
            componentId: 0,
            cardLists: [
                {
                    url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536497171749&di=fda7c622fdecbd19ffc9a49f6a8a1d3d&imgtype=0&src=http%3A%2F%2Fp1.qzone.la%2Fupload%2F1%2F5yfs506e.jpg',
                    name: 'element-ui',
                    component: 'el-input'
                },
                {
                    url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536497171749&di=9ea10ec9e49b6f6ddbed9fde07d3008f&imgtype=0&src=http%3A%2F%2Fp1.qzone.la%2Fupload%2F5%2Fj1jlyyfe.jpg',
                    name: 'iview',
                    component: 'i-button',
                    resource: 'https://unpkg.com/iview@3.1.0/dist/iview.min.js'
                }
            ],
            dragLists: []
        }
    },

    computed: {
        ...mapState('Main', [
            'currentProjectName', 
            'currentFrameName',
            'currentComponentLists',
            'drawComponentLists'
        ]),

        ...mapGetters('Main', ['findComponentLists']),

        projectMessage() {
            return this.currentProjectName + (
                this.currentFrameName === '' || !this.currentProjectName
                    ? '--'
                    : `(${this.currentFrameName}框架)`
            )
        }
    },

    async mounted() {     
        // 拖拽完成事件   
        this.$dragging.$on('dragend', ({group, target, item}) => {
            if(group == 'detaillist') {
                this.saveDrawComponents({
                    pid: 0,
                    ...item
                });
            }  
        });
        
    },

    methods: {
        ...mapMutations('Main', ['saveDrawComponents']),

        // 打开资源库的子组件列表
        openLibraryListHandler() {
            this.libraryvisible = true;
        }
    }
}
</script>

<style lang="scss">
@import "../../../../../element-variables.scss";
$library-views-height: 240px;
.library {
    position: relative;
    display: flex;
    height: 100%;
    .library-path {
        position: absolute;
        top: 0;
    }
    .library-drag {
        width: 100%;
        position: absolute;
        top: $library-views-height + 40;
        bottom: 0;  
        box-shadow: $--box-shadow-base;
    }
    .library-resources {
        margin-top: 40px;
        height: $library-views-height;
    }
    .el-select-dropdown__wrap {
        max-height: $library-views-height;
    }
}
</style>



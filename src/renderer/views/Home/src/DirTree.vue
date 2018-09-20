<template>
    <div>
        <el-tree 
            ref="tree"
            :key="index"
            :props="props"
            node-key="id"
            v-for="(item, index) in cacheDirLists"
            lazy
            highlight-current
            :load="loadNodeHandler"
            @mouseenter.native="handlerMouseenter(item, index)"
            @node-click="handlerClick"
            @node-contextmenu="handlerContextMenu">
            <span slot-scope="{ node, data }">
                <i :class="[data.type === 'dir' ? 'el-icon-goods':'el-icon-document']" />
                <span>{{ node.label }}</span>
            </span>
        </el-tree>
    </div>
</template>

<script>
import { Tree } from 'element-ui'
import { mapState, mapMutations } from 'vuex'
import { basename, readdirSync, isDirectory, checkFrameFromPackage } from '@/utils/utils'

export default {
    components: { ElTree: Tree },

    data() {
        return {
            props: {
                label: 'name',
                isLeaf: 'leaf'
            },
            currentIdx: 0,
            currentRoot: ''
        }
    },

    computed: {
        ...mapState('Main', ['cacheDirLists']),

        TREE() {
            return this.$refs['tree'];
        }
    },

    methods: {
        ...mapMutations('Main', ['setCurrentProject']),

        /**
         * 加载节点事件
         * @param {Object}
         * @param {Promise}
         */
        loadNodeHandler(node, resolve) {
            const { key } = node.store;
            // 初始化节点
            if(node.level === 0) {
                let idx = this.cacheDirLists.length - 1;
                let root = this.cacheDirLists[idx];
                return resolve([{ 
                    id: 1,
                    idx,
                    name: basename(root),
                    root,
                    path: root,
                    type: 'dir',
                    leaf: false
                }]);
            }else {
                const { path: url, root } = node.data;
                const childs = readdirSync(url)
                    .map(val => ({
                        id: Math.random().toFixed(5) * 100000,
                        name: val,
                        root,
                        idx: this.currentIdx,
                        path: `${url}/${val}`,
                        type: isDirectory(`${url}/${val}`) ? 'dir' : 'file',
                        leaf: isDirectory(`${url}/${val}`) ? false : true
                    }));
                return resolve(childs);
            }
        },

        handlerClick(data, node, store) {
            if(data.root) {
                const frameName = checkFrameFromPackage(data.root);
                this.setCurrentProject({
                    projectPath: data.root,
                    frameName
                });
            }
        },

        /**
         * 树的右点击事件
         */
        handlerContextMenu(event, data, node, store) {
            data.node = node;
            this.$electron.ipcRenderer.send('tree-contextmenu', data);
        },
        
        /**
         * 存储当前文件的根路径和序列号
         * @param {String} root: 根路径
         * @param {Number} index: 当前序列号
         */
        handlerMouseenter(root, index) {
            this.currentIdx = index;
            this.currentRoot = root;
        }
    }
}
</script>


<template>
    <div>
        <el-tree 
            :key="index"
            :props="props"
            :node-key="item"
            v-for="(item, index) in cacheDirLists"
            lazy
            highlight-current
            :load="loadNodeHandler"
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
            }
        }
    },

    computed: {
        ...mapState('Main', ['cacheDirLists'])
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
                return resolve([{ 
                    id: 1,
                    name: basename(key),
                    root: key,
                    path: key,
                    type: 'dir',
                    leaf: false
                }]);
            };
            const { path: url } = node.data;
            const childs = readdirSync(url)
                .map(val => ({
                    name: val,
                    root: key,
                    path: `${url}/${val}`,
                    type: isDirectory(`${url}/${val}`) ? 'dir' : 'file',
                    leaf: isDirectory(`${url}/${val}`) ? false : true
                }));
            return resolve(childs);
        },

        handlerClick(data, node, store) {
            if(data.root) {
                const frameName = checkFrameFromPackage(data.root);
                this.setCurrentProject({
                    projectPath: data.path,
                    frameName
                });
            }
        },

        /**
         * 树的右点击事件
         */
        handlerContextMenu(event, data, node, store) {
            this.$electron.ipcRenderer.send('tree-contextmenu', data);
        }
    }
}
</script>


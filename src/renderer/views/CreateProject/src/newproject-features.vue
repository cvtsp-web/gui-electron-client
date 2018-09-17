<template>
    <div class="newproject-features">
        <el-scrollbar
            wrap-class="el-select-dropdown__wrap">
            <el-checkbox-group v-model="checkedLists">
                <el-checkbox 
                    :key="index"
                    :label="item.label"
                    v-for="(item, index) in functionLists"
                    border>
                    {{item.name}}
                </el-checkbox>
            </el-checkbox-group>
        </el-scrollbar>

        <!-- 底部按钮模块 -->
        <footer-button>
            <el-button slot="left" icon="el-icon-back" @click="prevHandler">上一步</el-button>
            <el-button 
                type="success" 
                slot="right"
                @click="createCustomProject">
                创建项目
            </el-button>
        </footer-button>
    </div>
</template>

<script>
import FooterButton from './footer-button'
import { Scrollbar } from 'element-ui'
import { mapState } from 'vuex' 

export default {
    components: { 
        FooterButton,
        ElScrollbar: Scrollbar
    },

    inject: ['store'],

    data() {
        return {
            checkedLists: ['Babel', 'PreCss', 'config']
        }
    },

    computed: {
        ...mapState('CreateProject', [
            'functionLists'
        ])
    },

    methods: {
        // 返回上一个tab页
        prevHandler() {
            this.store.switchTabs(-1)
        },

        // 创建自定义项目
        createCustomProject() {

        }
    }
}
</script>

<style lang="scss">
.newproject-features {
    .el-checkbox.is-bordered {
        display: flex;
        margin: 10px 20px 0 20px;
        &:first-child {
            margin-left: 10px;
        }
    }
    .el-select-dropdown__wrap {
        max-height: 400px;
    }
}
</style>



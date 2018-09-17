<template>
    <div class="newproject-details">
        <el-form :model="details" style="padding: 0 30%">
            <el-form-item label="项目文件夹:">
                <el-input 
                    v-model="details.projectName"
                    prefix-icon="el-icon-goods" 
                    placeholder="myApp">
                </el-input>
            </el-form-item>
            <span class="current-path">{{currentPath}}</span>
            <el-form-item label="选择一套预设:">
                <el-radio-group v-model="details.preinstall">
                    <el-radio :label="1">默认</el-radio>
                    <el-radio :label="2">手动</el-radio>
                </el-radio-group>
            </el-form-item>

            <!-- 底部按钮模块 -->
            <footer-button>
                <el-button slot="left" icon="el-icon-close" @click="handlerCancel">取消</el-button>
                <el-button 
                    type="success" 
                    slot="right" 
                    :disabled="isDisabled"
                    @click="handlerRight">
                    {{rightBtnText}}
                </el-button>
            </footer-button>
        </el-form>
        
    </div>
</template>

<script>
import { Form, FormItem } from 'element-ui'
import FooterButton from './footer-button'
import generators from '@/utils/frameGenerator'
import { mapState, mapMutations } from 'vuex'

export default {
    components: {
        ElForm: Form,
        ElFormItem: FormItem,
        FooterButton
    },

    inject: ['store'], 

    data() {
        return {
            details: {
                path: '',       // 项目根路径
                projectName: '',
                preinstall: 1
            }
        }
    },

    computed: {
        ...mapState('Main', ['frameName']),

        currentPath() {
            return this.details.path + '/' + this.details.projectName;
        },

        isDisabled() {
            return this.details.projectName == '' ? true : false;
        },

        rightBtnText() {
            return this.details.preinstall == 1
                ? '创建项目'
                : '下一步'
        }
    },

    mounted() {
        const { root } = this.$route.query;
        this.details.path = `${root[0]}`;
    },

    methods: {
        ...mapMutations('Main', ['setCacheDir']),

        /**
         * 取消当前页面的配置
         * 回到上一页(home主页)
         */
        handlerCancel() {
            this.$router.back();
        },

        /**
         * 右侧按钮事件
         * 可能是创建功能 可能是下一步功能
         */
        handlerRight() {
            const { path, projectName, preinstall } = this.details;
            preinstall === 1
                ? generators[this.frameName]
                    .createDefaultPreset(path, projectName) // 默认创建 
                    .then(this.backHome)
                : this.store.switchTabs(1)
        },

        /**
         * 回到主页(Home)
         * 将生成的项目地址写入store中缓存起来
         */
        backHome() {
            this.setCacheDir(this.currentPath);
            this.handlerCancel();
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../../../element-variables.scss';
.newproject-details {
    .current-path {
        color: $--border-color-base;
    }
}
</style>





<template>
    <el-container class="create-project">
        <el-header class="create-project__header" style="height: none;">Create a new Project</el-header>
        <el-main>
            <el-tabs v-model="tabKeys">
                <el-tab-pane label="Details" name="1" disabled>
                    <newproject-details />
                </el-tab-pane>
                <el-tab-pane label="Features" name="2" disabled>
                    <newproject-features />
                </el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>
</template>

<script>
import NewprojectDetails from './src/newproject-details'
import NewprojectFeatures from './src/newproject-features'

export default {
    components: { NewprojectDetails, NewprojectFeatures },

    data() {
        return {
            tabKeys: '1'
        }
    },

    provide() {
        const _this = this;
        return {
            store: {
                state: {
                    tabKeys: _this.tabKeys
                },
                switchTabs(direction) {
                    const value = Number(this.state.tabKeys) + direction;
                    this.state.tabKeys = _this.tabKeys = value.toString();
                }
            }
        }
    },

    methods: {
        
    }
}
</script>

<style lang="scss">
@import '../../../../element-variables.scss';
.create-project__header {
    text-align: center;
    line-height: $--font-size-base * 7;
    background-color: $--color-primary-light-2;
    font-size: $--font-size-base * 2;
    color: $--color-white;
}
</style>



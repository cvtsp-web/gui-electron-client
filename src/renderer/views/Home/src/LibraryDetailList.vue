<template>
    <div class="library-detaillist" v-show="visible">
        <!-- <i class="library-detaillist__close el-icon-close"></i> -->
        <div class="library-detaillist__body">
            <component 
                v-for="(item, index) in data" 
                :key="index" 
                :is="item.name"
                v-dragging="{item: item, group: 'detaillist', target: 'library'}">
            </component>
        </div>

        <div class="library-detaillist__empty" v-show="isEmpty">暂无数据</div>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: true
        },
        data: {
            type: Array,
            default() {
                return []
            }
        }
    },

    computed: {
        isEmpty() {
            return this.data.length > 0 ? false : true;
        }
    },

    methods: {
        hanlderClose() {
            this.$emit('update:visible', false);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../../../element-variables.scss';
$library-views-height: 240px;
.library-detaillist {
    width: 300px;
    min-height: 100px;
    position: fixed;
    bottom: 20px;
    top: $library-views-height + 60;
    left: 10px;
    padding: 10px;
    border-radius: $--box-shadow-base;
    box-shadow: $--box-shadow-base;
    background-color: $--color-white;
    transition: $--all-transition;
}
.library-detaillist__close {
    position: absolute;
    top: 10px;
    right: 10px;
    &:hover {
        background: $--color-black;
        border-radius: 50%;
        color: $--color-white;
    }
}
.library-detaillist__body {
    padding-top: 25px;
}
$font-size: 20px;
.library-detaillist__empty {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: $font-size;
    margin-left: -$font-size * 2;
    margin-top: -$font-size * 2;
    color: $--border-color-lighter;
}
</style>

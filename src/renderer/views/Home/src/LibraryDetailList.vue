<template>
    <div class="library-detaillist" v-show="visible">
        <i class="library-detaillist__close el-icon-close" @click="hanlderClose"></i>
        <div class="library-detaillist__body">
            <component 
                v-for="(item, index) in data" 
                :key="index" 
                :is="item.name"
                v-dragging="{item: item, group: 'detaillist', target: 'library'}">
            </component>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default() {
                return []
            }
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
.library-detaillist {
    width: 300px;
    min-height: 100px;
    position: fixed;
    top: 10px;
    left: 10px;
    padding: 10px;
    border-radius: $--notification-radius;
    box-shadow: $--notification-shadow;
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
</style>

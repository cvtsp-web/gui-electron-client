<template>
    <div class="footer-button">
        <div class="button-left">
            <slot name="left"></slot>
        </div>
        <div class="button-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
.footer-button {
    padding-top: 15px;
    .button-left {
        float: left;
    }
    .button-right {
        float: right;
    }
}
</style>



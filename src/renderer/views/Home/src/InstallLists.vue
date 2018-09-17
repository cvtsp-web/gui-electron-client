<template>
    <div>
        <el-button @click="removeInstallPackage"></el-button>
    </div>
</template>

<script>
import { uninstallPackage } from '@/utils/utils'

export default {
    name: 'InstallLists',

    methods: {
        /**
         * 删除安装包
         */
        removeInstallPackage() {
            uninstallPackage('iview');
        }
    }
}
</script>


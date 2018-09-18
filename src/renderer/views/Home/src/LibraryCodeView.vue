<template>
    <div>
        {{data}}
    </div>
</template>

<script>
import pretty from 'pretty'

export default {
    props: {
        data: {
            type: Array,
            default() {
                return []
            }
        }
    },

    methods: {
        /**
        * 将数据转换为模版
        * @param {Array} 嵌套数组
        * @return {String} template模版
        */
        dataParseTemplate(data) {
            let code = `<template><section>`;

            code += `\n</section></template>`;

        }
    }
}  
</script>
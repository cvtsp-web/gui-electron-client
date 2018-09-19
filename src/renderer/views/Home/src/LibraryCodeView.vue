<template>
    <pre v-highlightjs="CODE">
        <code></code>
    </pre>
</template>

<script>
import Vue from 'vue'
//代码文本格式化
import pretty from 'pretty'
//代码文本提供高亮、缩进
import VueHighlightJS from 'vue-highlightjs'
import { mapMutations } from 'vuex'
Vue.use(VueHighlightJS)

export default {
    props: {
        data: {
            type: Array,
            default() {
                return []
            }
        }
    },

    computed: {
        CODE() {
            let tpl = `<template><section>`;
            tpl += this.dataParseTemplate(this.data);
            tpl += `\n</section></template>`;

            let resultTpl = pretty(tpl);
            this.saveVueTemplate(resultTpl);
            return resultTpl;
        }
    },

    methods: {
        ...mapMutations('Main', ['saveVueTemplate']),

        /**
        * 将数据转换为模版
        * @param {Array} 嵌套数组
        * @return {String} template模版
        */
        dataParseTemplate(data) {
            var tpl = ``;
            data.forEach(t => {
                tpl += `<${t.name} ${this.generatorPropsTpl(t)}>`;
                if(t.children.length > 0) {
                    tpl += this.dataParseTemplate(t.children);
                }
                tpl += `</${t.name}>`; 
            });
            return pretty(tpl);
        },

        /**
        * 生成props模块和slot分片
        * @param {Object} props: {vlaue:'', placeholder: '', ...}
        * @return: value="hello" placeholder="good"
        */
        generatorPropsTpl(mess) {
            let tpl = '';
            if(mess.props) {
                Object.keys(mess.props).forEach(val => {
                    tpl+= `${val}="${mess.props[val]}" `;
                });
            }
            if(mess.slot && mess.slot !== 'default') {
                tpl+= `slot="${mess.slot}"`;
            }
            return tpl;
        }
    }
}  
</script>
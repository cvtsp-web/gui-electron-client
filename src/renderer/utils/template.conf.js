// vue 默认模版
const vue = {
    templateDir: [
        {name: 'src', type: 'dir'},
        {name: '<dirName>.vue', type: 'file'},
        {name: '<dirName>.<stylePostfix>', type: 'file'},
        {name: 'index.js', type: 'file'}
    ],
    template: `
        <template>
            <div class="{{name}}">
                {{inject}}
            </div>
        </template>

        <script>
        
        export default {
            name: "{{name}}"
        }
        </script>
    `
};

module.exports = {
    vue
}
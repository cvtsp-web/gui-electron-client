export default {
    namespaced: true,

    state: {
        // 功能清单（未来可能存在数据库，动态增减）
        functionLists: [
            { name: 'Babel', label: 'Babel' },
            { name: 'TypeScript', label: 'TypeScript' },
            { name: 'Progressive Web App (PWA) Support', label: 'PWA' },
            { name: 'Router', label: 'Router' },
            { name: 'Vuex', label: 'Vuex' },
            { name: 'Css Pre-processors', label: 'PreCss'},
            { name: 'Linter/Formatter', label: 'Linter' },
            { name: 'Unit Testing', label: 'Unit' },
            { name: 'E2E Testing', label: 'E2E' },
            { name: '使用配置文件', label: 'config' }
        ]
    }
}
const middlewareEmit = {
    //发出生成页面模版的信号到renderer层
    generatorPage(sender, params) {
        sender.send('generator-page', params);
    },

    //将文件解析成数据进入拖拽区域
    enterDragArea(sender, params) {
        sender.send('enter-dragarea', params);
    },

    //id为1 为文件夹的根目录 可以有从工作区域删除文件夹
    removeFromWrokspace(sender, params) {
        sender.send('remove-from-wrokspace', params);
    },  

    // 删除文件或者文件夹
    removeDir(sender, params) {
        sender.send('remove-dir', params);
    }
};

// 公用的菜单事件
const publicMenuLists = [
    { label: '删除', click: middlewareEmit.removeDir }
];

// 文件夹树的右击事件
const contextMenuLists = [
    { label: '开始生成页面', click: middlewareEmit.generatorPage},
    ...publicMenuLists
]

// 文件的右击事件
const contextFilesMenuLists = [
    { label: '进入拖拽区域', click: middlewareEmit.enterDragArea},
    ...publicMenuLists
];

module.exports = {
    middlewareEmit,
    contextMenuLists,
    contextFilesMenuLists
}
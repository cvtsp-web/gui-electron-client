
/**
 * 发出生成页面模版的信号到renderer层
 * @param {*} sender 
 * @param {Object} params 
 */
function generatorPage(sender, params) {
    sender.send('generator-page', params);
}

/**
 * 将文件解析成数据进入拖拽区域
 */
function enterDragArea(sender, params) {
    sender.send('enter-dragarea', params);
}

// 文件夹树的右击事件
const contextMenuLists = [
    { label: '开始生成页面', click: generatorPage}
]

// 文件的右击事件
const contextFilesMenuLists = [
    { label: '进入拖拽区域', click: enterDragArea}
];

module.exports = {
    contextMenuLists,
    contextFilesMenuLists
}
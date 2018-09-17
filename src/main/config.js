
/**
 * 发出生成页面模版的信号到renderer层
 * @param {*} sender 
 * @param {Object} params 
 */
const generatorPage = function(sender, params) {
    sender.send('generator-page', params);
}

const contextMenuLists = [
    { label: '开始生成页面', click: generatorPage}
]


module.exports = {
    contextMenuLists
}
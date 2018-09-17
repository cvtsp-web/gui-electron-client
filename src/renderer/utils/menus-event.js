import { remote, ipcRenderer } from 'electron'
const menuHandlerGroups = {};


/**
 * 创建新项目
 */
menuHandlerGroups.createNewProject = function() {
    remote.dialog.showOpenDialog({
        title: '创建新项目',
        properties: ['openFile', 'openDirectory']
    }, (filePaths) => {
        ipcRenderer.send('main-createNewProject', filePaths);
    })
}




export default menuHandlerGroups;
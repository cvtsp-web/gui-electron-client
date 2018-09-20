import { BrowserWindow, ipcMain, Menu, MenuItem } from 'electron'
import { contextMenuLists, contextFilesMenuLists, middlewareEmit } from './config'

/**接收菜单新建项目信息 */
ipcMain.on('main-createNewProject', (event, arg) => {
    event.sender.send('createNewProject', arg);
})


/**
 * 接收右点击树弹出信号
 */
ipcMain.on('tree-contextmenu', (event, arg) => {
    // 文件夹格式
    if(arg && arg.type === 'dir') {
        dirGeneratorMenus(event, arg);
    }else if(arg && arg.type === 'file'){
        fileGeneratorMenus(event, arg);
    };
})

function dirGeneratorMenus(event, params) {
    const menu = new Menu();
    contextMenuLists.forEach(list => {
        menu.append(new MenuItem({
            ...list,
            click: () => { list.click && list.click.apply(list, [event.sender, params]) }
        }));
    });

    // id为1 为文件夹的根目录
    params.id === 1 && menu.append(new MenuItem({
        label: '从工作区域移出',
        click: () => { middlewareEmit.removeFromWrokspace.apply(null, [event.sender, params]) }
    }));

    const win = BrowserWindow.fromWebContents(event.sender);
    menu.popup(win);
}

function fileGeneratorMenus(event, params) {
    const menu = new Menu();
    contextFilesMenuLists.forEach(list => {
        menu.append(new MenuItem({
            ...list,
            click: () => {list.click && list.click.apply(list, [event.sender, params])}
        }));
    });

    const win = BrowserWindow.fromWebContents(event.sender);
    menu.popup(win);
}
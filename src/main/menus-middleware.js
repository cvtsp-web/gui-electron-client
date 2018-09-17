import { BrowserWindow, ipcMain, Menu, MenuItem } from 'electron'
import { contextMenuLists } from './config'

/**接收菜单新建项目信息 */
ipcMain.on('main-createNewProject', (event, arg) => {
    event.sender.send('createNewProject', arg);
})


/**
 * 接收右点击树弹出信号
 */
ipcMain.on('tree-contextmenu', (event, arg) => {
    const menu = new Menu();
    
    if(arg && arg.type === 'dir') {
        contextMenuLists.forEach(list => {
            menu.append(new MenuItem({
                ...list,
                click: () => { list.click && list.click.apply(list, [event.sender, arg]) }
            }));
        });
    
        const win = BrowserWindow.fromWebContents(event.sender);
        menu.popup(win);
    }
})
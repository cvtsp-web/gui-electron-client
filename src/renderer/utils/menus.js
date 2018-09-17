import { remote } from 'electron'
import utils from '@/utils/menus-event'

const Menu = remote.Menu;
const template = [
    {
        label: '文件',
        submenu: [
            {
                label: '创建新项目',
                click: utils['createNewProject']
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
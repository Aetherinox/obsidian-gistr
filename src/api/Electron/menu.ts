import { Menu, app, BrowserWindow, shell, nativeImage } from 'electron'
import { join } from 'path'

export const createMenu = ( win: BrowserWindow ) =>
{
    // const devMenu = [
    //   {role: 'reload'},
    //   {role: 'toggleDevTools'}
    // ] as MenuItemConstructorOptions[]
    const appMenu = Menu.buildFromTemplate( [
    {
        label: app.getName(),
        submenu: [
        {
            label: 'About Obsidian Gistr',
            click: () =>
            {
                win.webContents.send( 'showAbout' )
            }
        },
        {
            label: 'Check For Updates',
            click: () =>
            {
                win.webContents.send( 'checkUpdate', true )
            }
        },
        {
            type: 'separator'
        },
        {
            role: 'quit'
        }]
    },
    {
        label: 'File',
        submenu: [
        {
            label: 'Open Folder',
            icon: nativeImage.createFromPath( join( process.env.PUBLIC, 'open-folder.png' ) ).resize(
            {
                width: 16,
                height: 16
            } ),
            click: () =>
            {
                win.webContents.send( 'openFolder' )
            }
        },
        {
            label: 'Open Recent Project',
            accelerator: 'CmdOrCtrl+Shift+L',
            click: () =>
            {
                win.webContents.send( 'openRecent' )
            }
        }]
    },
    {
        label: 'View',
        submenu: [
        {
            role: 'reload'
        },
        {
            role: 'toggleDevTools'
        }]
    },
    {
        label: 'Help',
        submenu: [
        {
            label: 'Keymap',
            click: () =>
            {
                win.webContents.send( 'showKeymap' )
            }
        },
        {
            label: 'Issues',
            click: () =>
            {
                shell.openExternal( 'https://github.com/Aetherinox/obsidian-gistr/issues' )
            }
        }]
    }] )
    Menu.setApplicationMenu( appMenu )
}

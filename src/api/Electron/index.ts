process.env.DIST    = join( __dirname, '../..' )
process.env.PUBLIC  = app.isPackaged ? process.env.DIST : join( process.env.DIST, '../public' )
process.env[ 'ELECTRON_DISABLE_SECURITY_WARNINGS' ] = 'true'

import {createMenu} from './menu'
import { app, BrowserWindow, shell, ipcMain, dialog, webContents, nativeTheme } from 'electron'
import { release } from 'os'
import { join } from 'path'
nativeTheme.themeSource = 'dark'

// Disable GPU Acceleration for Windows 7
if ( release( ).startsWith( '6.1' ) ) app.disableHardwareAcceleration( )

// Set application name for Windows 10+ notifications
if ( process.platform === 'win32') app.setAppUserModelId( app.getName( ) )

if ( !app.requestSingleInstanceLock( ) )
{
    app.quit( )
    process.exit( 0 )
}

let win:                BrowserWindow | null = null
const preload           = join(__dirname, '../preload/index.js')
export const url        = process.env.VITE_DEV_SERVER_URL
export const indexHtml  = join(process.env.DIST, 'index.html')

async function createWindow( )
{
    win = new BrowserWindow(
    {
        title:      'Md Writer',
        icon:       join(process.env.PUBLIC, 'favicon.svg'),
        minWidth:   1100,
        width:      1100,
        webPreferences:
        {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        }
    } )

    win.on( 'blur', ( ) =>
    {
        win.webContents.send( 'blur' )
    } )

    if ( app.isPackaged )
    {
        win.loadFile( indexHtml )
    }
    else
    {
        win.loadURL(url)
        // win.webContents.openDevTools( )
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', ( ) =>
    {
        win?.webContents.send('main-process-message', new Date( ).toLocaleString( ))
    } )

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler( ( { url } ) =>
    {
        if (url.startsWith( 'https:' ) ) shell.openExternal( url )
        return { action: 'deny' }
    } )

    createMenu( win )
}

app.whenReady( ).then( createWindow )

app.on('window-all-closed', ( ) =>
{
    win = null
    if ( process.platform !== 'darwin' ) app.quit( )
} )

app.on('second-instance', ( ) =>
{
    if (win)
    {
        // Focus on the main window if the user tried to open another
        if ( win.isMinimized( ) ) win.restore( )
        win.focus( )
    }
} )

app.on('activate', ( ) =>
{
    const allWindows = BrowserWindow.getAllWindows( )
    if ( allWindows.length )
    {
        allWindows[ 0 ].focus( )
    }
    else
    {
        createWindow( )
    }
} )

// new window example arg: new windows url
ipcMain.handle( 'open-win', ( event, arg ) =>
{
    const childWindow = new BrowserWindow(
    {
        webPreferences:
        {
            preload,
        },
    } )

    if ( app.isPackaged )
    {
        childWindow.loadFile(indexHtml, { hash: arg } )
    }
    else
    {
        childWindow.loadURL(`${url}/#${arg}`)
        // childWindow.webContents.openDevTools({ mode: "undocked", activate: true } )
    }
} )

ipcMain.handle( 'dialog', ( e: any, method: any, params: any ) =>
{
    // @ts-ignore
    return dialog[ method ]( params );
} )

ipcMain.handle( 'moveToTrash', ( e, path: string ) =>
{
    return shell.trashItem(path)
} )

ipcMain.handle( 'appInfo', (e) =>
{
    return {
        index:      app.isPackaged ? indexHtml : url,
        preload,
        dist:       process.env.DIST,
        locale:     app.getLocale( ),
        version:    app.getVersion( ),
        appName:    app.getName( )
    }
} )

ipcMain.handle( 'printPdf', ( e, id: string ) =>
{
    return webContents.fromId( +id ).printToPDF(
    {
        printBackground: true
    } )
} )
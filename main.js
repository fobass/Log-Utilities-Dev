"use strict";
exports.__esModule = true;
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const app = electron.app
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const ipc = electron.ipcMain
const dialog = electron.dialog
var path = require("path")
var url = require("url")



var mainWindow = null;

const contextMenu = new Menu()
contextMenu.append(new MenuItem({ label: 'Cut', role: 'cut' }))
contextMenu.append(new MenuItem({ label: 'Copy', role: 'copy' }))
contextMenu.append(new MenuItem({ label: 'Paste', role: 'paste' }))
contextMenu.append(new MenuItem({ label: 'Select All', role: 'selectall' }))
contextMenu.append(new MenuItem({ type: 'separator' }))
contextMenu.append(new MenuItem({ label: 'Custom', click() { console.log('Custom Menu')} }))

ipc.on('open-directory-dialog', function (event) {
    dialog.showOpenDialog({
        properties: ['openDirectory']
        }, 
        function (files) {
        if (files) 
            event.sender.send('selectedItem', 'files')
        })
})

ipc.on('selectedItem', function (event, path) {
    document.getElementById('selectedItem').innerHTML = `You selected: ${path}`
})

ipc.on('show-context-menu', (event)=>{
    const win = BrowserWindow.fromWebContents(event.sender)
    contextMenu.popup(win)
})

ipc.on('somemsg', (event, args)=>{
    event.returnValue = "HiHi..."
    console.log(args)
})

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600, show: false, frame: false, webPreferences: {nodeIntegration: true} });
    
    mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }))

    // Open the DevTools.
   // mainWindow.webContents.openDevTools();
    mainWindow.once('ready-to-show', ()=> { 
            return mainWindow.show() 
        })

    mainWindow.on('closed', ()=> {
            mainWindow = null
        })
}
app.on('ready', ()=>{
        const menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)
        createWindow()
    })

app.on('window-all-closed', ()=> {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    })

app.on('activate', ()=> {
        if (mainWindow === null) {
            createWindow();
        }
    })

var template = [
    {
        label: 'Home',
        click: () => {
            const text = 'asdasdasd'
            // #1
            win.webContents.send('call-foo', text)
            // #2
            win.webContents.executeJavaScript(`foo('${text}')`)
          },
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteandmatchstyle' },
            { role: 'delete' },
            { role: 'selectall' },
            { type: 'separator' },
            {
                label: 'Speech',
                submenu: [
                    { role: 'startspeaking' },
                    { role: 'stopspeaking' }
                ]
            }
        ]
    },
    {
        label: 'Insert',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            {
                role: 'togglefullscreen',
                enabled: false
            }
        ]
    },
    {
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: function () { require('electron').shell.openExternal('https://electronjs.org'); }
            }
        ]
    }
];
if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services', submenu: [] },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    });
    // Window menu
    template[3].submenu = [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
    ];
}

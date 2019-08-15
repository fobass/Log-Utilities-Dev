"use strict";
exports.__esModule = true;
var customtitlebar = require("custom-electron-titlebar");
const ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs')

new customtitlebar.Titlebar({
        backgroundColor: customtitlebar.Color.fromHex('#505050'),
        icon: './images/logo.png',
        shadow: false,
        enableMnemonics: true
    });

ipcRenderer.on('file-save', function() {
    console.log('save file!!!');
});


// document.querySelector('add-to-list').addEventListener('click', () => {
//     console.log('save file!!!');
//     fs.readFile('./page1.html', function (err, data) {
//         document.getElementById('main-content').innerHTML = data.toString()
//       })
//   });